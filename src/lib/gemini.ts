// =============================================
// VocaKids – Gemini API Client
// Chấm điểm phát âm bằng audio multimodal
// =============================================

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface PronunciationEval {
  score: number;           // 0–100
  feedback_vi: string;     // Tiếng Việt, thân thiện trẻ em
  phoneme_errors: string[];
  heard: string;
  passed: boolean;
}

// ── Helper: Word similarity & Levenshtein distance ─────────────────────────
function cleanWord(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}

function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length, n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

function wordSimilarity(heard: string, target: string): number {
  const h = cleanWord(heard);
  const t = cleanWord(target);
  if (!h || !t) return 0;
  if (h === t) return 1.0;
  // If target is inside heard words (e.g. child said "a cat" or "the cat")
  if (heard.toLowerCase().split(/\s+/).some((w) => cleanWord(w) === t)) {
    return 1.0;
  }
  const maxLen = Math.max(h.length, t.length);
  const dist = levenshteinDistance(h, t);
  return Math.max(0, 1 - dist / maxLen);
}

/**
 * Evaluates a child's pronunciation of an English word
 * using Gemini's multimodal audio capability.
 */
export async function evaluatePronunciation(
  audioBase64: string,
  mimeType: string,
  targetWord: string,
  targetVi: string,
  apiKey: string,
): Promise<PronunciationEval> {
  const genAI = new GoogleGenerativeAI(apiKey);

  const prompt = `You are a strict and honest speech-to-text transcriber and children's pronunciation evaluator.
The target English word is: "${targetWord}" (Vietnamese: "${targetVi}").

CRITICAL STEP 1: UNBIASED TRANSCRIPTION
- Listen to the audio and transcribe EXACTLY what English word(s) or sound the speaker uttered into "heard".
- DO NOT assume or guess that the speaker said "${targetWord}" if they spoke another word!
- If the speaker said "dog", write "heard": "dog".
- If the speaker said "cat", write "heard": "cat".
- If the audio is silence, breathing, or background noise, write "heard": "".

CRITICAL STEP 2: STRICT SCORING
- If "heard" is empty or silence: score = 0.
- If "heard" is completely DIFFERENT from "${targetWord}" (e.g. said "dog" when target is "cat"): score MUST be between 10 and 25.
- If "heard" matches "${targetWord}":
  * Excellent: 90 - 100
  * Good attempt: 70 - 89
  * Heavily distorted: 40 - 65

Respond ONLY with valid JSON (no markdown):
{
  "heard": "<transcribed words or empty string>",
  "score": <0-100>,
  "phoneme_errors": [<mispronounced phonemes>],
  "feedback_vi": "<Vietnamese feedback, 1-2 sentences>"
}`;

  // Normalize mimeType (supports audio/webm, audio/mp4 for iOS Safari, audio/wav, etc.)
  const resolvedMime = mimeType || 'audio/webm';

  // Model priority: Gemini 3.5 Flash Lite -> 3.1 Flash Lite -> 2.5 Flash
  const models = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-3.8-flash'];
  let lastErr: unknown = null;

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        {
          inlineData: {
            data: audioBase64,
            mimeType: resolvedMime,
          },
        },
        { text: prompt },
      ]);

      const text = result.response.text().trim();
      const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
      const parsed = JSON.parse(cleaned) as Omit<PronunciationEval, 'passed'>;

      const heardText = (parsed.heard || '').trim();
      const sim = wordSimilarity(heardText, targetWord);

      // Rule 1: Silence / No speech
      if (!heardText || heardText === '""' || parsed.score === 0) {
        return {
          score: 0,
          heard: '',
          phoneme_errors: [],
          feedback_vi: 'Cô chưa nghe thấy tiếng nói của con. Con hãy bấm micro và đọc to rõ ràng nhé! 🎤',
          passed: false,
        };
      }

      // Rule 2: Wrong word completely (e.g. said "dog" when target is "cat")
      if (sim < 0.5) {
        return {
          score: Math.min(25, Number(parsed.score) || 15),
          heard: heardText,
          phoneme_errors: [targetWord.toLowerCase()],
          feedback_vi: `Con ơi, cô nghe thấy con đọc là "${heardText}", trong khi từ cần đọc là "${targetWord}" (${targetVi}) cơ. Con hãy đọc lại "${targetWord}" nhé! 😊`,
          passed: false,
        };
      }

      // Rule 3: Correct target word
      const score = Math.min(100, Math.max(0, Number(parsed.score) || 0));
      const rawFeedback = (parsed as unknown as Record<string, unknown>).feedback_vi ||
                          (parsed as unknown as Record<string, unknown>).feedback_vI ||
                          (parsed as unknown as Record<string, unknown>).feedbackVi ||
                          (parsed as unknown as Record<string, unknown>).feedback ||
                          '';
      const feedback_vi = typeof rawFeedback === 'string' && rawFeedback.trim()
        ? rawFeedback.trim()
        : (score >= 70 ? `Con phát âm từ "${targetWord}" rất tốt! 👏` : `Con hãy nghe lại mẫu và thử đọc lại "${targetWord}" nhé! 😊`);

      return {
        ...parsed,
        score,
        heard: heardText,
        feedback_vi,
        passed: score >= 70,
        phoneme_errors: (parsed.phoneme_errors || []).filter((ph) => ph !== 'no_speech_detected'),
      };
    } catch (err) {
      lastErr = err;
      console.warn(`[Gemini Eval ${modelName}] failed, trying fallback...`, (err as Error)?.message?.slice(0, 100));
    }
  }

  throw lastErr;
}

/**
 * Fallback: simple string similarity for when audio eval isn't available
 */
export function simpleSimilarity(heard: string, target: string): number {
  const a = heard.toLowerCase().trim();
  const b = target.toLowerCase().trim();
  if (a === b) return 100;
  if (a.includes(b) || b.includes(a)) return 85;

  // Dice coefficient on bigrams
  const bigrams = (s: string) => {
    const set = new Set<string>();
    for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2));
    return set;
  };
  const bA = bigrams(a);
  const bB = bigrams(b);
  let intersection = 0;
  bA.forEach((bg) => { if (bB.has(bg)) intersection++; });
  const dice = (2 * intersection) / (bA.size + bB.size) || 0;
  return Math.round(dice * 100);
}
