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

export async function listCourses(filters: CourseFilters = {}): Promise<CourseParsed[]> {
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
  const rows = await db.prepare(sql).all<Course>(...params);
  return rows.map(parseCourse);
}

export async function getCourseBySlug(slug: string): Promise<CourseParsed | null> {
  const row = await db
    .prepare("SELECT * FROM courses WHERE slug = ?")
    .get<Course>(slug);
  return row ? parseCourse(row) : null;
}

export async function getCourseById(id: number): Promise<CourseParsed | null> {
  const row = await db.prepare("SELECT * FROM courses WHERE id = ?").get<Course>(id);
  return row ? parseCourse(row) : null;
}

export async function listCategories(): Promise<{ category: string; count: number }[]> {
  return db
    .prepare(
      "SELECT category, COUNT(*) as count FROM courses WHERE published = 1 GROUP BY category ORDER BY count DESC"
    )
    .all<{ category: string; count: number }>();
}

export async function listBundles(): Promise<Bundle[]> {
  return db.prepare("SELECT * FROM bundles ORDER BY id ASC").all<Bundle>();
}

export async function getBundleBySlug(slug: string): Promise<Bundle | null> {
  return (await db.prepare("SELECT * FROM bundles WHERE slug = ?").get<Bundle>(slug)) ?? null;
}

export async function getBundleById(id: number): Promise<Bundle | null> {
  return (await db.prepare("SELECT * FROM bundles WHERE id = ?").get<Bundle>(id)) ?? null;
}

export async function getBundleCourses(bundle: Bundle): Promise<CourseParsed[]> {
  let ids: number[] = [];
  try {
    ids = JSON.parse(bundle.course_ids);
  } catch {
    ids = [];
  }
  if (!ids.length) return [];
  const placeholders = ids.map(() => "?").join(",");
  const rows = await db
    .prepare(`SELECT * FROM courses WHERE id IN (${placeholders})`)
    .all<Course>(...ids);
  return rows.map(parseCourse);
}

export async function listWorkshops(): Promise<Workshop[]> {
  return db
    .prepare("SELECT * FROM workshops ORDER BY starts_at ASC")
    .all<Workshop>();
}

export async function getWorkshopById(id: number): Promise<Workshop | null> {
  return (await db.prepare("SELECT * FROM workshops WHERE id = ?").get<Workshop>(id)) ?? null;
}

export async function listEbooks(): Promise<Ebook[]> {
  return db.prepare("SELECT * FROM ebooks ORDER BY id ASC").all<Ebook>();
}

export async function getEbookById(id: number): Promise<Ebook | null> {
  return (await db.prepare("SELECT * FROM ebooks WHERE id = ?").get<Ebook>(id)) ?? null;
}

export async function listPosts(limit?: number): Promise<Post[]> {
  let sql = "SELECT * FROM posts ORDER BY published_at DESC";
  if (limit) sql += ` LIMIT ${Number(limit)}`;
  return db.prepare(sql).all<Post>();
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return (await db.prepare("SELECT * FROM posts WHERE slug = ?").get<Post>(slug)) ?? null;
}

export async function getEnrollment(userId: number, courseId: number) {
  return db
    .prepare("SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?")
    .get<{
      id: number;
      user_id: number;
      course_id: number;
      order_id: number | null;
      enrolled_at: string;
    }>(userId, courseId);
}

