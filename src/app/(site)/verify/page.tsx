import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { verifyCertificate } from "@/lib/data";
import { bengaliNumber, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "সার্টিফিকেট যাচাই",
  description: "CrackNcode Academy সার্টিফিকেট কোড দিয়ে সাথে সাথে যাচাই করুন।",
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  const result = code ? verifyCertificate(code) : null;
  const user = await getCurrentUser();

  return (
    <>
      <section className="border-b border-line bg-surface-2/50">
        <div className="container-cn py-12 lg:py-16">
          <nav className="flex items-center gap-2 text-xs text-muted" aria-label="ব্রেডক্রাম্ব">
            <Link href="/" className="hover:text-ink">হোম</Link>
            <span>/</span>
            <span className="text-ink">সার্টিফিকেট যাচাই</span>
          </nav>
          <span className="eyebrow mt-6">ভেরিফিকেশন</span>
          <h1 className="section-title mt-3 text-3xl md:text-5xl">সার্টিফিকেট যাচাই করুন</h1>
          <p className="mt-3 max-w-2xl text-muted">
            সার্টিফিকেটের উপরে থাকা কোডটি নিচে দিন। কোর্স ১০০% সম্পন্ন থাকলে সার্টিফিকেটের
            তথ্য সাথে সাথে দেখাবে।
          </p>
        </div>
      </section>

      <section className="container-cn max-w-3xl py-12">
        <form method="get" className="flex flex-col gap-3 rounded-2xl border border-line-soft bg-surface p-5 sm:flex-row">
          <input
            name="code"
            defaultValue={code || ""}
            placeholder="যেমন: CN-W001-S00001"
            className="input font-mono"
            aria-label="সার্টিফিকেট কোড"
          />
          <button type="submit" className="btn btn-primary shrink-0">যাচাই করুন</button>
        </form>

        {code && !result && (
          <div className="mt-6 rounded-2xl border border-live/30 bg-live/5 p-6">
            <p className="font-display text-lg font-bold text-live">সার্টিফিকেট পাওয়া যায়নি</p>
            <p className="mt-1 text-sm text-muted">
              কোডটি ঠিক আছে কিনা দেখুন। কোড শুধু কোর্সের সব লেসন সম্পন্ন করলে সক্রিয় হয়।
            </p>
          </div>
        )}

        {result && (
          <div className="mt-8 overflow-hidden rounded-2xl border-2 border-line bg-surface shadow-[8px_8px_0_var(--shadow-color)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft bg-green/10 px-6 py-4">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-green">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-green text-cream text-xs">✓</span>
                ভেরিফায়েড সার্টিফিকেট
              </span>
              <span className="font-mono text-[0.7rem] text-muted">{result.code}</span>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">CrackNcode Academy</p>
              <h2 className="section-title mt-2 text-2xl md:text-3xl">কোর্স সম্পন্নের সার্টিফিকেট</h2>
              <p className="mt-5 text-sm text-muted">এই সার্টিফিকেট প্রদান করা হয়েছে</p>
              <p className="font-display text-2xl font-bold">{result.student.name}</p>
              <p className="mt-4 text-sm text-muted">সফলভাবে সম্পন্ন করার জন্য</p>
              <Link
                href={`/courses/${result.course.slug}`}
                className="font-display text-xl font-bold text-orange-deep hover:underline"
              >
                {result.course.title}
              </Link>
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-line-soft pt-4 text-xs text-muted">
                <span>সম্পন্ন: {formatDate(result.completedAt)}</span>
                <span>লেসন: {bengaliNumber(result.course.lesson_count)}টি</span>
                <span>যাচাই: {formatDate(new Date().toISOString())}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-line-soft bg-surface-2/60 p-6 text-sm text-muted">
          <p className="font-semibold text-ink">আপনার সার্টিফিকেট কোড কোথায় পাবেন?</p>
          <p className="mt-1">
            কোর্সের সব লেসন সম্পন্ন করলে{" "}
            {user ? (
              <Link href="/dashboard" className="font-semibold text-orange-deep underline">
                আপনার ড্যাশবোর্ডে
              </Link>
            ) : (
              <Link href="/login" className="font-semibold text-orange-deep underline">
                ড্যাশবোর্ডে লগইন করে
              </Link>
            )}{" "}
            সার্টিফিকেট কোড দেখতে পাবেন।
          </p>
        </div>
      </section>
    </>
  );
}
