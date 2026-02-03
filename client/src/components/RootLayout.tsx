import React from 'react';
import { useLocation } from 'wouter';

interface RootLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

export default function RootLayout({ children, showHeader = true }: RootLayoutProps) {
  const [, setLocation] = useLocation();

  const navigate = (path: string) => {
    setLocation(path);
  };

  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      {showHeader && (
        <header className="fixed top-0 left-0 right-0 z-30 flex justify-between items-center px-6 py-4 bg-black/40 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <img 
                src="https://i.postimg.cc/26TTPbxH/grok-image-x6em5fj-edit-96291120058942.png" 
                alt="Afnan Logo" 
                className="w-8 h-8 rounded"
              />
              <span className="text-lg font-bold">Afnan AI</span>
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => navigate('/')} className="text-sm hover:text-gray-300 transition">الرئيسية</button>
            <button onClick={() => navigate('/studio')} className="text-sm hover:text-gray-300 transition">الاستوديو</button>
            <button onClick={() => navigate('/pro')} className="text-sm hover:text-gray-300 transition">PRO</button>
            <button onClick={() => navigate('/privacy')} className="text-sm hover:text-gray-300 transition">الخصوصية</button>
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition"
            >
              Login
            </button>
          </nav>

          <button className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>
      )}

      <main className={showHeader ? 'pt-20' : ''}>
        {children}
      </main>
    </div>
  );
}
