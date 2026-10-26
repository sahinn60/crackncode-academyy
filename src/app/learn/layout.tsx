import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { getCurrentUser } from "@/lib/auth";

export default async function LearnLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <header className="sticky top-0 z-40 border-b border-line bg-page/95 backdrop-blur">
        <div className="container-cn flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo compact />
            <span className="hidden h-5 w-px bg-line-soft sm:block" />
            <Link
              href="/dashboard"
              className="hidden text-xs font-semibold text-muted hover:text-ink sm:block"
            >
              ← ড্যাশবোর্ড
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-line-soft bg-surface px-3 py-1 text-[0.65rem] font-semibold text-muted md:block">
              ফোকাস মোড
            </span>
            <ThemeToggle />
            {user && (
              <span className="grid h-8 w-8 place-items-center rounded-full bg-navy font-mono text-[0.68rem] font-bold text-cream">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