export async function getCompletedLessons(userId: number, courseId: number): Promise<string[]> {
  const rows = await db
    .prepare("SELECT lesson_key FROM lesson_progress WHERE user_id = ? AND course_id = ?")
    .all<{ lesson_key: string }>(userId, courseId);
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

export async function verifyCertificate(code: string) {
  const match = code.trim().toUpperCase().match(/^CN-W(\d{3})-S(\d{5})$/);
  if (!match) return null;
  const courseId = Number(match[1]);
  const userId = Number(match[2]);
  const course = await getCourseById(courseId);
  const user = await db
    .prepare("SELECT id, name FROM users WHERE id = ?")
    .get<{ id: number; name: string }>(userId);
  const enrollment = user ? await getEnrollment(userId, courseId) : undefined;
  if (!course || !user || !enrollment) return null;
  const completed = await getCompletedLessons(userId, courseId);
  const percent = progressPercent(course, completed);
  if (percent < 100) return null;
  const last = await db
    .prepare(
      "SELECT MAX(completed_at) AS dt FROM lesson_progress WHERE user_id = ? AND course_id = ?"
    )
    .get<{ dt: string | null }>(userId, courseId);
  return {
    course,
    student: user,
    completedAt: last?.dt ?? enrollment.enrolled_at,
    code: certificateCode(courseId, userId),
  };
}

export async function listMyEnrollments(userId: number) {
  const rows = await db
    .prepare(
      `SELECT e.*, c.slug, c.title, c.subtitle, c.gradient, c.icon, c.image, c.level, c.hours, c.category, c.lesson_count, c.curriculum
       FROM enrollments e JOIN courses c ON c.id = e.course_id
       WHERE e.user_id = ? ORDER BY e.enrolled_at DESC`
    )
    .all<Course & { enrolled_at: string }>(userId);
  return Promise.all(
    rows.map(async (row) => {
      const course = parseCourse(row);
      const completed = await getCompletedLessons(userId, course.id);
      return {
        course,
        enrolledAt: row.enrolled_at,
        completed,
        percent: progressPercent(course, completed),
      };
    })
  );
}

export async function listMyOrders(userId: number): Promise<Order[]> {
  return db
    .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC")
    .all<Order>(userId);
}

export async function listMyPurchases(userId: number, type: "ebook" | "workshop") {
  return db
    .prepare(
      "SELECT * FROM orders WHERE user_id = ? AND product_type = ? AND status = 'paid' ORDER BY id DESC"
    )
    .all<Order>(userId, type);
}

export async function getOrderById(id: number): Promise<Order | null> {
  return (await db.prepare("SELECT * FROM orders WHERE id = ?").get<Order>(id)) ?? null;
}

export async function adminStats() {
  const [revenue, students, enrollments, pending, messages] = await Promise.all([
    db
      .prepare("SELECT COALESCE(SUM(amount),0) AS total FROM orders WHERE status = 'paid'")
      .get<{ total: number }>(),
    db.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'student'").get<{ n: number }>(),
    db.prepare("SELECT COUNT(*) AS n FROM enrollments").get<{ n: number }>(),
    db
      .prepare("SELECT COUNT(*) AS n FROM orders WHERE status = 'pending'")
      .get<{ n: number }>(),
    db.prepare("SELECT COUNT(*) AS n FROM messages").get<{ n: number }>(),
  ]);
  return {
    revenue: revenue?.total ?? 0,
    students: students?.n ?? 0,
    enrollments: enrollments?.n ?? 0,
    pending: pending?.n ?? 0,
    messages: messages?.n ?? 0,
  };
}

export async function adminRecentOrders(limit = 8) {
  return db
    .prepare(
      `SELECT o.*, u.name AS student_name, u.email AS student_email
       FROM orders o JOIN users u ON u.id = o.user_id
       ORDER BY o.id DESC LIMIT ?`
    )
    .all<Order & { student_name: string; student_email: string }>(limit);
}

export async function adminCourses() {
  return db
    .prepare(
      `SELECT c.*, (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS enrolled
       FROM courses c ORDER BY c.id DESC`
    )
    .all<Course & { enrolled: number }>();
}

export async function adminOrders(status?: string) {
  const where = status && status !== "all" ? "WHERE o.status = ?" : "";
  const params = status && status !== "all" ? [status] : [];
  return db
    .prepare(
      `SELECT o.*, u.name AS student_name, u.email AS student_email
       FROM orders o JOIN users u ON u.id = o.user_id ${where}
       ORDER BY o.id DESC`
    )
    .all<Order & { student_name: string; student_email: string }>(...params);
}

export async function adminStudents() {
  return db
    .prepare(
      `SELECT u.id, u.name, u.email, u.phone, u.created_at,
        (SELECT COUNT(*) FROM enrollments e WHERE e.user_id = u.id) AS enrollment_count,
        (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id AND o.status = 'paid') AS paid_orders
       FROM users u WHERE u.role = 'student' ORDER BY u.id DESC`
    )
    .all<User & { enrollment_count: number; paid_orders: number }>();
}

export async function adminMessages() {
  return db
    .prepare("SELECT * FROM messages ORDER BY id DESC")
    .all<{
      id: number;
      name: string;
      email: string;
      subject: string;
      body: string;
      created_at: string;
    }>();
}
