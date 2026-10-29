import type { Metadata } from "next";
import Link from "next/link";
import { getBundleCourses, listBundles } from "@/lib/data";
import { getLocale } from "@/lib/i18n-server";
import { pick } from "@/lib/i18n";
import { formatNumber, discountPercent, formatTaka } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, "বান্ডেল প্যাকেজ", "Bundle Packages"),
    description: pick(
      locale,
      "একাধিক কোর্স একসাথে — বান্ডেলে বেশি সেভ করুন।",
      "Multiple courses in one package — save more with bundles."
    ),
  };
}

export default async function BundlesPage() {
  const locale = await getLocale();
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
          <nav
            className="flex items-center gap-2 text-xs text-muted"
            aria-label={pick(locale, "ব্রেডক্রাম্ব", "Breadcrumb")}
          >
            <Link href="/" className="hover:text-ink">{pick(locale, "হোম", "Home")}</Link>
            <span>/</span>
            <span className="text-ink">{pick(locale, "বান্ডেল", "Bundles")}</span>
          </nav>
          <span className="eyebrow mt-6">{pick(locale, "কম্বো অফার", "Combo offer")}</span>
          <h1 className="section-title mt-3 max-w-3xl text-3xl md:text-5xl">
            {pick(locale, "একসাথে শিখুন, বেশি সেভ করুন", "Learn together, save more")}
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            {pick(
              locale,
              "সম্পর্কিত কোর্সগুলো এক বান্ডেলে নিলে আলাদা কেনার চেয়ে অনেক কম খরচে পুরো স্কিল পথটা পেয়ে যাবেন।",
              "Get the whole skill path in one bundle for far less than buying the related courses separately."
            )}
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
                      {formatNumber(courses.length, locale)}
                      {pick(locale, "টি কোর্সের কম্বো", "-course combo")}
                    </span>
                    <span className="rounded-sm bg-orange px-2 py-0.5 text-[0.62rem] font-bold text-white">
                      {formatNumber(off, locale)}%{pick(locale, " ছাড়", " off")}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2">
                    <span className="pill pill-orange">
                      {pick(locale, "লাইফটাইম অ্যাক্সেস", "Lifetime access")}
                    </span>
                    <span className="pill">{pick(locale, "প্রজেক্টসহ", "With projects")}</span>
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
                        {pick(locale, "আলাদা কিনলে", "Buying separately:")}{" "}
                        {formatTaka(bundle.original_price, locale)}
                      </p>
                      <p className="font-display text-2xl font-bold">
                        {formatTaka(bundle.price, locale)}
                      </p>
                    </div>
                    <Link href={`/checkout/bundle/${bundle.id}`} className="btn btn-primary btn-sm">
                      {pick(locale, "বান্ডেল নিন", "Get the bundle")}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-line-soft bg-surface-2/60 p-6">
          <h3 className="font-display text-lg font-bold">
            {pick(locale, "বান্ডেল কিনলে যা পাবেন", "What you get with a bundle")}
          </h3>
          <div className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-2 lg:grid-cols-4">
            {[
              pick(locale, "সব কোর্সে লাইফটাইম অ্যাক্সেস", "Lifetime access to every course"),
              pick(locale, "প্রজেক্ট ও কোড রিভিউ", "Projects and code review"),
              pick(locale, "যাচাইযোগ্য সার্টিফিকেট", "Verifiable certificate"),
              pick(locale, "ভবিষ্যতের আপডেট ফ্রি", "Free future updates"),
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
