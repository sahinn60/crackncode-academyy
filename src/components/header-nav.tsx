"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { logoutAction } from "@/lib/actions";

type HeaderUser = { name: string; email: string; role: "student" | "admin" } | null;

const navItems = [
  { href: "/courses", label: "কোর্স" },
  { href: "/bundles", label: "বান্ডেল" },
  { href: "/workshops", label: "ওয়ার্কশপ" },
  { href: "/ebooks", label: "ই-বুক" },
  { href: "/blog", label: "ব্লগ" },
  { href: "/about", label: "আমাদের সম্পর্কে" },
];

export function HeaderNav({ user }: { user: HeaderUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    setOpen(false);
    setMenu(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <nav className="hidden items-center gap-6 lg:flex" aria-label="প্রধান মেনু">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link ${isActive(item.href) ? "active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <Link
          href="/courses"
          aria-label="কোর্স খুঁজুন"
          className="hidden h-9 w-9 place-items-center rounded-full border border-line-soft bg-surface text-ink transition-colors hover:bg-surface-2 sm:grid"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Link>
        <ThemeToggle />

        {user ? (
          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setMenu((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-line-soft bg-surface py-1 pl-1 pr-3 transition-colors hover:bg-surface-2"
              aria-expanded={menu}
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-navy font-mono text-xs font-bold text-cream">
                {user.name.trim().charAt(0).toUpperCase()}
              </span>
              <span className="max-w-[7rem] truncate text-xs font-semibold">
                {user.name.split(" ")[0]}
              </span>
            </button>
            {menu && (
              <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-line-soft bg-surface p-1.5 shadow-xl">
                <p className="truncate px-3 py-2 text-[0.7rem] text-muted">{user.email}</p>
                <Link
                  href="/dashboard"
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-2"
                >
                  আমার ড্যাশবোর্ড
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-2"
                  >
                    অ্যাডমিন প্যানেল
                  </Link>
                )}
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-live hover:bg-surface-2"
                  >
                    লগআউট
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden items-center gap-2 lg:flex">
            <Link href="/login" className="btn btn-ghost btn-sm">
              লগইন
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm">
              ফ্রি অ্যাকাউন্ট
            </Link>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-full border border-line-soft bg-surface lg:hidden"
          aria-label="মেনু খুলুন"
          aria-expanded={open}
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full z-40 border-b border-line bg-page p-5 shadow-xl lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="মোবাইল মেনু">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive(item.href) ? "bg-surface-2 text-ink" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-line-soft pt-4">
            {user ? (
              <>
                <Link href="/dashboard" className="btn btn-outline w-full">
                  আমার ড্যাশবোর্ড
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="btn btn-outline w-full">
                    অ্যাডমিন প্যানেল
                  </Link>
                )}
                <form action={logoutAction}>
                  <button type="submit" className="btn btn-ghost w-full text-live">
                    লগআউট
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-outline w-full">
                  লগইন
                </Link>
                <Link href="/register" className="btn btn-primary w-full">
                  ফ্রি অ্যাকাউন্ট খুলুন
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
