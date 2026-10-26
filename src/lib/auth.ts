import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { createHmac, timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import { db } from "./db";
import type { User } from "./types";

const COOKIE = "cn_session";
const MAX_AGE = 60 * 60 * 24 * 30;
const secret =
  process.env.SESSION_SECRET || "crackncode-dev-secret-change-before-launch";

function sign(value: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function verify(token: string): number | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [rawId, rawExp, sig] = parts;
  const expected = sign(`${rawId}.${rawExp}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const exp = Number(rawExp);
  if (!Number.isFinite(exp) || exp < Date.now()) return null;
  const id = Number(rawId);
  return Number.isInteger(id) ? id : null;
}

export async function setSession(userId: number) {
  const exp = Date.now() + MAX_AGE * 1000;
  const raw = `${userId}.${exp}`;
  const token = `${raw}.${sign(raw)}`;
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  const userId = verify(token);
  if (!userId) return null;
  const row = await db
    .prepare("SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?")
    .get<User>(userId);
  return row ?? null;
});

export async function requireUser(next?: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  }
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}

export function safeNext(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  return value;
}
