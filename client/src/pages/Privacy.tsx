import React from 'react';
import { useLocation } from 'wouter';
import RootLayout from '@/components/RootLayout';

export default function Privacy() {
  const [, setLocation] = useLocation();

  return (
    <RootLayout>
      <div className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
              سياسة الخصوصية واتفاقية المستخدم
            </h1>

            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                <strong>1. الاستخدام المشروع:</strong> يلتزم المستخدم باستخدام خدمات Afnan AI للأغراض المشروعة فقط ووفقاً للقوانين المعمول بها.
              </p>

              <p>
                <strong>2. حماية الخصوصية:</strong> نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية وعدم مشاركتها مع أطراف ثالثة دون موافقتك.
              </p>

              <p>
                <strong>3. ملكية المحتوى:</strong> جميع المحتويات المولدة عبر المنصة هي ملك للمستخدم، مع احتفاظنا بحق تحسين النماذج بناءً على التفاعلات العامة.
              </p>

              <p>
                <strong>4. المحتوى المحظور:</strong> يمنع استخدام المنصة لإنشاء محتوى يحرض على العنف أو الكراهية أو ينتهك حقوق الملكية الفكرية للآخرين.
              </p>

              <p>
                <strong>5. الأمان والتشفير:</strong> نحن نستخدم تقنيات تشفير متقدمة لضمان أمن المحادثات والبيانات المرفوعة على خوادمنا.
              </p>

              <p>
                <strong>6. تحديث الشروط:</strong> يحق لـ Afnan AI تحديث شروط الخدمة في أي وقت، وسيتم إخطار المستخدمين بالتغييرات الجوهرية.
              </p>

              <p>
                <strong>7. ملفات تعريف الارتباط:</strong> استخدامك للمنصة يعني موافقتك الكاملة على جمع ملفات تعريف الارتباط لتحسين تجربة المستخدم.
              </p>

              <p>
                <strong>8. عدم المسؤولية:</strong> المنصة غير مسؤولة عن أي قرارات يتخذها المستخدم بناءً على المخرجات الناتجة عن الذكاء الاصطناعي.
              </p>

              <p>
                <strong>9. سرية الحساب:</strong> يلتزم المستخدم بالحفاظ على سرية معلومات حسابه وعدم مشاركتها مع الآخرين لضمان أمن بياناته.
              </p>

              <p>
                <strong>10. التواصل والدعم:</strong> في حال وجود أي استفسار أو شكوى، يمكنكم التواصل مع فريق الدعم الفني عبر البريد الإلكتروني الرسمي.
              </p>
            </div>

            <div className="mt-12 text-center">
              <button
                onClick={() => setLocation('/')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                العودة للرئيسية
              </button>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
