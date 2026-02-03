# Afnan AI - Vercel Serverless Version

هذا المشروع تم تحويله ليعمل بكفاءة على منصة Vercel باستخدام **Serverless Functions**.

## التغييرات الرئيسية:
1. **نقل المنطق إلى `api/`**: تم حذف `server.js` ونقل منطق العمل إلى `api/chat.js` و `api/gemini.js`.
2. **إزالة ملفات اللوجز**: تم حذف ملفات `.log` لأن Vercel لا يدعم الكتابة على نظام الملفات. يمكنك متابعة اللوجز من لوحة تحكم Vercel.
3. **تحديث `vercel.json`**: تم ضبط الإعدادات لضمان تشغيل الدوال البرمجية بشكل صحيح.
4. **ربط الـ Frontend**: تم التأكد من أن ملفات HTML تنادي الـ API عبر مسارات نسبية (`/api/chat`).

## كيفية التشغيل:
- المشروع جاهز للرفع المباشر على Vercel.
- تأكد من إضافة مفاتيح الـ API في إعدادات Vercel (Environment Variables):
  - `OPENROUTER_API_KEY`
  - `GEMINI_API_KEY`

## البنية الحالية:
- `api/chat.js`: التعامل مع طلبات الدردشة عبر OpenRouter.
- `api/gemini.js`: التعامل مع طلبات Gemini (اختياري).
- `index.html`: الصفحة الرئيسية.
- `afnan.html`: واجهة الدردشة.
- `vercel.json`: إعدادات المنصة.
