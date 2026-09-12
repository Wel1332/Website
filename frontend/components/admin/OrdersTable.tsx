import { formatPrice } from "@/shared/products";
import type { listRecentOrders } from "@/backend/admin-orders";

type OrderRow = Awaited<ReturnType<typeof listRecentOrders>>[number];

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default function OrdersTable({
  orders,
  limit,
}: {
  orders: OrderRow[];
  limit: number;
}) {
  return (
    <>
      <div className="flex items-center gap-6">
        <span className="label shrink-0">Orders</span>
        <span className="h-px flex-1 bg-border" />
        <span className="label shrink-0">
          {orders.length >= limit ? `Latest ${limit}` : `${orders.length} total`}
        </span>
      </div>

      <h1 className="mt-8 text-[clamp(1.8rem,4vw,2.5rem)]">Sales</h1>

      <div className="mt-10 overflow-x-auto">
        {orders.length === 0 ? (
          <p className="text-muted">
            No orders yet. They appear here once Stripe confirms a payment
            through the webhook.
          </p>
        ) : (
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="label py-3 pr-4 font-medium">Date</th>
                <th className="label py-3 pr-4 font-medium">Product</th>
                <th className="label py-3 pr-4 font-medium">Customer</th>
                <th className="label py-3 pr-4 text-right font-medium">Amount</th>
                <th className="label py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border align-top">
                  <td className="py-4 pr-4 font-mono text-[0.85rem] text-muted">
                    {dateFormat.format(o.createdAt)}
                  </td>
                  <td className="py-4 pr-4">
                    <span className="font-display font-semibold tracking-[-0.02em]">
                      {o.productName}
                    </span>
                    <span className="mt-1 block font-mono text-[0.75rem] text-faint">
                      {o.productSlug}
                    </span>
                  </td>
                  <td className="py-4 pr-4 font-mono text-[0.85rem]">
                    {o.customerEmail ?? <span className="text-faint">—</span>}
                  </td>
                  <td className="py-4 pr-4 text-right font-mono text-[0.95rem]">
                    {formatPrice(o.amountCents, o.currency)}
                  </td>
                  <td className="py-4">
                    <span
                      className={`label ${
                        o.status === "PAID"
                          ? "text-accent"
                          : o.status === "FAILED"
                            ? "text-danger"
                            : ""
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
