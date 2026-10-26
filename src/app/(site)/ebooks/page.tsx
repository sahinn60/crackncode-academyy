import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { listEbooks, listMyPurchases } from "@/lib/data";
import { bengaliNumber, formatTaka } from "@/lib/utils";

export const metadata: Metadata = {
  title: "ই-বুক লাইব্রেরি",
  description: "ফ্রি ও সাশ্রয়ী ই-বুক — প্রোগ্রামিং, ফ্রিল্যান্সিং, AI আর ক্যারিয়ার গাইড।",
};

export default async function EbooksPage() {
  const ebooks = await listEbooks();
  const user = await getCurrentUser();
  const purchased = user ? await listMyPurchases(user.id, "ebook") : [];
  const purchasedIds = new Set(purchased.map((o) => o.product_id));

  return (
    <>
      <section className="border-b border-line bg-surface-2/50">
        <div className="container-cn py-12 lg:py-16">
          <nav className="flex items-center gap-2 text-xs text-muted" aria-label="ব্রেডক্রাম্ব">
            <Link href="/" className="hover:text-ink">হোম</Link>
            <span>/</span>
            <span className="text-ink">ই-বুক</span>
          </nav>
          <span className="eyebrow mt-6">রিডিং লাইব্রেরি</span>
          <h1 className="section-title mt-3 max-w-3xl text-3xl md:text-5xl">
            ছোট গাইডে বড় পরিবর্তন
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            ভিডিও দেখার সময় নেই? এক বসায় পড়ে ফেলার মতো সাজানো গাইড — ফ্রি ও সাশ্রয়ী
            দামে। কিনলে ড্যাশবোর্ডে পেয়ে যাবেন।
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
                        ই-বুক · {bengaliNumber(book.pages)} পেজ
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-1 pt-3">
                  <p className="text-[0.78rem] leading-relaxed text-muted">{book.description}</p>
                  <div className="mt-auto flex items-end justify-between gap-3 border-t border-line-soft pt-4">
                    <span className="font-display text-lg font-bold">
                      {book.price === 0 ? "ফ্রি" : formatTaka(book.price)}
                    </span>
                    {owned ? (
                      <Link href="/dashboard" className="btn btn-outline btn-sm text-green">
                        ✓ লাইব্রেরিতে আছে
                      </Link>
                    ) : (
                      <Link href={`/checkout/ebook/${book.id}`} className="btn btn-primary btn-sm">
                        {book.price === 0 ? "ফ্রি নিন" : "কিনুন"}
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
            ই-বুক কেনার পর আপনার{" "}
            <Link href="/dashboard" className="font-semibold text-orange-deep underline">
              ড্যাশবোর্ড
            </Link>{" "}
            থেকে ডাউনলোড/পড়ার লিংক পাবেন। ফ্রি ই-বুকের জন্যও একটি অ্যাকাউন্ট দরকার — যাতে
            আপনার লাইব্রেরি সবসময় এক জায়গায় থাকে।
          </p>
        </div>
      </section>
    </>
  );
}
