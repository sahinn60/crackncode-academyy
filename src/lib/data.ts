import "server-only";
import { db } from "./db";
import type {
  Bundle,
  Course,
  CourseParsed,
  Ebook,
  Lesson,
  Module,
  Order,
  Post,
  User,
  Workshop,
} from "./types";

function parseCourse(row: Course): CourseParsed {
  let outcomes: string[] = [];
  let curriculum: Module[] = [];
  try {
    outcomes = JSON.parse(row.outcomes || "[]");
    curriculum = JSON.parse(row.curriculum || "[]");
  } catch {
    // keep empty defaults if seed data is malformed
  }
  return { ...row, outcomes, curriculum };
}

export type CourseFilters = {
  q?: string;
  category?: string;
  level?: string;
  sort?: string;
  featured?: boolean;
  limit?: number;
};

export function listCourses(filters: CourseFilters = {}): CourseParsed[] {
  const where: string[] = ["published = 1"];
  const params: (string | number)[] = [];
  if (filters.q) {
    where.push("(title LIKE ? OR subtitle LIKE ? OR description LIKE ? OR category LIKE ?)");
    const like = `%${filters.q}%`;
    params.push(like, like, like, like);
  }
  if (filters.category) {
    where.push("category = ?");
    params.push(filters.category);
  }
  if (filters.level) {
    where.push("level = ?");
    params.push(filters.level);
  }
  if (filters.featured) where.push("featured = 1");

  let order = "featured DESC, id ASC";
  if (filters.sort === "new") order = "id DESC";
  if (filters.sort === "price-low") order = "price ASC";
  if (filters.sort === "price-high") order = "price DESC";

  let sql = `SELECT * FROM courses WHERE ${where.join(" AND ")} ORDER BY ${order}`;
  if (filters.limit) sql += ` LIMIT ${Number(filters.limit)}`;
  const rows = db.prepare(sql).all(...params) as unknown as Course[];
  return rows.map(parseCourse);
}

export function getCourseBySlug(slug: string): CourseParsed | null {
  const row = db.prepare("SELECT * FROM courses WHERE slug = ?").get(slug) as
    | Course
    | undefined;
  return row ? parseCourse(row) : null;
}

export function getCourseById(id: number): CourseParsed | null {
  const row = db.prepare("SELECT * FROM courses WHERE id = ?").get(id) as
    | Course
    | undefined;
  return row ? parseCourse(row) : null;
}

export function listCategories(): { category: string; count: number }[] {
  return db
    .prepare(
      "SELECT category, COUNT(*) as count FROM courses WHERE published = 1 GROUP BY category ORDER BY count DESC"
    )
    .all() as unknown as { category: string; count: number }[];
}

export function listBundles(): Bundle[] {
  return db.prepare("SELECT * FROM bundles ORDER BY id ASC").all() as unknown as Bundle[];
}

export function getBundleBySlug(slug: string): Bundle | null {
  return (
    (db.prepare("SELECT * FROM bundles WHERE slug = ?").get(slug) as Bundle | undefined) ??
    null
  );
}

export function getBundleById(id: number): Bundle | null {
  return (
    (db.prepare("SELECT * FROM bundles WHERE id = ?").get(id) as Bundle | undefined) ?? null
  );
}

export function getBundleCourses(bundle: Bundle): CourseParsed[] {
  let ids: number[] = [];
  try {
    ids = JSON.parse(bundle.course_ids);
  } catch {
    ids = [];
  }
  if (!ids.length) return [];
  const placeholders = ids.map(() => "?").join(",");
  const rows = db
    .prepare(`SELECT * FROM courses WHERE id IN (${placeholders})`)
    .all(...ids) as unknown as Course[];
  return rows.map(parseCourse);
}

export function listWorkshops(): Workshop[] {
  return db
    .prepare("SELECT * FROM workshops ORDER BY starts_at ASC")
    .all() as unknown as Workshop[];
}

export function getWorkshopById(id: number): Workshop | null {
  return (
    (db.prepare("SELECT * FROM workshops WHERE id = ?").get(id) as Workshop | undefined) ??
    null
  );
}

export function listEbooks(): Ebook[] {
  return db.prepare("SELECT * FROM ebooks ORDER BY id ASC").all() as unknown as Ebook[];
}

export function getEbookById(id: number): Ebook | null {
  return (
    (db.prepare("SELECT * FROM ebooks WHERE id = ?").get(id) as Ebook | undefined) ?? null
  );
}

export function listPosts(limit?: number): Post[] {
  let sql = "SELECT * FROM posts ORDER BY published_at DESC";
  if (limit) sql += ` LIMIT ${Number(limit)}`;
  return db.prepare(sql).all() as unknown as Post[];
}

export function getPostBySlug(slug: string): Post | null {
  return (
    (db.prepare("SELECT * FROM posts WHERE slug = ?").get(slug) as Post | undefined) ?? null
  );
}

export function getEnrollment(userId: number, courseId: number) {
  return db
    .prepare("SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?")
    .get(userId, courseId) as
    | { id: number; user_id: number; course_id: number; order_id: number | null; enrolled_at: string }
    | undefined;
}

export function getCompletedLessons(userId: number, courseId: number): string[] {
  const rows = db
    .prepare("SELECT lesson_key FROM lesson_progress WHERE user_id = ? AND course_id = ?")
    .all(userId, courseId) as unknown as { lesson_key: string }[];
  return rows.map((r) => r.lesson_key);
}

