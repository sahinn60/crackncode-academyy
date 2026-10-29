import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { listMyPurchases, listWorkshops } from "@/lib/data";
import { getLocale } from "@/lib/i18n-server";
import { localeTag, pick, type Locale } from "@/lib/i18n";
import { formatNumber, formatDate, formatTaka } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, "লাইভ ওয়ার্কশপ", "Live Workshops"),
    description: pick(
      locale,
      "লাইভ সেশনে প্রশ্ন করুন, রেকর্ডিং পান — বাংলায় প্র্যাকটিক্যাল ওয়ার্কশপ।",
      "Ask questions in live sessions and get the recording — practical workshops in Bangla."
    ),
  };
}

function timeOf(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(localeTag(locale), {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default async function WorkshopsPage() {
  const locale = await getLocale();
  const workshops = await listWorkshops();
  const user = await getCurrentUser();
  const purchased = user ? await listMyPurchases(user.id, "workshop") : [];
  const purchasedIds = new Set(purchased.map((o) => o.product_id));

  return (
    <>
      <section className="border-b border-line bg-surface-2/50">
        <div className="container-cn py-12 lg:py-16">
          <nav
            className="flex items-center gap-2 text-xs text-muted"
            aria-label={pick(locale, "ব্রেডক্রাম্ব", "Breadcrumb")}
          >
            <Link href="/" className="hover:text-ink">{pick(locale, "হোম", "Home")}</Link>
            <span>/</span>
            <span className="text-ink">{pick(locale, "ওয়ার্কশপ", "Workshops")}</span>
          </nav>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="eyebrow"><span className="live-dot" /> {pick(locale, "লাইভ সেশন", "Live session")}</span>
            <span className="text-xs text-muted">
              {pick(locale, "সীমিত সিট — আগে বুক করুন", "Limited seats — book early")}
            </span>
          </div>
          <h1 className="section-title mt-3 max-w-3xl text-3xl md:text-5xl">
            {pick(locale, "লাইভে শিখুন, সাথে সাথে প্রশ্ন করুন", "Learn live and ask questions as you go")}
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            {pick(
              locale,
              "২-৩ ঘণ্টার ছোট সেশন, বাস্তব কাজ আর সরাসরি ইন্টারঅ্যাকশন। সেশনের রেকর্ডিংও পাবেন — তাই মিস হলে চিন্তা নেই।",
              "Short 2-3 hour sessions with hands-on work and direct interaction. You also get the recording — so missing it is no problem."
            )}
          </p>
        </div>
      </section>

      <section className="container-cn py-12 lg:py-16">
        <div className="space-y-5">
          {workshops.map((w) => {
            const filled = Math.round(((w.seats_total - w.seats_left) / w.seats_total) * 100);
            const registered = purchasedIds.has(w.id);
            return (
              <div
                key={w.id}
                className="grid gap-5 rounded-2xl border border-line-soft bg-surface p-4 md:grid-cols-[15rem_1fr_auto] md:items-center md:p-5"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                  <img
                    src={w.image}
                    alt={w.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-2 top-2 rounded-sm bg-live px-2 py-0.5 text-[0.6rem] font-bold text-white">
                    {pick(locale, "লাইভ", "Live")}
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="hidden shrink-0 flex-col items-center rounded-xl border border-line-soft bg-page px-3 py-2 text-center sm:flex">
                    <span className="font-display text-2xl font-bold leading-none">
                      {new Intl.DateTimeFormat(localeTag(locale), { day: "numeric" }).format(new Date(w.starts_at))}
                    </span>
                    <span className="mt-1 text-[0.62rem] font-semibold uppercase text-muted">
                      {new Intl.DateTimeFormat(localeTag(locale), { month: "short" }).format(new Date(w.starts_at))}
                    </span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="pill pill-live"><span className="live-dot" /> {pick(locale, "লাইভ", "Live")}</span>
                      <span className="pill pill-orange">
                        {w.price === 0 ? pick(locale, "ফ্রি", "Free") : formatTaka(w.price, locale)}
                      </span>
                      <span className="text-xs text-muted">{w.duration}</span>
                    </div>
                    <h2 className="font-display mt-2 text-xl font-bold md:text-2xl">{w.title}</h2>
                    <p className="mt-1 max-w-2xl text-sm text-muted">{w.description}</p>
                    <p className="mt-3 text-xs font-semibold text-ink">
                      {formatDate(w.starts_at, locale)} • {pick(locale, "রাত ", "")}
                      {timeOf(w.starts_at, locale)} • {pick(locale, "অনলাইন (Zoom)", "Online (Zoom)")}
                    </p>
                    <div className="mt-3 flex max-w-sm items-center gap-3">
                      <div className="progress-track h-1.5 flex-1">
                        <div className="progress-fill" style={{ width: `${filled}%` }} />
                      </div>
                      <span className="text-[0.68rem] text-muted">
                        {formatNumber(w.seats_left, locale)}
                        {pick(locale, " সিট বাকি", " seats left")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:flex-col md:items-stretch">
                  {registered ? (
                    <span className="btn btn-outline btn-sm cursor-default text-green">
                      ✓ {pick(locale, "রেজিস্টার্ড", "Registered")}
                    </span>
                  ) : (
                    <Link href={`/checkout/workshop/${w.id}`} className="btn btn-primary">
                      {w.price === 0
                        ? pick(locale, "ফ্রি রেজিস্ট্রার", "Register free")
                        : pick(locale, "সিট বুক করুন", "Book a seat")}
                    </Link>
                  )}
                  <Link href="/contact" className="btn btn-ghost btn-sm text-muted">
                    {pick(locale, "প্রশ্ন আছে?", "Have a question?")}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid gap-4 rounded-2xl border border-line-soft bg-surface-2/60 p-6 sm:grid-cols-3">
          {[
            [
              pick(locale, "লাইভ প্রশ্নোত্তর", "Live Q&A"),
              pick(
                locale,
                "সেশনের মাঝেই প্রশ্ন করুন, সরাসরি উত্তর পান।",
                "Ask questions during the session and get answers on the spot."
              ),
            ],
            [
              pick(locale, "রেকর্ডিং অ্যাক্সেস", "Recording access"),
              pick(
                locale,
                "লাইভ মিস করলেও রেকর্ডিং দেখে নিতে পারবেন।",
                "Miss the live session? You can watch the recording instead."
              ),
            ],
            [
              pick(locale, "রিসোর্স কিট", "Resource kit"),
              pick(
                locale,
                "স্লাইড, টেমপ্লেট আর চেকলিস্ট — সেশনের পরে পাবেন।",
                "Slides, templates and checklists — delivered after the session."
              ),
            ],
          ].map(([title, text]) => (
            <div key={title}>
              <h3 className="font-display text-sm font-bold">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
