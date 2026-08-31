/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { TtsControls } from './components/TtsControls';
import { InteractiveReader } from './components/InteractiveReader';
import { CurriculumLibrary } from './components/CurriculumLibrary';
import { SpeakingPracticeModal } from './components/SpeakingPracticeModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { SavedWordsDrawer } from './components/SavedWordsDrawer';
import { GuideModal } from './components/GuideModal';
import { globalSpeechSynth } from './utils/speechSynthesisManager';
import { SpeechVoiceInfo, SentenceItem, SavedVocabularyItem } from './types';
import { playChimeSound } from './utils/audioUtils';
import { Sparkles, Heart, Award } from 'lucide-react';

const INITIAL_TEXT = 'Hello, my friend! Look at the cute puppy playing with a ball in the sunny park.';
const INITIAL_KOREAN = '안녕, 내 친구야! 화창한 공원에서 공을 가지고 노는 귀여운 강아지를 보세요.';

export default function App() {
  // TTS State
  const [text, setText] = useState<string>(() => {
    return localStorage.getItem('kids_tts_text') || INITIAL_TEXT;
  });
  const [korean, setKorean] = useState<string>(() => {
    return localStorage.getItem('kids_tts_korean') || INITIAL_KOREAN;
  });

  const [rate, setRate] = useState<number>(0.85); // Kid-friendly default pace
  const [pitch, setPitch] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);
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
  const [showKorean, setShowKorean] = useState<boolean>(true);

  // Saved Vocabulary
  const [savedWords, setSavedWords] = useState<SavedVocabularyItem[]>(() => {
    try {
      const saved = localStorage.getItem('kids_tts_saved_words');
      return saved ? JSON.parse(saved) : [
        { id: '1', english: 'puppy', korean: '강아지', dateAdded: '2026-08-30' },
        { id: '2', english: 'sunny', korean: '화창한, 맑은', dateAdded: '2026-08-30' },
        { id: '3', english: 'playing', korean: '놀고 있는', dateAdded: '2026-08-30' },
      ];
    } catch (e) {
      return [];
    }
  });

  // Modals
  const [isSpeakingPracticeOpen, setIsSpeakingPracticeOpen] = useState<boolean>(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Ref to track repeat loop safely in asynchronous events
  const repeatCountRef = useRef(repeatCount);
  const currentRepeatRef = useRef(1);
  repeatCountRef.current = repeatCount;

  // Initialize Voices
  useEffect(() => {
    const handleVoices = (loadedVoices: SpeechVoiceInfo[]) => {
      setVoices(loadedVoices);
      if (loadedVoices.length > 0 && !selectedVoice) {
        // Pick best US voice or first
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

  useEffect(() => {
    localStorage.setItem('kids_tts_korean', korean);
  }, [korean]);

  useEffect(() => {
    localStorage.setItem('kids_tts_saved_words', JSON.stringify(savedWords));
  }, [savedWords]);

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
            }, 600); // 0.6s breathing room between repeats
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
      handlePlay(0.6); // 0.6x slow speed for easy listening
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

  // Save word to vocabulary
  const handleSaveWord = (word: string, meaning: string) => {
    const clean = word.toLowerCase().trim();
    if (savedWords.some((item) => item.english.toLowerCase() === clean)) {
      // Toggle remove
      setSavedWords((prev) => prev.filter((item) => item.english.toLowerCase() !== clean));
    } else {
      const newItem: SavedVocabularyItem = {
        id: `word-${Date.now()}`,
        english: word,
        korean: meaning || '영어 단어',
        dateAdded: new Date().toISOString().slice(0, 10),
      };
      setSavedWords((prev) => [newItem, ...prev]);
    }
  };

  const handleRemoveWord = (id: string) => {
    setSavedWords((prev) => prev.filter((w) => w.id !== id));
  };

  // Curriculum sentence selection
  const handleSelectSentence = (sentence: SentenceItem, autoPlay: boolean = false) => {
    handleStop();
    setText(sentence.english);
    setKorean(sentence.korean);
    if (autoPlay) {
      setTimeout(() => {
        globalSpeechSynth.speak({
          text: sentence.english,
          rate,
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
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentWordIndex(-1);
            playChimeSound('success');
          },
        });
      }, 150);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-amber-200 selection:text-amber-900">
      {/* 1. Header with Tools & Switches */}
      <Header
        fontSizeLevel={fontSizeLevel}
        onChangeFontSize={setFontSizeLevel}
        showSyllables={showSyllables}
        onToggleSyllables={() => setShowSyllables(!showSyllables)}
        showKorean={showKorean}
        onToggleKorean={() => setShowKorean(!showKorean)}
        savedCount={savedWords.length}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* 2. Main Body Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Interactive Text Display & Synchronized Word Reader */}
        <InteractiveReader
          text={text}
          onTextChange={setText}
          koreanTranslation={korean}
          onKoreanChange={setKorean}
          isPlaying={isPlaying}
          currentWordIndex={currentWordIndex}
          fontSizeLevel={fontSizeLevel}
          showSyllables={showSyllables}
          showKorean={showKorean}
          onSpeakSingleWord={handleSpeakSingleWord}
          onSaveWord={handleSaveWord}
          savedWords={savedWords}
        />

        {/* TTS Speed and Playback Controls */}
        <TtsControls
          rate={rate}
          onRateChange={setRate}
          pitch={pitch}
          onPitchChange={setPitch}
          volume={volume}
          onVolumeChange={setVolume}
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
          onOpenPractice={() => setIsSpeakingPracticeOpen(true)}
          repeatCount={repeatCount}
          onChangeRepeatCount={setRepeatCount}
          currentRepeat={currentRepeat}
          hasText={!!text.trim()}
        />

        {/* Curriculum Library Preset Sentences */}
        <CurriculumLibrary
          onSelectSentence={handleSelectSentence}
          currentSentenceText={text}
        />
      </main>

      {/* 3. Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-5 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1">
            <span>초등학교 영어 수업 & 맞춤형 발음 학습 지원 웹앱</span>
            <span className="text-amber-500 font-bold">✨</span>
          </p>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Web Speech API & Google Gemini AI</span>
            <span>&middot;</span>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-amber-700 hover:underline font-bold"
            >
              사용 도움말
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <SpeakingPracticeModal
        isOpen={isSpeakingPracticeOpen}
        onClose={() => setIsSpeakingPracticeOpen(false)}
        targetSentence={text}
        targetKorean={korean}
        onPlayTarget={(customRate) => handlePlay(customRate)}
      />

      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onApplySentence={handleSelectSentence}
      />

      <SavedWordsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedWords={savedWords}
        onRemoveWord={handleRemoveWord}
        onSpeakWord={handleSpeakSingleWord}
        onLoadIntoReader={(w, m) => {
          handleStop();
          setText(w);
          setKorean(m);
        }}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
