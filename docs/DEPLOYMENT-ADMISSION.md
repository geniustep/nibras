# نشر بوابة التسجيل الأولي (Vercel + PostgreSQL مستقل)

## البنية المعتمدة

| المكوّن | الاستضافة | الملاحظات |
|---------|-----------|-----------|
| الواجهة العامة + `POST /api/applications` | **Vercel** | Next.js 16 |
| PostgreSQL | **سيرفر مستقل** | Docker: قاعدة `nibras_admission` |
| لوحة الإدارة `/admin` | **السيرفر الحالي** | `admission.madarisnibras.ma` — Docker/Traefik |

**توصية:** استخدام **نفس قاعدة** لوحة القبول حتى تظهر الطلبات فوراً في اللوحة.

---

## المسارات العامة

| المسار | الوظيفة |
|--------|---------|
| `/` | إعادة توجيه إلى `/ar` (الموقع الرئيسي) |
| `/tassjil/bidaya` | الصفحة التعريفية لبوابة التسجيل |
| `/tassjil` | استمارة التسجيل الأولي |
| `/tassjil/najah` | تأكيد الطلب + رقم التتبع |
| `POST /api/applications` | حفظ الطلب |

الموقع المؤسسي (متعدد اللغات): `/ar`, `/fr`, `/en`.

---

## قاعدة البيانات على السيرفر

- **اسم القاعدة:** `nibras_admission`
- **Docker:** PostgreSQL داخل الحاوية على المنفذ `5432`، مكشوف على المضيف غالباً **`5434`**
- **الهجرات:** تُشغَّل تلقائياً عبر خدمة `migrate` عند `docker compose up` على السيرفر
- **لا تستخدم** `localhost` في `DATABASE_URL` على Vercel

### تطوير محلي

```bash
cp .env.example .env
# عدّل DATABASE_URL — مثال:
# postgresql://nibras:YOUR_PASSWORD@localhost:5434/nibras_admission
npm install
npm run dev
```

### إنتاج (Vercel → السيرفر)

يحتاج فريق السيرفر توفير رابط يصل من الإنترنت، مثلاً:

- `HOST` عام + `sslmode=require` + `pg_hba` / جدار ناري
- أو **PgBouncer / pooler** (مفضّل أمنياً بدل فتح `5432`/`5434` للعامة)

---

## متغيرات Vercel

| المتغير | مثال | ملاحظة |
|---------|------|--------|
| `DATABASE_URL` | `postgresql://…@HOST:PORT/nibras_admission?sslmode=require` | قناة آمنة فقط |
| `TRACKING_YEAR` | `2026` | سنة أرقام التتبع `NIB-2026-XXXXXX` |
| `NEXT_PUBLIC_APP_URL` | `https://admission.madarisnibras.ma` | يطابق النطاق على Vercel |

---

## أوامر البناء

| الأمر | متى |
|-------|-----|
| `npm run build` | محلي / CI — بدون `migrate deploy` |
| `npm run build:vercel` | **افتراضي Vercel** — `prisma generate` + `next build` |
| `npm run build:vercel:migrate` | فقط إن لم تُطبَّق الهجرات على السيرفر بعد |

`vercel.json` يستخدم `build:vercel` (بدون migrate) لأن الهجرات تُدار عبر Docker على السيرفر.

---

## النطاق و DNS

- **اللوحة الحالية:** `https://admission.madarisnibras.ma`
- **النطاق المقترح للبوابة على Vercel:** نفس النطاق أو `www.madarisnibras.ma` — يُحدَّد مع فريق السيرفر
- `NEXT_PUBLIC_APP_URL` **يجب** أن يطابق النطاق النهائي

`/` يعيد التوجيه إلى `/ar`. الصفحة التعريفية للتسجيل على `/tassjil/bidaya`.

---

## اختبار

```bash
npm run test:admission          # تحقق Zod + API (بدون متصفح)
npm run test:admission:e2e      # Playwright (يتطلب npm run dev)
```

---

## استكشاف خطأ 500 على `POST /api/applications`

الرسالة «تعذر حفظ الطلب» مع **HTTP 500** تعني أن الاتصال بقاعدة البيانات أو الحفظ فشل (بعد اجتياز التحقق من الحقول).

| السبب الشائع | الحل |
|--------------|------|
| `DATABASE_URL` غير مضاف على Vercel | Environment Variables → Production |
| الرابط يستخدم `localhost` أو `127.0.0.1` | استبدله بـ HOST عام أو pooler من السيرفر |
| Vercel لا يصل إلى PostgreSQL | فتح الجدار الناري / pooler + `?sslmode=require` |
| الجداول غير موجودة | `npx prisma migrate deploy` على السيرفر |
| اتصالات serverless | تم ضبط Prisma singleton في الكود |

**تشخيص على Vercel:**

1. Deployments → Functions → Logs عند إرسال استمارة — ابحث عن `[applications]`.
2. مؤقتاً: `ADMISSION_API_DEBUG=true` ثم أعد الإرسال — قد يظهر حقل `debug` في استجابة JSON.
3. `HEALTH_CHECK_SECRET` + `GET /api/health/db?secret=...` للتحقق من الاتصال.

---

## قائمة تحقق قبل الإطلاق

- [ ] `DATABASE_URL` إنتاج على Vercel (من السيرفر، ليس localhost)
- [ ] Vercel يصل إلى PostgreSQL (IP / pooler / TLS)
- [ ] الجداول موجودة (`Application`, `ApplicationCounter`, …)
- [ ] `NEXT_PUBLIC_APP_URL` صحيح
- [ ] إرسال تجريبي من `/tassjil` → ظهور الطلب في لوحة القبول
- [ ] `/`, `/tassjil`, `/tassjil/najah` تعمل مع هيدر/فوتر الموقع

---

## مراسلة فريق السيرفر

راجع `docs/SERVER-REQUEST.md` لنموذج الطلب والتأكيدات المطلوبة.
