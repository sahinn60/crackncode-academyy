import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "ফ্রি অ্যাকাউন্ট" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getCurrentUser();
  const { next } = await searchParams;
  if (user) redirect(next?.startsWith("/") ? next : "/dashboard");

  return (
    <>
      <span className="eyebrow mb-4">শুরু হোক আজই</span>
      <h2 className="section-title text-3xl">ফ্রি অ্যাকাউন্ট খুলুন</h2>
      <p className="mt-2 mb-7 text-sm text-muted">
        রেজিস্ট্রেশন ফ্রি। কোর্স কিনতে চাইলে পরে এক ক্লিকেই এনরোল করতে পারবেন।
      </p>
      <AuthForm mode="register" next={next} />
    </>
  );
}
