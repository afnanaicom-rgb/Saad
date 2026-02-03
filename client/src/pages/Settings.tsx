import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import RootLayout from '@/components/RootLayout';

export default function Settings() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('afnan_user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setLocation('/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('afnan_user');
    setLocation('/login');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'Afnan ai') {
      alert('نص التأكيد غير صحيح');
      return;
    }

    localStorage.removeItem('afnan_user');
    localStorage.clear();
    alert('تم حذف حسابك نهائياً');
    setLocation('/');
  };

  return (
    <RootLayout>
      <div className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setLocation('/studio')}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold">الإعدادات</h1>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Legal Section */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                القانونية
              </h2>

              <div className="space-y-4 text-sm text-gray-400">
                <details className="cursor-pointer group">
                  <summary className="text-white font-medium py-2 hover:text-gray-300 transition">
                    سياسة الخصوصية
                  </summary>
                  <p className="p-3 bg-white/5 rounded mt-2 leading-relaxed text-gray-400">
                    نحن نحترم خصوصيتك. بياناتك مشفرة ولا يتم مشاركتها مع أطراف ثالثة. يتم تخزين المحادثات لتحسين تجربتك فقط.
                  </p>
                </details>

                <details className="cursor-pointer group">
                  <summary className="text-white font-medium py-2 hover:text-gray-300 transition">
                    اتفاقية المستخدم
                  </summary>
                  <p className="p-3 bg-white/5 rounded mt-2 leading-relaxed text-gray-400">
                    باستخدامك لـ Afnan AI، فإنك توافق على شروط الخدمة الخاصة بنا. يمنع استخدام الخدمة في أغراض غير قانونية.
                  </p>
                </details>

                <details className="cursor-pointer group">
                  <summary className="text-white font-medium py-2 hover:text-gray-300 transition">
                    من نحن
                  </summary>
                  <p className="p-3 bg-white/5 rounded mt-2 leading-relaxed text-gray-400">
                    Afnan AI هو مساعدك الذكي المتطور، يهدف لتقديم تجربة ذكاء اصطناعي فريدة باللغة العربية.
                  </p>
                </details>
              </div>
            </div>

            {/* Appearance Section */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                المظهر
              </h2>

              <div className="flex items-center justify-between">
                <span className="text-white">الوضع الليلي</span>
                <div className="w-12 h-6 bg-indigo-600 rounded-full relative p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1 transition-all" />
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-900/20 border border-red-900/50 rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4 text-red-400 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                منطقة الخطر
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full text-right p-3 rounded-lg hover:bg-white/5 transition flex items-center justify-between text-white"
                >
                  <span>تسجيل الخروج</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full text-right p-3 rounded-lg hover:bg-red-500/10 text-red-400 transition flex items-center justify-between"
                >
                  <span>حذف الحساب نهائياً</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16H5v-4m0 0V8m0 4v4h8m0 0V8m0 4v4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold mb-4">تسجيل الخروج؟</h3>
            <p className="text-gray-400 mb-6">هل أنت متأكد أنك تريد تسجيل الخروج؟</p>
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="flex-1 bg-white text-black font-bold py-2 rounded-lg hover:bg-gray-100 transition"
              >
                خروج
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-white/10 py-2 rounded-lg hover:bg-white/20 transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold mb-2 text-red-500">حذف الحساب!</h3>
            <p className="text-gray-400 text-sm mb-6">
              سيتم حذف كافة بياناتك. يرجى كتابة <span className="text-white font-bold">Afnan ai</span> للتأكيد:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Afnan ai"
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 mb-6 text-center focus:border-red-500 outline-none transition text-white"
            />
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 font-bold py-2 rounded-lg hover:bg-red-700 transition"
              >
                حذف نهائي
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-white/10 py-2 rounded-lg hover:bg-white/20 transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </RootLayout>
  );
}
