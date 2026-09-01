import { SpeedPreset } from '../types';

export const SPEED_PRESETS: SpeedPreset[] = [
  {
    id: 'slow',
    rate: 0.75,
    label: '천천히 (0.75x)',
    description: '천천히 또박또박 따라 말하기',
    icon: 'Cat',
    badge: '🦔 0.75x',
    recommendedFor: '처음 듣거나 발음을 또박또박 익힐 때',
  },
  {
    id: 'normal',
    rate: 0.9,
    label: '보통 (0.9x)',
    description: '초등 표준 자연스러운 속도',
    icon: 'Sparkles',
    badge: '🐱 0.9x',
    recommendedFor: '자연스럽게 듣고 따라 읽을 때',
  },
];

export const CURRICULUM_SENTENCES = [];

export const OFFLINE_ELEMENTARY_DICT: Record<string, { syllables: string; phonetic: string; koreanMeaning: string; tip: string }> = {
  hello: { syllables: 'hel·lo', phonetic: '/həˈloʊ/', koreanMeaning: '안녕, 안녕하세요', tip: 'o 소리를 둥글게 모으며 밝게 인사해 보세요.' },
  welcome: { syllables: 'wel·come', phonetic: '/ˈwel.kəm/', koreanMeaning: '환영해요', tip: 'wel에 힘을 주어 웰-컴!' },
  english: { syllables: 'eng·lish', phonetic: '/ˈɪŋ.ɡlɪʃ/', koreanMeaning: '영어', tip: '끝의 sh는 조용히 할 때처럼 쉬- 소리를 내요.' },
  class: { syllables: 'class', phonetic: '/klæs/', koreanMeaning: '수업, 반', tip: 'a는 입을 크게 벌려 /æ/ 소리를 내요: 클래스!' },
  apple: { syllables: 'ap·ple', phonetic: '/ˈæp.əl/', koreanMeaning: '사과', tip: '첫 소리 /æ/는 입을 사과 베어 물듯 크게 벌려요.' },
  banana: { syllables: 'ba·nan·a', phonetic: '/bəˈnæn.ə/', koreanMeaning: '바나나', tip: '가운데 nan에 힘을 주어 읽어요: 바-내-너!' },
  elephant: { syllables: 'el·e·phant', phonetic: '/ˈel.ə.fənt/', koreanMeaning: '코끼리', tip: 'ph는 f 소리예요! 윗니로 아랫입술을 살짝 닿게 해요.' },
  school: { syllables: 'school', phonetic: '/skuːl/', koreanMeaning: '학교', tip: 'ch는 /k/ 소리가 나요. 끝의 l은 혀끝을 윗잇몸에 붙여요.' },
  friend: { syllables: 'friend', phonetic: '/frend/', koreanMeaning: '친구', tip: 'ie가 짧은 /e/ 소리가 나요. 프렌-드!' },
  today: { syllables: 'to·day', phonetic: '/təˈdeɪ/', koreanMeaning: '오늘', tip: 'day에 강세를 두어 투-데이!' },
  good: { syllables: 'good', phonetic: '/ɡʊd/', koreanMeaning: '좋은, 잘하는', tip: 'oo를 짧고 가볍게 굿!' },
  morning: { syllables: 'morn·ing', phonetic: '/ˈmɔːr.nɪŋ/', koreanMeaning: '아침', tip: 'or 소리를 낼 때 입술을 둥글게 모으고 혀를 살짝 굴려요.' },
  book: { syllables: 'book', phonetic: '/bʊk/', koreanMeaning: '책', tip: 'oo는 짧게 북!' },
  happy: { syllables: 'hap·py', phonetic: '/ˈhæp.i/', koreanMeaning: '행복한, 기쁜', tip: 'p가 두 개 있지만 한 번만 팡 터뜨려요: 해피!' },
};
