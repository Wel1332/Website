import type { Metadata } from "next";
import { redirect } from "next/navigation";
import OrdersTable from "@/frontend/components/admin/OrdersTable";
import { ORDERS_PAGE_LIMIT, listRecentOrders } from "@/backend/admin-orders";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  // Same boundary as GET /api/admin/orders: authenticated isn't enough.
  if (user.role !== "ADMIN") {
    return (
      <>
        <div className="flex items-center gap-6">
          <span className="label shrink-0">Orders</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <h1 className="mt-8 text-[clamp(1.8rem,4vw,2.5rem)]">Restricted to admins</h1>
        <p className="mt-4 max-w-[52ch] text-muted">
          Order and revenue data is only available to ADMIN accounts. Ask an
          admin if you need a figure from here.
        </p>
      </>
    );
  }

  const orders = await listRecentOrders();
  return <OrdersTable orders={orders} limit={ORDERS_PAGE_LIMIT} />;
}
