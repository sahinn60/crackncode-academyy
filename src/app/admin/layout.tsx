import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { AdminNav } from "@/components/admin-nav";
import { logoutAction } from "@/lib/actions";
import { requireAdmin } from "@/lib/auth";
import { adminStats } from "@/lib/data";

export const metadata: Metadata = {
  title: { default: "অ্যাডমিন প্যানেল", template: "%s · অ্যাডমিন" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const stats = await adminStats();

  return (
    <div className="min-h-dvh bg-page">
      <header className="sticky top-0 z-40 border-b border-line-soft bg-page/90 backdrop-blur">
        <div className="container-cn flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Logo compact />
            <span className="hidden rounded-full border border-orange bg-orange/10 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-widest text-orange-deep sm:inline">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <Link href="/" className="btn btn-ghost btn-sm">
                সাইট দেখুন
              </Link>
            </span>
            <ThemeToggle />
            <span className="hidden items-center gap-2 rounded-full border border-line-soft bg-surface py-1 pl-1 pr-3 md:flex">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-navy font-mono text-xs font-bold text-cream">
                {user.name.trim().charAt(0).toUpperCase()}
              </span>
              <span className="text-xs font-semibold">{user.name.split(" ")[0]}</span>
            </span>
            <form action={logoutAction}>
              <button type="submit" className="btn btn-outline btn-sm">
                লগআউট
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="container-cn grid gap-6 py-6 lg:grid-cols-[15rem_1fr] lg:gap-8 lg:py-8">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line-soft bg-surface p-2.5">
            <AdminNav messageCount={stats.messages} />
            <div className="mt-2 hidden border-t border-line-soft p-2 lg:block">
              <Link href="/admin/courses/new" className="btn btn-primary btn-sm w-full">
                + নতুন কোর্স
              </Link>
              <p className="mt-3 px-1 text-[0.65rem] leading-relaxed text-muted">
                পেমেন্ট মোড: <span className="font-semibold text-orange-deep">ডেমো</span> — সব
                লেনদেন ম্যানুয়ালি যাচাই করুন।
              </p>
            </div>
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>

      <footer className="border-t border-line-soft py-5">
        <div className="container-cn flex flex-wrap items-center justify-between gap-2 text-[0.7rem] text-muted">
          <span>CrackNcode Academy · অ্যাডমিন কনসোল</span>
          <Link href="/dashboard" className="hover:text-ink">
            স্টুডেন্ট ড্যাশবোর্ড →
          </Link>
        </div>
      </footer>
    </div>
  );
}