export function getAllLessons(course: CourseParsed): { key: string; lesson: Lesson; moduleTitle: string }[] {
  const all: { key: string; lesson: Lesson; moduleTitle: string }[] = [];
  course.curriculum.forEach((m, mi) => {
    m.lessons.forEach((lesson, li) => {
      all.push({ key: `${mi}-${li}`, lesson, moduleTitle: m.title });
    });
  });
  return all;
}

export function progressPercent(course: CourseParsed, completed: string[]): number {
  const total = getAllLessons(course).length;
  if (!total) return 0;
  return Math.round((completed.length / total) * 100);
}

export function nextLesson(course: CourseParsed, completed: string[]) {
  const all = getAllLessons(course);
  return all.find((l) => !completed.includes(l.key)) ?? all[0] ?? null;
}

export function certificateCode(courseId: number, userId: number): string {
  return `CN-W${String(courseId).padStart(3, "0")}-S${String(userId).padStart(5, "0")}`;
}

export function verifyCertificate(code: string) {
  const match = code.trim().toUpperCase().match(/^CN-W(\d{3})-S(\d{5})$/);
  if (!match) return null;
  const courseId = Number(match[1]);
  const userId = Number(match[2]);
  const course = getCourseById(courseId);
  const user = db.prepare("SELECT id, name FROM users WHERE id = ?").get(userId) as
    | { id: number; name: string }
    | undefined;
  const enrollment = user ? getEnrollment(userId, courseId) : undefined;
  if (!course || !user || !enrollment) return null;
  const completed = getCompletedLessons(userId, courseId);
  const percent = progressPercent(course, completed);
  if (percent < 100) return null;
  const last = db
    .prepare(
      "SELECT MAX(completed_at) AS dt FROM lesson_progress WHERE user_id = ? AND course_id = ?"
    )
    .get(userId, courseId) as { dt: string | null };
  return {
    course,
    student: user,
    completedAt: last.dt ?? enrollment.enrolled_at,
    code: certificateCode(courseId, userId),
  };
}

export function listMyEnrollments(userId: number) {
  const rows = db
    .prepare(
      `SELECT e.*, c.slug, c.title, c.subtitle, c.gradient, c.icon, c.image, c.level, c.hours, c.category, c.lesson_count, c.curriculum
       FROM enrollments e JOIN courses c ON c.id = e.course_id
       WHERE e.user_id = ? ORDER BY e.enrolled_at DESC`
    )
    .all(userId) as unknown as (Course & { enrolled_at: string })[];
  return rows.map((row) => {
    const course = parseCourse(row);
    const completed = getCompletedLessons(userId, course.id);
    return { course, enrolledAt: row.enrolled_at, completed, percent: progressPercent(course, completed) };
  });
}

export function listMyOrders(userId: number): Order[] {
  return db
    .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC")
    .all(userId) as unknown as Order[];
}

export function listMyPurchases(userId: number, type: "ebook" | "workshop") {
  return db
    .prepare(
      "SELECT * FROM orders WHERE user_id = ? AND product_type = ? AND status = 'paid' ORDER BY id DESC"
    )
    .all(userId, type) as unknown as Order[];
}

export function getOrderById(id: number): Order | null {
  return (
    (db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as Order | undefined) ?? null
  );
}

export function adminStats() {
  const revenue = db
    .prepare("SELECT COALESCE(SUM(amount),0) AS total FROM orders WHERE status = 'paid'")
    .get() as { total: number };
  const students = db
    .prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'student'")
    .get() as { n: number };
  const enrollments = db
    .prepare("SELECT COUNT(*) AS n FROM enrollments")
    .get() as { n: number };
  const pending = db
    .prepare("SELECT COUNT(*) AS n FROM orders WHERE status = 'pending'")
    .get() as { n: number };
  const messages = db.prepare("SELECT COUNT(*) AS n FROM messages").get() as { n: number };
  return {
    revenue: revenue.total,
    students: students.n,
    enrollments: enrollments.n,
    pending: pending.n,
    messages: messages.n,
  };
}

export function adminRecentOrders(limit = 8) {
  return db
    .prepare(
      `SELECT o.*, u.name AS student_name, u.email AS student_email
       FROM orders o JOIN users u ON u.id = o.user_id
       ORDER BY o.id DESC LIMIT ?`
    )
    .all(limit) as unknown as (Order & { student_name: string; student_email: string })[];
}

export function adminCourses() {
  return db
    .prepare(
      `SELECT c.*, (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS enrolled
       FROM courses c ORDER BY c.id DESC`
    )
    .all() as unknown as (Course & { enrolled: number })[];
}

export function adminOrders(status?: string) {
  const where = status && status !== "all" ? "WHERE o.status = ?" : "";
  const params = status && status !== "all" ? [status] : [];
  return db
    .prepare(
      `SELECT o.*, u.name AS student_name, u.email AS student_email
       FROM orders o JOIN users u ON u.id = o.user_id ${where}
       ORDER BY o.id DESC`
    )
    .all(...params) as unknown as (Order & { student_name: string; student_email: string })[];
}

export function adminStudents() {
  return db
    .prepare(
      `SELECT u.id, u.name, u.email, u.phone, u.created_at,
        (SELECT COUNT(*) FROM enrollments e WHERE e.user_id = u.id) AS enrollment_count,
        (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id AND o.status = 'paid') AS paid_orders
       FROM users u WHERE u.role = 'student' ORDER BY u.id DESC`
    )
    .all() as unknown as (User & { enrollment_count: number; paid_orders: number })[];
}

export function adminMessages() {
  return db
    .prepare("SELECT * FROM messages ORDER BY id DESC")
    .all() as unknown as { id: number; name: string; email: string; subject: string; body: string; created_at: string }[];
}
