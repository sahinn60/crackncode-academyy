"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, registerAction, type FormState } from "@/lib/actions";

export function AuthForm({ mode, next }: { mode: "login" | "register"; next?: string }) {
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next || ""} />

      {mode === "register" && (
        <div>
          <label htmlFor="name" className="label">
            পুরো নাম
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="যেমন: রাফি হাসান"
            className="input"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="label">
          ইমেইল
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
          পাসওয়ার্ড
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={mode === "register" ? 8 : 1}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          placeholder={mode === "register" ? "কমপক্ষে ৮ অক্ষর" : "আপনার পাসওয়ার্ড"}
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
          ? "একটু অপেক্ষা করুন..."
          : mode === "login"
            ? "লগইন করুন"
            : "অ্যাকাউন্ট খুলুন"}
      </button>

      <p className="text-center text-sm text-muted">
        {mode === "login" ? (
          <>
            নতুন এখানে?{" "}
            <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-orange-deep hover:underline">
              ফ্রি অ্যাকাউন্ট খুলুন
            </Link>
          </>
        ) : (
          <>
            আগে থেকেই অ্যাকাউন্ট আছে?{" "}
            <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-orange-deep hover:underline">
              লগইন করুন
            </Link>
          </>
        )}
      </p>

      {mode === "register" && (
        <p className="text-center text-[0.7rem] leading-relaxed text-muted">
          অ্যাকাউন্ট খুললে আপনি আমাদের{" "}
          <Link href="/terms" className="underline">ব্যবহারের শর্ত</Link> ও{" "}
          <Link href="/privacy" className="underline">প্রাইভেসি পলিসি</Link> মেনে নিচ্ছেন।
        </p>
      )}
    </form>
  );
}
