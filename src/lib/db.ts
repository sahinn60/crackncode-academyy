import fs from "node:fs";
import path from "node:path";
import { createClient, type InValue } from "@libsql/client";
import { hashPassword } from "./password";
import {
  coursesSeed,
  bundlesSeed,
  workshopsSeed,
  ebooksSeed,
  postsSeed,
} from "./seed-data";

const localPath =
  process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "crackncode.db");
const remoteUrl = process.env.TURSO_DATABASE_URL || "";
const url = remoteUrl || `file:${localPath.replace(/\\/g, "/")}`;

const client = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  phone TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  level TEXT NOT NULL DEFAULT 'বিগিনার',
  hours REAL NOT NULL DEFAULT 10,
  lesson_count INTEGER NOT NULL DEFAULT 0,
  price INTEGER NOT NULL DEFAULT 0,
  original_price INTEGER NOT NULL DEFAULT 0,
  gradient TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '</>',
  image TEXT NOT NULL DEFAULT '',
  featured INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  instructor_name TEXT NOT NULL DEFAULT '',
  instructor_title TEXT NOT NULL DEFAULT '',
  instructor_bio TEXT NOT NULL DEFAULT '',
  outcomes TEXT NOT NULL DEFAULT '[]',
  curriculum TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  order_id INTEGER,
  enrolled_at TEXT NOT NULL,
  UNIQUE(user_id, course_id)
);
CREATE TABLE IF NOT EXISTS lesson_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_key TEXT NOT NULL,
  completed_at TEXT NOT NULL,
  UNIQUE(user_id, course_id, lesson_key)
);
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_type TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  amount INTEGER NOT NULL,
  method TEXT NOT NULL DEFAULT 'bkash',
  status TEXT NOT NULL DEFAULT 'pending',
  txn_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  paid_at TEXT
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS bundles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL DEFAULT 0,
  original_price INTEGER NOT NULL DEFAULT 0,
  course_ids TEXT NOT NULL DEFAULT '[]',
  gradient TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS workshops (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  starts_at TEXT NOT NULL,
  duration TEXT NOT NULL DEFAULT '',
  seats_total INTEGER NOT NULL DEFAULT 0,
  seats_left INTEGER NOT NULL DEFAULT 0,
  price INTEGER NOT NULL DEFAULT 0,
  gradient TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS ebooks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  pages INTEGER NOT NULL DEFAULT 0,
  price INTEGER NOT NULL DEFAULT 0,
  gradient TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '',
  read_minutes INTEGER NOT NULL DEFAULT 5,
  gradient TEXT NOT NULL DEFAULT '',
  published_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_course ON lesson_progress(user_id, course_id);
`;

type Args = InValue[];

async function runRaw(sql: string, args: Args = []) {
  return client.execute({ sql, args });
}

async function allRaw<T = Record<string, unknown>>(sql: string, args: Args = []) {
  const result = await client.execute({ sql, args });
  return result.rows as unknown as T[];
}

async function seed() {
  const seeded = await allRaw<{ value: string }>(
    "SELECT value FROM meta WHERE key = 'seed_version'"
  );
  if (seeded.length) return;

  const now = new Date().toISOString();
  const lock = await runRaw(
    "INSERT OR IGNORE INTO meta (key, value) VALUES ('seed_started', ?)",
    [now]
  );
  if (lock.rowsAffected === 0) {
    for (let i = 0; i < 100; i += 1) {
      const done = await allRaw("SELECT 1 FROM meta WHERE key = 'seed_version'");
      if (done.length) return;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@crackncode.academy";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";
  await runRaw(
    "INSERT OR IGNORE INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, 'admin', ?)",
    ["CrackNcode Admin", adminEmail, hashPassword(adminPassword), now]
  );

  const idBySlug = new Map<string, number>();
  for (const c of coursesSeed) {
    const lessonCount = c.curriculum.reduce((n, m) => n + m.lessons.length, 0);
    const result = await runRaw(
      `INSERT INTO courses (
        slug, title, subtitle, description, category, level, hours, lesson_count,
        price, original_price, gradient, icon, featured, published,
        instructor_name, instructor_title, instructor_bio, outcomes, curriculum, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?)`,
      [
        c.slug,
        c.title,
        c.subtitle,
        c.description,
        c.category,
        c.level,
        c.hours,
        lessonCount,
        c.price,
        c.original_price,
        c.gradient,
        c.icon,
        c.featured,
        c.instructor_name,
        c.instructor_title,
        c.instructor_bio,
        JSON.stringify(c.outcomes),
        JSON.stringify(c.curriculum),
        now,
      ]
    );
    idBySlug.set(c.slug, Number(result.lastInsertRowid ?? 0));
  }

  const allIds = [...idBySlug.values()];
  for (const b of bundlesSeed) {
    const ids =
      b.course_slugs === "ALL"
        ? allIds
        : Array.isArray(b.course_slugs)
          ? b.course_slugs.map((s) => idBySlug.get(s)).filter(Boolean)
          : [];
    await runRaw(
      "INSERT INTO bundles (slug, title, description, price, original_price, course_ids, gradient) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [b.slug, b.title, b.description, b.price, b.original_price, JSON.stringify(ids), b.gradient]
    );
  }

  for (const w of workshopsSeed) {
    await runRaw(
      "INSERT INTO workshops (slug, title, description, starts_at, duration, seats_total, seats_left, price, gradient) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        w.slug,
        w.title,
        w.description,
        w.starts_at,
        w.duration,
        w.seats_total,
        w.seats_left,
        w.price,
        w.gradient,
      ]
    );
  }

  for (const e of ebooksSeed) {
    await runRaw(
      "INSERT INTO ebooks (slug, title, description, pages, price, gradient) VALUES (?, ?, ?, ?, ?, ?)",
      [e.slug, e.title, e.description, e.pages, e.price, e.gradient]
    );
  }

  for (const p of postsSeed) {
    await runRaw(
      "INSERT INTO posts (slug, title, excerpt, content, category, author, read_minutes, gradient, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        p.slug,
        p.title,
        p.excerpt,
        p.content,
        p.category,
        p.author,
        p.read_minutes,
        p.gradient,
        p.published_at,
      ]
    );
  }

  await runRaw("INSERT INTO meta (key, value) VALUES ('seed_version', '1')");
}

const COURSE_IMAGES: Record<string, string> = {
  "full-stack-web-development": "/images/courses/web.webp",
  "python-programming": "/images/courses/python.webp",
  "ai-prompt-engineering": "/images/courses/ai.webp",
  "react-nextjs-masterclass": "/images/courses/react.webp",
  "competitive-programming-cpp": "/images/courses/algorithms.webp",
  "freelancing-fiverr-upwork": "/images/courses/freelance.webp",
  "ethical-hacking-basics": "/images/courses/cyber.webp",
  "data-analytics-power-bi": "/images/courses/data.webp",
  "flutter-app-development": "/images/courses/mobile.webp",
  "ui-ux-design-figma": "/images/courses/design.webp",
  "git-github-devops": "/images/courses/devops.webp",
  "wordpress-ecommerce": "/images/courses/wordpress.webp",
};

const WORKSHOP_IMAGES: Record<string, string> = {
  "first-website-in-2-hours": "/images/courses/web.webp",
  "chatgpt-productivity": "/images/courses/ai.webp",
  "portfolio-review-live": "/images/courses/freelance.webp",
};

async function hasColumn(table: "courses" | "workshops", column: string) {
  const cols = await allRaw<{ name: string }>(`PRAGMA table_info(${table})`);
  return cols.some((c) => c.name === column);
}

async function addColumn(table: "courses" | "workshops") {
  if (await hasColumn(table, "image")) return;
  try {
    await runRaw(`ALTER TABLE ${table} ADD COLUMN image TEXT NOT NULL DEFAULT ''`);
  } catch (error) {
    // Another instance may have added it between the check and the ALTER.
    if (!String(error).includes("duplicate column name")) throw error;
  }
}

async function applyImages() {
  await addColumn("courses");
  await addColumn("workshops");
  for (const [slug, image] of Object.entries(COURSE_IMAGES)) {
    await runRaw("UPDATE courses SET image = ? WHERE slug = ?", [image, slug]);
  }
  for (const [slug, image] of Object.entries(WORKSHOP_IMAGES)) {
    await runRaw("UPDATE workshops SET image = ? WHERE slug = ?", [image, slug]);
  }
}

async function init() {
  if (!remoteUrl) {
    fs.mkdirSync(path.dirname(localPath), { recursive: true });
    for (const pragma of ["PRAGMA journal_mode = WAL;", "PRAGMA busy_timeout = 5000;"]) {
      try {
        await client.execute(pragma);
      } catch {
        // Pragmas are best-effort; the client still works without them.
      }
    }
  }
  try {
    await client.execute("PRAGMA foreign_keys = ON;");
  } catch {
    // Remote Turso connections may reject foreign_keys pragmas.
  }
  await client.executeMultiple(SCHEMA);
  await seed();
  await applyImages();
}

let initPromise: Promise<void> | null = null;

function ready() {
  if (!initPromise) initPromise = init();
  return initPromise;
}

class Statement {
  private sql: string;

  constructor(sql: string) {
    this.sql = sql;
  }

  private async execute(args: Args) {
    await ready();
    return client.execute({ sql: this.sql, args });
  }

  async run(...args: Args) {
    const result = await this.execute(args);
    return {
      lastInsertRowid: Number(result.lastInsertRowid ?? 0),
      changes: result.rowsAffected,
    };
  }

  async get<T = Record<string, unknown>>(...args: Args) {
    const result = await this.execute(args);
    return result.rows[0] as unknown as T | undefined;
  }

  async all<T = Record<string, unknown>>(...args: Args) {
    const result = await this.execute(args);
    return result.rows as unknown as T[];
  }
}

export const db = {
  prepare(sql: string) {
    return new Statement(sql);
  },
  async exec(sql: string) {
    await ready();
    return client.executeMultiple(sql);
  },
};
