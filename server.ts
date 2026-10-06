import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { VERIFIED_TEACHINGS } from './src/data/teachings.ts';
import { buildDeterministicReel } from './src/utils/reelGenerator.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API: Verify quote endpoint (Hallucination Firewall)
app.post('/api/verify-quote', (req: Request, res: Response) => {
  const { quote } = req.body;
  if (!quote || typeof quote !== 'string') {
    return res.status(400).json({ status: 'error', message: 'Quote string is required' });
  }

  const query = quote.toLowerCase().trim();
  const match = VERIFIED_TEACHINGS.find(
    (t) =>
      t.teaching.toLowerCase().includes(query) ||
      query.includes(t.teaching.toLowerCase().slice(0, 25)) ||
      t.tags.some((tag) => query.includes(tag.toLowerCase())) ||
      t.title.toLowerCase().includes(query)
  );

  if (match) {
    return res.json({
      status: 'VERIFIED',
      teaching: match,
      sourceCitation: `${match.sourceName}, ${match.volume}, ${match.chapter}`,
      provenanceBadge: 'SOURCE VERIFIED ✓'
    });
  }

  // Hallucination Firewall Demonstration
  return res.json({
    status: 'SOURCE_NOT_FOUND',
    message: 'This quotation could not be verified in our trusted teaching library.',
    warning: 'To prevent historical distortion, Vivekam refuses to generate reels from unverified quotes.'
  });
});

// API: Generate Reel Endpoint
app.post('/api/generate-reel', async (req: Request, res: Response) => {
  try {
    const { teachingId, storyContext = 'campus', language = 'en', userProblem } = req.body;

    const teaching = VERIFIED_TEACHINGS.find((t) => t.id === teachingId) || VERIFIED_TEACHINGS[0];

    // If Gemini is available, we can augment with custom phrasing
    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `
You are a source-grounded teaching adaptation engine.
VERIFIED TEACHING DATA:
Theme: ${teaching.theme}
Title: ${teaching.title}
Exact Quote: "${teaching.teaching}"
Source: ${teaching.sourceName}, ${teaching.volume}, ${teaching.chapter}
Story Context: ${storyContext} (e.g. campus, career, or everyday life)
Language: ${language}
User's emotional situation: "${userProblem || 'Needing clarity and inner strength'}"

RULES:
1. Use ONLY supplied verified source material.
2. Never invent quotations.
3. Never attribute AI-generated text to Swami Vivekananda.
4. Never fabricate historical incidents.
5. Modern scenarios must be explicitly marked fictional.
6. Preserve the core meaning of the original teaching.
7. Return a JSON response with:
   - hook: string (punchy 1-sentence youth question)
   - story: string (2-sentence modern relatable youth situation)
   - interpretation: string (clear breakdown of how this ancient wisdom applies today)
   - takeaway: string (1 sentence moral anchor)
   - actionTitle: string
   - actionInstruction: string (specific 24-hour practical action)
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are Vivekam engine. Always ground outputs strictly in verified source materials. Return raw valid JSON.',
            responseMimeType: 'application/json',
          },
        });

        const textOutput = response.text;
        if (textOutput) {
          const parsed = JSON.parse(textOutput);
          const baseReel = buildDeterministicReel(teaching, storyContext, language, userProblem);

          // Augment scenes with model-tailored creative elements while maintaining deterministic structure and strict truth tags
          if (parsed.hook) {
            baseReel.scenes[0].narration = parsed.hook;
            baseReel.scenes[0].subtitle = parsed.hook;
          }
          if (parsed.story) {
            baseReel.scenes[1].narration = parsed.story;
            baseReel.scenes[1].subtitle = parsed.story;
          }
          if (parsed.interpretation) {
            baseReel.scenes[3].narration = parsed.interpretation;
            baseReel.scenes[3].subtitle = parsed.interpretation;
          }
          if (parsed.takeaway) {
            baseReel.scenes[4].narration = parsed.takeaway;
            baseReel.scenes[4].subtitle = parsed.takeaway;
          }
          if (parsed.actionInstruction) {
            baseReel.scenes[5].narration = `Your 24-hour challenge: ${parsed.actionInstruction}`;
            baseReel.scenes[5].subtitle = `24-HOUR CHALLENGE: ${parsed.actionInstruction}`;
            baseReel.actionChallenge.instruction = parsed.actionInstruction;
            if (parsed.actionTitle) baseReel.actionChallenge.title = parsed.actionTitle;
          }

          return res.json({
            status: 'success',
            mode: 'gemini-augmented',
            reel: baseReel,
          });
        }
      } catch (geminiError) {
        console.warn('Gemini API call warning, falling back to deterministic engine:', geminiError);
      }
    }

    // High quality deterministic fallback (guaranteed hackathon robustness)
    const reel = buildDeterministicReel(teaching, storyContext, language, userProblem);
    return res.json({
      status: 'success',
      mode: 'deterministic-verified',
      reel,
    });
  } catch (error: any) {
    console.error('Reel generation error:', error);
    return res.status(500).json({ status: 'error', message: error.message || 'Generation failed' });
  }
});

// Setup Vite middleware for local development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Vivekam server running on http://localhost:${PORT}`);
  });
}

startServer();
