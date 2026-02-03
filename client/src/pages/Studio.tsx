import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import RootLayout from '@/components/RootLayout';
import ModelSelector from '@/components/ModelSelector';
import ImageUploader from '@/components/ImageUploader';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  model?: 'flash' | 'max';
}

export default function Studio() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'flash' | 'max'>('flash');
  const [credits, setCredits] = useState(150);
  const [isPro, setIsPro] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { user, loading: authLoading } = useFirebaseAuth();

  useEffect(() => {
    if (!user && !authLoading) {
      setLocation('/login');
    }
  }, [user, authLoading]);

  const handleImageSelect = (file: File) => {
    setUploadedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (blob: Blob) => {
    const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
    handleImageSelect(file);
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !uploadedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      model: selectedModel,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setUploadedImage(null);
    setImagePreview(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', input);
      formData.append('model', selectedModel);
      if (uploadedImage) {
        formData.append('image', uploadedImage);
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: data.output,
          timestamp: new Date(),
          model: selectedModel,
        };
        setMessages((prev) => [...prev, aiMessage]);

        // Update credits
        const creditsUsed = selectedModel === 'flash' ? 10 : 50;
        setCredits((prev) => Math.max(0, prev - creditsUsed));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // TODO: Implement logout
      setLocation('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (authLoading) {
    return (
      <RootLayout showHeader={false}>
        <div className="flex items-center justify-center h-screen">
          <div className="w-10 h-10 border-3 border-gray-700 border-t-white rounded-full animate-spin" />
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout showHeader={false}>
      <div className="flex h-screen bg-black">
        {/* Sidebar */}
        <aside
          className={`fixed right-0 top-0 h-full w-80 bg-gray-950 border-l border-gray-800 z-40 transform transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          } md:relative md:translate-x-0`}
        >
          {/* Sidebar Header */}
          <div className="p-6 flex flex-col gap-4 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg text-white">المكتبة</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="بحث في المحادثات..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pr-9 pl-3 text-xs text-white focus:outline-none focus:border-white/20"
              />
              <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 hide-scrollbar" />

          {/* Upgrade Box */}
          <div className="px-4 mb-4">
            <button
              onClick={() => setLocation('/pro')}
              className="w-full p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 hover:opacity-90 transition shadow-lg shadow-indigo-500/20"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">الترقية لـ PRO</span>
                <span className="text-[10px] text-yellow-300">👑</span>
              </div>
              <p className="text-[10px] text-indigo-100">افتح نموذج Max واحصل على 10000 رصيد</p>
            </button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-white/5 bg-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={user?.photoURL || 'https://via.placeholder.com/40'}
                  alt="User"
                  className="w-10 h-10 rounded-full border border-white/10"
                />
                <div className="flex flex-col max-w-[120px]">
                  <span className="text-sm font-bold text-white truncate">{user?.displayName || 'User'}</span>
                  <span className="text-[10px] text-gray-500 truncate">{user?.email || 'user@example.com'}</span>
                </div>
              </div>
              <button
                onClick={() => setLocation('/settings')}
                className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition text-gray-400"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="fixed top-0 left-0 right-0 md:left-80 z-30 flex justify-between items-center px-6 py-4 border-b border-white/10 bg-black/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition md:hidden"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <img
                  src="https://i.postimg.cc/26TTPbxH/grok-image-x6em5fj-edit-96291120058942.png"
                  alt="Afnan Logo"
                  className="w-6 h-6"
                />
                <span className="text-sm font-bold text-white">Afnan AI</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.reload()}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={() => setLocation('/pro')}
                className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold hover:bg-yellow-500/20 transition"
              >
                PRO
              </button>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto pt-20 pb-32 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-96 text-gray-500">
                  <p>ابدأ محادثة جديدة...</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-gray-900 border border-gray-800 text-white'
                          : 'bg-transparent text-gray-300'
                      }`}
                    >
                      {msg.content}
                      {msg.model && (
                        <p className="text-xs text-gray-500 mt-2">
                          {msg.model === 'flash' ? 'Afnan 1.2 Flash' : 'Afnan 1.2 Max'}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-end">
                  <div className="bg-gray-900 border border-gray-800 px-4 py-3 rounded-2xl">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="fixed bottom-0 left-0 right-0 md:left-80 bg-gradient-to-t from-black via-black to-transparent p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              {/* Model Selector */}
              <div className="mb-4">
                <ModelSelector
                  onModelChange={setSelectedModel}
                  credits={credits}
                  isPro={isPro}
                  onUpgrade={() => setLocation('/pro')}
                />
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4 relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-xs h-32 rounded-lg object-cover border border-gray-700"
                  />
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Input */}
              <div className="glass-input-container rounded-3xl p-3 flex items-center gap-3">
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || (!input.trim() && !uploadedImage)}
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

                <ImageUploader
                  onImageSelect={handleImageSelect}
                  onCameraCapture={handleCameraCapture}
                  disabled={isLoading}
                />

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-right"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/80 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </RootLayout>
  );
}
