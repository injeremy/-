import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

// Extended offline dictionary fallback for instant lookup of common elementary words
const OFFLINE_DICT: Record<string, { syllables: string; phonetic: string; koreanMeaning: string; tip: string }> = {
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini AI client initialization (lazy / safe)
  let genAI: GoogleGenAI | null = null;
  function getGenAI() {
    if (!genAI) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        genAI = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      }
    }
    return genAI;
  }

  // Helper function to query Gemini with fallback & error resilience
  async function generateWithFallback(prompt: string, isJson: boolean = false) {
    const ai = getGenAI();
    if (!ai) return null;

    const modelsToTry = ['gemini-3.7-flash', 'gemini-flash-latest'];

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          ...(isJson ? { config: { responseMimeType: 'application/json' } } : {}),
        });
        if (response && response.text) {
          return response.text;
        }
      } catch (err: any) {
        console.warn(`Model ${model} attempt warning:`, err?.message || err);
      }
    }
    return null;
  }

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
  });

  // Word meaning & analysis API
  app.post('/api/analyze-word', async (req, res) => {
    const { word, sentence } = req.body;
    if (!word) {
      return res.status(400).json({ error: 'Word is required' });
    }

    const cleanWord = String(word).toLowerCase().replace(/[^a-z0-9]/gi, '').trim();

    // Check offline dictionary first
    if (OFFLINE_DICT[cleanWord]) {
      const off = OFFLINE_DICT[cleanWord];
      return res.json({
        word: cleanWord,
        syllables: off.syllables,
        phonetic: off.phonetic,
        koreanPhonetic: `[${cleanWord}]`,
        koreanMeaning: off.koreanMeaning,
        elementaryTip: off.tip,
        isOffline: true,
      });
    }

    // Default offline fallback object
    const defaultFallback = {
      word: cleanWord,
      syllables: cleanWord.length > 5 ? cleanWord.slice(0, 3) + '·' + cleanWord.slice(3) : cleanWord,
      phonetic: `/${cleanWord}/`,
      koreanPhonetic: `[${cleanWord}]`,
      koreanMeaning: '영어 단어',
      elementaryTip: '소리를 잘 듣고 큰 목소리로 천천히 따라 해보세요!',
      isOffline: true,
    };

    try {
      const prompt = `You are an encouraging English teacher for Korean elementary school students.
Analyze the English word: "${cleanWord}" (Context: "${sentence || ''}").
Respond ONLY with a JSON object:
{
  "word": "${cleanWord}",
  "syllables": "e.g. el·e·phant or to·mor·row",
  "phonetic": "/.../",
  "koreanPhonetic": "e.g. [엘리펀트]",
  "koreanMeaning": "Easy elementary Korean meaning",
  "elementaryTip": "Short friendly tip for Korean elementary kids on pronunciation in 1 Korean sentence."
}`;

      const responseText = await generateWithFallback(prompt, true);
      if (responseText) {
        const parsed = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());
        return res.json(parsed);
      }
    } catch (err: any) {
      console.warn('Word analysis AI fallback triggered:', err?.message || err);
    }

    return res.json(defaultFallback);
  });

  // Sentence translation endpoint
  app.post('/api/translate-sentence', async (req, res) => {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }

    try {
      const prompt = `Translate this English sentence/word into friendly, natural Korean suitable for an elementary school student:
"${text}"
Output ONLY the Korean translation with no extra commentary.`;

      const translation = await generateWithFallback(prompt, false);
      if (translation) {
        return res.json({ translation: translation.trim() });
      }
    } catch (err: any) {
      console.warn('Translation AI fallback triggered:', err?.message || err);
    }

    return res.json({ translation: '' });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
