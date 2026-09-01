import React, { useState } from 'react';
import {
  Volume2,
  Eraser,
  RotateCcw,
  X
} from 'lucide-react';
import { WordAnalysis } from '../types';
import { OFFLINE_ELEMENTARY_DICT } from '../data/curriculumData';
import { playChimeSound } from '../utils/audioUtils';

interface InteractiveReaderProps {
  text: string;
  onTextChange: (newText: string) => void;
  isPlaying: boolean;
  currentWordIndex: number;
  fontSizeLevel: number;
  showSyllables: boolean;
  onSpeakSingleWord: (word: string, rate?: number) => void;
}

export const InteractiveReader: React.FC<InteractiveReaderProps> = ({
  text,
  onTextChange,
  isPlaying,
  currentWordIndex,
  fontSizeLevel,
  showSyllables,
  onSpeakSingleWord,
}) => {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordAnalysis, setWordAnalysis] = useState<WordAnalysis | null>(null);

  // Split text into words
  const words = React.useMemo(() => {
    if (!text || !text.trim()) return [];
    return text.trim().split(/\s+/);
  }, [text]);

  const fontSizeClasses = [
    'text-xl sm:text-2xl leading-relaxed',
    'text-2xl sm:text-3xl leading-loose',
    'text-3xl sm:text-4xl leading-loose font-medium',
  ][fontSizeLevel] || 'text-2xl sm:text-3xl leading-relaxed';

  // Handle clicking a specific word in the text
  const handleWordClick = async (rawWord: string) => {
    const cleanWord = rawWord.toLowerCase().replace(/[^a-z0-9]/gi, '').trim();
    if (!cleanWord) return;

    setSelectedWord(cleanWord);
    playChimeSound('pop');
    onSpeakSingleWord(cleanWord, 0.85);

    // Check offline dictionary first
    const offlineEntry = OFFLINE_ELEMENTARY_DICT[cleanWord];
    if (offlineEntry) {
      setWordAnalysis({
        word: cleanWord,
        syllables: offlineEntry.syllables,
        phonetic: offlineEntry.phonetic,
        koreanPhonetic: `[${cleanWord}]`,
        koreanMeaning: offlineEntry.koreanMeaning,
        elementaryTip: offlineEntry.tip,
        isOffline: true,
      });
      return;
    }

    // Fallback if not in offline dict
    setWordAnalysis({
      word: cleanWord,
      syllables: cleanWord.length > 5 ? cleanWord.slice(0, 3) + '·' + cleanWord.slice(3) : cleanWord,
      phonetic: `/${cleanWord}/`,
      koreanPhonetic: `[${cleanWord}]`,
      koreanMeaning: '',
      elementaryTip: '소리를 듣고 큰 목소리로 천천히 따라 해보세요!',
      isOffline: true,
    });
  };

  const handleClear = () => {
    playChimeSound('click');
    onTextChange('');
    setSelectedWord(null);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-100 shadow-md shadow-amber-900/5 space-y-4">
      {/* 1. English Input Section - Direct input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <span className="text-amber-500 font-black">✏️</span>
            <span>영어 문장 또는 단어 입력</span>
          </label>
          {text && (
            <button
              onClick={handleClear}
              className="text-xs font-semibold text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>지우기</span>
            </button>
          )}
        </div>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => {
            onTextChange(e.target.value);
            setSelectedWord(null);
          }}
          placeholder="여기에 영어 문장이나 단어를 입력하세요."
          className="w-full p-4 rounded-2xl border-2 border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 text-slate-800 text-lg sm:text-xl font-medium outline-none transition-all placeholder:text-slate-300 resize-y"
          autoFocus
        />
      </div>

      {/* 2. Word-by-word Live Highlight Area */}
      {words.length > 0 && (
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">
              💡 입력한 단어를 누르면 개별 발음을 바로 확인할 수 있어요!
            </span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/40 border border-amber-200/70 min-h-[90px] flex flex-col justify-center">
            {/* Synchronized Word Highlighting */}
            <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-2.5 ${fontSizeClasses} text-slate-800 font-sans select-none`}>
              {words.map((rawWord, idx) => {
                const cleanWord = rawWord.toLowerCase().replace(/[^a-z0-9]/gi, '');
                const isCurrent = isPlaying && currentWordIndex === idx;
                const dictItem = OFFLINE_ELEMENTARY_DICT[cleanWord];
                const displayWord = showSyllables && dictItem ? dictItem.syllables : rawWord;

                return (
                  <span
                    key={`${rawWord}-${idx}`}
                    onClick={() => handleWordClick(rawWord)}
                    className={`inline-block px-2.5 py-1 rounded-xl transition-all duration-150 cursor-pointer transform ${
                      isCurrent
                        ? 'bg-amber-400 text-slate-900 font-black shadow-md shadow-amber-400/40 scale-110 ring-4 ring-amber-200 -translate-y-0.5'
                        : selectedWord === cleanWord
                        ? 'bg-sky-100 text-sky-900 font-bold ring-2 ring-sky-300'
                        : 'hover:bg-amber-100 hover:text-amber-900'
                    }`}
                  >
                    {displayWord}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Pop-up Word Card (When a word is clicked) */}
      {selectedWord && wordAnalysis && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-sky-50 to-indigo-50 border-2 border-amber-200 shadow-md relative animate-in fade-in duration-150">
          <button
            onClick={() => setSelectedWord(null)}
            className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                  {wordAnalysis.word}
                </h4>
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-white border border-amber-200 text-amber-800">
                  {wordAnalysis.syllables || wordAnalysis.word}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {wordAnalysis.phonetic}
                </span>
              </div>
            </div>

            {/* Quick Word Audio Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playChimeSound('click');
                  onSpeakSingleWord(wordAnalysis.word, 0.9);
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>표준 발음</span>
              </button>
              <button
                onClick={() => {
                  playChimeSound('click');
                  onSpeakSingleWord(wordAnalysis.word, 0.6);
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 border border-amber-300 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>🐢 느리게</span>
              </button>
            </div>
          </div>

          {/* Elementary Pronunciation Tip */}
          <div className="bg-white/90 p-3 rounded-xl border border-amber-200/60 text-xs text-slate-700 flex items-start gap-2">
            <span className="text-amber-500 font-bold text-sm">💡</span>
            <div>
              <span className="font-bold text-amber-900">발음 팁: </span>
              <span>{wordAnalysis.elementaryTip}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
