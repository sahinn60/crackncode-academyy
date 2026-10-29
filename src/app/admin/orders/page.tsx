import type { Metadata } from "next";
import Link from "next/link";
import { adminOrders } from "@/lib/data";
import { adminCancelOrderAction, adminMarkPaidAction } from "@/lib/admin-actions";
import { getLocale } from "@/lib/i18n-server";
import { pick, type Locale } from "@/lib/i18n";
import {
  formatNumber,
  formatDateShort,
  formatTaka,
  orderStatusLabel,
  paymentMethodLabel,
} from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: pick(locale, "অর্ডার", "Orders") };
}

const filterValues = ["all", "pending", "paid", "cancelled"];

function filterLabel(value: string, locale: Locale): string {
  if (value === "pending") return pick(locale, "অপেক্ষমাণ", "Pending");
  if (value === "paid") return pick(locale, "সম্পন্ন", "Paid");
  if (value === "cancelled") return pick(locale, "বাতিল", "Cancelled");
  return pick(locale, "সব", "All");
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const locale = await getLocale();
  const { status: raw } = await searchParams;
  const status = raw && filterValues.includes(raw) ? raw : "all";
  const orders = await adminOrders(status);
  const paidTotal = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.amount, 0);

  const orderCount = formatNumber(orders.length, locale);
  const paidTotalText = formatTaka(paidTotal, locale);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          {pick(locale, "লেনদেন", "Transactions")}
        </p>
        <h1 className="section-title mt-1 text-3xl">
          {pick(locale, "অর্ডার ব্যবস্থাপনা", "Order management")}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {pick(
            locale,
            `${orderCount}টি অর্ডার · এই তালিকায় মোট ${paidTotalText} সম্পন্ন`,
            `${orderCount} orders · ${paidTotalText} paid in this list`
          )}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterValues.map((value) => (
          <Link
            key={value}
            href={value === "all" ? "/admin/orders" : `/admin/orders?status=${value}`}
            className={`pill px-3 py-1.5 ${status === value ? "pill-orange" : ""}`}
          >
            {filterLabel(value, locale)}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface">
        <div className="table-wrap">
          <table className="table-cn">
            <thead>
              <tr>
                <th>{pick(locale, "অর্ডার", "Order")}</th>
                <th>{pick(locale, "স্টুডেন্ট", "Student")}</th>
                <th>{pick(locale, "পদ্ধতি", "Method")}</th>
                <th>{pick(locale, "পরিমাণ", "Amount")}</th>
                <th>{pick(locale, "স্ট্যাটাস", "Status")}</th>
                <th>{pick(locale, "তারিখ", "Date")}</th>
                <th className="text-right">{pick(locale, "অ্যাকশন", "Actions")}</th>
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
                  <td className="whitespace-nowrap text-xs">{paymentMethodLabel(o.method, locale)}</td>
                  <td className="whitespace-nowrap text-sm font-semibold">
                    {formatTaka(o.amount, locale)}
                  </td>
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
                      {orderStatusLabel(o.status, locale)}
                    </span>
                    {o.status === "paid" && o.paid_at && (
                      <p className="mt-1 text-[0.6rem] text-muted">
                        {formatDateShort(o.paid_at, locale)}
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap text-[0.68rem] text-muted">
                    {formatDateShort(o.created_at, locale)}
                  </td>
                  <td>
                    {o.status === "pending" ? (
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <form action={adminMarkPaidAction}>
                          <input type="hidden" name="id" value={o.id} />
                          <button type="submit" className="btn btn-primary btn-sm">
                            {pick(locale, "পরিশোধিত", "Mark paid")}
                          </button>
                        </form>
                        <form action={adminCancelOrderAction}>
                          <input type="hidden" name="id" value={o.id} />
                          <button
                            type="submit"
                            className="rounded-md px-2 py-1 text-[0.7rem] font-semibold text-live hover:bg-live/10"
                          >
                            {pick(locale, "বাতিল", "Cancel")}
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
            {pick(locale, "এই ফিল্টারে কোনো অর্ডার নেই।", "No orders match this filter.")}
          </p>
        )}
      </div>

      <p className="text-[0.7rem] leading-relaxed text-muted">
        {pick(
          locale,
          "নোট: ডেমো মোডে শিক্ষার্থী নিজেই পেমেন্ট নিশ্চিত করতে পারে। ম্যানুয়াল যাচাইয়ের পর শিক্ষার্থীর পেমেন্ট না হলে অর্ডার বাতিল করুন। পরিশোধিত করলে কোর্স/বান্ডেল স্বয়ংক্রিয়ভাবে এনরোল হবে।",
          "Note: in demo mode students can confirm payment themselves. After manual verification, cancel the order if the student hasn't paid. Marking an order as paid enrolls the course/bundle automatically."
        )}
      </p>
    </div>
  );
}
