import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { listEbooks, listMyPurchases } from "@/lib/data";
import { getLocale } from "@/lib/i18n-server";
import { pick } from "@/lib/i18n";
import { formatNumber, formatTaka } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, "ই-বুক লাইব্রেরি", "E-book Library"),
    description: pick(
      locale,
      "ফ্রি ও সাশ্রয়ী ই-বুক — প্রোগ্রামিং, ফ্রিল্যান্সিং, AI আর ক্যারিয়ার গাইড।",
      "Free and affordable e-books — guides on programming, freelancing, AI and careers."
    ),
  };
}

export default async function EbooksPage() {
  const locale = await getLocale();
  const ebooks = await listEbooks();
  const user = await getCurrentUser();
  const purchased = user ? await listMyPurchases(user.id, "ebook") : [];
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
            <span className="text-ink">{pick(locale, "ই-বুক", "E-books")}</span>
          </nav>
          <span className="eyebrow mt-6">{pick(locale, "রিডিং লাইব্রেরি", "Reading library")}</span>
          <h1 className="section-title mt-3 max-w-3xl text-3xl md:text-5xl">
            {pick(locale, "ছোট গাইডে বড় পরিবর্তন", "Big change from a small guide")}
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            {pick(
              locale,
              "ভিডিও দেখার সময় নেই? এক বসায় পড়ে ফেলার মতো সাজানো গাইড — ফ্রি ও সাশ্রয়ী দামে। কিনলে ড্যাশবোর্ডে পেয়ে যাবেন।",
              "No time for videos? These guides are organised to be read in a single sitting — free and affordably priced. After buying, they are waiting in your dashboard."
            )}
          </p>
        </div>
      </section>

      <section className="container-cn py-12 lg:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ebooks.map((book) => {
            const owned = purchasedIds.has(book.id);
            return (
              <div
                key={book.id}
                className="book-stage flex flex-col overflow-hidden rounded-2xl border border-line-soft bg-surface p-4"
              >
                <div className="book-shelf">
                  <div className="book-cover" style={{ background: book.gradient }}>
                    <div className="book-cover-inner">
                      <span className="font-mono text-[0.5rem] uppercase tracking-[0.2em] text-cream/60">
                        CrackNcode
                      </span>
                      <span className="font-display mt-3 text-[1rem] font-bold leading-snug text-cream">
                        {book.title}
                      </span>
                      <span className="mt-auto text-[0.58rem] font-semibold uppercase tracking-widest text-cream/70">
                        {pick(locale, "ই-বুক", "E-book")} · {formatNumber(book.pages, locale)}
                        {pick(locale, " পেজ", " pages")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-1 pt-3">
                  <p className="text-[0.78rem] leading-relaxed text-muted">{book.description}</p>
                  <div className="mt-auto flex items-end justify-between gap-3 border-t border-line-soft pt-4">
                    <span className="font-display text-lg font-bold">
                      {book.price === 0 ? pick(locale, "ফ্রি", "Free") : formatTaka(book.price, locale)}
                    </span>
                    {owned ? (
                      <Link href="/dashboard" className="btn btn-outline btn-sm text-green">
                        ✓ {pick(locale, "লাইব্রেরিতে আছে", "In your library")}
                      </Link>
                    ) : (
                      <Link href={`/checkout/ebook/${book.id}`} className="btn btn-primary btn-sm">
                        {book.price === 0 ? pick(locale, "ফ্রি নিন", "Get it free") : pick(locale, "কিনুন", "Buy now")}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-line-soft bg-surface-2/60 p-6">
          <p className="text-sm text-muted">
            {pick(
              locale,
              "ই-বুক কেনার পর আপনার",
              "After buying an e-book, you will find the download and reading link in your"
            )}{" "}
            <Link href="/dashboard" className="font-semibold text-orange-deep underline">
              {pick(locale, "ড্যাশবোর্ড", "dashboard")}
            </Link>{" "}
            {pick(
              locale,
              "থেকে ডাউনলোড/পড়ার লিংক পাবেন। ফ্রি ই-বুকের জন্যও একটি অ্যাকাউন্ট দরকার — যাতে আপনার লাইব্রেরি সবসময় এক জায়গায় থাকে।",
              "where you can download and read them. You need an account even for free e-books — so your library always stays in one place."
            )}
          </p>
        </div>
      </section>
    </>
  );
}
