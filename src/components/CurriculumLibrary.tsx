import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Play,
  ArrowRight,
  Search,
  CheckCircle2,
  Filter,
  GraduationCap,
  Sparkle
} from 'lucide-react';
import { CURRICULUM_SENTENCES } from '../data/curriculumData';
import { SentenceItem, GradeLevel } from '../types';
import { playChimeSound } from '../utils/audioUtils';

interface CurriculumLibraryProps {
  onSelectSentence: (sentence: SentenceItem, autoPlay?: boolean) => void;
  currentSentenceText: string;
}

export const CurriculumLibrary: React.FC<CurriculumLibraryProps> = ({
  onSelectSentence,
  currentSentenceText,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GradeLevel>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: { id: GradeLevel; label: string; icon: string; desc: string }[] = [
    { id: 'all', label: '전체 보기', icon: '🌟', desc: '모든 초등 예문' },
    { id: 'grade3-4', label: '초등 3~4학년', icon: '🎒', desc: '기초 단어 & 인사' },
    { id: 'grade5-6', label: '초등 5~6학년', icon: '🚀', desc: '실력 표현 & 회화' },
    { id: 'phonics', label: '파닉스 & 라임', icon: '🔤', desc: '소리 규칙 & 잰말' },
    { id: 'daily', label: '교실 & 일상', icon: '🏫', desc: '수업 및 생활 영어' },
    { id: 'story', label: '미니 동화', icon: '📖', desc: '짧고 재미있는 우화' },
  ];

  const filteredSentences = CURRICULUM_SENTENCES.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.gradeLevel === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.korean.includes(searchQuery) ||
      (item.keyWords && item.keyWords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-100 shadow-md shadow-amber-900/5 space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-500" />
            <span>초등 교육과정 추천 예문 보관소</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            교과서 필수 어휘와 파닉스 라임 문장을 클릭하여 바로 들어보세요.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="단어 또는 문장 검색..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-slate-700 outline-none transition-all"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              playChimeSound('click');
              setSelectedCategory(cat.id);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all border ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Sentences List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
        {filteredSentences.map((item) => {
          const isCurrent = currentSentenceText.trim() === item.english.trim();
          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all duration-150 flex flex-col justify-between ${
                isCurrent
                  ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-200 shadow-xs'
                  : 'bg-slate-50/50 hover:bg-white border-slate-200/80 hover:border-amber-200 hover:shadow-xs'
              }`}
            >
              <div className="mb-2">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                    {item.category}
                  </span>
                  {item.phonicsFocus && (
                    <span className="text-[10px] text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded font-semibold truncate max-w-[140px]">
                      {item.phonicsFocus}
                    </span>
                  )}
                </div>
                <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {item.english}
                </p>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {item.korean}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100/80">
                <button
                  onClick={() => {
                    playChimeSound('click');
                    onSelectSentence(item, false);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  불러오기
                </button>
                <button
                  onClick={() => {
                    playChimeSound('pop');
                    onSelectSentence(item, true);
                  }}
                  className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-xs flex items-center gap-1 transition-all"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>바로 듣기</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
