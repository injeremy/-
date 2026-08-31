import { SpeechVoiceInfo, RecognitionResult } from '../types';

export class SpeechSynthesizer {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechVoiceInfo[] = [];
  private onVoicesLoadedCallbacks: Array<(voices: SpeechVoiceInfo[]) => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  public isSupported(): boolean {
    return !!this.synth;
  }

  private loadVoices() {
    if (!this.synth) return;
    const rawVoices = this.synth.getVoices();
    if (!rawVoices || rawVoices.length === 0) return;

    // Filter English voices
    const englishVoices = rawVoices.filter((v) =>
      v.lang.toLowerCase().startsWith('en')
    );

    const targetList = englishVoices.length > 0 ? englishVoices : rawVoices;

    this.voices = targetList.map((v) => {
      let accent: 'US' | 'UK' | 'AU' | 'CA' | 'Other' = 'Other';
      const lang = v.lang.toLowerCase();
      const name = v.name.toLowerCase();

      if (lang.includes('us') || name.includes('united states') || name.includes('us')) {
        accent = 'US';
      } else if (lang.includes('gb') || lang.includes('uk') || name.includes('united kingdom') || name.includes('british')) {
        accent = 'UK';
      } else if (lang.includes('au') || name.includes('australia')) {
        accent = 'AU';
      } else if (lang.includes('ca') || name.includes('canada')) {
        accent = 'CA';
      }

      let displayName = v.name;
      // Clean up common system prefixes
      displayName = displayName.replace(/Google|Microsoft|Apple|Natural|Desktop/gi, '').trim();
      if (!displayName) displayName = v.name;
      displayName += ` (${accent})`;

      return {
        voice: v,
        name: v.name,
        lang: v.lang,
        displayName,
        accent,
      };
    });

    // Sort to prioritize high quality US, UK, and AU voices
    this.voices.sort((a, b) => {
      const aScore = (a.accent === 'US' ? 10 : a.accent === 'UK' ? 8 : 5) + (a.name.includes('Natural') || a.name.includes('Google') ? 5 : 0);
      const bScore = (b.accent === 'US' ? 10 : a.accent === 'UK' ? 8 : 5) + (b.name.includes('Natural') || b.name.includes('Google') ? 5 : 0);
      return bScore - aScore;
    });

    this.onVoicesLoadedCallbacks.forEach((cb) => cb(this.voices));
  }

  public getVoices(): SpeechVoiceInfo[] {
    if (this.voices.length === 0 && this.synth) {
      this.loadVoices();
    }
    return this.voices;
  }

  public onVoicesLoaded(callback: (voices: SpeechVoiceInfo[]) => void) {
    this.onVoicesLoadedCallbacks.push(callback);
    if (this.voices.length > 0) {
      callback(this.voices);
    }
  }

