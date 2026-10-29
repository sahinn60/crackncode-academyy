"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { pick, type Locale } from "@/lib/i18n";
import { setLocaleAction } from "@/lib/i18n-actions";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function change(next: Locale) {
    if (next === locale || pending) return;
    startTransition(async () => {
      await setLocaleAction(next);
      router.refresh();
    });
  }

  return (
    <div
      role="group"
      aria-label={pick(locale, "ভাষা বদলান", "Change language")}
      className="flex h-9 items-center rounded-full border border-line-soft bg-surface p-0.5 text-[0.68rem] font-bold"
    >
      <button
        type="button"
        onClick={() => change("bn")}
        aria-pressed={locale === "bn"}
        className={`h-full rounded-full px-2.5 transition-colors ${
          locale === "bn" ? "bg-navy text-cream" : "text-muted hover:text-ink"
        }`}
      >
        বাংলা
      </button>
      <button
        type="button"
        onClick={() => change("en")}
        aria-pressed={locale === "en"}
        className={`h-full rounded-full px-2.5 transition-colors ${
          locale === "en" ? "bg-navy text-cream" : "text-muted hover:text-ink"
        }`}
      >
        EN
      </button>
    </div>
  );
}
