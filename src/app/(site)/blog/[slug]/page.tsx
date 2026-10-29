import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Cover } from "@/components/ui";
import { getPostBySlug, listPosts } from "@/lib/data";
import { postImage } from "@/lib/post-images";
import { getLocale } from "@/lib/i18n-server";
import { categoryLabel, pick } from "@/lib/i18n";
import { formatDate, formatNumber } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const post = await getPostBySlug(slug);
  if (!post) return { title: pick(locale, "লেখা পাওয়া যায়নি", "Article not found") };
  return { title: post.title, description: post.excerpt };
}

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const locale = await getLocale();
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = (await listPosts()).filter((p) => p.id !== post.id).slice(0, 2);
  const blocks = post.content.split(/\n\n+/);

  return (
    <>
      <article>
        <header className="border-b border-line bg-surface-2/50">
          <div className="container-cn max-w-4xl py-10 lg:py-14">
            <nav
              className="flex flex-wrap items-center gap-2 text-xs text-muted"
              aria-label={pick(locale, "ব্রেডক্রাম্ব", "Breadcrumb")}
            >
              <Link href="/" className="hover:text-ink">{pick(locale, "হোম", "Home")}</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-ink">{pick(locale, "ব্লগ", "Blog")}</Link>
              <span>/</span>
              <span className="text-ink">{categoryLabel(post.category, locale)}</span>
            </nav>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="pill pill-orange">{categoryLabel(post.category, locale)}</span>
              <span>{formatDate(post.published_at, locale)}</span>
              <span>•</span>
              <span>
                {formatNumber(post.read_minutes, locale)}{" "}
                {pick(locale, "মিনিট পড়া", "min read")}
              </span>
            </div>
            <h1 className="section-title mt-4 text-3xl md:text-[2.8rem]">{post.title}</h1>
            <p className="mt-3 text-muted">{post.excerpt}</p>
            <div className="mt-5 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-navy font-display text-sm font-bold text-cream">
                {post.author.charAt(0)}
              </span>
              <div>
                <p className="text-sm font-semibold">{post.author}</p>
                <p className="text-[0.68rem] text-muted">CrackNcode Academy</p>
              </div>
            </div>
          </div>
        </header>

        <div className="container-cn max-w-4xl py-10">
          {postImage(post.slug) ? (
            <img
              src={postImage(post.slug)}
              alt={post.title}
              className="h-48 w-full rounded-2xl object-cover sm:h-64"
            />
          ) : (
            <Cover gradient={post.gradient} icon="✎" className="h-48 w-full rounded-2xl sm:h-64" />
          )}
          <div className="prose-cn mx-auto mt-10 max-w-3xl">
            {blocks.map((block, i) => {
              const lines = block.split("\n");
              if (block.startsWith("## ")) {
                return <h2 key={i}>{block.slice(3)}</h2>;
              }
              if (lines.every((line) => line.startsWith("- "))) {
                return (
                  <ul key={i}>
                    {lines.map((line, j) => (
                      <li key={j}><Inline text={line.slice(2)} /></li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="whitespace-pre-line">
                  <Inline text={block} />
                </p>
              );
            })}
          </div>

          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border-2 border-line bg-surface p-6 shadow-[5px_5px_0_var(--shadow-color)] sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <p className="font-display text-lg font-bold">
                {pick(
                  locale,
                  "পড়া শেষ? এবার হাতে-কলমে শুরু করুন",
                  "Finished reading? Now start building"
                )}
              </p>
              <p className="mt-1 text-sm text-muted">
                {pick(
                  locale,
                  "প্রজেক্ট-বেসড কোর্সে শিখুন, সার্টিফিকেট নিন।",
                  "Learn with project-based courses and earn a certificate."
                )}
              </p>
            </div>
            <Link href="/courses" className="btn btn-primary mt-4 shrink-0 sm:mt-0">
              {pick(locale, "কোর্স দেখুন", "View courses")}
            </Link>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-line bg-surface-2/40 py-12">
          <div className="container-cn">
            <h2 className="section-title text-2xl">{pick(locale, "আরও পড়ুন", "More to read")}</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group flex gap-4 rounded-2xl border border-line-soft bg-surface p-4"
                >
                  {postImage(p.slug) ? (
                    <img
                      src={postImage(p.slug)}
                      alt={p.title}
                      loading="lazy"
                      className="h-24 w-24 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <Cover gradient={p.gradient} icon="✎" className="h-24 w-24 shrink-0 rounded-xl" />
                  )}
                  <div>
                    <p className="text-[0.68rem] font-semibold text-orange-deep">
                      {categoryLabel(p.category, locale)}
                    </p>
                    <h3 className="font-display mt-1 text-base font-bold leading-snug group-hover:text-orange-deep">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-[0.7rem] text-muted">{formatDate(p.published_at, locale)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
