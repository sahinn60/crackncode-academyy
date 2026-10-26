import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getOrderById } from "@/lib/data";
import { formatDate, formatTaka, paymentMethodLabel } from "@/lib/utils";

export const metadata: Metadata = { title: "পেমেন্ট সফল" };

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
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
              {order.status === "paid" ? "পেমেন্ট সফল হয়েছে" : "অর্ডার বাতিল হয়েছে"}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {order.status === "paid"
                ? "আপনার অ্যাক্সেস চালু হয়েছে — এখনই শেখা শুরু করতে পারেন।"
                : "এই অর্ডারটি সম্পন্ন হয়নি। আবার চেষ্টা করতে পারেন।"}
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted">পণ্য</span>
                <span className="text-right font-semibold">{order.title}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">পরিমাণ</span>
                <span className="font-semibold">{formatTaka(order.amount)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">মাধ্যম</span>
                <span className="font-semibold">{paymentMethodLabel(order.method)} (ডেমো)</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">ট্রানজেকশন</span>
                <span className="font-mono text-xs">{order.txn_id}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">তারিখ</span>
                <span className="font-semibold">
                  {formatDate(order.paid_at || order.created_at)}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-2">
              <Link href="/dashboard" className="btn btn-primary w-full">
                ড্যাশবোর্ডে যান
              </Link>
              <Link href="/courses" className="btn btn-outline w-full">
                আরও কোর্স দেখুন
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-[0.68rem] text-muted">
          সমস্যা হলে ট্রানজেকশন আইডি দিয়ে{" "}
          <Link href="/contact" className="underline">যোগাযোগ করুন</Link>।
        </p>
      </div>
    </div>
  );
}
