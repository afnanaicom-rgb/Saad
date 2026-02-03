import React, { useState } from 'react';
import { useLocation } from 'wouter';
import RootLayout from '@/components/RootLayout';

export default function Home() {
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response:', data.output);
        setMessage('');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <RootLayout>
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-3xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-light mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
              Afnan AI
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              مساعدك الذكي المتطور - استمتع بتجربة ذكاء اصطناعي فريدة باللغة العربية
            </p>
          </div>

          {/* Chat Input */}
          <div className="mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-3 flex items-center gap-3">
              <button
                onClick={handleSend}
                disabled={isLoading || !message.trim()}
                className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:opacity-80 transition disabled:opacity-50 flex-shrink-0"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 text-black animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-9m0 0l-9-9m9 9H3" />
                  </svg>
                )}
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="كيف يمكن لأفنان مساعدتك اليوم؟"
                className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-right"
              />
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mb-8">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-32 h-24 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-gray-500 transition cursor-pointer overflow-hidden"
                >
                  <img
                    src={`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80&crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8YXJ0fHx8fHx8MTY4MzAyODk5Ng&ixlib=rb-4.0.3`}
                    alt={`Gallery ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div className="flex justify-center gap-2 mb-12">
            <button className="px-3 py-1 text-xs rounded-full border border-white/20 text-gray-400 hover:text-white transition">
              Afnan 1.2 Flash
            </button>
            <button className="px-3 py-1 text-xs rounded-full border border-white text-white">
              Afnan 1.2 Max
            </button>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-4 gap-8 text-center border-t border-gray-800 pt-12">
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wider mb-3">الأدوات</p>
              <button onClick={() => setLocation('/studio')} className="text-sm text-gray-400 hover:text-white transition">
                الاستوديو
              </button>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wider mb-3">الخطط</p>
              <button onClick={() => setLocation('/pro')} className="text-sm text-gray-400 hover:text-white transition">
                ترقية PRO
              </button>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wider mb-3">القانونية</p>
              <button onClick={() => setLocation('/privacy')} className="text-sm text-gray-400 hover:text-white transition">
                الخصوصية
              </button>
            </div>
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-wider mb-3">الحساب</p>
              <button onClick={() => setLocation('/login')} className="text-sm text-gray-400 hover:text-white transition">
                تسجيل الدخول
              </button>
            </div>
          </div>

          {/* Verified Badge */}
          <div className="flex items-center justify-center gap-2 mt-12 text-xs text-gray-600">
            <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center text-black text-[8px] font-bold">✓</div>
            <span>Verified by Afnan AI</span>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
