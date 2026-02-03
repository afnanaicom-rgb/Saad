import React, { useState } from 'react';

interface ModelSelectorProps {
  onModelChange: (model: 'flash' | 'max') => void;
  credits: number;
  isPro: boolean;
  onUpgrade?: () => void;
}

export default function ModelSelector({
  onModelChange,
  credits,
  isPro,
  onUpgrade,
}: ModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState<'flash' | 'max'>('flash');

  const handleModelChange = (model: 'flash' | 'max') => {
    if (model === 'max' && !isPro) {
      if (onUpgrade) onUpgrade();
      return;
    }
    setSelectedModel(model);
    onModelChange(model);
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-2xl border border-gray-800">
      {/* Flash Model */}
      <button
        onClick={() => handleModelChange('flash')}
        className={`flex-1 py-2 px-3 rounded-xl transition font-medium text-sm flex items-center justify-between ${
          selectedModel === 'flash'
            ? 'bg-blue-600 text-white'
            : 'bg-white/5 text-gray-400 hover:bg-white/10'
        }`}
      >
        <span>Afnan 1.2 Flash</span>
        <span className="text-xs bg-white/10 px-2 py-1 rounded">150/يوم</span>
      </button>

      {/* Max Model */}
      <button
        onClick={() => handleModelChange('max')}
        disabled={!isPro}
        className={`flex-1 py-2 px-3 rounded-xl transition font-medium text-sm flex items-center justify-between ${
          selectedModel === 'max' && isPro
            ? 'bg-purple-600 text-white'
            : isPro
            ? 'bg-white/5 text-gray-400 hover:bg-white/10'
            : 'bg-white/5 text-gray-600 cursor-not-allowed opacity-50'
        }`}
      >
        <span>Afnan 1.2 Max</span>
        {!isPro ? (
          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">
            ترقية
          </span>
        ) : (
          <span className="text-xs bg-purple-500/20 px-2 py-1 rounded">
            {credits.toLocaleString()}
          </span>
        )}
      </button>

      {/* Credits Display */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl">
        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-sm font-bold text-white">{credits}</span>
      </div>
    </div>
  );
}
