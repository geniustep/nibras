# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admission.spec.ts >> بوابة التسجيل الأولي >> API ترفض طلباً فارغاً (400)
- Location: e2e\admission.spec.ts:42:7

# Error details

```
Error: apiRequestContext.post: socket hang up
Call log:
  - → POST http://127.0.0.1:3001/api/applications
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.96 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br
    - content-type: multipart/form-data; boundary=----WebKitFormBoundaryk8O26nAHuZ6PBoNp
    - content-length: 44

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("بوابة التسجيل الأولي", () => {
  4  |   test("الصفحة التعريفية /", async ({ page }) => {
  5  |     const res = await page.goto("/");
  6  |     expect(res?.status()).toBe(200);
  7  |     await expect(page.getByRole("heading", { name: "بوابة التسجيل الأولي" })).toBeVisible();
  8  |     await expect(page.getByRole("link", { name: "بدء التسجيل الأولي" })).toHaveAttribute(
  9  |       "href",
  10 |       "/tassjil"
  11 |     );
  12 |     await expect(page.locator("header")).toBeVisible();
  13 |     await expect(page.locator("footer")).toBeVisible();
  14 |   });
  15 | 
  16 |   test("استمارة /tassjil", async ({ page }) => {
  17 |     await page.goto("/tassjil");
  18 |     await expect(
  19 |       page.getByRole("heading", { name: "استمارة التسجيل الأولي" })
  20 |     ).toBeVisible();
  21 |     await expect(page.locator('input[name="studentFirstName"]')).toBeVisible();
  22 |     await expect(page.locator('input[name="parentPhone"]')).toBeVisible();
  23 |     await expect(page.getByRole("button", { name: "إرسال طلب التسجيل الأولي" })).toBeVisible();
  24 |   });
  25 | 
  26 |   test("صفحة النجاح /tassjil/najah", async ({ page }) => {
  27 |     await page.goto("/tassjil/najah?ref=NIB-2026-000042");
  28 |     await expect(page.getByRole("heading", { name: "تم استلام طلبكم بنجاح" })).toBeVisible();
  29 |     await expect(page.getByText("NIB-2026-000042")).toBeVisible();
  30 |     await expect(page.getByRole("link", { name: "العودة إلى الصفحة الرئيسية" })).toHaveAttribute(
  31 |       "href",
  32 |       "/"
  33 |     );
  34 |   });
  35 | 
  36 |   test("الموقع الرئيسي /ar يعمل", async ({ page }) => {
  37 |     const res = await page.goto("/ar");
  38 |     expect(res?.status()).toBe(200);
  39 |     await expect(page.locator("header")).toBeVisible();
  40 |   });
  41 | 
  42 |   test("API ترفض طلباً فارغاً (400)", async ({ request }) => {
> 43 |     const res = await request.post("/api/applications", { multipart: {} });
     |                               ^ Error: apiRequestContext.post: socket hang up
  44 |     expect(res.status()).toBe(400);
  45 |     const body = await res.json();
  46 |     expect(body.errors).toBeTruthy();
  47 |     expect(body.errors.studentFirstName).toBeTruthy();
  48 |   });
  49 | 
  50 | });
  51 | 
```