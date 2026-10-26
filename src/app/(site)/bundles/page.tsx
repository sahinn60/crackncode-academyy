import type { Metadata } from "next";
import Link from "next/link";
import { getBundleCourses, listBundles } from "@/lib/data";
import { bengaliNumber, discountPercent, formatTaka } from "@/lib/utils";

export const metadata: Metadata = {
  title: "বান্ডেল প্যাকেজ",
  description: "একাধিক কোর্স একসাথে — বান্ডেলে বেশি সেভ করুন।",
};

export default async function BundlesPage() {
  const bundles = await Promise.all(
    (await listBundles()).map(async (b) => ({
      bundle: b,
      courses: await getBundleCourses(b),
    }))
  );

  return (
    <>
      <section className="border-b border-line bg-surface-2/50">
        <div className="container-cn py-12 lg:py-16">
          <nav className="flex items-center gap-2 text-xs text-muted" aria-label="ব্রেডক্রাম্ব">
            <Link href="/" className="hover:text-ink">হোম</Link>
            <span>/</span>
            <span className="text-ink">বান্ডেল</span>
          </nav>
          <span className="eyebrow mt-6">কম্বো অফার</span>
          <h1 className="section-title mt-3 max-w-3xl text-3xl md:text-5xl">
            একসাথে শিখুন, বেশি সেভ করুন
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            সম্পর্কিত কোর্সগুলো এক বান্ডেলে নিলে আলাদা কেনার চেয়ে অনেক কম খরচে পুরো স্কিল
            পথটা পেয়ে যাবেন।
          </p>
        </div>
      </section>

      <section className="container-cn py-12 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {bundles.map(({ bundle, courses }) => {
            const off = discountPercent(bundle.price, bundle.original_price);
            return (
              <div
                key={bundle.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-line-soft bg-surface"
              >
                <div className="relative h-40 overflow-hidden bg-navy">
                  <div className="grid h-full grid-cols-3 gap-0.5">
                    {courses.slice(0, 3).map((c) => (
                      <div key={c.id} className="overflow-hidden bg-surface-2">
                        {c.image ? (
                          <img
                            src={c.image}
                            alt={c.title}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div
                            className="h-full w-full"
                            style={{ background: c.gradient }}
                            aria-hidden
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                    <span className="font-display text-sm font-bold text-cream">
                      {bengaliNumber(courses.length)}টি কোর্সের কম্বো
                    </span>
                    <span className="rounded-sm bg-orange px-2 py-0.5 text-[0.62rem] font-bold text-navy">
                      {off}% ছাড়
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2">
                    <span className="pill pill-orange">লাইফটাইম অ্যাক্সেস</span>
                    <span className="pill">প্রজেক্টসহ</span>
                  </div>
                  <h2 className="font-display mt-3 text-xl font-bold">{bundle.title}</h2>
                  <p className="mt-1.5 text-sm text-muted">{bundle.description}</p>

                  <ul className="mt-4 flex-1 space-y-2 border-t border-line-soft pt-4 text-sm">
                    {courses.map((c) => (
                      <li key={c.id} className="flex items-start gap-2 text-muted">
                        <span className="mt-0.5 text-green">✓</span>
                        <span>{c.title}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex items-end justify-between gap-3 border-t border-line-soft pt-4">
                    <div>
                      <p className="text-xs text-muted line-through">
                        আলাদা কিনলে {formatTaka(bundle.original_price)}
                      </p>
                      <p className="font-display text-2xl font-bold">{formatTaka(bundle.price)}</p>
                    </div>
                    <Link href={`/checkout/bundle/${bundle.id}`} className="btn btn-primary btn-sm">
                      বান্ডেল নিন
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-line-soft bg-surface-2/60 p-6">
          <h3 className="font-display text-lg font-bold">বান্ডেল কিনলে যা পাবেন</h3>
          <div className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-2 lg:grid-cols-4">
            {[
              "সব কোর্সে লাইফটাইম অ্যাক্সেস",
              "প্রজেক্ট ও কোড রিভিউ",
              "যাচাইযোগ্য সার্টিফিকেট",
              "ভবিষ্যতের আপডেট ফ্রি",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="text-green">✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
