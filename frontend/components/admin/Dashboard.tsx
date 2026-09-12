import Link from "next/link";

/* Two figures, struck large. `paidOrderCount` is null for STAFF — the number
   is never fetched for them, not merely hidden. */
export default function Dashboard({
  productCount,
  paidOrderCount,
}: {
  productCount: number;
  paidOrderCount: number | null;
}) {
  return (
    <>
      <div className="flex items-center gap-6">
        <span className="label shrink-0">Overview</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <dl className="mt-10 grid gap-10 sm:grid-cols-2 md:gap-12">
        <div className="sm:border-r sm:border-border sm:pr-10">
          <dt className="label">Products in catalogue</dt>
          <dd className="mt-4 font-mono text-[3rem] font-medium leading-none tracking-[-0.03em]">
            {productCount}
          </dd>
          <Link className="link mt-6 inline-block text-[0.95rem]" href="/admin/products">
            Manage products
          </Link>
        </div>

        {paidOrderCount !== null && (
          <div>
            <dt className="label">Paid orders</dt>
            <dd className="mt-4 font-mono text-[3rem] font-medium leading-none tracking-[-0.03em]">
              {paidOrderCount}
            </dd>
            <Link className="link mt-6 inline-block text-[0.95rem]" href="/admin/orders">
              View orders
            </Link>
          </div>
        )}
      </dl>
    </>
  );
}
