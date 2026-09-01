/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { TtsControls } from './components/TtsControls';
import { InteractiveReader } from './components/InteractiveReader';
import { globalSpeechSynth } from './utils/speechSynthesisManager';
import { SpeechVoiceInfo } from './types';
import { playChimeSound } from './utils/audioUtils';

export default function App() {
  const [text, setText] = useState<string>(() => {
    return localStorage.getItem('kids_tts_text') || '';
  });

  const [rate, setRate] = useState<number>(0.9); // Default pace: 0.9x
  const [pitch] = useState<number>(1.0); // Fixed pitch to avoid voice distortion
  const [volume] = useState<number>(1.0);
  const [voices, setVoices] = useState<SpeechVoiceInfo[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
  const [repeatCount, setRepeatCount] = useState<number>(1);
  const [currentRepeat, setCurrentRepeat] = useState<number>(1);

  // Display & UI Preferences
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(1); // 0: Normal, 1: Large, 2: Extra Large
  const [showSyllables, setShowSyllables] = useState<boolean>(false);

  // Ref to track repeat loop safely in asynchronous events
  const repeatCountRef = useRef(repeatCount);
  const currentRepeatRef = useRef(1);
  repeatCountRef.current = repeatCount;

  // Initialize Voices
  useEffect(() => {
    const handleVoices = (loadedVoices: SpeechVoiceInfo[]) => {
      setVoices(loadedVoices);
      if (loadedVoices.length > 0 && !selectedVoice) {
        const usVoice = loadedVoices.find((v) => v.accent === 'US') || loadedVoices[0];
        setSelectedVoice(usVoice.name);
      }
    };

    globalSpeechSynth.onVoicesLoaded(handleVoices);
    const existing = globalSpeechSynth.getVoices();
    if (existing.length > 0) {
      handleVoices(existing);
    }
  }, []);

  // Save texts to local storage
  useEffect(() => {
    localStorage.setItem('kids_tts_text', text);
  }, [text]);

  // Main Play handler
  const handlePlay = (customRate?: number) => {
    if (!text.trim()) return;

    const playRate = customRate !== undefined ? customRate : rate;
    currentRepeatRef.current = 1;
    setCurrentRepeat(1);
    setIsPlaying(true);
    setIsPaused(false);
    setCurrentWordIndex(-1);

    const runUtterance = () => {
      globalSpeechSynth.speak({
        text,
        rate: playRate,
        pitch,
        volume,
        voiceName: selectedVoice,
        onStart: () => {
          setIsPlaying(true);
          setIsPaused(false);
        },
        onBoundary: (charIndex, wordIndex) => {
          setCurrentWordIndex(wordIndex);
        },
        onEnd: () => {
          if (currentRepeatRef.current < repeatCountRef.current) {
            currentRepeatRef.current += 1;
            setCurrentRepeat(currentRepeatRef.current);
            setTimeout(() => {
              runUtterance();
            }, 600); // 0.6s pause between repeats
          } else {
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentWordIndex(-1);
            playChimeSound('success');
          }
        },
        onError: () => {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentWordIndex(-1);
        },
      });
    };

    runUtterance();
  };

  const handlePause = () => {
    globalSpeechSynth.pause();
    setIsPaused(true);
  };

  const handleResume = () => {
    globalSpeechSynth.resume();
    setIsPaused(false);
  };

  const handleStop = () => {
    globalSpeechSynth.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordIndex(-1);
    setCurrentRepeat(1);
    currentRepeatRef.current = 1;
  };

  const handleReplaySlow = () => {
    handleStop();
    setTimeout(() => {
      handlePlay(0.6); // 0.6x slow speed for clear comprehension
    }, 150);
  };

  // Speak a single word
  const handleSpeakSingleWord = (word: string, singleRate: number = 0.85) => {
    globalSpeechSynth.speak({
      text: word,
      rate: singleRate,
      pitch,
      volume,
      voiceName: selectedVoice,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-amber-200 selection:text-amber-900">
      {/* 1. Header */}
      <Header
        fontSizeLevel={fontSizeLevel}
        onChangeFontSize={setFontSizeLevel}
        showSyllables={showSyllables}
        onToggleSyllables={() => setShowSyllables(!showSyllables)}
      />

      {/* 2. Main Body Container (Direct English sentence input & Speed Controls only) */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Interactive Text Input & Direct Word Reader */}
        <InteractiveReader
          text={text}
          onTextChange={setText}
          isPlaying={isPlaying}
          currentWordIndex={currentWordIndex}
          fontSizeLevel={fontSizeLevel}
          showSyllables={showSyllables}
          onSpeakSingleWord={handleSpeakSingleWord}
        />

        {/* TTS Speed & Audio Playback Controls */}
        <TtsControls
          rate={rate}
          onRateChange={setRate}
          selectedVoice={selectedVoice}
          onVoiceChange={setSelectedVoice}
          voices={voices}
          isPlaying={isPlaying}
          isPaused={isPaused}
          onPlay={() => handlePlay()}
          onPause={handlePause}
          onResume={handleResume}
          onStop={handleStop}
          onReplaySlow={handleReplaySlow}
          repeatCount={repeatCount}
          onChangeRepeatCount={setRepeatCount}
          currentRepeat={currentRepeat}
          hasText={!!text.trim()}
        />
      </main>

      {/* 3. Simple Clean Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <p className="font-medium">
            초등 영어 발음 & 속도 조절 TTS
          </p>
          <p className="text-slate-400">
            직접 입력 &middot; 학습 속도 &middot; 발음 확인
          </p>
        </div>
      </footer>
    </div>
  );
}
