import React from 'react';
import { Volume2, Type } from 'lucide-react';

interface HeaderProps {
  fontSizeLevel: number; // 0: normal, 1: large, 2: extra large
  onChangeFontSize: (level: number) => void;
  showSyllables: boolean;
  onToggleSyllables: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  fontSizeLevel,
  onChangeFontSize,
  showSyllables,
  onToggleSyllables,
}) => {
  return (
    <header className="bg-white border-b border-amber-100/80 shadow-xs sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-300 flex items-center justify-center shadow-md shadow-amber-200/50 text-white">
            <Volume2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight flex items-center gap-1.5 font-['Fredoka','Nunito',sans-serif]">
              <span>초등 영어 발음 TTS</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                속도 조절 학습
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              영어 문장/단어 직접 입력 &middot; 속도 조절 듣기
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Font Size Toggle */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60" title="글자 크기 조절">
            <button
              onClick={() => onChangeFontSize(Math.max(0, fontSizeLevel - 1))}
              disabled={fontSizeLevel === 0}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
                fontSizeLevel === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-white'
              }`}
            >
              A-
            </button>
            <span className="px-1.5 text-xs text-slate-400 font-semibold select-none">
              {fontSizeLevel === 0 ? '기본' : fontSizeLevel === 1 ? '크게' : '특대'}
            </span>
            <button
              onClick={() => onChangeFontSize(Math.min(2, fontSizeLevel + 1))}
              disabled={fontSizeLevel === 2}
              className={`px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
                fontSizeLevel === 2 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-white'
              }`}
            >
              A+
            </button>
          </div>

          {/* Syllables Button */}
          <button
            onClick={onToggleSyllables}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              showSyllables
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="음절 구분점(·) 켜기/끄기"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">음절 분해</span>
            <span className="text-[10px] opacity-80">{showSyllables ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
