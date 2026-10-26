export type Role = "student" | "admin";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
  created_at: string;
};

export type Lesson = {
  title: string;
  minutes: number;
  summary?: string;
};

export type Module = {
  title: string;
  lessons: Lesson[];
};

export type Course = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  hours: number;
  lesson_count: number;
  price: number;
  original_price: number;
  gradient: string;
  icon: string;
  image: string;
  featured: number;
  published: number;
  instructor_name: string;
  instructor_title: string;
  instructor_bio: string;
  outcomes: string;
  curriculum: string;
  created_at: string;
};

export type CourseParsed = Omit<Course, "outcomes" | "curriculum"> & {
  outcomes: string[];
  curriculum: Module[];
};

export type Bundle = {
  id: number;
  slug: string;
  title: string;
  description: string;
  price: number;
  original_price: number;
  course_ids: string;
  gradient: string;
};

export type Workshop = {
  id: number;
  slug: string;
  title: string;
  description: string;
  starts_at: string;
  duration: string;
  seats_total: number;
  seats_left: number;
  price: number;
  gradient: string;
  image: string;
};

export type Ebook = {
  id: number;
  slug: string;
  title: string;
  description: string;
  pages: number;
  price: number;
  gradient: string;
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  read_minutes: number;
  gradient: string;
  published_at: string;
};

export type Order = {
  id: number;
  user_id: number;
  product_type: "course" | "bundle" | "ebook" | "workshop";
  product_id: number;
  title: string;
  amount: number;
  method: string;
  status: "pending" | "paid" | "cancelled";
  txn_id: string;
  created_at: string;
  paid_at: string | null;
};
