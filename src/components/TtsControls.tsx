import React from 'react';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Volume2,
  Repeat,
  Gauge,
  ChevronDown
} from 'lucide-react';
import { SPEED_PRESETS } from '../data/curriculumData';
import { SpeechVoiceInfo } from '../types';

interface TtsControlsProps {
  rate: number;
  onRateChange: (rate: number) => void;
  selectedVoice: string;
  onVoiceChange: (voiceName: string) => void;
  voices: SpeechVoiceInfo[];
  isPlaying: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReplaySlow: () => void;
  repeatCount: number;
  onChangeRepeatCount: (count: number) => void;
  currentRepeat: number;
  hasText: boolean;
}

export const TtsControls: React.FC<TtsControlsProps> = ({
  rate,
  onRateChange,
  selectedVoice,
  onVoiceChange,
  voices,
  isPlaying,
  isPaused,
  onPlay,
  onPause,
  onResume,
  onStop,
  onReplaySlow,
  repeatCount,
  onChangeRepeatCount,
  currentRepeat,
  hasText,
}) => {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-100 shadow-md shadow-amber-900/5 space-y-4">
      {/* 1. Only 2 Safe Educational Speeds (0.75x & 0.9x) - No Sliders, No fast speeds */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-amber-500" />
            <span>읽기 속도</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {SPEED_PRESETS.map((preset) => {
            const isActive = Math.abs(preset.rate - rate) < 0.08;
            return (
              <button
                key={preset.id}
                onClick={() => onRateChange(preset.rate)}
                className={`py-3 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 border relative cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/25 scale-[1.02]'
                    : 'bg-amber-50/50 hover:bg-amber-100/70 text-slate-700 border-amber-200/70 hover:border-amber-300'
                }`}
              >
                <span className="text-xl sm:text-2xl">{preset.badge.split(' ')[0]}</span>
                <div className="text-left">
                  <div className="text-sm font-extrabold">{preset.label}</div>
                  <div className={`text-xs font-medium leading-tight ${isActive ? 'text-amber-100' : 'text-slate-500'}`}>
                    {preset.description}
                  </div>
                </div>
                {isActive && (
                  <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Voice & Repeat Options Only */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
        {/* Voice Selector */}
        <div>
          <label className="font-bold text-slate-600 mb-1 flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-sky-500" />
            <span>원어민 목소리</span>
          </label>
          <div className="relative">
            <select
              value={selectedVoice}
              onChange={(e) => onVoiceChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-700 font-medium focus:ring-2 focus:ring-amber-400 focus:border-amber-400 appearance-none pr-8 truncate text-xs"
            >
              {voices.length === 0 ? (
                <option value="">기본 영어 목소리</option>
              ) : (
                voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.displayName}
                  </option>
                ))
              )}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Repeat Count Loop */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="font-bold text-slate-600 flex items-center gap-1">
              <Repeat className="w-3.5 h-3.5 text-emerald-500" />
              <span>반복 듣기</span>
            </label>
            {isPlaying && repeatCount > 1 && (
              <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full font-bold">
                {currentRepeat} / {repeatCount}회
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {[
              { count: 1, label: '1회' },
              { count: 2, label: '2회' },
              { count: 3, label: '3회' },
            ].map((item) => (
              <button
                key={item.count}
                onClick={() => onChangeRepeatCount(item.count)}
                className={`flex-1 py-2 rounded-lg border text-center font-semibold transition-colors cursor-pointer ${
                  repeatCount === item.count
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Primary Playback Buttons */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
          {!isPlaying ? (
            <button
              onClick={onPlay}
              disabled={!hasText}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                hasText
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-amber-500/30 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Play className="w-5 h-5 fill-current" />
              <span>영어로 읽기 (Play)</span>
            </button>
          ) : isPaused ? (
            <button
              onClick={onResume}
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl font-black text-sm sm:text-base bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-2 shadow-md shadow-emerald-500/30 transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>이어서 듣기</span>
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl font-black text-sm sm:text-base bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center gap-2 shadow-md shadow-amber-500/30 transition-all cursor-pointer"
            >
              <Pause className="w-5 h-5 fill-current" />
              <span>잠시 멈춤</span>
            </button>
          )}

          {/* Stop Button */}
          {(isPlaying || isPaused) && (
            <button
              onClick={onStop}
              className="px-4 py-3 rounded-2xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-1.5 transition-colors border border-slate-200 cursor-pointer"
              title="처음부터 다시 정지"
            >
              <Square className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">정지</span>
            </button>
          )}

          {/* Slow Replay Button */}
          <button
            onClick={onReplaySlow}
            disabled={!hasText}
            className={`px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors border ${
              hasText
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200 cursor-pointer'
                : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
            }`}
            title="0.6x 천천히 다시 듣기"
          >
            <RotateCcw className="w-4 h-4" />
            <span>🐢 느리게 다시듣기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
