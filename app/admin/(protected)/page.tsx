import { count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Dashboard from "@/frontend/components/admin/Dashboard";
import { getDb, schema } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const db = getDb();
  const [{ value: productCount }] = await db
    .select({ value: count() })
    .from(schema.products);

  // Revenue figures are ADMIN only — STAFF never runs the query.
  let paidOrderCount: number | null = null;
  if (user.role === "ADMIN") {
    const [{ value }] = await db
      .select({ value: count() })
      .from(schema.orders)
      .where(eq(schema.orders.status, "PAID"));
    paidOrderCount = value;
  }

  return <Dashboard productCount={productCount} paidOrderCount={paidOrderCount} />;
}
