import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        genAI = new GoogleGenAI({ apiKey });
      }
    }
    return genAI;
  }

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY });
  });

  // Elementary English Analysis API: word phonics breakdown, easy Korean meaning, syllable split, tip
  app.post('/api/analyze-word', async (req, res) => {
    try {
      const { word, sentence } = req.body;
      if (!word) {
        return res.status(400).json({ error: 'Word is required' });
      }

      const ai = getGenAI();
      if (!ai) {
        // Fallback offline heuristic for syllable and elementary tips
        return res.json({
          word,
          syllables: word.length > 5 ? word.slice(0, 3) + '·' + word.slice(3) : word,
          phonetic: `/${word}/`,
          koreanMeaning: '단어 의미',
          pronunciationTip: '소리를 잘 듣고 입모양을 크게 하여 천천히 따라 해보세요!',
          isOffline: true
        });
      }

      const prompt = `You are a friendly, encouraging English teacher for Korean elementary school students (grades 3-6).
Analyze the English word: "${word}" (Context sentence: "${sentence || ''}").
Respond ONLY with a JSON object in the following format (no markdown, no backticks, pure JSON):
{
  "word": "${word}",
  "syllables": "separated with dots, e.g., el·e·phant or to·mor·row",
  "phonetic": "/.../ e.g. /ˈel.ə.fənt/",
  "koreanPhonetic": "Korean easy pronunciation guide like [엘리펀트]",
  "koreanMeaning": "Easy elementary Korean meaning, e.g., 코끼리",
  "elementaryTip": "Short friendly tip for Korean elementary kids on pronunciation or usage in 1-2 Korean sentences. E.g., 'ph는 f 소리가 나서 입술을 살짝 물고 바람을 내보내요!'"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const responseText = response.text || '{}';
      const parsed = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());
      res.json(parsed);
    } catch (err: any) {
      console.error('Word analysis error:', err);
      res.status(500).json({ error: err.message || 'Failed to analyze word' });
    }
  });

  // Elementary Sentence Generator API
  app.post('/api/generate-sentences', async (req, res) => {
    try {
      const { grade = '3-4', topic = 'animals', count = 3 } = req.body;
      const ai = getGenAI();
      if (!ai) {
        return res.status(400).json({ error: 'Gemini API key is not configured' });
      }

      const prompt = `You are a Korean elementary school English curriculum designer.
Generate ${count} fun, educational English practice sentences suitable for elementary school grade ${grade} on the topic "${topic}".
Each sentence should be clear, natural, and engaging for kids.

Respond ONLY with a JSON object format:
{
  "sentences": [
    {
      "english": "The friendly cat is sleeping on the chair.",
      "korean": "다정한 고양이가 의자 위에서 자고 있어요.",
      "level": "초등 3~4학년",
      "keyWords": ["friendly", "sleeping", "chair"],
      "topic": "${topic}"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const responseText = response.text || '{}';
      const parsed = JSON.parse(responseText.replace(/```json/g, '').replace(/```/g, '').trim());
      res.json(parsed);
    } catch (err: any) {
      console.error('Sentence generation error:', err);
      res.status(500).json({ error: err.message || 'Failed to generate sentences' });
    }
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
