// =============================================
// VocaKids – API Key Test Route
// POST /api/test-key
// Body: { apiKey: string }
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { apiKey?: string };
    const apiKey = body?.apiKey;
    const rawKey = (apiKey?.trim() || process.env.GEMINI_API_KEY || '').trim();

    // Tự động làm sạch: trích xuất key hợp lệ (kể cả khi bị dán lặp 2 lần hoặc dính khoảng trắng)
    const match = rawKey.match(/(AQ\.[A-Za-z0-9_-]+|AIza[A-Za-z0-9_-]+)/);
    const resolvedKey = match ? match[1] : rawKey;

    if (!resolvedKey) {
      return NextResponse.json({ error: 'No API key provided' }, { status: 400 });
    }

    console.log('[/api/test-key key check]', {
      rawLength: rawKey.length,
      sanitizedLength: resolvedKey.length,
      prefix: resolvedKey.slice(0, 10),
      suffix: resolvedKey.slice(-6),
      fromEnv: !apiKey?.trim(),
    });

    // Try a minimal Gemini call to verify the key works
    const genAI = new GoogleGenerativeAI(resolvedKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });

    const result = await model.generateContent('Say "OK" in one word.');
    const text   = result.response.text();

    if (text) {
      return NextResponse.json({ ok: true, response: text.trim(), fromEnv: !apiKey?.trim() });
    }

    return NextResponse.json({ error: 'Empty response' }, { status: 500 });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[/api/test-key error]', msg);
    const isInvalid = msg.includes('API_KEY_INVALID') || msg.includes('401') || msg.includes('403') || msg.includes('quota');
    return NextResponse.json(
      { error: isInvalid ? 'Invalid API key' : 'Connection error', details: msg },
      { status: isInvalid ? 401 : 500 },
    );
  }
}
