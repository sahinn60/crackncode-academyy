"use client";

import { useActionState } from "react";
import {
  contactAction,
  updateProfileAction,
  changePasswordAction,
  type FormState,
} from "@/lib/actions";

export function ContactForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(contactAction, null);

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="label">আপনার নাম</label>
          <input id="c-name" name="name" required className="input" placeholder="পুরো নাম" />
        </div>
        <div>
          <label htmlFor="c-email" className="label">ইমেইল</label>
          <input id="c-email" name="email" type="email" required className="input" placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <label htmlFor="c-subject" className="label">বিষয়</label>
        <input id="c-subject" name="subject" className="input" placeholder="যেমন: কোর্স সম্পর্কে প্রশ্ন" />
      </div>
      <div>
        <label htmlFor="c-body" className="label">বার্তা</label>
        <textarea id="c-body" name="body" required rows={6} className="input resize-y" placeholder="বিস্তারিত লিখুন..." />
      </div>

      {state?.error && (
        <p className="rounded-lg border border-live/30 bg-live/10 px-3 py-2 text-sm text-live">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-lg border border-green/30 bg-green/10 px-3 py-2 text-sm text-green">{state.success}</p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
        {pending ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান"}
      </button>
    </form>
  );
}

export function ProfileForm({ name, phone, email }: { name: string; phone: string; email: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateProfileAction, null);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="p-email">ইমেইল</label>
        <input id="p-email" value={email} disabled className="input opacity-60" />
      </div>
      <div>
        <label className="label" htmlFor="p-name">নাম</label>
        <input id="p-name" name="name" defaultValue={name} required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="p-phone">মোবাইল নম্বর</label>
        <input id="p-phone" name="phone" defaultValue={phone} className="input" placeholder="01XXXXXXXXX" />
      </div>

      {state?.error && <p className="text-sm text-live">{state.error}</p>}
      {state?.success && <p className="text-sm text-green">{state.success}</p>}

      <button type="submit" disabled={pending} className="btn btn-outline btn-sm disabled:opacity-60">
        {pending ? "সেভ হচ্ছে..." : "প্রোফাইল সেভ করুন"}
      </button>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(changePasswordAction, null);

  return (
    <form action={action} className="space-y-3">
      <div>
        <label className="label" htmlFor="pw-current">বর্তমান পাসওয়ার্ড</label>
        <input
          id="pw-current"
          name="current"
          type="password"
          required
          autoComplete="current-password"
          className="input"
        />
      </div>
      <div>
        <label className="label" htmlFor="pw-new">নতুন পাসওয়ার্ড</label>
        <input
          id="pw-new"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="input"
          placeholder="কমপক্ষে ৮ অক্ষর"
        />
      </div>
      <div>
        <label className="label" htmlFor="pw-confirm">নতুন পাসওয়ার্ড (আবার)</label>
        <input
          id="pw-confirm"
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="input"
        />
      </div>

      {state?.error && <p className="text-sm text-live">{state.error}</p>}
      {state?.success && <p className="text-sm text-green">{state.success}</p>}

      <button type="submit" disabled={pending} className="btn btn-outline btn-sm disabled:opacity-60">
        {pending ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
      </button>
    </form>
  );
}
