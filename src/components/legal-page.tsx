import Link from "next/link";

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <>
      <section className="border-b border-line bg-surface-2/50">
        <div className="container-cn max-w-4xl py-12 lg:py-16">
          <nav className="flex items-center gap-2 text-xs text-muted" aria-label="ব্রেডক্রাম্ব">
            <Link href="/" className="hover:text-ink">হোম</Link>
            <span>/</span>
            <span className="text-ink">{title}</span>
          </nav>
          <h1 className="section-title mt-6 text-3xl md:text-5xl">{title}</h1>
          <p className="mt-2 text-xs text-muted">সর্বশেষ আপডেট: {updated}</p>
          <p className="mt-4 max-w-2xl text-muted">{intro}</p>
        </div>
      </section>

      <section className="container-cn max-w-4xl py-12">
        <div className="space-y-8">
          {sections.map((section, i) => (
            <div key={section.heading} className="rounded-2xl border border-line-soft bg-surface p-6">
              <h2 className="font-display text-xl font-bold">
                <span className="mr-2 font-mono text-sm text-orange-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {section.heading}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
                {section.body.map((para, j) => (
                  <p key={j}>{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-line-soft bg-surface-2/60 p-5 text-sm text-muted">
          এই নীতিমালা নিয়ে প্রশ্ন থাকলে{" "}
          <Link href="/contact" className="font-semibold text-orange-deep underline">
            যোগাযোগ করুন
          </Link>
          ।
        </div>
      </section>
    </>
  );
}
