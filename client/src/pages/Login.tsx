import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import RootLayout from '@/components/RootLayout';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

export default function Login() {
  const [, setLocation] = useLocation();
  const [language, setLanguage] = useState('ar');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { loginWithGoogle, loginWithGithub, loading, error } = useFirebaseAuth();

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLanguage(savedLang);
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLang;
  }, []);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    setShowLangMenu(false);
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      setLocation('/studio');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleGithubLogin = async () => {
    try {
      await loginWithGithub();
      setLocation('/studio');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const texts = {
    ar: {
      title: 'مرحباً بك في Afnan AI',
      subtitle: 'ابدأ رحلتك الإبداعية الآن',
      loginPrompt: 'تسجيل الدخول عبر',
      googleBtn: 'تسجيل الدخول عبر Google',
      githubBtn: 'تسجيل الدخول عبر GitHub',
      xBtn: 'تسجيل الدخول عبر X',
      loading: 'جاري تسجيل الدخول...',
    },
    en: {
      title: 'Welcome to Afnan AI',
      subtitle: 'Start your creative journey now',
      loginPrompt: 'Login with',
      googleBtn: 'Login with Google',
      githubBtn: 'Login with GitHub',
      xBtn: 'Login with X',
      loading: 'Logging in...',
    },
  };

  const t = texts[language as keyof typeof texts] || texts.ar;

  return (
    <RootLayout showHeader={false}>
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-3 border-gray-700 border-t-white rounded-full animate-spin" />
            <p className="mt-4 text-sm text-gray-400">{t.loading}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="fixed top-6 right-6 bg-red-600 text-white px-6 py-3 rounded-lg z-50 max-w-sm">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Logo */}
        <button
          onClick={() => setLocation('/')}
          className="absolute top-6 right-6 hover:opacity-80 transition"
        >
          <img
            src="https://i.postimg.cc/26TTPbxH/grok-image-x6em5fj-edit-96291120058942.png"
            alt="Afnan AI Logo"
            className="w-12 h-12 rounded"
          />
        </button>

        {/* Language Selector */}
        <div className="absolute top-6 left-6 relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-sm font-medium"
          >
            {language === 'ar' ? 'EN' : 'AR'}
          </button>

          {showLangMenu && (
            <div className="absolute top-12 left-0 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden z-50">
              <button
                onClick={() => changeLanguage('ar')}
                className="w-full px-4 py-2 text-left hover:bg-gray-800 transition text-sm"
              >
                العربية
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className="w-full px-4 py-2 text-left hover:bg-gray-800 transition text-sm border-t border-gray-800"
              >
                English
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md w-full">
          <h1 className="text-3xl md:text-4xl font-semibold mb-3 tracking-normal">{t.title}</h1>
          <p className="text-gray-400 text-sm mb-12">{t.subtitle}</p>

          {/* Login Buttons */}
          <div className="w-full space-y-3">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-6">{t.loginPrompt}</p>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-12 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 active:scale-95 transition disabled:opacity-50"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span>{t.googleBtn}</span>
            </button>

            <button
              onClick={handleGithubLogin}
              disabled={loading}
              className="w-full h-12 bg-gray-900 text-white font-semibold rounded-xl flex items-center justify-center hover:bg-gray-800 active:scale-95 transition disabled:opacity-50 border border-gray-700"
            >
              <span>{t.githubBtn}</span>
            </button>

            <button
              disabled={loading}
              className="w-full h-12 bg-black text-white font-semibold rounded-xl flex items-center justify-center hover:bg-gray-900 active:scale-95 transition disabled:opacity-50 border border-gray-700"
            >
              <span>{t.xBtn}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-gray-600 text-center mb-6">
          <p>
            {language === 'ar'
              ? 'بتسجيل الدخول، فإنك توافق على شروط الخدمة وسياسة الخصوصية'
              : 'By logging in, you agree to our Terms of Service and Privacy Policy'}
          </p>
        </div>
      </div>
    </RootLayout>
  );
}
