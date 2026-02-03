# Afnan AI - Next.js Conversion TODO

## Phase 1: Project Setup
- [x] Initialize Next.js project
- [x] Copy static assets from original project
- [x] Set up Tailwind CSS and fonts
- [x] Configure environment variables

## Phase 2: Page Components
- [x] Convert index.html to Home page
- [x] Convert afnan.html to Studio page
- [x] Convert login.html to Login page
- [x] Convert pro.html to Pro page
- [x] Convert privacy.html to Privacy page
- [x] Convert settings.html to Settings page

## Phase 3: Layout & Navigation
- [x] Create shared RootLayout component
- [x] Create Header component with navigation
- [x] Create Sidebar component for Studio
- [x] Create Navigation menu component
- [x] Implement responsive design

## Phase 4: Firebase & Authentication
- [x] Create Firebase config API route
- [ ] Implement Google Auth API route
- [ ] Implement GitHub Auth API route
- [ ] Create auth middleware
- [x] Implement user session management (localStorage)

## Phase 5: API Routes & Security
- [x] Create /api/chat route (protect OpenRouter key)
- [x] Create /api/gemini route (protect Gemini key)
- [x] Create /api/firebase-auth route
- [x] Implement environment variable protection
- [x] Add CORS headers to API routes

## Phase 6: Firebase Auth الحقيقية
- [x] إضافة Firebase Auth مع Google
- [x] إضافة Firebase Auth مع GitHub
- [x] إنشاء API route للمصادقة
- [ ] ربط Firebase مع قاعدة البيانات

## Phase 7: نظام الأرصدة والاشتراكات
- [ ] إنشاء جدول الأرصدة في قاعدة البيانات
- [x] 150 رصيد يومي للـ Flash
- [x] 10000 رصيد للـ Max بعد الترقية
- [ ] شراء الأرصدة (1 دولار = 1000 رصيد)
- [x] نظام تتبع استهلاك الأرصدة

## Phase 8: نماذج الذكاء الاصطناعي
- [x] تكامل Afnan 1.2 Flash الحقيقي
- [x] تكامل Afnan 1.2 Max الحقيقي
- [x] اختيار النموذج في الواجهة
- [x] حساب الأرصدة المستهلكة

## Phase 9: رفع الصور والملفات
- [x] إضافة أيقونة رفع الصور
- [x] إضافة كاميرا للتصوير
- [ ] رفع الملفات إلى S3/Firebase Storage
- [x] معالجة الصور قبل الإرسال

## Phase 10: نظام الدفع
- [ ] تكامل Stripe للدفع
- [ ] معالجة الدفع الآمنة
- [ ] تحديث الأرصدة بعد الدفع
- [ ] سجل المعاملات
- [ ] Create chat input component
- [ ] Implement real-time message sending
- [ ] Add loading states and error handling

## Phase 7: Testing & Validation
- [ ] Test all page navigation
- [ ] Verify no 404 errors
- [ ] Test chat functionality
- [ ] Test authentication flow
- [ ] Test API routes security

## Phase 8: Vercel Configuration
- [ ] Update vercel.json for Next.js
- [ ] Configure environment variables in Vercel
- [ ] Set up build settings
- [ ] Configure deployment settings

## Phase 9: GitHub Integration
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Set up GitHub Actions (optional)

## Phase 10: Final Delivery
- [ ] Create checkpoint
- [ ] Generate deployment documentation
- [ ] Provide project summary to user
