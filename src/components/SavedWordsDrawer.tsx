import React from 'react';
import {
  Bookmark,
  X,
  Volume2,
  Trash2,
  Download,
  BookOpen,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { SavedVocabularyItem } from '../types';
import { playChimeSound } from '../utils/audioUtils';

interface SavedWordsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedWords: SavedVocabularyItem[];
  onRemoveWord: (id: string) => void;
  onSpeakWord: (word: string, rate?: number) => void;
  onLoadIntoReader: (word: string, meaning: string) => void;
}

export const SavedWordsDrawer: React.FC<SavedWordsDrawerProps> = ({
  isOpen,
  onClose,
  savedWords,
  onRemoveWord,
  onSpeakWord,
  onLoadIntoReader,
}) => {
  if (!isOpen) return null;

  const handleExportText = () => {
    if (savedWords.length === 0) return;
    const content = savedWords
      .map((item, idx) => `${idx + 1}. ${item.english} - ${item.korean}`)
      .join('\n');
    const blob = new Blob([`[나만의 초등 영어 단어장]\n\n${content}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `초등영어단어장_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    playChimeSound('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white h-full max-w-md w-full p-5 sm:p-6 shadow-2xl flex flex-col justify-between border-l border-amber-200 animate-in slide-in-from-right duration-250">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Bookmark className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  내 단어 보관함 ({savedWords.length}개)
                </h3>
                <p className="text-xs text-slate-500">
                  저장한 단어를 반복해서 듣고 복습해요.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Bar */}
          {savedWords.length > 0 && (
            <div className="flex items-center justify-between mt-3 mb-2 text-xs">
              <span className="text-slate-400 font-medium">단어 목록</span>
              <button
                onClick={handleExportText}
                className="flex items-center gap-1 text-sky-700 hover:text-sky-900 font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>텍스트 파일로 저장</span>
              </button>
            </div>
          )}
        </div>

        {/* Word Items List */}
        <div className="flex-1 overflow-y-auto my-3 space-y-2.5 pr-1">
          {savedWords.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-2">
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">보관된 단어가 없습니다</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                문장에서 모르는 단어를 누른 후<br />
                <span className="text-amber-600 font-semibold">'단어장에 저장'</span>을 눌러보세요!
              </p>
            </div>
          ) : (
            savedWords.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 hover:border-amber-300 hover:bg-amber-50/80 transition-all flex items-center justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-extrabold text-slate-900 truncate">
                    {item.english}
                  </h4>
                  <p className="text-xs text-slate-600 truncate font-medium">
                    {item.korean}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      playChimeSound('click');
                      onSpeakWord(item.english, 1.0);
                    }}
                    className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-colors"
                    title="표준 발음 듣기"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      playChimeSound('click');
                      onSpeakWord(item.english, 0.6);
                    }}
                    className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300/70 transition-colors text-[10px] font-bold"
                    title="천천히 듣기"
                  >
                    🐢
                  </button>
                  <button
                    onClick={() => {
                      playChimeSound('pop');
                      onLoadIntoReader(item.english, item.korean);
                      onClose();
                    }}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors text-xs font-bold"
                    title="읽기판에 크게 띄우기"
                  >
                    보기
                  </button>
                  <button
                    onClick={() => {
                      playChimeSound('click');
                      onRemoveWord(item.id);
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
