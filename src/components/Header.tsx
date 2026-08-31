import React from 'react';
import { Volume2, Sparkles, BookOpen, Type, Sparkle, HelpCircle, Bookmark } from 'lucide-react';

interface HeaderProps {
  fontSizeLevel: number; // 0: normal, 1: large, 2: extra large
  onChangeFontSize: (level: number) => void;
  showSyllables: boolean;
  onToggleSyllables: () => void;
  showKorean: boolean;
  onToggleKorean: () => void;
  savedCount: number;
  onOpenSavedDrawer: () => void;
  onOpenAIAssistant: () => void;
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  fontSizeLevel,
  onChangeFontSize,
  showSyllables,
  onToggleSyllables,
  showKorean,
  onToggleKorean,
  savedCount,
  onOpenSavedDrawer,
  onOpenAIAssistant,
  onOpenGuide,
}) => {
  return (
    <header className="bg-white border-b border-amber-100/80 shadow-xs sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-300 flex items-center justify-center shadow-md shadow-amber-200/50 text-white transform transition-transform hover:scale-105">
            <Volume2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight flex items-center gap-1.5 font-['Fredoka','Nunito',sans-serif]">
                <span>초등 영어 발음 친구</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                  TTS 학습기
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              속도 조절 &middot; 단어별 발음 &middot; 파닉스 분해 &middot; 따라 읽기
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

          {/* Korean Translation Toggle */}
          <button
            onClick={onToggleKorean}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              showKorean
                ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="한글 뜻 보기/숨기기"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">한글 뜻</span>
            <span className="text-[10px] opacity-80">{showKorean ? 'ON' : 'OFF'}</span>
          </button>

          {/* Saved Vocabulary Drawer */}
          <button
            onClick={onOpenSavedDrawer}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all relative"
            title="보관한 단어장"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">단어장</span>
            {savedCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          {/* AI English Assistant */}
          <button
            onClick={onOpenAIAssistant}
            className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r from-violet-500 to-indigo-600 text-white border border-indigo-600 shadow-xs hover:opacity-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI 선생님</span>
            <span className="sm:hidden">AI</span>
          </button>

          {/* Guide Help */}
          <button
            onClick={onOpenGuide}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            title="사용 방법 안내"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
