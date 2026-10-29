import { localeTag, pick, type Locale } from "./i18n";

export function formatNumber(value: number, locale: Locale = "bn"): string {
  return new Intl.NumberFormat(localeTag(locale)).format(value);
}

export function formatTaka(amount: number, locale: Locale = "bn"): string {
  const formatted = new Intl.NumberFormat(localeTag(locale), {
    maximumFractionDigits: 0,
  }).format(amount);
  return `৳${formatted}`;
}

export function formatDate(iso: string, locale: Locale = "bn"): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateShort(iso: string, locale: Locale = "bn"): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

export function discountPercent(price: number, original: number): number {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

export function paymentMethodLabel(method: string, locale: Locale = "bn"): string {
  if (method === "bkash") return "bKash";
  if (method === "nagad") return "Nagad";
  if (method === "card") return pick(locale, "কার্ড", "Card");
  return method;
}

export function orderStatusLabel(status: string, locale: Locale = "bn"): string {
  if (status === "paid") return pick(locale, "পেমেন্ট সম্পন্ন", "Paid");
  if (status === "pending") return pick(locale, "অপেক্ষমাণ", "Pending");
  if (status === "cancelled") return pick(locale, "বাতিল", "Cancelled");
  return status;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0980-\u09FF]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
