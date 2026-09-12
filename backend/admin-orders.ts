import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getDb, schema } from "@/lib/db";
import { requireRole } from "@/backend/auth";

/* Order and revenue data is ADMIN only. STAFF are authenticated and can reach
   the rest of /admin, but this is where the authorization line sits. */

export const ORDERS_PAGE_LIMIT = 200;

export async function listRecentOrders() {
  return getDb()
    .select({
      id: schema.orders.id,
      stripeSessionId: schema.orders.stripeSessionId,
      productId: schema.orders.productId,
      productName: schema.products.name,
      productSlug: schema.products.slug,
      customerEmail: schema.orders.customerEmail,
      amountCents: schema.orders.amountCents,
      currency: schema.orders.currency,
      status: schema.orders.status,
      createdAt: schema.orders.createdAt,
    })
    .from(schema.orders)
    .innerJoin(schema.products, eq(schema.orders.productId, schema.products.id))
    .orderBy(desc(schema.orders.createdAt))
    .limit(ORDERS_PAGE_LIMIT);
}

/** GET /api/admin/orders — ADMIN only. */
export async function handleListOrders(req: NextRequest) {
  const user = await requireRole(req, "ADMIN");
  if (user instanceof NextResponse) return user;

  const orders = await listRecentOrders();
  return NextResponse.json({ orders });
}
