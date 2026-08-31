import React from 'react';
import { HelpCircle, X, Volume2, Gauge, BookOpen, Mic, Sparkles } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-2 border-amber-200 relative max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-['Fredoka',sans-serif]">
              초등 영어 발음 친구 사용 방법
            </h3>
            <p className="text-xs text-slate-500">
              선생님과 학생을 위한 스마트 TTS 학습 가이드
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <div className="w-7 h-7 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5 flex items-center gap-1">
                <Gauge className="w-4 h-4 text-amber-600" />
                <span>속도 조절 (0.5x ~ 1.5x)</span>
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                거북이(0.5x), 고슴도치(0.75x), 토끼(1.25x), 로켓(1.5x) 버튼을 눌러 수준에 맞게 속도를 조절하세요. 처음 배울 땐 <strong>0.75x(고슴도치)</strong>로 따라 말하는 것을 추천합니다!
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-sky-50/70 border border-sky-200/80">
            <div className="w-7 h-7 rounded-xl bg-sky-500 text-white font-black flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5 flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>단어 콕! 개별 발음 & 파닉스 팁</span>
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                문장 안의 어떤 단어든 누르면 그 단어만 또박또박 <strong>느리게</strong> 들어볼 수 있고, <strong>음절 분해(el·e·phant)</strong>와 초등 발음 꿀팁이 열려요.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
            <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5 flex items-center gap-1">
                <Mic className="w-4 h-4 text-emerald-600" />
                <span>따라 말하기 & 발음 채점 도전!</span>
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                마이크 버튼을 눌러 원어민 소리를 듣고 그대로 말해보세요. 정확도 점수와 별 3개(⭐⭐⭐), 축하 효과음과 함께 내가 맞춘 단어를 색깔별로 확인할 수 있어요.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-violet-50/70 border border-violet-200/80">
            <div className="w-7 h-7 rounded-xl bg-violet-500 text-white font-black flex items-center justify-center shrink-0">
              4
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-violet-600" />
                <span>AI 선생님 맞춤 문장 생성</span>
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                'AI 선생님' 버튼을 누르고 원하는 주제(동물, 우주, 학교 등)를 선택하면 초등학교 학년 수준에 꼭 맞는 영어 문장을 즉시 생성할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-amber-500/20 transition-all"
          >
            확인했어요! 신나게 영어 연습 시작하기 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
