import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { verifyCertificate } from "@/lib/data";
import { getLocale } from "@/lib/i18n-server";
import { pick } from "@/lib/i18n";
import { formatNumber, formatDate } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: pick(locale, "সার্টিফিকেট যাচাই", "Verify Certificate"),
    description: pick(
      locale,
      "CrackNcode Academy সার্টিফিকেট কোড দিয়ে সাথে সাথে যাচাই করুন।",
      "Verify a CrackNcode Academy certificate instantly with its code."
    ),
  };
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const locale = await getLocale();
  const { code } = await searchParams;
  const result = code ? await verifyCertificate(code) : null;
  const user = await getCurrentUser();

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
            <span className="text-ink">{pick(locale, "সার্টিফিকেট যাচাই", "Verify Certificate")}</span>
          </nav>
          <span className="eyebrow mt-6">{pick(locale, "ভেরিফিকেশন", "Verification")}</span>
          <h1 className="section-title mt-3 text-3xl md:text-5xl">
            {pick(locale, "সার্টিফিকেট যাচাই করুন", "Verify a certificate")}
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            {pick(
              locale,
              "সার্টিফিকেটের উপরে থাকা কোডটি নিচে দিন। কোর্স ",
              "Enter the code printed on the certificate below. If the course is "
            )}
            {formatNumber(100, locale)}%{" "}
            {pick(
              locale,
              "সম্পন্ন থাকলে সার্টিফিকেটের তথ্য সাথে সাথে দেখাবে।",
              "complete, the certificate details will appear right away."
            )}
          </p>
        </div>
      </section>

      <section className="container-cn max-w-3xl py-12">
        <form method="get" className="flex flex-col gap-3 rounded-2xl border border-line-soft bg-surface p-5 sm:flex-row">
          <input
            name="code"
            defaultValue={code || ""}
            placeholder={pick(locale, "যেমন: CN-W001-S00001", "e.g. CN-W001-S00001")}
            className="input font-mono"
            aria-label={pick(locale, "সার্টিফিকেট কোড", "Certificate code")}
          />
          <button type="submit" className="btn btn-primary shrink-0">
            {pick(locale, "যাচাই করুন", "Verify")}
          </button>
        </form>

        {code && !result && (
          <div className="mt-6 rounded-2xl border border-live/30 bg-live/5 p-6">
            <p className="font-display text-lg font-bold text-live">
              {pick(locale, "সার্টিফিকেট পাওয়া যায়নি", "Certificate not found")}
            </p>
            <p className="mt-1 text-sm text-muted">
              {pick(
                locale,
                "কোডটি ঠিক আছে কিনা দেখুন। কোড শুধু কোর্সের সব লেসন সম্পন্ন করলে সক্রিয় হয়।",
                "Check that the code is correct. A code becomes active only after you complete every lesson in the course."
              )}
            </p>
          </div>
        )}

        {result && (
          <div className="mt-8 overflow-hidden rounded-2xl border-2 border-line bg-surface shadow-[8px_8px_0_var(--shadow-color)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft bg-green/10 px-6 py-4">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-green">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-green text-cream text-xs">✓</span>
                {pick(locale, "ভেরিফায়েড সার্টিফিকেট", "Verified certificate")}
              </span>
              <span className="font-mono text-[0.7rem] text-muted">{result.code}</span>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">CrackNcode Academy</p>
              <h2 className="section-title mt-2 text-2xl md:text-3xl">
                {pick(locale, "কোর্স সম্পন্নের সার্টিফিকেট", "Certificate of Course Completion")}
              </h2>
              <p className="mt-5 text-sm text-muted">
                {pick(locale, "এই সার্টিফিকেট প্রদান করা হয়েছে", "This certificate is presented to")}
              </p>
              <p className="font-display text-2xl font-bold">{result.student.name}</p>
              <p className="mt-4 text-sm text-muted">
                {pick(locale, "সফলভাবে সম্পন্ন করার জন্য", "for successfully completing")}
              </p>
              <Link
                href={`/courses/${result.course.slug}`}
                className="font-display text-xl font-bold text-orange-deep hover:underline"
              >
                {result.course.title}
              </Link>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-line-soft pt-4 text-xs text-muted">
                <span>
                  {pick(locale, "সম্পন্ন: ", "Completed: ")}
                  {formatDate(result.completedAt, locale)}
                </span>
                <span>
                  {pick(locale, "লেসন: ", "Lessons: ")}
                  {formatNumber(result.course.lesson_count, locale)}
                  {pick(locale, "টি", "")}
                </span>
                <span>
                  {pick(locale, "যাচাই: ", "Verified: ")}
                  {formatDate(new Date().toISOString(), locale)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-line-soft bg-surface-2/60 p-6 text-sm text-muted">
          <p className="font-semibold text-ink">
            {pick(locale, "আপনার সার্টিফিকেট কোড কোথায় পাবেন?", "Where do I find my certificate code?")}
          </p>
          <p className="mt-1">
            {user ? (
              <>
                {pick(locale, "কোর্সের সব লেসন সম্পন্ন করলে ", "Once you complete every lesson in a course, ")}
                <Link href="/dashboard" className="font-semibold text-orange-deep underline">
                  {pick(locale, "আপনার ড্যাশবোর্ডে", "your dashboard")}
                </Link>
                {pick(locale, " সার্টিফিকেট কোড দেখতে পাবেন।", " shows your certificate code.")}
              </>
            ) : (
              <>
                {pick(locale, "কোর্সের সব লেসন সম্পন্ন করার পর ", "After completing every lesson in a course, ")}
                <Link href="/login" className="font-semibold text-orange-deep underline">
                  {pick(locale, "ড্যাশবোর্ডে লগইন করে", "log in to your dashboard")}
                </Link>
                {pick(locale, " সার্টিফিকেট কোড দেখতে পাবেন।", " to see your certificate code.")}
              </>
            )}
          </p>
        </div>
      </section>
    </>
  );
}
