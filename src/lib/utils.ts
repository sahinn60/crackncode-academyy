export function formatTaka(amount: number): string {
  const formatted = new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `৳${formatted}`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateShort(iso: string): string {
  return new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

export function discountPercent(price: number, original: number): number {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

export function bengaliNumber(n: number): string {
  return new Intl.NumberFormat("bn-BD").format(n);
}

export function paymentMethodLabel(method: string): string {
  if (method === "bkash") return "bKash";
  if (method === "nagad") return "Nagad";
  if (method === "card") return "কার্ড";
  return method;
}

export function orderStatusLabel(status: string): string {
  if (status === "paid") return "পেমেন্ট সম্পন্ন";
  if (status === "pending") return "অপেক্ষমাণ";
  if (status === "cancelled") return "বাতিল";
  return status;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0980-\u09FF]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
