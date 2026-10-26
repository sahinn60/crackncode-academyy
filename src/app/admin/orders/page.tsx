import type { Metadata } from "next";
import Link from "next/link";
import { adminOrders } from "@/lib/data";
import { adminCancelOrderAction, adminMarkPaidAction } from "@/lib/admin-actions";
import {
  bengaliNumber,
  formatDateShort,
  formatTaka,
  orderStatusLabel,
  paymentMethodLabel,
} from "@/lib/utils";

export const metadata: Metadata = { title: "অর্ডার" };

const filters = [
  { value: "all", label: "সব" },
  { value: "pending", label: "অপেক্ষমাণ" },
  { value: "paid", label: "সম্পন্ন" },
  { value: "cancelled", label: "বাতিল" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: raw } = await searchParams;
  const status = filters.some((f) => f.value === raw) ? raw! : "all";
  const orders = adminOrders(status);
  const paidTotal = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">লেনদেন</p>
        <h1 className="section-title mt-1 text-3xl">অর্ডার ব্যবস্থাপনা</h1>
        <p className="mt-1 text-sm text-muted">
          {bengaliNumber(orders.length)}টি অর্ডার · এই তালিকায় মোট {formatTaka(paidTotal)} সম্পন্ন
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/admin/orders" : `/admin/orders?status=${f.value}`}
            className={`pill px-3 py-1.5 ${status === f.value ? "pill-orange" : ""}`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface">
        <div className="table-wrap">
          <table className="table-cn">
            <thead>
              <tr>
                <th>অর্ডার</th>
                <th>স্টুডেন্ট</th>
                <th>পদ্ধতি</th>
                <th>পরিমাণ</th>
                <th>স্ট্যাটাস</th>
                <th>তারিখ</th>
                <th className="text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <span className="font-mono text-[0.7rem]">#{o.id}</span>
                    <p className="max-w-[13rem] truncate text-xs font-semibold">{o.title}</p>
                    <p className="font-mono text-[0.6rem] text-muted">{o.txn_id}</p>
                  </td>
                  <td>
                    <p className="max-w-[10rem] truncate text-xs font-semibold">{o.student_name}</p>
                    <p className="max-w-[10rem] truncate text-[0.62rem] text-muted">{o.student_email}</p>
                  </td>
                  <td className="whitespace-nowrap text-xs">{paymentMethodLabel(o.method)}</td>
                  <td className="whitespace-nowrap text-sm font-semibold">{formatTaka(o.amount)}</td>
                  <td>
                    <span
                      className={`pill ${
                        o.status === "paid"
                          ? "pill-green"
                          : o.status === "pending"
                            ? "pill-orange"
                            : "pill-live"
                      }`}
                    >
                      {orderStatusLabel(o.status)}
                    </span>
                    {o.status === "paid" && o.paid_at && (
                      <p className="mt-1 text-[0.6rem] text-muted">{formatDateShort(o.paid_at)}</p>
                    )}
                  </td>
                  <td className="whitespace-nowrap text-[0.68rem] text-muted">
                    {formatDateShort(o.created_at)}
                  </td>
                  <td>
                    {o.status === "pending" ? (
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <form action={adminMarkPaidAction}>
                          <input type="hidden" name="id" value={o.id} />
                          <button type="submit" className="btn btn-primary btn-sm">
                            পরিশোধিত
                          </button>
                        </form>
                        <form action={adminCancelOrderAction}>
                          <input type="hidden" name="id" value={o.id} />
                          <button
                            type="submit"
                            className="rounded-md px-2 py-1 text-[0.7rem] font-semibold text-live hover:bg-live/10"
                          >
                            বাতিল
                          </button>
                        </form>
                      </div>
                    ) : (
                      <p className="text-right text-[0.65rem] text-muted">—</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted">
            এই ফিল্টারে কোনো অর্ডার নেই।
          </p>
        )}
      </div>

      <p className="text-[0.7rem] leading-relaxed text-muted">
        নোট: ডেমো মোডে শিক্ষার্থী নিজেই পেমেন্ট নিশ্চিত করতে পারে। ম্যানুয়াল যাচাইয়ের পর
        শিক্ষার্থীর পেমেন্ট না হলে অর্ডার বাতিল করুন। পরিশোধিত করলে কোর্স/বান্ডেল স্বয়ংক্রিয়ভাবে
        এনরোল হবে।
      </p>
    </div>
  );
}
