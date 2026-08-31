import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Bookmark,
  Sparkles,
  RotateCcw,
  BookOpen,
  Eraser,
  Copy,
  Check,
  Type,
  HelpCircle,
  X,
  Volume1,
  Mic,
  MessageSquareQuote
} from 'lucide-react';
import { WordAnalysis, SavedVocabularyItem } from '../types';
import { OFFLINE_ELEMENTARY_DICT } from '../data/curriculumData';
import { playChimeSound } from '../utils/audioUtils';

interface InteractiveReaderProps {
  text: string;
  onTextChange: (newText: string) => void;
  koreanTranslation: string;
  onKoreanChange: (korean: string) => void;
  isPlaying: boolean;
  currentWordIndex: number;
  fontSizeLevel: number;
  showSyllables: boolean;
  showKorean: boolean;
  onSpeakSingleWord: (word: string, rate?: number) => void;
  onSaveWord: (word: string, meaning: string) => void;
  savedWords: SavedVocabularyItem[];
  onOpenWordPractice?: (word: string) => void;
}

export const InteractiveReader: React.FC<InteractiveReaderProps> = ({
  text,
  onTextChange,
  koreanTranslation,
  onKoreanChange,
  isPlaying,
  currentWordIndex,
  fontSizeLevel,
  showSyllables,
  showKorean,
  onSpeakSingleWord,
  onSaveWord,
  savedWords,
  onOpenWordPractice,
}) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordAnalysis, setWordAnalysis] = useState<WordAnalysis | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Split text into words and punctuation
  const words = React.useMemo(() => {
    if (!text.trim()) return [];
    return text.trim().split(/\s+/);
  }, [text]);

  const fontSizeClasses = [
    'text-xl sm:text-2xl leading-relaxed',
    'text-2xl sm:text-3xl leading-loose',
    'text-3xl sm:text-4xl leading-loose font-medium',
  ][fontSizeLevel] || 'text-2xl sm:text-3xl leading-relaxed';

  // Handle clicking a specific word in the text block
  const handleWordClick = async (rawWord: string) => {
    const cleanWord = rawWord.toLowerCase().replace(/[^a-z0-9]/gi, '').trim();
    if (!cleanWord) return;

    setSelectedWord(cleanWord);
    playChimeSound('pop');
    onSpeakSingleWord(cleanWord, 0.85);

    // Check offline dictionary first for instant response
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

    // Try server API for dynamic word analysis
    setIsLoadingAnalysis(true);
    try {
      const res = await fetch('/api/analyze-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: cleanWord, sentence: text }),
      });
      if (res.ok) {
        const data = await res.json();
        setWordAnalysis(data);
      } else {
        throw new Error('API failed');
      }
    } catch (e) {
      // Fallback simple breakdown
      setWordAnalysis({
        word: cleanWord,
        syllables: cleanWord.length > 5 ? cleanWord.slice(0, 3) + '·' + cleanWord.slice(3) : cleanWord,
        phonetic: `/${cleanWord}/`,
        koreanPhonetic: `[${cleanWord}]`,
        koreanMeaning: '영어 단어',
        elementaryTip: '소리를 잘 듣고 천천히 큰 목소리로 따라 해보세요!',
        isOffline: true,
      });
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    playChimeSound('click');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    playChimeSound('click');
    onTextChange('');
    onKoreanChange('');
    setSelectedWord(null);
  };

  const isWordSaved = (w: string) => {
    const clean = w.toLowerCase().replace(/[^a-z0-9]/gi, '');
    return savedWords.some((item) => item.english.toLowerCase() === clean);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-100/90 shadow-md shadow-amber-900/5 relative">
      {/* Top action bar: Edit Mode vs Reading Mode Toggle */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-900 font-bold text-xs border border-amber-200/80">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>영어 문장 읽기판</span>
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            단어를 누르면 개별 발음과 파닉스 설명이 나와요!
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              isEditMode
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            {isEditMode ? '완료 (읽기 모드로)' : '직접 입력 / 수정'}
          </button>

          {text && (
            <>
              <button
                onClick={handleCopy}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                title="복사하기"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? '복사됨' : '복사'}</span>
              </button>
              <button
                onClick={handleClear}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                title="지우기"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">지우기</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {isEditMode ? (
        /* Edit Mode: Textareas for English & Korean */
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              영어로 읽고 싶은 문장이나 단어를 입력하세요:
            </label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="예: Good morning, everyone! I like playing soccer with my best friends."
              className="w-full p-4 rounded-2xl border-2 border-amber-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 text-slate-800 text-lg font-medium outline-none transition-all placeholder:text-slate-300 resize-y"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              한글 뜻 (선택 사항):
            </label>
            <input
              type="text"
              value={koreanTranslation}
              onChange={(e) => onKoreanChange(e.target.value)}
              placeholder="예: 좋은 아침이에요, 여러분! 나는 가장 친한 친구들과 축구하는 것을 좋아해요."
              className="w-full p-3 rounded-xl border border-slate-200 focus:border-amber-400 text-sm text-slate-700 outline-none"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setIsEditMode(false)}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              입력 완료하고 듣기 🎧
            </button>
          </div>
        </div>
      ) : (
        /* Interactive Reader Display Mode with Word Highlights */
        <div className="min-h-[160px] flex flex-col justify-center">
          {words.length === 0 ? (
            <div className="text-center py-10 px-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-3">
                <Volume2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-700 mb-1">읽을 영어 문장이 비어있어요</h3>
              <p className="text-xs text-slate-500 mb-4">
                직접 영어를 입력하거나 아래의 초등 필수 표현 목록에서 골라보세요!
              </p>
              <button
                onClick={() => setIsEditMode(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
              >
                ✏️ 영어 입력하기
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Interactive Word Flow */}
              <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-2.5 ${fontSizeClasses} text-slate-800 font-sans select-none`}>
                {words.map((rawWord, idx) => {
                  const cleanWord = rawWord.toLowerCase().replace(/[^a-z0-9]/gi, '');
                  const isCurrent = isPlaying && currentWordIndex === idx;
                  const dictItem = OFFLINE_ELEMENTARY_DICT[cleanWord];
                  const displayWord = showSyllables && dictItem ? dictItem.syllables : rawWord;
                  const isSaved = isWordSaved(cleanWord);

                  return (
                    <span
                      key={`${rawWord}-${idx}`}
                      onClick={() => handleWordClick(rawWord)}
                      className={`inline-block px-2 py-1 rounded-xl transition-all duration-150 cursor-pointer transform ${
                        isCurrent
                          ? 'bg-amber-400 text-slate-900 font-black shadow-md shadow-amber-400/40 scale-110 ring-4 ring-amber-200/80 -translate-y-0.5'
                          : selectedWord === cleanWord
                          ? 'bg-sky-100 text-sky-900 font-bold ring-2 ring-sky-300'
                          : 'hover:bg-amber-50 hover:text-amber-900 hover:shadow-xs'
                      }`}
                      title="클릭하여 단어 발음 및 파닉스 확인"
                    >
                      {displayWord}
                      {isSaved && (
                        <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full ml-1 align-top" />
                      )}
                    </span>
                  );
                })}
              </div>

              {/* Korean Translation Display (if available and toggled ON) */}
              {showKorean && koreanTranslation && (
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-start gap-2 text-slate-600 bg-slate-50/70 p-3 rounded-2xl">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 whitespace-nowrap">
                    한글 뜻
                  </span>
                  <p className="text-sm sm:text-base font-medium text-slate-700 leading-relaxed">
                    {koreanTranslation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Pop-up Word Inspection Card (When a word is clicked) */}
      {selectedWord && wordAnalysis && (
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-sky-50/70 to-indigo-50/70 border-2 border-amber-200/90 shadow-lg relative animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => setSelectedWord(null)}
            className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                  {wordAnalysis.word}
                </h4>
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-white border border-amber-200 text-amber-800 shadow-xs">
                  {wordAnalysis.syllables || wordAnalysis.word}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {wordAnalysis.phonetic}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-700 mt-1">
                뜻: <span className="text-sky-700 font-extrabold">{wordAnalysis.koreanMeaning}</span>
              </p>
            </div>

            {/* Quick Word Audio Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playChimeSound('click');
                  onSpeakSingleWord(wordAnalysis.word, 1.0);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>표준 발음</span>
              </button>
              <button
                onClick={() => {
                  playChimeSound('click');
                  onSpeakSingleWord(wordAnalysis.word, 0.55);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 border border-amber-300/70 transition-all"
                title="0.55x 초벌 느리게 듣기"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>🐢 느리게</span>
              </button>
              <button
                onClick={() => {
                  playChimeSound('star');
                  onSaveWord(wordAnalysis.word, wordAnalysis.koreanMeaning);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all ${
                  isWordSaved(wordAnalysis.word)
                    ? 'bg-amber-400 text-white border-amber-500'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isWordSaved(wordAnalysis.word) ? '저장됨' : '단어장에 저장'}</span>
              </button>
            </div>
          </div>

          {/* Elementary Phonics Tip Box */}
          <div className="bg-white/90 p-3 rounded-xl border border-amber-200/60 text-xs text-slate-700 flex items-start gap-2">
            <span className="text-amber-500 font-bold text-sm">💡</span>
            <div>
              <span className="font-bold text-amber-900">초등 발음 꿀팁: </span>
              <span>{wordAnalysis.elementaryTip}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
