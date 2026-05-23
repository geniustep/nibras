# طلب تأكيدات تقنية — فريق السيرفر

> نموذج جاهز للإرسال. لا تُدرج كلمات المرور في البريد — استخدم قناة آمنة لـ `DATABASE_URL`.

---

**الموضوع:** تأكيدات تقنية مطلوبة قبل نشر بوابة التسجيل الأولي على Vercel

مع التحية،

قبل نشر واجهة التسجيل الأولي وربطها بقاعدة **PostgreSQL على السيرفر المستقل** (التطبيق على **Vercel**)، نحتاج التأكيدات التالية نقطة بنقطة. نرجو الرد على شكل **قائمة مرقّمة** كما في **النقطة 8**.

---

### النقطة 1 — قاعدة PostgreSQL على السيرفر المستقل

1. **رابط الاتصال `DATABASE_URL` لبيئة الإنتاج** — قناة آمنة.  
   `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require`

2. **هل القاعدة نفس قاعدة لوحة إدارة القبول؟** (نعم / لا)  
   توصيتنا: **نعم** — الطلبات تظهر في `admission.madarisnibras.ma`.

3. **هل الجداول موجودة مسبقاً؟**  
   - نعم: تأكيد المخطط (`Application`, `ApplicationCounter`, …).  
   - لا: `npx prisma migrate deploy` مرة واحدة.  
   *(عندكم: الهجرات قد تُشغَّل عبر Docker عند `compose up`.)*

4. **SSL:** `sslmode=require` أم شهادة/CA خاصة؟

5. **النسخ الاحتياطي:** التكرار والاستعادة.

6. رابط **مناسب لـ Vercel** (ليس `localhost`).

---

### النقطة 2 — السماح لـ Vercel بالوصول

1. جدار ناري: اتصال خارجي إلى منفذ PostgreSQL (مثلاً `5434` على المضيف).

2. تقييد IP لـ Vercel؟ قائمة IPs أو pooler (PgBouncer / …).

3. الطريقة المعتمدة: VPN / tunnel / pooler — نرجو التحديد.

*فتح المنفذ للإنترنت العام غير مفضّل؛ الأفضل pooler + TLS.*

---

### النقطة 3 — Vercel

1. مستودع Git والفرع (`main` / `production`).

2. متغيرات: `DATABASE_URL`, `TRACKING_YEAR`, `NEXT_PUBLIC_APP_URL`  
   (مثال: `https://admission.madarisnibras.ma`).

3. بناء: `npm run build:vercel` (بدون migrate إن الجداول جاهزة).

4. **من ينفّذ الهجرات؟** Vercel أم السيرفر/Docker فقط؟

---

### النقطة 4 — النطاق

| المسار | الوظيفة |
|--------|---------|
| `/` | تعريفية |
| `/tassjil` | استمارة |
| `/tassjil/najah` | نجاح + تتبع |
| `POST /api/applications` | حفظ |

- النطاق النهائي: `www.madarisnibras.ma` أم `admission.madarisnibras.ma`؟
- DNS → Vercel؟ من يدير؟
- Cloudflare / proxy وإعدادات `/api/applications`؟

---

### النقطة 5 — الأمان

- rate limiting / WAF على `POST /api/applications`؟
- حد حجم الطلب على الـ proxy.
- TLS بين Vercel وPostgreSQL.

---

### النقطة 6 — Staging

- رابط Preview / staging.
- `DATABASE_URL` تجريبية منفصلة.

---

### النقطة 7 — خارج النطاق

- لوحة `/admin` على بيئتكم (Docker).
- لا إعادة تصميم — الدمج البصري مُنجَز.

---

### النقطة 8 — المطلوب في الرد

1. `DATABASE_URL` (+ staging) — آمن  
2. قاعدة مشتركة؟ جداول جاهزة؟  
3. وصول Vercel (IP / pooler / VPN)  
4. من ينفّذ الهجرات؟  
5. نطاق + DNS + Cloudflare  
6. جهة اتصال + موعد أول اختبار إرسال  

شكراً لتعاونكم.

مع التحية،  
**[الاسم]** — **[الفريق]** — **[البريد / الهاتف]**

---

## مرجع داخلي (لا يُرسل)

| الموضوع | الوضع الحالي |
|---------|----------------|
| القاعدة | Docker `nibras_admission`، منفذ المضيف `5434` |
| الهجرات | خدمة `migrate` في `docker compose` |
| اللوحة | `admission.madarisnibras.ma` |
| Vercel | `build:vercel` بدون `migrate deploy` |
| محلي | `localhost:5434` — لا يصلح لإنتاج Vercel |
