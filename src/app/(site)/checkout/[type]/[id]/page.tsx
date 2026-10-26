import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Cover } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getEnrollment, listMyOrders } from "@/lib/data";
import { getCheckoutProduct } from "@/lib/products";
import { placeOrderAction } from "@/lib/actions";
import { discountPercent, formatTaka } from "@/lib/utils";

export const metadata: Metadata = { title: "চেকআউট" };

type Params = Promise<{ type: string; id: string }>;

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ error?: string }>;
}) {
  const { type, id } = await params;
  const { error } = await searchParams;
  const product = getCheckoutProduct(type, Number(id));
  if (!product) notFound();

  const user = await requireUser(`/checkout/${type}/${id}`);

  if (product.type === "course") {
    const existing = getEnrollment(user.id, product.id);
    if (existing) redirect(`/learn/${product.slug}`);
  }

  const alreadyPaid = listMyOrders(user.id).some(
    (o) => o.product_type === product.type && o.product_id === product.id && o.status === "paid"
  );
  if (alreadyPaid) redirect("/dashboard?already=1");

  const off = discountPercent(product.amount, product.originalPrice);
  const isFree = product.amount === 0;

  return (
    <>
      <section className="border-b border-line bg-surface-2/50">
        <div className="container-cn py-8 lg:py-10">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-muted" aria-label="ব্রেডক্রাম্ব">
            <Link href="/" className="hover:text-ink">হোম</Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-ink">কোর্স</Link>
            <span>/</span>
            <span className="text-ink">চেকআউট</span>
          </nav>
          <h1 className="section-title mt-3 text-2xl md:text-3xl">চেকআউট</h1>
          <p className="mt-1 text-sm text-muted">
            আপনার অর্ডার নিশ্চিত করুন — তারপর পেমেন্ট ধাপে যাবেন।
          </p>
        </div>
      </section>

      <div className="container-cn grid gap-8 py-10 lg:grid-cols-[1.3fr_0.8fr] lg:py-14">
        <form action={placeOrderAction} className="space-y-6">
          <input type="hidden" name="product_type" value={product.type} />
          <input type="hidden" name="product_id" value={product.id} />

          <div className="rounded-2xl border border-line-soft bg-surface p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold">অ্যাকাউন্ট</h2>
              <Link href="/dashboard" className="text-xs font-semibold text-orange-deep hover:underline">
                প্রোফাইল
              </Link>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-surface-2 p-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-navy font-mono text-xs font-bold text-cream">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
            </div>
            <p className="mt-3 text-[0.72rem] text-muted">
              অর্ডার ও কোর্স অ্যাক্সেস এই অ্যাকাউন্টে যুক্ত হবে।
            </p>
          </div>

          <div className="rounded-2xl border border-line-soft bg-surface p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold">পেমেন্ট মাধ্যম</h2>
              <span className="pill pill-orange">ডেমো মোড</span>
            </div>
            <div className="mt-4 space-y-2.5">
              {[
                { value: "bkash", name: "bKash", desc: "মোবাইল ব্যাংকিং — সবচেয়ে জনপ্রিয়", badge: "bKash", color: "#e2136e" },
                { value: "nagad", name: "Nagad", desc: "মোবাইল ব্যাংকিং — দ্রুত পেমেন্ট", badge: "Nagad", color: "#ee1c25" },
                { value: "card", name: "কার্ড", desc: "Visa / Mastercard (ডেমো)", badge: "CARD", color: "#0b1530" },
              ].map((m, i) => (
                <label key={m.value} className="method-card">
                  <input
                    type="radio"
                    name="method"
                    value={m.value}
                    defaultChecked={i === 0}
                    className="accent-[#f39322]"
                  />
                  <span
                    className="grid h-9 w-12 shrink-0 place-items-center rounded-md text-[0.6rem] font-bold text-white"
                    style={{ background: m.color }}
                  >
                    {m.badge}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{m.name}</span>
                    <span className="block text-[0.7rem] text-muted">{m.desc}</span>
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-mustard/50 bg-mustard/15 px-4 py-3 text-[0.72rem] leading-relaxed text-ink">
              <strong className="font-semibold">ডেমো পেমেন্ট:</strong> এই মুহূর্তে কোনো টাকা কাটা হবে
              না। পরের ধাপে পেমেন্ট নিশ্চিত করলেই কোর্স অ্যাক্সেস চালু হবে। লাইভ bKash/Nagad
              চালু করতে মার্চেন্ট অ্যাকাউন্ট সংযুক্ত করতে হবে।
            </div>
          </div>

          {error === "method" && (
            <p className="rounded-lg border border-live/30 bg-live/10 px-3 py-2 text-sm text-live">
              পেমেন্ট মাধ্যম সঠিকভাবে বেছে নিন।
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-lg w-full">
            {isFree ? "ফ্রি রেজিস্টার নিশ্চিত করুন" : "পেমেন্টে এগিয়ে যান"}
          </button>
          <p className="text-center text-[0.7rem] text-muted">
            এগিয়ে গেলে আপনি{" "}
            <Link href="/terms" className="underline">ব্যবহারের শর্ত</Link> ও{" "}
            <Link href="/refund" className="underline">রিফান্ড নীতি</Link> মেনে নিচ্ছেন।
          </p>
        </form>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border-2 border-line bg-surface p-5 shadow-[6px_6px_0_var(--shadow-color)]">
            <h2 className="font-display text-lg font-bold">অর্ডার সারাংশ</h2>
            <div className="mt-4 flex gap-3">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-20 w-28 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <Cover
                  gradient={product.gradient}
                  icon={product.icon}
                  className="h-20 w-28 shrink-0 rounded-xl"
                />
              )}
              <div className="min-w-0">
                <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-orange-deep">
                  {product.type === "course"
                    ? "কোর্স"
                    : product.type === "bundle"
                      ? "বান্ডেল"
                      : product.type === "ebook"
                        ? "ই-বুক"
                        : "ওয়ার্কশপ"}
                </p>
                <h3 className="font-display mt-0.5 text-sm font-bold leading-snug">{product.title}</h3>
                <p className="mt-1 text-[0.68rem] text-muted">{product.meta}</p>
              </div>
            </div>

            <div className="mt-5 space-y-2 border-t border-line-soft pt-4 text-sm">
              <div className="flex justify-between text-muted">
                <span>মূল্য</span>
                <span>{formatTaka(product.originalPrice || product.amount)}</span>
              </div>
              {off > 0 && (
                <div className="flex justify-between text-green">
                  <span>ছাড়</span>
                  <span>- {formatTaka(product.originalPrice - product.amount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-line-soft pt-3 text-base font-bold">
                <span>সর্বমোট</span>
                <span className="font-display text-xl">
                  {isFree ? "ফ্রি" : formatTaka(product.amount)}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2 rounded-xl bg-surface-2 p-3 text-[0.7rem] text-muted">
              <p>✓ লাইফটাইম অ্যাক্সেস</p>
              <p>✓ যাচাইযোগ্য সার্টিফিকেট {product.type === "course" || product.type === "bundle" ? "ও প্রজেক্ট" : ""}</p>
              <p>✓ নিরাপদ অর্ডার প্রসেস</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
