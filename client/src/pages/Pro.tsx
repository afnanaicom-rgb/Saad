import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import RootLayout from '@/components/RootLayout';

export default function Pro() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('afnan_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleUpgradeToPro = () => {
    if (!user) {
      alert('يرجى تسجيل الدخول أولاً');
      setLocation('/login');
      return;
    }

     if (confirm('هل تريد تأكيد شراء خطة PRO مقابل $10؟')) {
      localStorage.setItem(`isPro_${user.uid}`, 'true');
      const currentCredits = parseInt(localStorage.getItem(`credits_${user.uid}`) || '0') || 0;
      localStorage.setItem(`credits_${user.uid}`, (currentCredits + 8000).toString());

      alert('مبروك! تم تفعيل خطة PRO وإضافة 8000 رصيد لحسابك.');
      setLocation('/studio');
    }
  };

  return (
    <RootLayout>
      <div className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">اختر خطتك الاحترافية</h1>
            <p className="text-gray-400 text-lg">افتح القوة الكاملة لأفنان 1.2 مع نموذج Max ورصيد ضخم</p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-8 text-right opacity-60 hover:opacity-75 transition">
              <h3 className="text-2xl font-bold mb-2">الخطة المجانية</h3>
              <p className="text-sm text-gray-500 mb-6">مناسبة للتجارب البسيطة</p>
              <div className="text-4xl font-bold mb-8">
                $0 <span className="text-sm font-normal text-gray-600">/ للأبد</span>
              </div>

              <ul className="space-y-4 mb-8 text-sm text-gray-400">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  نموذج Afnan 1.2 Flash
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  300 رصيد مجاني
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  نموذج Afnan 1.2 Max
                </li>
              </ul>

              <button disabled className="w-full py-3 rounded-2xl bg-white/5 text-gray-500 font-bold cursor-not-allowed">
                خطتك الحالية
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-3xl p-8 text-right relative overflow-hidden">
              <div className="absolute top-4 left-4 bg-indigo-600 text-white text-[10px] font-bold px-4 py-1 rounded-full">
                الأكثر شيوعاً
              </div>

              <h3 className="text-2xl font-bold mb-2">خطة PRO / Max</h3>
              <p className="text-sm text-gray-400 mb-6">للمبرمجين المحترفين والشركات</p>
              <div className="text-4xl font-bold mb-8">
                $10 <span className="text-sm font-normal text-gray-500">/ دفعة واحدة</span>
              </div>

              <ul className="space-y-4 mb-8 text-sm text-gray-300">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  الوصول الكامل لنموذج Afnan 1.2 Max
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  8000 رصيد فوري
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  أولوية في معالجة الطلبات
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  دعم فني مخصص
                </li>
              </ul>

              <button
                onClick={handleUpgradeToPro}
                className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20"
              >
                اشترك الآن
              </button>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => setLocation('/studio')}
              className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              العودة للاستوديو
            </button>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
