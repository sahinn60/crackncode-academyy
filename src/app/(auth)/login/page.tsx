import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { pick } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: pick(locale, "লগইন", "Log in") };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const [user, { next }, locale] = await Promise.all([
    getCurrentUser(),
    searchParams,
    getLocale(),
  ]);
  if (user) redirect(next?.startsWith("/") ? next : "/dashboard");

  return (
    <>
      <span className="eyebrow mb-4">{pick(locale, "আবার স্বাগতম", "Welcome back")}</span>
      <h2 className="section-title text-3xl">{pick(locale, "লগইন করুন", "Log in")}</h2>
      <p className="mt-2 mb-7 text-sm text-muted">
        {pick(
          locale,
          "আপনার কোর্স, প্রোগ্রেস আর সার্টিফিকেট — সব এক জায়গায়।",
          "Your courses, progress and certificates — all in one place."
        )}
      </p>
      <AuthForm mode="login" next={next} locale={locale} />
    </>
  );
}
