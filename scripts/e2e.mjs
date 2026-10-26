import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { scryptSync } from "node:crypto";

const BASE = "http://localhost:3000";
const SHOTS = path.resolve("e2e-shots");
await mkdir(SHOTS, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const db = new DatabaseSync("data/crackncode.db");

/* ---------- CDP client ---------- */
const targets = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const pageTarget = targets.find((t) => t.type === "page");
if (!pageTarget) throw new Error("No Chrome page target");
const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve);
  ws.addEventListener("error", reject);
});
let msgId = 0;
const pending = new Map();
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
  }
});
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++msgId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 1000,
  deviceScaleFactor: 1,
  mobile: false,
});
await send("Network.clearBrowserCookies");

async function evalJs(expression) {
  const res = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
    userGesture: true,
  });
  if (res.exceptionDetails) {
    throw new Error(
      "Eval error: " +
        (res.exceptionDetails.exception?.description || res.exceptionDetails.text)
    );
  }
  return res.result.value;
}

async function waitUntil(fn, { timeout = 30000, interval = 300, label = "condition" } = {}) {
  const start = Date.now();
  let lastErr;
  while (Date.now() - start < timeout) {
    try {
      if (await fn()) return;
    } catch (e) {
      lastErr = e;
    }
    await sleep(interval);
  }
  throw new Error(`Timeout waiting for ${label}${lastErr ? ` (${lastErr.message})` : ""}`);
}

const bodyText = () => evalJs("document.body ? document.body.innerText : ''");
const pathInfo = () => evalJs("location.pathname + location.search");
const expectText = (needle, timeout = 30000) =>
  waitUntil(async () => (await bodyText()).includes(needle), {
    timeout,
    label: `text "${needle}"`,
  });
const waitUrl = (frag, timeout = 30000) =>
  waitUntil(async () => (await pathInfo()).includes(frag), {
    timeout,
    label: `url contains "${frag}"`,
  });

async function nav(url, { timeout = 45000 } = {}) {
  await send("Page.navigate", { url: url.startsWith("http") ? url : BASE + url });
  await waitUntil(() => evalJs("document.readyState === 'complete'"), {
    timeout,
    label: `load ${url}`,
  });
  await sleep(900);
}

function setValueExpr(selector, value) {
  return `(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return false;
    const proto = Object.getPrototypeOf(el);
    const desc = Object.getOwnPropertyDescriptor(proto, "value");
    desc.set.call(el, ${JSON.stringify(value)});
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  })()`;
}

async function setValue(selector, value) {
  const ok = await evalJs(setValueExpr(selector, value));
  if (!ok) throw new Error(`Field not found: ${selector}`);
}

async function submitForm(selector) {
  const ok = await evalJs(`(() => {
    const f = document.querySelector(${JSON.stringify(selector)});
    if (!f) return false;
    f.requestSubmit();
    return true;
  })()`);
  if (!ok) throw new Error(`Form not found: ${selector}`);
}

async function shot(name) {
  await sleep(350);
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  await writeFile(path.join(SHOTS, name), Buffer.from(data, "base64"));
  console.log(`  shot ${name}`);
}

async function clickRowButton(rowText, buttonText) {
  const ok = await evalJs(`(() => {
    const row = [...document.querySelectorAll('tr, article')].find((r) =>
      r.textContent.includes(${JSON.stringify(rowText)})
    );
    if (!row) return false;
    const btn = [...row.querySelectorAll('button')].find(
      (b) => b.textContent.trim() === ${JSON.stringify(buttonText)}
    );
    if (!btn) return false;
    btn.form.requestSubmit(btn);
    return true;
  })()`);
  if (!ok) throw new Error(`Could not click "${buttonText}" in row "${rowText}"`);
}

async function login(email, password) {
  await nav("/login");
  await setValue('input[name="email"]', email);
  await setValue('input[name="password"]', password);
  await submitForm('form:has(input[name="email"])');
  await waitUntil(async () => !(await pathInfo()).startsWith("/login"), {
    timeout: 30000,
    label: "login redirect",
  });
  await sleep(700);
}

/* ---------- Test data ---------- */
const stamp = Date.now();
const studentEmail = `e2e.${stamp}@example.com`;
const studentName = "টেস্ট শিক্ষার্থী";
const testCourseTitle = `E2E Test Course ${stamp}`;
const testCourseSlug = `e2e-test-course-${stamp}`;
const messageSubject = `E2E প্রশ্ন ${stamp}`;
const adminEmail = "admin@crackncode.academy";
const adminPassword = "Admin@12345";

const course1 = db.prepare("SELECT * FROM courses WHERE id = 1").get();
const course2 = db.prepare("SELECT * FROM courses WHERE id = 2").get();
const results = {};

