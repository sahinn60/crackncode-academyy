import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "লগইন" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getCurrentUser();
  const { next } = await searchParams;
  if (user) redirect(next?.startsWith("/") ? next : "/dashboard");

  return (
    <>
      <span className="eyebrow mb-4">আবার স্বাগতম</span>
      <h2 className="section-title text-3xl">লগইন করুন</h2>
      <p className="mt-2 mb-7 text-sm text-muted">
        আপনার কোর্স, প্রোগ্রেস আর সার্টিফিকেট — সব এক জায়গায়।
      </p>
      <AuthForm mode="login" next={next} />
    </>
  );
}
