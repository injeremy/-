export interface SpeechVoiceInfo {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
  displayName: string;
  accent: 'US' | 'UK' | 'AU' | 'CA' | 'Other';
  gender?: 'Female' | 'Male' | 'Neutral';
}

export type GradeLevel = 'all' | 'grade3-4' | 'grade5-6' | 'phonics' | 'story' | 'daily';

export interface SpeedPreset {
  id: string;
  rate: number;
  label: string;
  badge: string;
  icon: string;
  description: string;
  recommendedFor: string;
}

export interface SentenceItem {
  id: string;
  english: string;
  korean: string;
  category: string;
  gradeLevel: 'grade3-4' | 'grade5-6' | 'phonics' | 'story' | 'daily';
  keyWords?: string[];
  phonicsFocus?: string;
  syllables?: string;
}

export interface WordAnalysis {
  word: string;
  syllables: string;
  phonetic: string;
  koreanPhonetic: string;
  koreanMeaning: string;
  elementaryTip: string;
  isOffline?: boolean;
}

export interface SpeechPlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentWordIndex: number;
  currentCharIndex: number;
  totalWords: number;
  repeatCurrent: number;
  repeatTarget: number;
}

export interface RecognitionResult {
  transcript: string;
  confidence: number;
  score: number; // 0 - 100
  stars: number; // 1 - 3
  feedback: string;
  wordMatches: {
    word: string;
    matched: boolean;
    spokenWord?: string;
  }[];
}

export interface SavedVocabularyItem {
  id: string;
  english: string;
  korean: string;
  dateAdded: string;
  notes?: string;
}
