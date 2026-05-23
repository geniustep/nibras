/**
 * اختبار سريع لصفحات التسجيل وواجهة API (بدون قاعدة بيانات للتحقق من الأخطاء).
 */
const base = process.env.TEST_BASE_URL ?? "http://localhost:3000";
// إذا كان المنفذ 3001 مشغولاً: TEST_BASE_URL=http://localhost:3001 node scripts/test-admission.mjs

async function checkPage(path, mustInclude) {
  const url = `${base}${path}`;
  const res = await fetch(url, { redirect: "manual" });
  const html = await res.text();
  const ok =
    res.status === 200 &&
    mustInclude.every((s) => html.includes(s));
  return { path, status: res.status, ok, url };
}

async function checkApiValidation() {
  const res = await fetch(`${base}/api/applications`, {
    method: "POST",
    body: new FormData(),
  });
  const data = await res.json().catch(() => ({}));
  const ok = res.status === 400 && data.errors && typeof data.errors === "object";
  return {
    path: "POST /api/applications (empty)",
    status: res.status,
    ok,
    hasErrors: Boolean(data.errors),
  };
}

async function main() {
  console.log(`Base URL: ${base}\n`);

  const pages = await Promise.all([
    checkPage("/", ["بوابة التسجيل الأولي", "بدء التسجيل الأولي"]),
    checkPage("/tassjil", ["استمارة التسجيل الأولي", "studentFirstName"]),
    checkPage("/tassjil/najah?ref=NIB-2026-000001", [
      "تم استلام طلبكم بنجاح",
      "NIB-2026-000001",
    ]),
    checkPage("/ar", ["مدارس"]),
  ]);

  const headerCheck = await checkPage("/", ["sticky top-0"]); // Header classes
  const api = await checkApiValidation();

  let failed = 0;
  for (const r of [...pages, { ...headerCheck, note: "header" }, api]) {
    const mark = r.ok ? "PASS" : "FAIL";
    if (!r.ok) failed++;
    console.log(
      `[${mark}] ${r.path} → HTTP ${r.status}${r.hasErrors !== undefined ? ` errors=${r.hasErrors}` : ""}`
    );
  }

  // تحقق من عدم إعادة توجيه / إلى /ar
  const rootRedirect = await fetch(`${base}/`, { redirect: "manual" });
  const noRedirect = rootRedirect.status === 200;
  console.log(
    `[${noRedirect ? "PASS" : "FAIL"}] / لا يعيد التوجيه إلى /ar (status=${rootRedirect.status})`
  );
  if (!noRedirect) failed++;

  console.log(`\n${failed === 0 ? "كل الاختبارات نجحت." : `فشل ${failed} اختبار(ات).`}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("خطأ في الاتصال:", e.message);
  process.exit(2);
});
