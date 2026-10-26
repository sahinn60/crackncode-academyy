import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { listMyPurchases, listWorkshops } from "@/lib/data";
import { bengaliNumber, formatDate, formatTaka } from "@/lib/utils";

export const metadata: Metadata = {
  title: "লাইভ ওয়ার্কশপ",
  description: "লাইভ সেশনে প্রশ্ন করুন, রেকর্ডিং পান — বাংলায় প্র্যাকটিক্যাল ওয়ার্কশপ।",
};

function timeOf(iso: string) {
  return new Intl.DateTimeFormat("bn-BD", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default async function WorkshopsPage() {
  const workshops = await listWorkshops();
  const user = await getCurrentUser();
  const purchased = user ? await listMyPurchases(user.id, "workshop") : [];
  const purchasedIds = new Set(purchased.map((o) => o.product_id));

  return (
    <>
      <section className="border-b border-line bg-surface-2/50">
        <div className="container-cn py-12 lg:py-16">
          <nav className="flex items-center gap-2 text-xs text-muted" aria-label="ব্রেডক্রাম্ব">
            <Link href="/" className="hover:text-ink">হোম</Link>
            <span>/</span>
            <span className="text-ink">ওয়ার্কশপ</span>
          </nav>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="eyebrow"><span className="live-dot" /> লাইভ সেশন</span>
            <span className="text-xs text-muted">সীমিত সিট — আগে বুক করুন</span>
          </div>
          <h1 className="section-title mt-3 max-w-3xl text-3xl md:text-5xl">
            লাইভে শিখুন, সাথে সাথে প্রশ্ন করুন
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            ২-৩ ঘণ্টার ছোট সেশন, বাস্তব কাজ আর সরাসরি ইন্টারঅ্যাকশন। সেশনের রেকর্ডিংও
            পাবেন — তাই মিস হলে চিন্তা নেই।
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
                    লাইভ
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="hidden shrink-0 flex-col items-center rounded-xl border border-line-soft bg-page px-3 py-2 text-center sm:flex">
                    <span className="font-display text-2xl font-bold leading-none">
                      {new Intl.DateTimeFormat("bn-BD", { day: "numeric" }).format(new Date(w.starts_at))}
                    </span>
                    <span className="mt-1 text-[0.62rem] font-semibold uppercase text-muted">
                      {new Intl.DateTimeFormat("bn-BD", { month: "short" }).format(new Date(w.starts_at))}
                    </span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="pill pill-live"><span className="live-dot" /> লাইভ</span>
                      <span className="pill pill-orange">{w.price === 0 ? "ফ্রি" : formatTaka(w.price)}</span>
                      <span className="text-xs text-muted">{w.duration}</span>
                    </div>
                    <h2 className="font-display mt-2 text-xl font-bold md:text-2xl">{w.title}</h2>
                    <p className="mt-1 max-w-2xl text-sm text-muted">{w.description}</p>
                    <p className="mt-3 text-xs font-semibold text-ink">
                      {formatDate(w.starts_at)} • রাত {timeOf(w.starts_at)} • অনলাইন (Zoom)
                    </p>
                    <div className="mt-3 flex max-w-sm items-center gap-3">
                      <div className="progress-track h-1.5 flex-1">
                        <div className="progress-fill" style={{ width: `${filled}%` }} />
                      </div>
                      <span className="text-[0.68rem] text-muted">
                        {bengaliNumber(w.seats_left)} সিট বাকি
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:flex-col md:items-stretch">
                  {registered ? (
                    <span className="btn btn-outline btn-sm cursor-default text-green">✓ রেজিস্টার্ড</span>
                  ) : (
                    <Link href={`/checkout/workshop/${w.id}`} className="btn btn-primary">
                      {w.price === 0 ? "ফ্রি রেজিস্ট্রার" : "সিট বুক করুন"}
                    </Link>
                  )}
                  <Link href="/contact" className="btn btn-ghost btn-sm text-muted">
                    প্রশ্ন আছে?
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid gap-4 rounded-2xl border border-line-soft bg-surface-2/60 p-6 sm:grid-cols-3">
          {[
            ["লাইভ প্রশ্নোত্তর", "সেশনের মাঝেই প্রশ্ন করুন, সরাসরি উত্তর পান।"],
            ["রেকর্ডিং অ্যাক্সেস", "লাইভ মিস করলেও রেকর্ডিং দেখে নিতে পারবেন।"],
            ["রিসোর্স কিট", "স্লাইড, টেমপ্লেট আর চেকলিস্ট — সেশনের পরে পাবেন।"],
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
