import Link from "next/link";
import { formatTaka, discountPercent } from "@/lib/utils";

type Props = {
  gradient: string;
  icon: string;
  className?: string;
  label?: string;
};

export function Cover({ gradient, icon, className = "", label }: Props) {
  return (
    <div
      className={`cover-art flex items-center justify-center ${className}`}
      style={{ background: gradient }}
    >
      <span className="cover-icon text-[clamp(1.6rem,7vw,2.8rem)] text-cream/95">{icon}</span>
      <span className="absolute left-3 top-3 font-mono text-[0.55rem] uppercase tracking-[0.22em] text-cream/60">
        crackncode
      </span>
      {label && (
        <span className="absolute bottom-3 right-3 rounded-full border border-cream/30 bg-navy/35 px-2.5 py-1 text-[0.65rem] font-semibold text-cream backdrop-blur">
          {label}
        </span>
      )}
      <span className="pointer-events-none absolute -left-6 top-1/2 -translate-y-1/2 select-none font-mono text-[5rem] font-bold text-cream/5">
        {"{ }"}
      </span>
    </div>
  );
}

export function Price({
  price,
  original,
  size = "md",
}: {
  price: number;
  original: number;
  size?: "sm" | "md" | "lg";
}) {
  const off = discountPercent(price, original);
  const priceClass =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl";
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={`font-display font-bold ${priceClass}`}>{formatTaka(price)}</span>
      {original > price && (
        <>
          <span className="text-sm text-muted line-through">{formatTaka(original)}</span>
          <span className="rounded-md bg-green/10 px-1.5 py-0.5 text-[0.68rem] font-bold text-green">
            {off}% ছাড়
          </span>
        </>
      )}
    </div>
  );
}

export function CourseCard({
  slug,
  title,
  subtitle,
  category,
  level,
  hours,
  lessonCount,
  price,
  originalPrice,
  gradient,
  icon,
  image,
}: {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  level: string;
  hours: number;
  lessonCount: number;
  price: number;
  originalPrice: number;
  gradient: string;
  icon: string;
  image?: string;
}) {
  const off = discountPercent(price, originalPrice);
  return (
    <Link
      href={`/courses/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-line-soft bg-surface transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(11,21,48,0.45)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <Cover gradient={gradient} icon={icon} className="h-full w-full" />
        )}
        <span className="absolute left-2.5 top-2.5 rounded-sm bg-navy/90 px-2 py-0.5 text-[0.62rem] font-bold text-cream backdrop-blur">
          {category}
        </span>
        {off > 0 && (
          <span className="absolute right-2.5 top-2.5 rounded-sm bg-orange px-2 py-0.5 text-[0.62rem] font-extrabold text-navy shadow-sm">
            {off}% ছাড়
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-orange-deep">
          {level}
        </span>
        <h3 className="font-display mt-1 text-[1.06rem] font-bold leading-snug group-hover:text-orange-deep">
          {title}
        </h3>
        <p className="mt-1 line-clamp-2 text-[0.82rem] leading-relaxed text-muted">{subtitle}</p>
        <div className="mt-3 flex items-center gap-3 text-[0.7rem] text-muted">
          <span>{hours} ঘণ্টা</span>
          <span className="h-1 w-1 rounded-full bg-line" />
          <span>{lessonCount} লেসন</span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-line-soft pt-3">
          <Price price={price} original={originalPrice} size="sm" />
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-sm transition-colors group-hover:border-orange group-hover:bg-orange group-hover:text-navy">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <span className="eyebrow mb-3">{eyebrow}</span>}
        <h2 className="section-title text-3xl md:text-[2.5rem]">{title}</h2>
        {description && <p className="mt-3 text-muted">{description}</p>}
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="btn btn-outline btn-sm self-start md:self-auto"
        >
          {linkLabel}
          <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}
