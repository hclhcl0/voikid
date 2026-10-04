// =============================================
// VocaKids – Word Image Generation API
// POST /api/word/image
// Nhận từ tiếng Anh → Gemini Imagen 3 → Trả URL ảnh cartoon cho trẻ em
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ImageRequestBody {
  word: string;
  vi?: string;
  emoji?: string;
  apiKey?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as ImageRequestBody;
    const { word, vi = '', emoji = '', apiKey: bodyKey } = body;

    if (!word?.trim()) {
      return NextResponse.json({ error: 'MISSING_WORD' }, { status: 400 });
    }

    const apiKey = bodyKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'NO_API_KEY' }, { status: 401 });
    }

    const cleanWord = word.trim();

    // Build child-safe, educational image prompt
    const prompt = buildKidsImagePrompt(cleanWord, vi, emoji);

    const genAI = new GoogleGenerativeAI(apiKey);

    // Try Gemini imagen-3.0-generate-002 first, then fallback models
    const imagenModels = [
      'imagen-3.0-generate-002',
      'imagen-3.0-fast-generate-001',
    ];

    let imageBase64: string | null = null;
    let mimeType: string = 'image/png';
    let lastErr: unknown = null;

    for (const modelName of imagenModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName }) as any;
        if (typeof model.generateImages === 'function') {
          const result = await model.generateImages({
            prompt,
            number_of_images: 1,
            aspect_ratio: '1:1',
            safety_filter_level: 'block_low_and_above',
            person_generation: 'dont_allow',
          });

          const img = result?.images?.[0];
          if (img?.bytesBase64Encoded) {
            imageBase64 = img.bytesBase64Encoded;
            mimeType = img.mimeType || 'image/png';
            break;
          }
        }
      } catch (e) {
        lastErr = e;
        console.warn(`[/api/word/image] Model ${modelName} failed:`, e);
      }
    }

    // If Imagen failed (quota/model unavailable), try gemini-2.0-flash-exp with image generation
    if (!imageBase64) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp-image-generation' });
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ['IMAGE'],
          } as any,
        });

        const parts = result.response.candidates?.[0]?.content?.parts as any[];
        if (parts) {
          for (const part of parts) {
            if (part?.inlineData?.data) {
              imageBase64 = part.inlineData.data;
              mimeType = part.inlineData.mimeType || 'image/png';
              break;
            }
          }
        }
      } catch (e) {
        lastErr = e;
        console.warn('[/api/word/image] gemini-2.0-flash-exp-image-generation failed:', e);
      }
    }

    if (!imageBase64) {
      // Return a helpful error – the caller should fall back to Twemoji
      console.error('[/api/word/image] All image models failed:', lastErr);
      return NextResponse.json(
        { error: 'IMAGE_GENERATION_FAILED', details: String(lastErr), fallback: true },
        { status: 503 }
      );
    }

    // Return base64 image as data URL so caller can display or save it
    const dataUrl = `data:${mimeType};base64,${imageBase64}`;
    return NextResponse.json({ success: true, imageUrl: dataUrl, source: 'gemini' });

  } catch (err) {
    console.error('[/api/word/image]', err);
    return NextResponse.json({ error: 'UNEXPECTED_ERROR', details: String(err) }, { status: 500 });
  }
}

function buildKidsImagePrompt(word: string, vi: string, emoji: string): string {
  const viHint = vi ? ` (Vietnamese: ${vi})` : '';
  const emojiHint = emoji ? `, similar to ${emoji}` : '';

  return `Create a simple, cute cartoon illustration of "${word}"${viHint}${emojiHint}.

Style requirements:
- Flat design / vector cartoon style
- Bright, cheerful, vivid colors (primary palette: yellow, orange, blue, green, pink)
- Clean white or very light background  
- Bold black outlines
- No text or letters in the image
- Safe and appropriate for children aged 4-10 years
- The main subject should be centered and fill most of the frame
- Simple enough to be recognized at a glance (like a flashcard illustration)
- Educational and friendly, not scary or violent
- No realistic photos or photorealistic style

The image is for a vocabulary flashcard for Vietnamese elementary school children learning English.`;
}