  public speak(options: {
    text: string;
    rate?: number;
    pitch?: number;
    volume?: number;
    voiceName?: string;
    onBoundary?: (charIndex: number, wordIndex: number) => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
    onStart?: () => void;
  }) {
    if (!this.synth) {
      options.onError?.(new Error('Speech Synthesis is not supported in this browser.'));
      return;
    }

    this.stop();

    const cleanText = options.text.trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = Math.max(0.3, Math.min(2.5, options.rate || 1.0));
    utterance.pitch = Math.max(0.5, Math.min(1.8, options.pitch || 1.0));
    utterance.volume = Math.max(0, Math.min(1, options.volume !== undefined ? options.volume : 1.0));

    // Choose voice
    if (options.voiceName) {
      const selected = this.voices.find((v) => v.name === options.voiceName);
      if (selected) {
        utterance.voice = selected.voice;
        utterance.lang = selected.lang;
      }
    }

    if (!utterance.voice && this.voices.length > 0) {
      // Default to best US voice or first available
      const usVoice = this.voices.find((v) => v.accent === 'US') || this.voices[0];
      utterance.voice = usVoice.voice;
      utterance.lang = usVoice.lang;
    }

    // Precompute word offsets in string for accurate boundary tracking
    const wordsWithOffsets: { word: string; start: number; end: number; index: number }[] = [];
    const regex = /\S+/g;
    let match;
    let idx = 0;
    while ((match = regex.exec(cleanText)) !== null) {
      wordsWithOffsets.push({
        word: match[0],
        start: match.index,
        end: match.index + match[0].length,
        index: idx++,
      });
    }

    utterance.onstart = () => {
      options.onStart?.();
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word' || event.charIndex !== undefined) {
        const charIndex = event.charIndex;
        // Find which word matches this charIndex
        let matchedWordIdx = wordsWithOffsets.findIndex(
          (w) => charIndex >= w.start && charIndex <= w.end
        );
        if (matchedWordIdx === -1) {
          // Find closest preceding word
          for (let i = wordsWithOffsets.length - 1; i >= 0; i--) {
            if (charIndex >= wordsWithOffsets[i].start) {
              matchedWordIdx = i;
              break;
            }
          }
        }
        if (matchedWordIdx >= 0) {
          options.onBoundary?.(charIndex, matchedWordIdx);
        }
      }
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        options.onError?.(e);
      }
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return !!this.synth && this.synth.speaking;
  }

  public isPaused(): boolean {
    return !!this.synth && this.synth.paused;
  }
}

// Speech Recognition helper for Elementary Kids Shadowing/Speaking Practice
export function startVoiceRecognition(options: {
  targetText: string;
  onResult: (res: RecognitionResult) => void;
  onError: (err: string) => void;
  onEnd: () => void;
}): { stop: () => void } {
  const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRec) {
    options.onError('이 브라우저는 음성 인식을 지원하지 않습니다. Chrome 또는 Edge 브라우저를 이용해 주세요.');
    options.onEnd();
    return { stop: () => {} };
  }

  const recognition = new SpeechRec();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;

  recognition.onresult = (event: any) => {
    try {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence || 0.9;

      // Clean and split words
      const cleanTargetWords = options.targetText
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .trim()
        .split(/\s+/);

      const cleanSpokenWords = transcript
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .trim()
        .split(/\s+/);

      let matchedCount = 0;
      const wordMatches = cleanTargetWords.map((tWord, idx) => {
        const spokenWord = cleanSpokenWords[idx];
        const matched = cleanSpokenWords.includes(tWord);
        if (matched) matchedCount++;
        return {
          word: tWord,
          matched,
          spokenWord,
        };
      });

      const matchRatio = cleanTargetWords.length > 0 ? matchedCount / cleanTargetWords.length : 1;
      const score = Math.round(matchRatio * 100);

      let stars = 1;
      let feedback = '조금 더 큰 목소리로 또박또박 따라 해볼까요? 파이팅!';
      if (score >= 85) {
        stars = 3;
        feedback = '🌟 완벽해요! 원어민처럼 멋진 발음이에요!';
      } else if (score >= 50) {
        stars = 2;
        feedback = '👏 참 잘했어요! 속도를 조금 늦춰서 다시 해보면 백점!';
      }

      options.onResult({
        transcript,
        confidence,
        score,
        stars,
        feedback,
        wordMatches,
      });
    } catch (e: any) {
      options.onError('음성을 분석하는 중 오류가 발생했습니다.');
    }
  };

  recognition.onerror = (event: any) => {
    let msg = '음성을 인식하지 못했어요. 다시 시도해 주세요.';
    if (event.error === 'not-allowed') {
      msg = '마이크 권한이 허용되지 않았습니다. 브라우저 주소창에서 마이크를 켜주세요.';
    } else if (event.error === 'no-speech') {
      msg = '소리가 감지되지 않았어요. 마이크 가까이에서 말씀해 주세요.';
    }
    options.onError(msg);
  };

  recognition.onend = () => {
    options.onEnd();
  };

  recognition.start();

  return {
    stop: () => {
      try {
        recognition.stop();
      } catch (e) {}
    },
  };
}

export const globalSpeechSynth = new SpeechSynthesizer();
