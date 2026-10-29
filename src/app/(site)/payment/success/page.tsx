import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getOrderById } from "@/lib/data";
import { pick } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { formatDate, formatTaka, paymentMethodLabel } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: pick(locale, "পেমেন্ট সফল", "Payment successful") };
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const locale = await getLocale();
  const { order: orderParam } = await searchParams;
  const orderId = Number(orderParam);
  const user = await requireUser("/dashboard");
  const order = Number.isInteger(orderId) ? await getOrderById(orderId) : null;

  if (!order || order.user_id !== user.id) redirect("/dashboard");
  if (order.status === "pending") redirect(`/payment/${order.id}`);

  return (
    <div className="container-cn flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-lg">
        <div className="overflow-hidden rounded-2xl border-2 border-line bg-surface shadow-[8px_8px_0_var(--shadow-color)]">
          <div className="bg-green/10 px-6 py-8 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green text-2xl text-cream">
              ✓
            </span>
            <h1 className="section-title mt-4 text-2xl">
              {order.status === "paid"
                ? pick(locale, "পেমেন্ট সফল হয়েছে", "Payment successful")
                : pick(locale, "অর্ডার বাতিল হয়েছে", "Order cancelled")}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {order.status === "paid"
                ? pick(
                    locale,
                    "আপনার অ্যাক্সেস চালু হয়েছে — এখনই শেখা শুরু করতে পারেন।",
                    "Your access is active — you can start learning right now."
                  )
                : pick(
                    locale,
                    "এই অর্ডারটি সম্পন্ন হয়নি। আবার চেষ্টা করতে পারেন।",
                    "This order was not completed. You can try again."
                  )}
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted">{pick(locale, "পণ্য", "Product")}</span>
                <span className="text-right font-semibold">{order.title}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">{pick(locale, "পরিমাণ", "Amount")}</span>
                <span className="font-semibold">{formatTaka(order.amount, locale)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">{pick(locale, "মাধ্যম", "Method")}</span>
                <span className="font-semibold">
                  {paymentMethodLabel(order.method, locale)} ({pick(locale, "ডেমো", "demo")})
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">{pick(locale, "ট্রানজেকশন", "Transaction")}</span>
                <span className="font-mono text-xs">{order.txn_id}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">{pick(locale, "তারিখ", "Date")}</span>
                <span className="font-semibold">
                  {formatDate(order.paid_at || order.created_at, locale)}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-2">
              <Link href="/dashboard" className="btn btn-primary w-full">
                {pick(locale, "ড্যাশবোর্ডে যান", "Go to dashboard")}
              </Link>
              <Link href="/courses" className="btn btn-outline w-full">
                {pick(locale, "আরও কোর্স দেখুন", "Browse more courses")}
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-[0.68rem] text-muted">
          {pick(locale, "সমস্যা হলে ট্রানজেকশন আইডি দিয়ে", "If there's a problem,")}{" "}
          <Link href="/contact" className="underline">
            {pick(locale, "যোগাযোগ করুন", "contact us")}
          </Link>
          {pick(locale, "।", " with the transaction ID.")}
        </p>
      </div>
    </div>
  );
}
