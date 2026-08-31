import React from 'react';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Volume2,
  Sliders,
  Sparkles,
  Mic,
  Repeat,
  Gauge,
  Music2,
  ChevronDown
} from 'lucide-react';
import { SPEED_PRESETS } from '../data/curriculumData';
import { SpeechVoiceInfo, SpeedPreset } from '../types';

interface TtsControlsProps {
  rate: number;
  onRateChange: (rate: number) => void;
  pitch: number;
  onPitchChange: (pitch: number) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
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
  onOpenPractice: () => void;
  repeatCount: number; // 1, 2, 3, 999 (infinite)
  onChangeRepeatCount: (count: number) => void;
  currentRepeat: number;
  hasText: boolean;
}

export const TtsControls: React.FC<TtsControlsProps> = ({
  rate,
  onRateChange,
  pitch,
  onPitchChange,
  volume,
  onVolumeChange,
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
  onOpenPractice,
  repeatCount,
  onChangeRepeatCount,
  currentRepeat,
  hasText,
}) => {
  const currentPreset = SPEED_PRESETS.find((p) => Math.abs(p.rate - rate) < 0.04);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-amber-100 shadow-md shadow-amber-900/5 space-y-4">
      {/* 1. Speed Preset Selection Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-amber-500" />
            <span>읽기 속도 조절</span>
            <span className="text-[11px] font-normal text-slate-500">
              (현재: <strong className="text-amber-600 font-bold">{rate.toFixed(2)}x</strong>)
            </span>
          </label>
          <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium border border-amber-200">
            {currentPreset ? currentPreset.description : '사용자 지정 속도'}
          </span>
        </div>

        {/* Speed Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SPEED_PRESETS.map((preset) => {
            const isActive = Math.abs(preset.rate - rate) < 0.04;
            return (
              <button
                key={preset.id}
                onClick={() => onRateChange(preset.rate)}
                className={`py-2.5 px-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 border relative ${
                  isActive
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/25 scale-[1.02]'
                    : 'bg-amber-50/50 hover:bg-amber-100/70 text-slate-700 border-amber-200/70 hover:border-amber-300'
                }`}
              >
                <span className="text-sm sm:text-base mb-0.5">{preset.badge.split(' ')[0]}</span>
                <span className="text-xs font-extrabold">{preset.label.split(' ')[0]}</span>
                <span className={`text-[11px] font-medium leading-tight ${isActive ? 'text-amber-100' : 'text-slate-500'}`}>
                  {preset.badge.split(' ').slice(1).join(' ')}
                </span>
                {isActive && (
                  <span className="absolute -top-1.5 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-300"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Precise Slider Option */}
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">🐢 0.4x</span>
          <input
            type="range"
            min="0.4"
            max="2.0"
            step="0.05"
            value={rate}
            onChange={(e) => onRateChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
          />
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">2.0x 🚀</span>
        </div>
      </div>

      {/* 2. Audio Customization (Voice, Pitch, Repeat) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
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

        {/* Pitch Control (Tone) */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="font-bold text-slate-600 flex items-center gap-1">
              <Music2 className="w-3.5 h-3.5 text-violet-500" />
              <span>목소리 톤(높낮이)</span>
            </label>
            <span className="text-slate-400 font-semibold">{pitch < 1.0 ? '낮음' : pitch === 1.0 ? '보통' : '어린이 톤'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPitchChange(0.85)}
              className={`flex-1 py-1.5 rounded-lg border text-center font-semibold transition-colors ${
                pitch < 0.95 ? 'bg-violet-100 text-violet-800 border-violet-300' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              차분하게
            </button>
            <button
              onClick={() => onPitchChange(1.0)}
              className={`flex-1 py-1.5 rounded-lg border text-center font-semibold transition-colors ${
                pitch >= 0.95 && pitch <= 1.05 ? 'bg-violet-100 text-violet-800 border-violet-300' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              표준
            </button>
            <button
              onClick={() => onPitchChange(1.25)}
              className={`flex-1 py-1.5 rounded-lg border text-center font-semibold transition-colors ${
                pitch > 1.05 ? 'bg-violet-100 text-violet-800 border-violet-300' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              밝게
            </button>
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
                {currentRepeat} / {repeatCount === 999 ? '∞' : repeatCount}회
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {[
              { count: 1, label: '1회' },
              { count: 2, label: '2회' },
              { count: 3, label: '3회' },
              { count: 999, label: '무한' },
            ].map((item) => (
              <button
                key={item.count}
                onClick={() => onChangeRepeatCount(item.count)}
                className={`flex-1 py-1.5 rounded-lg border text-center font-semibold transition-colors ${
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

      {/* 3. Primary Playback Buttons (Big, friendly, prominent) */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5">
        {/* Play/Pause & Stop Button Group */}
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

          {/* Slow Replay Button (0.6x instant practice) */}
          <button
            onClick={onReplaySlow}
            disabled={!hasText}
            className={`px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors border ${
              hasText
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200 cursor-pointer'
                : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
            }`}
            title="0.6x 아주 천천히 다시 듣기"
          >
            <RotateCcw className="w-4 h-4" />
            <span>🐢 느리게 다시듣기</span>
          </button>
        </div>

        {/* Practice Speaking (Shadowing) Challenge */}
        <button
          onClick={onOpenPractice}
          disabled={!hasText}
          className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all ${
            hasText
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 hover:from-sky-600 hover:to-blue-700 cursor-pointer'
              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>🎙️ 따라 말하기 (발음 채점)</span>
        </button>
      </div>
    </div>
  );
};
