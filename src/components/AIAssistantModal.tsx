import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  BookOpen,
  CheckCircle2,
  Play,
  Lightbulb,
  Plus
} from 'lucide-react';
import { SentenceItem } from '../types';
import { playChimeSound } from '../utils/audioUtils';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySentence: (sentence: SentenceItem, autoPlay?: boolean) => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplySentence,
}) => {
  const [topic, setTopic] = useState<string>('동물원과 귀여운 동물들');
  const [grade, setGrade] = useState<string>('3-4');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedSentences, setGeneratedSentences] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const topicsList = [
    '동물원과 귀여운 동물들',
    '맛있는 음식과 과일',
    '즐거운 학교생활과 친구',
    '우주와 별 탐험',
    '신나는 주말과 가족 여행',
    '내가 좋아하는 취미와 스포츠',
  ];

  const handleGenerate = async (targetTopic: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    playChimeSound('click');

    try {
      const res = await fetch('/api/generate-sentences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetTopic || topic,
          grade,
          count: 3,
        }),
      });

      if (!res.ok) {
        throw new Error('문장 생성에 실패했습니다.');
      }

      const data = await res.json();
      setGeneratedSentences(data.sentences || []);
      playChimeSound('success');
    } catch (e: any) {
      setErrorMsg(e.message || '문장 생성 중 문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border-2 border-indigo-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-['Fredoka',sans-serif]">
              초등 맞춤 AI 영어 문장 생성기
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              원하는 주제를 고르면 초등학생 수준에 딱 맞는 문장을 만들어 드려요.
            </p>
          </div>
        </div>

        {/* Grade Level Selection */}
        <div className="my-4">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            학년 수준 선택:
          </label>
          <div className="flex gap-2">
            {[
              { id: '3-4', label: '🎒 초등 3~4학년 (기초 어휘)' },
              { id: '5-6', label: '🚀 초등 5~6학년 (심화 표현)' },
            ].map((g) => (
              <button
                key={g.id}
                onClick={() => setGrade(g.id)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                  grade === g.id
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Topic Chips */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            인기 학습 주제 추천:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {topicsList.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTopic(t);
                  handleGenerate(t);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                  topic === t
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="주제를 직접 입력해 보세요 (예: 공룡 탐험, 크리스마스 파티)"
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white text-slate-800 outline-none"
          />
          <button
            onClick={() => handleGenerate(topic)}
            disabled={isLoading || !topic.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>생성하기</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-medium border border-rose-200 mb-3">
            {errorMsg}
          </div>
        )}

        {/* Generated Sentences List */}
        {generatedSentences.length > 0 && (
          <div className="space-y-2.5 mt-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>생성된 맞춤 영어 문장 ({generatedSentences.length}개)</span>
            </h4>
            {generatedSentences.map((sent, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 hover:border-indigo-300 transition-colors flex flex-col justify-between gap-2"
              >
                <div>
                  <p className="text-sm sm:text-base font-bold text-slate-900">
                    {sent.english}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {sent.korean}
                  </p>
                </div>
                <div className="flex justify-end gap-1.5 pt-1">
                  <button
                    onClick={() => {
                      playChimeSound('click');
                      onApplySentence({
                        id: `ai-${Date.now()}-${idx}`,
                        english: sent.english,
                        korean: sent.korean,
                        category: topic,
                        gradeLevel: grade === '3-4' ? 'grade3-4' : 'grade5-6',
                      }, false);
                      onClose();
                    }}
                    className="px-2.5 py-1 text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                  >
                    학습창에 넣기
                  </button>
                  <button
                    onClick={() => {
                      playChimeSound('pop');
                      onApplySentence({
                        id: `ai-${Date.now()}-${idx}`,
                        english: sent.english,
                        korean: sent.korean,
                        category: topic,
                        gradeLevel: grade === '3-4' ? 'grade3-4' : 'grade5-6',
                      }, true);
                      onClose();
                    }}
                    className="px-3 py-1 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>바로 듣기</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
