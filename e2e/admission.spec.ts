import { test, expect } from "@playwright/test";

test.describe("بوابة التسجيل الأولي", () => {
  test("الجذر / يعيد التوجيه إلى /ar", async ({ page }) => {
    const res = await page.goto("/", { waitUntil: "commit" });
    expect(res?.url()).toContain("/ar");
    await expect(page.getByRole("heading", { name: /مدارس النبراس/ })).toBeVisible();
  });

  test("الصفحة التعريفية /admission/bidaya", async ({ page }) => {
    await page.goto("/admission/bidaya");
    await expect(page.getByRole("heading", { name: "بوابة التسجيل الأولي" })).toBeVisible();
    await expect(page.getByRole("link", { name: "بدء التسجيل الأولي" })).toHaveAttribute(
      "href",
      "/admission"
    );
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("استمارة /admission", async ({ page }) => {
    await page.goto("/admission");
    await expect(
      page.getByRole("heading", { name: "استمارة التسجيل الأولي" })
    ).toBeVisible();
    await expect(page.locator('input[name="studentFirstName"]')).toBeVisible();
    await expect(page.locator('input[name="parentPhone"]')).toBeVisible();
    await expect(page.getByRole("button", { name: "إرسال طلب التسجيل الأولي" })).toBeVisible();
  });

  test("صفحة النجاح /admission/najah", async ({ page }) => {
    await page.goto("/admission/najah?ref=NIB-2026-000042");
    await expect(page.getByRole("heading", { name: "تم استلام طلبكم بنجاح" })).toBeVisible();
    await expect(page.getByText("NIB-2026-000042")).toBeVisible();
    await expect(page.getByRole("link", { name: "العودة إلى الصفحة الرئيسية" })).toHaveAttribute(
      "href",
      "/ar"
    );
  });

  test("الموقع الرئيسي /ar يعمل", async ({ page }) => {
    const res = await page.goto("/ar");
    expect(res?.status()).toBe(200);
    await expect(page.locator("header")).toBeVisible();
  });

  test("API ترفض طلباً فارغاً (400)", async ({ request }) => {
    const res = await request.post("/api/applications", { multipart: {} });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.errors).toBeTruthy();
    expect(body.errors.studentFirstName).toBeTruthy();
  });

});