try {
  console.log("1. Homepage");
  await nav("/");
  await expectText("CrackNcode");
  await expectText("কোর্স");
  await shot("01-home.png");

  console.log("2. Anonymous /admin redirects to login");
  await nav("/admin");
  await waitUrl("/login");
  results.anonAdminRedirect = await pathInfo();

  console.log("3. Register student");
  await nav("/register?next=/courses");
  await setValue('input[name="name"]', studentName);
  await setValue('input[name="email"]', studentEmail);
  await setValue('input[name="password"]', "Student@12345");
  await submitForm('form:has(input[name="email"])');
  await waitUntil(async () => !(await pathInfo()).startsWith("/register"), {
    timeout: 30000,
    label: "register redirect",
  });
  const student = db
    .prepare("SELECT id, name, email FROM users WHERE email = ?")
    .get(studentEmail);
  if (!student) throw new Error("Student was not created in DB");
  results.studentId = student.id;
  console.log(`  student #${student.id}`);

  console.log("4. Checkout course 1 with Nagad, demo pay");
  await nav("/checkout/course/1");
  await expectText("চেকআউট");
  await evalJs(
    `(() => { const r = document.querySelector('input[name="method"][value="nagad"]'); r.click(); return r.checked; })()`
  );
  await submitForm('form:has(input[name="product_type"])');
  await waitUrl("/payment/");
  await expectText("ডেমো গেটওয়ে");
  await shot("02-payment.png");
  await submitForm('form:has(input[name="order_id"])');
  await waitUrl("/payment/success");
  await expectText("পেমেন্ট সফল হয়েছে");
  await shot("03-payment-success.png");
  const paidOrder = db
    .prepare("SELECT * FROM orders WHERE user_id = ? AND status = 'paid'")
    .get(student.id);
  if (!paidOrder) throw new Error("Order was not marked paid");
  if (paidOrder.method !== "nagad") throw new Error("Payment method not saved");
  results.paidOrder = { id: paidOrder.id, amount: paidOrder.amount, method: paidOrder.method };

  console.log("5. Dashboard + lesson completion");
  await nav("/dashboard");
  await expectText(course1.title);
  await shot("04-student-dashboard.png");

  console.log("5b. Change password (wrong then correct current)");
  await evalJs(`document.querySelector('details summary').click()`);
  await setValue('input[name="current"]', "WrongPass@1");
  await setValue('input[name="password"]', "NewStudent@12345");
  await setValue('input[name="confirm"]', "NewStudent@12345");
  await submitForm('form:has(input[name="current"])');
  await expectText("বর্তমান পাসওয়ার্ড সঠিক নয়");
  await setValue('input[name="current"]', "Student@12345");
  await setValue('input[name="password"]', "NewStudent@12345");
  await setValue('input[name="confirm"]', "NewStudent@12345");
  await submitForm('form:has(input[name="current"])');
  await expectText("পাসওয়ার্ড পরিবর্তন হয়েছে");
  const pwRow = db.prepare("SELECT password_hash FROM users WHERE id = ?").get(student.id);
  const [pwSalt, pwHash] = pwRow.password_hash.split(":");
  if (scryptSync("NewStudent@12345", pwSalt, 64).toString("hex") !== pwHash) {
    throw new Error("Password hash was not updated");
  }
  results.passwordChanged = true;

  await nav(`/learn/${course1.slug}`);
  await expectText("লেসন সম্পন্ন করুন");
  await shot("05-learn.png");
  await submitForm('form:has(input[name="lesson_key"])');
  await waitUrl("lesson=0-1");
  const progress = db
    .prepare("SELECT COUNT(*) AS n FROM lesson_progress WHERE user_id = ? AND course_id = 1")
    .get(student.id);
  if (progress.n !== 1) throw new Error(`Expected 1 completed lesson, got ${progress.n}`);
  results.lessonProgress = progress.n;

  console.log("6. Contact form");
  await nav("/contact");
  await setValue('input[name="name"]', studentName);
  await setValue('input[name="email"]', studentEmail);
  await setValue('input[name="subject"]', messageSubject);
  await setValue(
    'textarea[name="body"]',
    "এটি একটি স্বয়ংক্রিয় টেস্ট বার্তা। কোর্সের বিষয়ে জানতে চাই।"
  );
  await submitForm('form:has(input[name="subject"])');
  await expectText("ধন্যবাদ");
  const msg = db
    .prepare("SELECT * FROM messages WHERE email = ? AND subject = ?")
    .get(studentEmail, messageSubject);
  if (!msg) throw new Error("Contact message not stored");
  results.messageStored = msg.id;

  console.log("7. Pending order for admin approval");
  await nav("/checkout/course/2");
  await submitForm('form:has(input[name="product_type"])');
  await waitUrl("/payment/");
  await sleep(500);
  const pendingOrder = db
    .prepare(
      "SELECT * FROM orders WHERE user_id = ? AND product_id = 2 AND status = 'pending'"
    )
    .get(student.id);
  if (!pendingOrder) throw new Error("Pending order missing");
  results.pendingOrder = { id: pendingOrder.id, title: pendingOrder.title };

  console.log("8. Student cannot access /admin");
  await nav("/admin");
  await waitUntil(async () => (await pathInfo()).startsWith("/dashboard"), {
    timeout: 20000,
    label: "student blocked from admin",
  });
  results.studentAdminBlocked = true;

  console.log("9. Admin login");
  await send("Network.clearBrowserCookies");
  await login(adminEmail, adminPassword);
  await waitUrl("/admin");
  await expectText("অ্যাডমিন ড্যাশবোর্ড");
  await shot("06-admin-dashboard.png");

  console.log("10. Admin courses list + create course");
  await nav("/admin/courses");
  await expectText("কোর্স ব্যবস্থাপনা");
  await shot("07-admin-courses.png");
  await nav("/admin/courses/new");
  await expectText("নতুন কোর্স তৈরি করুন");
  await setValue('input[name="title"]', testCourseTitle);
  await sleep(600);
  await setValue('input[name="slug"]', testCourseSlug);
  await setValue('input[name="subtitle"]', "এটি একটি অটোমেটেড টেস্ট কোর্সের সংক্ষিপ্ত বর্ণনা।");
  await setValue(
    'textarea[name="description"]',
    "এই কোর্সটি শুধুমাত্র অ্যাডমিন প্যানেলের ক্রিয়েট ফ্লো পরীক্ষা করার জন্য তৈরি করা হয়েছে। এতে পর্যাপ্ত দৈর্ঘ্যের বিবরণ দেওয়া হলো।"
  );
  await setValue('input[name="category"]', "প্রোগ্রামিং");
  await setValue('input[name="level"]', "বিগিনার");
  await setValue('input[name="hours"]', "5");
  await setValue('input[name="price"]', "500");
  await setValue('input[name="original_price"]', "1000");
  await setValue('input[name="icon"]', "{ }");
  await setValue(
    'textarea[name="outcomes"]',
    "টেস্ট কোর্সের প্রথম ফলাফল\nটেস্ট কোর্সের দ্বিতীয় ফলাফল"
  );
  await setValue('input[name="instructor_name"]', "টেস্ট ইনস্ট্রাক্টর");
  await setValue('input[name="instructor_title"]', "টেস্ট ইঞ্জিনিয়ার");
  await setValue(
    'textarea[name="instructor_bio"]',
    "এটি টেস্ট বায়ো — অ্যাডমিন ফর্ম যাচাইয়ের জন্য।"
  );
  await setValue('input[aria-label="মডিউল 1 এর নাম"]', "শুরুর মডিউল");
  await setValue('input[aria-label="লেসন 1.1"]', "প্রথম টেস্ট লেসন");
  await setValue('input[placeholder^="লেসনের সংক্ষিপ্ত"]', "সংক্ষিপ্ত সারাংশ");
  await shot("08-admin-course-form.png");
  await submitForm('form:has(input[name="curriculum"])');
  await waitUrl("/admin/courses?saved=1");
  await expectText("সফলভাবে সংরক্ষণ");
  const created = db.prepare("SELECT * FROM courses WHERE slug = ?").get(testCourseSlug);
  if (!created) throw new Error("Course was not created");
  if (created.lesson_count !== 1) throw new Error("Lesson count not computed");
  if (created.price !== 500) throw new Error("Price not saved");
  results.createdCourse = { id: created.id, slug: created.slug };

  console.log("11. Publish toggle");
  await clickRowButton(testCourseTitle, "আনপাবলিশ");
  await waitUntil(
    async () => {
      const text = await evalJs(`(() => {
        const row = [...document.querySelectorAll('tr')].find(r => r.textContent.includes(${JSON.stringify(testCourseTitle)}));
        return row ? row.innerText : '';
      })()`);
      return text.includes("ড্রাফট");
    },
    { label: "course unpublished" }
  );
  const draft = db.prepare("SELECT published FROM courses WHERE id = ?").get(created.id);
  if (draft.published !== 0) throw new Error("Unpublish failed in DB");
  await clickRowButton(testCourseTitle, "পাবলিশ");
  await waitUntil(
    async () => {
      const text = await evalJs(`(() => {
        const row = [...document.querySelectorAll('tr')].find(r => r.textContent.includes(${JSON.stringify(testCourseTitle)}));
        return row ? row.innerText : '';
      })()`);
      return text.includes("প্রকাশিত");
    },
    { label: "course republished" }
  );

  console.log("12. Public course page for created course");
  await nav(`/courses/${testCourseSlug}`);
  await expectText(testCourseTitle);

  console.log("13. Delete created course");
  await nav("/admin/courses");
  await evalJs("window.confirm = () => true; true");
  await clickRowButton(testCourseTitle, "মুছুন");
  await waitUrl("deleted=1");
  const gone = db.prepare("SELECT id FROM courses WHERE id = ?").get(created.id);
  if (gone) throw new Error("Course not deleted from DB");
  results.courseDeleted = true;

  console.log("14. Admin orders: mark pending order paid");
  await nav("/admin/orders?status=pending");
  await expectText(pendingOrder.title);
  await shot("09-admin-orders.png");
  await clickRowButton(pendingOrder.title, "পরিশোধিত");
  await waitUntil(
    () => {
      const row = db
        .prepare("SELECT status FROM orders WHERE id = ?")
        .get(pendingOrder.id);
      return row && row.status === "paid";
    },
    { timeout: 25000, label: "pending order marked paid" }
  );
  const enrollment2 = db
    .prepare("SELECT id FROM enrollments WHERE user_id = ? AND course_id = 2")
    .get(student.id);
  if (!enrollment2) throw new Error("Admin mark-paid did not enroll student");
  results.adminMarkPaid = true;

  console.log("15. Admin students + messages");
  await nav("/admin/students");
  await expectText(studentEmail);
  await shot("10-admin-students.png");
  await nav("/admin/messages");
  await expectText(messageSubject);
  await shot("11-admin-messages.png");
  await clickRowButton(messageSubject, "মুছুন");
  await waitUntil(
    () => {
      const row = db.prepare("SELECT id FROM messages WHERE id = ?").get(msg.id);
      return !row;
    },
    { label: "message deleted" }
  );
  results.messageDeleted = true;

  console.log("16. Certificate verification");
  const curriculum = JSON.parse(course1.curriculum);
  const insert = db.prepare(
    "INSERT OR IGNORE INTO lesson_progress (user_id, course_id, lesson_key, completed_at) VALUES (?, 1, ?, ?)"
  );
  const now = new Date().toISOString();
  curriculum.forEach((m, mi) =>
    m.lessons.forEach((l, li) => insert.run(student.id, `${mi}-${li}`, now))
  );
  const certCode = `CN-W001-S${String(student.id).padStart(5, "0")}`;
  results.certCode = certCode;
  await nav(`/verify?code=${certCode}`);
  await expectText("ভেরিফায়েড সার্টিফিকেট");
  await expectText(course1.title);
  await shot("12-certificate.png");
  await nav("/verify?code=CN-W001-S99999");
  await expectText("সার্টিফিকেট পাওয়া যায়নি");
  results.certInvalidRejected = true;

  console.log("17. Dark mode + mobile screenshots");
  await nav("/");
  await evalJs(
    `(() => { const b = document.querySelector('button[aria-label*="ডার্ক মোড"]'); if (!b) return false; b.click(); return true; })()`
  );
  await sleep(500);
  const isDark = await evalJs("document.documentElement.classList.contains('dark')");
  if (!isDark) throw new Error("Dark mode did not activate");
  await shot("13-home-dark.png");
  await evalJs(
    `(() => { const b = document.querySelector('button[aria-label*="লাইট মোড"]'); if (!b) return false; b.click(); return true; })()`
  );
  await sleep(300);
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await nav("/");
  await shot("14-home-mobile.png");
  await nav("/admin/courses");
  await shot("15-admin-mobile.png");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });

  console.log("ALL E2E CHECKS PASSED");
} catch (error) {
  console.error("E2E FAILED:", error.message);
  try {
    const text = await bodyText();
    console.error("URL:", await pathInfo());
    console.error("PAGE TEXT:", text.slice(0, 1600));
    await shot("error.png");
  } catch {}
  process.exitCode = 1;
} finally {
  // clean up test student and any test data
  try {
    const s = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(studentEmail);
    if (s) {
      db.exec("BEGIN");
      db.prepare("DELETE FROM lesson_progress WHERE user_id = ?").run(s.id);
      db.prepare("DELETE FROM enrollments WHERE user_id = ?").run(s.id);
      db.prepare("DELETE FROM orders WHERE user_id = ?").run(s.id);
      db.prepare("DELETE FROM users WHERE id = ?").run(s.id);
      db.exec("COMMIT");
      console.log("Cleaned up test student + related rows");
    }
    db.prepare("DELETE FROM messages WHERE email = ?").run(studentEmail);
    db.prepare("DELETE FROM courses WHERE slug = ?").run(testCourseSlug);
    console.log("RESULTS", JSON.stringify(results, null, 2));
  } catch (e) {
    console.error("Cleanup error:", e.message);
  }
  ws.close();
}
