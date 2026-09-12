import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { isForeignKeyViolation, isUniqueViolation } from "@/lib/db-errors";
import {
  formatZodIssues,
  productCreateSchema,
  productUpdateSchema,
} from "@/lib/validation";
import { requireUser } from "@/backend/auth";

/* Catalogue management. Any signed-in user (ADMIN or STAFF) may manage
   products — the role boundary is on orders, not here. */

type Params = { params: Promise<{ id: string }> };

const SLUG_TAKEN = "A product with that slug already exists.";

async function readJson(req: NextRequest): Promise<unknown | undefined> {
  try {
    return await req.json();
  } catch {
    return undefined;
  }
}

/** GET /api/admin/products */
export async function handleListProducts(req: NextRequest) {
  const user = await requireUser(req);
  if (user instanceof NextResponse) return user;

  const rows = await getDb()
    .select()
    .from(schema.products)
    .orderBy(asc(schema.products.createdAt));
  return NextResponse.json({ products: rows });
}

/** POST /api/admin/products */
export async function handleCreateProduct(req: NextRequest) {
  const user = await requireUser(req);
  if (user instanceof NextResponse) return user;

  const body = await readJson(req);
  if (body === undefined) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = productCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", fields: formatZodIssues(parsed.error) },
      { status: 400 }
    );
  }

  try {
    const [product] = await getDb()
      .insert(schema.products)
      .values(parsed.data)
      .returning();
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    if (isUniqueViolation(err)) {
      return NextResponse.json({ error: SLUG_TAKEN }, { status: 409 });
    }
    throw err;
  }
}

/** PATCH /api/admin/products/[id] */
export async function handleUpdateProduct(req: NextRequest, { params }: Params) {
  const user = await requireUser(req);
  if (user instanceof NextResponse) return user;

  const { id } = await params;
  const body = await readJson(req);
  if (body === undefined) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = productUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", fields: formatZodIssues(parsed.error) },
      { status: 400 }
    );
  }

  try {
    const [product] = await getDb()
      .update(schema.products)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(schema.products.id, id))
      .returning();
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (err) {
    if (isUniqueViolation(err)) {
      return NextResponse.json({ error: SLUG_TAKEN }, { status: 409 });
    }
    throw err;
  }
}

/** DELETE /api/admin/products/[id] */
export async function handleDeleteProduct(req: NextRequest, { params }: Params) {
  const user = await requireUser(req);
  if (user instanceof NextResponse) return user;

  const { id } = await params;

  try {
    const [deleted] = await getDb()
      .delete(schema.products)
      .where(eq(schema.products.id, id))
      .returning({ id: schema.products.id });
    if (!deleted) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, id: deleted.id });
  } catch (err) {
    // orders.product_id references this row — the sale record must outlive
    // the listing, so hide the product instead of deleting it.
    if (isForeignKeyViolation(err)) {
      return NextResponse.json(
        {
          error:
            "This product has orders and can't be deleted. Mark it hidden instead.",
        },
        { status: 409 }
      );
    }
    throw err;
  }
}
