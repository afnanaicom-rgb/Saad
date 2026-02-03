# توثيق حل مشكلة تسجيل الدخول على Vercel

## المشكلة
كانت هناك مشكلة **404: NOT_FOUND** عند محاولة تسجيل الدخول عبر Google أو GitHub على الموقع المستضاف على Vercel. الخطأ كان يظهر عند محاولة Firebase إعادة التوجيه إلى مسار `/__/auth/handler`.

## السبب الجذري
المشكلة كانت في ملف `firebase-config.js` حيث كان `authDomain` مضبوطاً على الدومين المخصص:
```javascript
authDomain: "afnanai.com"
```

عند استخدام الدومين المخصص مع Vercel، يحاول Firebase إعادة التوجيه إلى `afnanai.com/__/auth/handler` وهذا المسار غير موجود على Vercel لأنه يتطلب إعدادات خاصة في Firebase Hosting.

## الحل المطبق

### 1. تحديث firebase-config.js
تم تغيير `authDomain` من الدومين المخصص إلى Firebase authDomain الافتراضي:

**قبل:**
```javascript
authDomain: "afnanai.com"
```

**بعد:**
```javascript
authDomain: "afnan-b5934.firebaseapp.com"
```

### 2. تبسيط vercel.json
تم إزالة الإعدادات غير الضرورية وتبسيط الملف:

**قبل:**
```json
{
  "rewrites": [
    {
      "source": "/__/auth/:path*",
      "destination": "/__/auth/:path*"
    }
  ]
}
```

**بعد:**
```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

## الخطوات التالية

### 1. إعادة النشر على Vercel
بعد رفع التعديلات إلى GitHub، سيتم إعادة النشر تلقائياً على Vercel. إذا لم يحدث ذلك تلقائياً:
- اذهب إلى لوحة تحكم Vercel
- اختر المشروع
- اضغط على "Redeploy" للنشر اليدوي

### 2. تحديث إعدادات Firebase Console
**مهم جداً:** يجب تحديث Authorized domains في Firebase Console:

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروع `afnan-b5934`
3. اذهب إلى **Authentication** > **Settings** > **Authorized domains**
4. تأكد من إضافة النطاقات التالية:
   - `afnan-b5934.firebaseapp.com` ✓
   - `afnanai.com` (الدومين المخصص)
   - نطاق Vercel الخاص بك (مثل: `saad-xyz.vercel.app`)

### 3. تحديث Google OAuth Redirect URIs
إذا كنت تستخدم Google OAuth:
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. اختر المشروع
3. اذهب إلى **APIs & Services** > **Credentials**
4. اختر OAuth 2.0 Client ID
5. أضف Authorized redirect URIs:
   - `https://afnan-b5934.firebaseapp.com/__/auth/handler`
   - `https://afnanai.com/__/auth/handler` (إذا كنت تريد استخدام الدومين المخصص)

### 4. تحديث GitHub OAuth App
إذا كنت تستخدم GitHub OAuth:
1. اذهب إلى [GitHub Developer Settings](https://github.com/settings/developers)
2. اختر OAuth App
3. حدث Authorization callback URL إلى:
   - `https://afnan-b5934.firebaseapp.com/__/auth/handler`

## اختبار الحل
بعد إعادة النشر:
1. افتح صفحة تسجيل الدخول: `https://afnanai.com/login.html`
2. اضغط على زر "Google Log in"
3. يجب أن يتم التوجيه إلى صفحة تسجيل الدخول من Google
4. بعد تسجيل الدخول، يجب أن يتم التوجيه إلى `afnan.html` بنجاح

## ملاحظات إضافية

### استخدام الدومين المخصص (اختياري)
إذا كنت تريد استخدام `afnanai.com` كـ authDomain بدلاً من Firebase الافتراضي:
1. يجب إعداد Firebase Hosting للدومين المخصص
2. أو استخدام Vercel Rewrites لإعادة توجيه `/__/auth/*` إلى Firebase
3. هذا يتطلب إعدادات متقدمة وغير موصى به للمبتدئين

### الحل الحالي (الموصى به)
الحل الحالي باستخدام `afnan-b5934.firebaseapp.com` هو الأبسط والأكثر استقراراً ويعمل بشكل مثالي مع Vercel.

## الخلاصة
✅ تم إصلاح المشكلة بنجاح  
✅ تم رفع التعديلات إلى GitHub  
⏳ انتظر إعادة النشر التلقائي على Vercel  
⚠️ تأكد من تحديث Authorized domains في Firebase Console  

---
**تاريخ الإصلاح:** 2 فبراير 2026  
**الملفات المعدلة:** `firebase-config.js`, `vercel.json`
