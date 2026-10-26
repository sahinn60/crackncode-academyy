import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { confirmPaymentAction, cancelPaymentAction } from "@/lib/actions";
import { requireUser } from "@/lib/auth";
import { getOrderById } from "@/lib/data";
import { paymentMethodLabel } from "@/lib/utils";
import { formatTaka } from "@/lib/utils";

export const metadata: Metadata = { title: "পেমেন্ট" };

type Params = Promise<{ orderId: string }>;

export default async function PaymentPage({ params }: { params: Params }) {
  const { orderId } = await params;
  const user = await requireUser(`/payment/${orderId}`);
  const order = getOrderById(Number(orderId));

  if (!order || order.user_id !== user.id) notFound();
  if (order.status === "paid") redirect(`/payment/success?order=${order.id}`);
  if (order.status === "cancelled") redirect("/courses");

  const isFree = order.amount === 0;
  const method = paymentMethodLabel(order.method);

  return (
    <div className="container-cn flex min-h-[70vh] items-center justify-center py-12">
      <div className="w-full max-w-lg">
        <div className="overflow-hidden rounded-2xl border-2 border-line bg-surface shadow-[8px_8px_0_var(--shadow-color)]">
          <div className="flex items-center justify-between gap-3 border-b border-line bg-navy px-5 py-4 text-cream">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-orange text-navy">
                <span className="font-mono text-[0.6rem] font-bold">&lt;/&gt;</span>
              </span>
              <div>
                <p className="text-sm font-bold">CrackNcode Pay</p>
                <p className="text-[0.6rem] text-cream/50">নিরাপদ ডেমো পেমেন্ট</p>
              </div>
            </div>
            <span className="rounded-full border border-mustard/50 bg-mustard/20 px-2.5 py-0.5 text-[0.6rem] font-bold text-mustard">
              DEMO
            </span>
          </div>

          <div className="p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              পরিশোধযোগ্য পরিমাণ
            </p>
            <p className="font-display mt-1 text-4xl font-bold">
              {isFree ? "ফ্রি" : formatTaka(order.amount)}
            </p>
            <p className="mt-1 text-sm font-semibold">{order.title}</p>
            <p className="mt-0.5 text-xs text-muted">মাধ্যম: {method}</p>

            <div className="mt-5 space-y-2 rounded-xl bg-surface-2 p-4 text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-muted">ট্রানজেকশন আইডি</span>
                <span className="font-mono text-[0.7rem] font-semibold">{order.txn_id}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">অর্ডার নম্বর</span>
                <span className="font-mono text-[0.7rem] font-semibold">#{order.id}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">অ্যাকাউন্ট</span>
                <span className="truncate text-[0.7rem]">{user.email}</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-mustard/50 bg-mustard/15 p-3 text-[0.7rem] leading-relaxed">
              <strong>ডেমো গেটওয়ে:</strong> নিচের বাটনে ক্লিক করলে কোনো বাস্তব টাকা কাটা হবে
              না — শুধু আপনার অর্ডার সম্পন্ন হবে এবং কোর্স/ই-বুক অ্যাক্সেস চালু হবে।
            </div>

            <div className="mt-5 grid gap-2">
              <form action={confirmPaymentAction}>
                <input type="hidden" name="order_id" value={order.id} />
                <button type="submit" className="btn btn-primary w-full btn-lg">
                  {isFree ? "রেজিস্ট্রেশন নিশ্চিত করুন" : "পেমেন্ট নিশ্চিত করুন (ডেমো)"}
                </button>
              </form>
              <form action={cancelPaymentAction}>
                <input type="hidden" name="order_id" value={order.id} />
                <button type="submit" className="btn btn-ghost w-full text-muted">
                  বাতিল করুন
                </button>
              </form>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-[0.68rem] text-muted">
          লাইভ পেমেন্ট চালু হলে এই ধাপেই bKash/Nagad গেটওয়েতে রিডাইরেক্ট হবে।
        </p>
      </div>
    </div>
  );
}
