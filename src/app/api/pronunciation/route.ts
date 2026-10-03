// =============================================
// VocaKids – Pronunciation API Route
// POST /api/pronunciation
// Body: { audioBase64, mimeType, targetWord, targetVi, apiKey? }
//   apiKey: client-side localStorage key (optional, overrides env)
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { evaluatePronunciationDual } from '@/lib/pronunciation';
import { LessonPolicy } from '@/lib/pronunciation/types';
import { detectEndingSound } from '@/lib/pronunciation/endingSoundHelper';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      audioBase64: string;
      mimeType:    string;
      targetWord:  string;
      targetVi:    string;
      phonetic?:   string;
      attemptId?:  string;
      taskKind?:   'word' | 'sentence';
      acceptedResponses?: string[];
      apiKey?:     string;   // ← from client localStorage
    };

    const { audioBase64, mimeType, targetWord, targetVi, phonetic, apiKey: clientKey } = body;
    const attemptId = body.attemptId || crypto.randomUUID();
    const taskKind = body.taskKind || 'word';
    const cleanTarget = targetWord.trim();
    // Mặc định cho phép từ gốc và từ có the/a đằng trước
    const acceptedResponses = body.acceptedResponses || [
      cleanTarget,
      cleanTarget.toLowerCase(),
      `a ${cleanTarget.toLowerCase()}`,
      `the ${cleanTarget.toLowerCase()}`
    ];

    if (!audioBase64 || !targetWord) {
      return NextResponse.json(
        { error: 'Missing audioBase64 or targetWord' },
        { status: 400 },
      );
    }

    // Client key takes priority; fall back to server env
    const resolvedKey = clientKey?.trim() || process.env.GEMINI_API_KEY;

    if (!resolvedKey) {
      return NextResponse.json(
        { error: 'NO_API_KEY', message: 'Chưa cài đặt Gemini API Key. Vào ⚙️ Cài đặt để nhập key.' },
        { status: 401 },
      );
    }

    const cleanMime = (mimeType || 'audio/webm').split(';')[0].trim();
    const endingSoundInfo = detectEndingSound(cleanTarget, phonetic);

    console.log('[/api/pronunciation request]', {
      attemptId,
      targetWord: cleanTarget,
      phonetic,
      endingSound: endingSoundInfo?.phoneme,
      taskKind,
      mimeType: cleanMime,
      audioBytes: audioBase64.length,
    });

    const policy: LessonPolicy = {
      targetText: cleanTarget,
      taskKind: taskKind,
      locale: 'en-US',
      acceptedResponses: acceptedResponses,
      acceptedTranscriptAliases: [],
      policyVersion: '1.0.0',
      phonetic: phonetic || undefined,
      endingSound: endingSoundInfo?.phoneme || undefined,
    };

    const result = await evaluatePronunciationDual(
      attemptId,
      audioBase64,
      cleanMime,
      policy,
      resolvedKey,
      'off' // Mặc định ở bản đầu tiên là tắt điểm raw theo yêu cầu (scoreMode = 'off')
    );
    
    console.log('[/api/pronunciation result]', result);
    return NextResponse.json(result);

  } catch (err: unknown) {
    console.error('[/api/pronunciation]', err);
    const msg = String((err as Error)?.message || err);
    if (msg.includes('429') || msg.includes('Quota exceeded') || msg.includes('Too Many Requests')) {
      return NextResponse.json(
        {
          error: 'QUOTA_EXCEEDED',
          message: 'Tài khoản Gemini tạm hết lượt gọi miễn phí hôm nay. Vui lòng đợi 30 giây hoặc đổi Key khác trong Cài đặt!',
        },
        { status: 429 },
      );
    }
    return NextResponse.json(
      { error: 'EVAL_FAILED', message: 'Không thể phân tích âm thanh. Vui lòng nói to rõ và thử lại!', details: msg },
      { status: 500 },
    );
  }
}
