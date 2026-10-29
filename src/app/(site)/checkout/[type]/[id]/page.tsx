import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Cover } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getEnrollment, listMyOrders } from "@/lib/data";
import { getCheckoutProduct } from "@/lib/products";
import { placeOrderAction } from "@/lib/actions";
import { pick } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { discountPercent, formatTaka } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: pick(locale, "চেকআউট", "Checkout") };
}

type Params = Promise<{ type: string; id: string }>;

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ error?: string }>;
}) {
  const locale = await getLocale();
  const { type, id } = await params;
  const { error } = await searchParams;
  const product = await getCheckoutProduct(type, Number(id));
  if (!product) notFound();

  const user = await requireUser(`/checkout/${type}/${id}`);

  if (product.type === "course") {
    const existing = await getEnrollment(user.id, product.id);
    if (existing) redirect(`/learn/${product.slug}`);
  }

  const alreadyPaid = (await listMyOrders(user.id)).some(
    (o) => o.product_type === product.type && o.product_id === product.id && o.status === "paid"
  );
  if (alreadyPaid) redirect("/dashboard?already=1");

  const off = discountPercent(product.amount, product.originalPrice);
  const isFree = product.amount === 0;

  return (
    <>
      <section className="border-b border-line bg-surface-2/50">
        <div className="container-cn py-8 lg:py-10">
          <nav
            className="flex flex-wrap items-center gap-2 text-xs text-muted"
            aria-label={pick(locale, "ব্রেডক্রাম্ব", "Breadcrumb")}
          >
            <Link href="/" className="hover:text-ink">{pick(locale, "হোম", "Home")}</Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-ink">{pick(locale, "কোর্স", "Courses")}</Link>
            <span>/</span>
            <span className="text-ink">{pick(locale, "চেকআউট", "Checkout")}</span>
          </nav>
          <h1 className="section-title mt-3 text-2xl md:text-3xl">{pick(locale, "চেকআউট", "Checkout")}</h1>
          <p className="mt-1 text-sm text-muted">
            {pick(
              locale,
              "আপনার অর্ডার নিশ্চিত করুন — তারপর পেমেন্ট ধাপে যাবেন।",
              "Confirm your order — then you'll move on to the payment step."
            )}
          </p>
        </div>
      </section>

      <div className="container-cn grid gap-8 py-10 lg:grid-cols-[1.3fr_0.8fr] lg:py-14">
        <form action={placeOrderAction} className="space-y-6">
          <input type="hidden" name="product_type" value={product.type} />
          <input type="hidden" name="product_id" value={product.id} />

          <div className="rounded-2xl border border-line-soft bg-surface p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold">{pick(locale, "অ্যাকাউন্ট", "Account")}</h2>
              <Link href="/dashboard" className="text-xs font-semibold text-orange-deep hover:underline">
                {pick(locale, "প্রোফাইল", "Profile")}
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
              {pick(
                locale,
                "অর্ডার ও কোর্স অ্যাক্সেস এই অ্যাকাউন্টে যুক্ত হবে।",
                "Orders and course access will be added to this account."
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-line-soft bg-surface p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold">{pick(locale, "পেমেন্ট মাধ্যম", "Payment method")}</h2>
              <span className="pill pill-orange">{pick(locale, "ডেমো মোড", "Demo mode")}</span>
            </div>
            <div className="mt-4 space-y-2.5">
              {[
                { value: "bkash", name: "bKash", desc: pick(locale, "মোবাইল ব্যাংকিং — সবচেয়ে জনপ্রিয়", "Mobile banking — most popular"), badge: "bKash", color: "#e2136e" },
                { value: "nagad", name: "Nagad", desc: pick(locale, "মোবাইল ব্যাংকিং — দ্রুত পেমেন্ট", "Mobile banking — fast payment"), badge: "Nagad", color: "#ee1c25" },
                { value: "card", name: pick(locale, "কার্ড", "Card"), desc: pick(locale, "Visa / Mastercard (ডেমো)", "Visa / Mastercard (demo)"), badge: "CARD", color: "#090E16" },
              ].map((m, i) => (
                <label key={m.value} className="method-card">
                  <input
                    type="radio"
                    name="method"
                    value={m.value}
                    defaultChecked={i === 0}
                    className="accent-[#ED002B]"
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
              <strong className="font-semibold">{pick(locale, "ডেমো পেমেন্ট:", "Demo payment:")}</strong>{" "}
              {pick(
                locale,
                "এই মুহূর্তে কোনো টাকা কাটা হবে না। পরের ধাপে পেমেন্ট নিশ্চিত করলেই কোর্স অ্যাক্সেস চালু হবে। লাইভ bKash/Nagad চালু করতে মার্চেন্ট অ্যাকাউন্ট সংযুক্ত করতে হবে।",
                "no money will be charged right now. Course access activates as soon as you confirm payment in the next step. To enable live bKash/Nagad, a merchant account must be connected."
              )}
            </div>
          </div>

          {error === "method" && (
            <p className="rounded-lg border border-live/30 bg-live/10 px-3 py-2 text-sm text-live">
              {pick(locale, "পেমেন্ট মাধ্যম সঠিকভাবে বেছে নিন।", "Please choose a payment method.")}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-lg w-full">
            {isFree
              ? pick(locale, "ফ্রি রেজিস্টার নিশ্চিত করুন", "Confirm free registration")
              : pick(locale, "পেমেন্টে এগিয়ে যান", "Continue to payment")}
          </button>
          <p className="text-center text-[0.7rem] text-muted">
            {pick(locale, "এগিয়ে গেলে আপনি", "By continuing you agree to our")}{" "}
            <Link href="/terms" className="underline">{pick(locale, "ব্যবহারের শর্ত", "Terms of Use")}</Link>{" "}
            {pick(locale, "ও", "and")}{" "}
            <Link href="/refund" className="underline">{pick(locale, "রিফান্ড নীতি", "Refund Policy")}</Link>
            {pick(locale, " মেনে নিচ্ছেন।", ".")}
          </p>
        </form>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border-2 border-line bg-surface p-5 shadow-[6px_6px_0_var(--shadow-color)]">
            <h2 className="font-display text-lg font-bold">{pick(locale, "অর্ডার সারাংশ", "Order summary")}</h2>
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
                    ? pick(locale, "কোর্স", "Course")
                    : product.type === "bundle"
                      ? pick(locale, "বান্ডেল", "Bundle")
                      : product.type === "ebook"
                        ? pick(locale, "ই-বুক", "E-book")
                        : pick(locale, "ওয়ার্কশপ", "Workshop")}
                </p>
                <h3 className="font-display mt-0.5 text-sm font-bold leading-snug">{product.title}</h3>
                <p className="mt-1 text-[0.68rem] text-muted">{product.meta}</p>
              </div>
            </div>

            <div className="mt-5 space-y-2 border-t border-line-soft pt-4 text-sm">
              <div className="flex justify-between text-muted">
                <span>{pick(locale, "মূল্য", "Price")}</span>
                <span>{formatTaka(product.originalPrice || product.amount, locale)}</span>
              </div>
              {off > 0 && (
                <div className="flex justify-between text-green">
                  <span>{pick(locale, "ছাড়", "Discount")}</span>
                  <span>- {formatTaka(product.originalPrice - product.amount, locale)}</span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-line-soft pt-3 text-base font-bold">
                <span>{pick(locale, "সর্বমোট", "Total")}</span>
                <span className="font-display text-xl">
                  {isFree ? pick(locale, "ফ্রি", "Free") : formatTaka(product.amount, locale)}
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-2 rounded-xl bg-surface-2 p-3 text-[0.7rem] text-muted">
              <p>{pick(locale, "✓ লাইফটাইম অ্যাক্সেস", "✓ Lifetime access")}</p>
              <p>
                {product.type === "course" || product.type === "bundle"
                  ? pick(locale, "✓ যাচাইযোগ্য সার্টিফিকেট ও প্রজেক্ট", "✓ Verifiable certificate and projects")
                  : pick(locale, "✓ যাচাইযোগ্য সার্টিফিকেট", "✓ Verifiable certificate")}
              </p>
              <p>{pick(locale, "✓ নিরাপদ অর্ডার প্রসেস", "✓ Secure order process")}</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
