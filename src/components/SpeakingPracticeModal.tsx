import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
  X,
  Star,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RecognitionResult } from '../types';
import { startVoiceRecognition } from '../utils/speechSynthesisManager';
import { playChimeSound } from '../utils/audioUtils';

interface SpeakingPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSentence: string;
  targetKorean: string;
  onPlayTarget: (rate?: number) => void;
}

export const SpeakingPracticeModal: React.FC<SpeakingPracticeModalProps> = ({
  isOpen,
  onClose,
  targetSentence,
  targetKorean,
  onPlayTarget,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recognizerController, setRecognizerController] = useState<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (recognizerController) {
        recognizerController.stop();
      }
      setIsListening(false);
      setRecognitionResult(null);
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartSpeaking = () => {
    setErrorMessage(null);
    setRecognitionResult(null);
    setIsListening(true);
    playChimeSound('click');

    const controller = startVoiceRecognition({
      targetText: targetSentence,
      onResult: (res) => {
        setRecognitionResult(res);
        setIsListening(false);

        if (res.stars >= 3) {
          playChimeSound('fanfare');
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } else if (res.stars >= 2) {
          playChimeSound('star');
        } else {
          playChimeSound('success');
        }
      },
      onError: (err) => {
        setErrorMessage(err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    setRecognizerController(controller);
  };

  const handleStopSpeaking = () => {
    if (recognizerController) {
      recognizerController.stop();
    }
    setIsListening(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border-2 border-amber-200 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="text-center mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-2">
            <Award className="w-4 h-4 text-sky-600" />
            <span>초등 발음 챌린지 (따라 말하기)</span>
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Fredoka',sans-serif]">
            원어민 소리를 듣고 큰 소리로 따라 해보세요!
          </h3>
        </div>

        {/* Target Sentence Card */}
        <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 mb-5 text-center">
          <p className="text-lg sm:text-xl font-black text-slate-900 mb-1 leading-snug">
            "{targetSentence}"
          </p>
          {targetKorean && (
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {targetKorean}
            </p>
          )}

          {/* Audio Reference Buttons */}
          <div className="flex items-center justify-center gap-2 mt-3 pt-2 border-t border-amber-200/60">
            <button
              onClick={() => {
                playChimeSound('click');
                onPlayTarget(1.0);
              }}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-slate-700 font-bold text-xs flex items-center gap-1 border border-amber-200 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              <span>표준 속도로 듣기</span>
            </button>
            <button
              onClick={() => {
                playChimeSound('click');
                onPlayTarget(0.7);
              }}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-slate-700 font-bold text-xs flex items-center gap-1 border border-amber-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>🐢 천천히 듣기</span>
            </button>
          </div>
        </div>

        {/* Microphone Action Area */}
        <div className="flex flex-col items-center justify-center my-4">
          {!isListening ? (
            <button
              onClick={handleStartSpeaking}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-sky-500 via-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            >
              <Mic className="w-9 h-9 group-hover:scale-110 transition-transform" />
            </button>
          ) : (
            <button
              onClick={handleStopSpeaking}
              className="w-20 h-20 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 animate-pulse hover:scale-105 transition-all cursor-pointer"
            >
              <MicOff className="w-9 h-9" />
            </button>
          )}

          <p className="text-xs font-bold text-slate-600 mt-3">
            {isListening ? (
              <span className="text-rose-600 animate-pulse">
                🔴 지금 영어로 말씀하세요... (듣고 있어요!)
              </span>
            ) : (
              '마이크 버튼을 누르고 말씀해 보세요'
            )}
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-medium border border-rose-200 flex items-start gap-2 mb-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Recognition Results & Scoring Card */}
        {recognitionResult && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 animate-in zoom-in-95 duration-150">
            {/* Stars & Score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-6 h-6 ${
                      starIdx <= recognitionResult.stars
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                정확도 {recognitionResult.score}점!
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-800">
              {recognitionResult.feedback}
            </p>

            {/* Recognized Words Breakdown */}
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
              <p className="text-[11px] text-slate-400 font-semibold mb-1.5">내가 말한 단어 분석:</p>
              <div className="flex flex-wrap gap-1.5">
                {recognitionResult.wordMatches.map((wm, i) => (
                  <span
                    key={i}
                    className={`px-2 py-0.8 rounded-lg font-bold flex items-center gap-1 ${
                      wm.matched
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {wm.matched ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : '✖'}
                    <span>{wm.word}</span>
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-2 italic">
                인식된 문장: "{recognitionResult.transcript}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
