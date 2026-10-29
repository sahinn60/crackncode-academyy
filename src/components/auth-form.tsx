"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, registerAction, type FormState } from "@/lib/actions";
import { pick, type Locale } from "@/lib/i18n";

export function AuthForm({
  mode,
  next,
  locale,
}: {
  mode: "login" | "register";
  next?: string;
  locale: Locale;
}) {
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next || ""} />

      {mode === "register" && (
        <div>
          <label htmlFor="name" className="label">
            {pick(locale, "পুরো নাম", "Full name")}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder={pick(locale, "যেমন: রাফি হাসান", "e.g. Rafi Hasan")}
            className="input"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="label">
          {pick(locale, "ইমেইল", "Email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="input"
        />
      </div>

      <div>
        <label htmlFor="password" className="label">
          {pick(locale, "পাসওয়ার্ড", "Password")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={mode === "register" ? 8 : 1}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder={
            mode === "register"
              ? pick(locale, "কমপক্ষে ৮ অক্ষর", "At least 8 characters")
              : pick(locale, "আপনার পাসওয়ার্ড", "Your password")
          }
          className="input"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg border border-live/30 bg-live/10 px-3 py-2 text-sm text-live">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
        {pending
          ? pick(locale, "একটু অপেক্ষা করুন...", "Please wait...")
          : mode === "login"
            ? pick(locale, "লগইন করুন", "Log in")
            : pick(locale, "অ্যাকাউন্ট খুলুন", "Create account")}
      </button>

      <p className="text-center text-sm text-muted">
        {mode === "login" ? (
          <>
            {pick(locale, "নতুন এখানে?", "New here?")}{" "}
            <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-orange-deep hover:underline">
              {pick(locale, "ফ্রি অ্যাকাউন্ট খুলুন", "Create a free account")}
            </Link>
          </>
        ) : (
          <>
            {pick(locale, "আগে থেকেই অ্যাকাউন্ট আছে?", "Already have an account?")}{" "}
            <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-orange-deep hover:underline">
              {pick(locale, "লগইন করুন", "Log in")}
            </Link>
          </>
        )}
      </p>

      {mode === "register" && (
        <p className="text-center text-[0.7rem] leading-relaxed text-muted">
          {pick(locale, "অ্যাকাউন্ট খুললে আপনি আমাদের", "By creating an account you agree to our")}{" "}
          <Link href="/terms" className="underline">
            {pick(locale, "ব্যবহারের শর্ত", "Terms of Use")}
          </Link>{" "}
          {pick(locale, "ও", "and")}{" "}
          <Link href="/privacy" className="underline">
            {pick(locale, "প্রাইভেসি পলিসি", "Privacy Policy")}
          </Link>
          {pick(locale, " মেনে নিচ্ছেন।", ".")}
        </p>
      )}
    </form>
  );
}
