import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";
import { getLocale } from "@/lib/i18n-server";
import { pick } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: pick(locale, "ফ্রি অ্যাকাউন্ট", "Free account") };
}

export default async function RegisterPage({
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
      <span className="eyebrow mb-4">{pick(locale, "শুরু হোক আজই", "Start today")}</span>
      <h2 className="section-title text-3xl">
        {pick(locale, "ফ্রি অ্যাকাউন্ট খুলুন", "Create a free account")}
      </h2>
      <p className="mt-2 mb-7 text-sm text-muted">
        {pick(
          locale,
          "রেজিস্ট্রেশন ফ্রি। কোর্স কিনতে চাইলে পরে এক ক্লিকেই এনরোল করতে পারবেন।",
          "Registration is free. When you are ready to buy a course, you can enroll in one click."
        )}
      </p>
      <AuthForm mode="register" next={next} locale={locale} />
    </>
  );
}
