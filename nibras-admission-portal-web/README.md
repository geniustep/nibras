# بوابة التسجيل الأولي — الواجهة العامة (Web)

هذه الحزمة مستخرجة من مشروع `nibras-admission-portal` وتحتوي **فقط** على:

- الصفحة الرئيسية `/`
- استمارة التسجيل `/tassjil`
- صفحة النجاح `/tassjil/najah`
- واجهة API لاستقبال الطلبات `/api/applications`

**لا تشمل** لوحة الإدارة (`/admin`) ولا واجهات الإدارة.

## التنزيل إلى حاسوبك

### من Cursor / الخادم

انسخ المجلد كاملاً:

```
/opt/nibras-admission-portal-web
```

أو استخدم الأرشيف الجاهز:

```
/opt/nibras-admission-portal-web.tar.gz
```

### عبر SCP (من حاسوبك)

```bash
scp -r user@SERVER:/opt/nibras-admission-portal-web ~/Projects/
# أو
scp user@SERVER:/opt/nibras-admission-portal-web.tar.gz ~/Downloads/
tar -xzf nibras-admission-portal-web.tar.gz
```

## التشغيل المحلي

```bash
cd nibras-admission-portal-web
cp .env.example .env
# عدّل DATABASE_URL و NEXT_PUBLIC_APP_URL
npm install
npx prisma migrate deploy
npm run dev
```

افتح: http://localhost:3000

## النشر على Vercel

### 1. رفع المشروع

- أنشئ مستودع Git جديد وادفع محتوى هذا المجلد، **أو**
- من لوحة Vercel: **Add New → Project** وارفع المجلد / اربط GitHub.

### 2. متغيرات البيئة (Settings → Environment Variables)

| المتغير | الوصف |
|---------|--------|
| `DATABASE_URL` | رابط PostgreSQL (يفضّل نفس قاعدة لوحة الإدارة إن وُجدت) |
| `TRACKING_YEAR` | مثال: `2026` |
| `NEXT_PUBLIC_APP_URL` | رابط Vercel بعد النشر، مثل `https://nibras-admission.vercel.app` |

### 3. قاعدة البيانات

- **Vercel Postgres** أو **Neon** أو أي PostgreSQL متاح من الإنترنت.
- عند أول نشر، يُنفَّذ `prisma migrate deploy` تلقائياً عبر أمر البناء في `vercel.json`.
- إذا كانت القاعدة **مشتركة** مع نسخة Docker للإدارة، لا حاجة لإنشاء قاعدة جديدة — فقط نفس `DATABASE_URL`.

### 4. النشر

Vercel يكتشف Next.js تلقائياً. أمر البناء الافتراضي:

```text
prisma generate && prisma migrate deploy && next build
```

## هيكل المجلد

```text
src/app/(public)/     ← الصفحات العامة
src/app/api/applications/  ← حفظ الطلبات
src/components/       ← واجهة الاستمارة والترويسة
src/lib/              ← Prisma، التحقق، أرقام التتبع
prisma/               ← المخطط والهجرات (نفس المشروع الأصلي)
public/               ← الشعار والأصول
```

## ملاحظات مهمة

1. **لوحة الإدارة** تبقى على الخادم الحالي (Docker) أو يمكن نشرها لاحقاً كمشروع منفصل.
2. الطلبات المُرسلة من Vercel تُحفظ في نفس جدول `Application` إذا استخدمت نفس `DATABASE_URL`.
3. غيّر `NEXT_PUBLIC_APP_URL` بعد الحصول على النطاق النهائي (مخصص أو `*.vercel.app`).

---

© مدارس النبراس — الواجهة العامة
