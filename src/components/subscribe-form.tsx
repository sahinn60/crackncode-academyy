"use client";

import { useActionState } from "react";
import { subscribeAction, type FormState } from "@/lib/actions";
import { pick, type Locale } from "@/lib/i18n";

export function SubscribeForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    subscribeAction,
    null
  );

  if (state?.success) {
    return (
      <p className="rounded-lg border border-green-light/40 bg-green/20 px-3 py-2 text-xs text-green-light">
        {state.success}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-2">
      <div className="flex overflow-hidden rounded-full border border-cream/25 bg-cream/10 p-1">
        <input
          type="email"
          name="email"
          required
          placeholder={pick(locale, "আপনার ইমেইল", "Your email")}
          className="w-full bg-transparent px-3 py-1.5 text-sm text-cream placeholder:text-cream/50 focus:outline-none"
          aria-label={pick(locale, "ইমেইল ঠিকানা", "Email address")}
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-full bg-orange px-4 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "..." : pick(locale, "সাবস্ক্রাইব", "Subscribe")}
        </button>
      </div>
      {state?.error && <p className="text-[0.7rem] text-live">{state.error}</p>}
    </form>
  );
}
