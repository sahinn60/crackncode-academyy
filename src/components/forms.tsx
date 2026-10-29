"use client";

import { useActionState } from "react";
import {
  contactAction,
  updateProfileAction,
  changePasswordAction,
  type FormState,
} from "@/lib/actions";
import { pick, type Locale } from "@/lib/i18n";

export function ContactForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState<FormState, FormData>(contactAction, null);

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="label">
            {pick(locale, "আপনার নাম", "Your name")}
          </label>
          <input
            id="c-name"
            name="name"
            required
            className="input"
            placeholder={pick(locale, "পুরো নাম", "Full name")}
          />
        </div>
        <div>
          <label htmlFor="c-email" className="label">
            {pick(locale, "ইমেইল", "Email")}
          </label>
          <input
            id="c-email"
            name="email"
            type="email"
            required
            className="input"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="c-subject" className="label">
          {pick(locale, "বিষয়", "Subject")}
        </label>
        <input
          id="c-subject"
          name="subject"
          className="input"
          placeholder={pick(locale, "যেমন: কোর্স সম্পর্কে প্রশ্ন", "e.g. A question about a course")}
        />
      </div>
      <div>
        <label htmlFor="c-body" className="label">
          {pick(locale, "বার্তা", "Message")}
        </label>
        <textarea
          id="c-body"
          name="body"
          required
          rows={6}
          className="input resize-y"
          placeholder={pick(locale, "বিস্তারিত লিখুন...", "Write the details...")}
        />
      </div>

      {state?.error && (
        <p className="rounded-lg border border-live/30 bg-live/10 px-3 py-2 text-sm text-live">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-lg border border-green/30 bg-green/10 px-3 py-2 text-sm text-green">{state.success}</p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
        {pending
          ? pick(locale, "পাঠানো হচ্ছে...", "Sending...")
          : pick(locale, "বার্তা পাঠান", "Send message")}
      </button>
    </form>
  );
}

export function ProfileForm({
  name,
  phone,
  email,
  locale,
}: {
  name: string;
  phone: string;
  email: string;
  locale: Locale;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateProfileAction, null);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="p-email">
          {pick(locale, "ইমেইল", "Email")}
        </label>
        <input id="p-email" value={email} disabled className="input opacity-60" />
      </div>
      <div>
        <label className="label" htmlFor="p-name">
          {pick(locale, "নাম", "Name")}
        </label>
        <input id="p-name" name="name" defaultValue={name} required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="p-phone">
          {pick(locale, "মোবাইল নম্বর", "Mobile number")}
        </label>
        <input
          id="p-phone"
          name="phone"
          defaultValue={phone}
          className="input"
          placeholder="01XXXXXXXXX"
        />
      </div>

      {state?.error && <p className="text-sm text-live">{state.error}</p>}
      {state?.success && <p className="text-sm text-green">{state.success}</p>}

      <button type="submit" disabled={pending} className="btn btn-outline btn-sm disabled:opacity-60">
        {pending
          ? pick(locale, "সেভ হচ্ছে...", "Saving...")
          : pick(locale, "প্রোফাইল সেভ করুন", "Save profile")}
      </button>
    </form>
  );
}

export function PasswordForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState<FormState, FormData>(changePasswordAction, null);

  return (
    <form action={action} className="space-y-3">
      <div>
        <label className="label" htmlFor="pw-current">
          {pick(locale, "বর্তমান পাসওয়ার্ড", "Current password")}
        </label>
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
        <label className="label" htmlFor="pw-new">
          {pick(locale, "নতুন পাসওয়ার্ড", "New password")}
        </label>
        <input
          id="pw-new"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="input"
          placeholder={pick(locale, "কমপক্ষে ৮ অক্ষর", "At least 8 characters")}
        />
      </div>
      <div>
        <label className="label" htmlFor="pw-confirm">
          {pick(locale, "নতুন পাসওয়ার্ড (আবার)", "New password (again)")}
        </label>
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
        {pending
          ? pick(locale, "পরিবর্তন হচ্ছে...", "Updating...")
          : pick(locale, "পাসওয়ার্ড পরিবর্তন করুন", "Change password")}
      </button>
    </form>
  );
}
