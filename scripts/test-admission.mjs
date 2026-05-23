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
    checkPage("/ar/admission/bidaya", ["ابدؤوا مسار ابنكم بثقة", "بدء طلب التسجيل"]),
    checkPage("/ar/admission", ["استمارة التسجيل الأولي", "studentFirstName"]),
    checkPage("/ar/admission/najah?ref=NIB-2026-000001", [
      "تم استلام طلبكم بنجاح",
      "NIB-2026-000001",
    ]),
    checkPage("/ar", ["مدارس"]),
  ]);

  const api = await checkApiValidation();

  let failed = 0;
  for (const r of [...pages, api]) {
    const mark = r.ok ? "PASS" : "FAIL";
    if (!r.ok) failed++;
    console.log(
      `[${mark}] ${r.path} → HTTP ${r.status}${r.hasErrors !== undefined ? ` errors=${r.hasErrors}` : ""}`
    );
  }

  const rootRedirect = await fetch(`${base}/`, { redirect: "manual" });
  const redirectsToAr =
    rootRedirect.status >= 300 &&
    rootRedirect.status < 400 &&
    (rootRedirect.headers.get("location")?.includes("/ar") ||
      rootRedirect.url?.includes("/ar"));
  console.log(
    `[${redirectsToAr ? "PASS" : "FAIL"}] / يعيد التوجيه إلى /ar (status=${rootRedirect.status})`
  );
  if (!redirectsToAr) failed++;

  console.log(`\n${failed === 0 ? "كل الاختبارات نجحت." : `فشل ${failed} اختبار(ات).`}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("خطأ في الاتصال:", e.message);
  process.exit(2);
});
