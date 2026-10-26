import type { Metadata } from "next";
import Link from "next/link";
import { Cover } from "@/components/ui";
import { listPosts } from "@/lib/data";
import { postImage } from "@/lib/post-images";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "ব্লগ",
  description: "প্রোগ্রামিং, ক্যারিয়ার, AI ও ফ্রিল্যান্সিং নিয়ে বাংলায় ব্যবহারিক লেখা।",
};

export default async function BlogPage() {
  const posts = await listPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <section className="border-b border-line bg-surface-2/50">
        <div className="container-cn py-12 lg:py-16">
          <nav className="flex items-center gap-2 text-xs text-muted" aria-label="ব্রেডক্রাম্ব">
            <Link href="/" className="hover:text-ink">হোম</Link>
            <span>/</span>
            <span className="text-ink">ব্লগ</span>
          </nav>
          <span className="eyebrow mt-6">CrackNcode ব্লগ</span>
          <h1 className="section-title mt-3 max-w-3xl text-3xl md:text-5xl">
            শেখার পথে কাজে লাগবে এমন কথা
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            টেক ক্যারিয়ার, স্কিল আর ফ্রিল্যান্সিং নিয়ে সোজাসাপ্টা গাইড — বাড়তি কথার
            ঝামেলা ছাড়া।
          </p>
        </div>
      </section>

      <section className="container-cn py-12 lg:py-16">
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid overflow-hidden rounded-3xl border border-line-soft bg-surface lg:grid-cols-2"
          >
            {postImage(featured.slug) ? (
              <img
                src={postImage(featured.slug)}
                alt={featured.title}
                className="h-56 w-full object-cover lg:h-full lg:min-h-[24rem]"
              />
            ) : (
              <Cover gradient={featured.gradient} icon="✎" className="h-56 w-full lg:h-full" />
            )}
            <div className="flex flex-col justify-center p-6 lg:p-10">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="pill pill-orange">{featured.category}</span>
                <span>{formatDate(featured.published_at)}</span>
                <span>•</span>
                <span>{featured.read_minutes} মিনিট</span>
              </div>
              <h2 className="font-display mt-4 text-2xl font-bold leading-snug md:text-3xl group-hover:text-orange-deep">
                {featured.title}
              </h2>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted md:text-base">
                {featured.excerpt}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-deep">
                পুরো লেখা পড়ুন <span aria-hidden>→</span>
              </span>
            </div>
          </Link>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line-soft bg-surface transition-transform hover:-translate-y-1"
            >
              {postImage(post.slug) ? (
                <img
                  src={postImage(post.slug)}
                  alt={post.title}
                  loading="lazy"
                  className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              ) : (
                <Cover gradient={post.gradient} icon="✎" className="h-32 w-full" />
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-2 text-[0.7rem] text-muted">
                  <span className="font-semibold text-orange-deep">{post.category}</span>
                  <span>•</span>
                  <span>{post.read_minutes} মিনিট</span>
                </div>
                <h3 className="font-display mt-2 text-lg font-bold leading-snug group-hover:text-orange-deep">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{post.excerpt}</p>
                <p className="mt-auto pt-4 text-[0.7rem] text-muted">{formatDate(post.published_at)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
