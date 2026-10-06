import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { evaluatePronunciationDual } from '@/lib/pronunciation/index';
import { detectEndingSound } from '@/lib/pronunciation/endingSoundHelper';
import { readContent } from '@/lib/backend/store';
import { defaultPronunciationSettings } from '@/lib/pronunciation/settings';
import type { AttemptResult, LessonPolicy } from '@/lib/pronunciation/types';
import { readApiKeys } from '@/lib/backend/apiKeys';
import { classifyProviderError, runKeyPool, type ProviderFailure } from '@/lib/pronunciation/keyPool';
export const runtime = 'nodejs';
const pending = new Map<string, { until: number; promise: Promise<AttemptResult> }>();
const limits = new Map<string, { until: number; count: number }>();
export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    if (Buffer.byteLength(raw) > 3_000_000) return NextResponse.json({ error: 'AUDIO_TOO_LARGE', message: 'Bản ghi quá lớn, hãy thu lại ngắn hơn.' }, { status: 413 });
    const body = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ error: 'INVALID_INPUT', message: 'Yêu cầu không hợp lệ.' }, { status: 400 });
    const { audioBase64, targetWord, phonetic, apiKey } = body;
    const mime = typeof body.mimeType === 'string' ? body.mimeType.split(';')[0].trim() : 'audio/webm';
    if (typeof audioBase64 !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(audioBase64) || audioBase64.length < 100 || typeof targetWord !== 'string' || !targetWord.trim() || targetWord.length > 500 || (phonetic !== undefined && (typeof phonetic !== 'string' || phonetic.length > 200)) || !['audio/webm','audio/mp4','audio/aac','audio/wav','audio/mpeg','audio/mp3','audio/ogg','audio/flac','audio/m4a'].includes(mime)) return NextResponse.json({ error: 'INVALID_INPUT', message: 'Bản ghi hoặc nội dung bài học không hợp lệ.' }, { status: 400 });
    const settings = readContent().settings.pronunciation ?? defaultPronunciationSettings;
    if (!settings.enabled) return NextResponse.json({ error: 'DISABLED', message: 'Chấm phát âm đang tạm tắt. Con vẫn có thể nghe mẫu và tự luyện.' }, { status: 503 });
    const key = typeof apiKey === 'string' && apiKey.length <= 300 ? apiKey.trim() || process.env.GEMINI_API_KEY : process.env.GEMINI_API_KEY;
    const pool = readApiKeys();
    if (!pool.keys.length && !key) return NextResponse.json({ error: 'NO_API_KEY', message: 'Chưa cấu hình Gemini API Key trong phần quản trị.' }, { status: 401 });
    const target = targetWord.trim();
    const taskKind = body.taskKind === 'sentence' ? 'sentence' : 'word';
    const attemptId = typeof body.attemptId === 'string' && /^[a-zA-Z0-9_-]{1,100}$/.test(body.attemptId) ? body.attemptId : crypto.randomUUID();
    const acceptedResponses = [target];
    if (taskKind === 'word' && settings.allowArticles) acceptedResponses.push(`a ${target}`, `the ${target}`);
    const policy: LessonPolicy = { targetText: target, taskKind, locale: 'en-US', acceptedResponses, acceptedTranscriptAliases: [], policyVersion: '2.0.0', phonetic, endingSound: detectEndingSound(target, phonetic)?.phoneme, allowRepetitions: settings.allowRepetitions };
    const now = Date.now();
    for (const [id, entry] of pending) if (entry.until < now) pending.delete(id);
    for (const [id, entry] of limits) if (entry.until < now) limits.delete(id);
    const fingerprint = createHash('sha256').update(JSON.stringify([attemptId,audioBase64,mime,policy,settings.model,settings.timeoutMs,pool.keys.length ? pool : key])).digest('hex');
    let entry = pending.get(fingerprint);
    if (!entry) {
      const ip = req.headers.get('x-forwarded-for') || 'local';
      const limit = limits.get(ip) ?? { until: now + 60000, count: 0 }; limits.set(ip,limit);
      if (++limit.count > 30 || pending.size >= 200) return NextResponse.json({ error: 'BUSY', message: 'Có nhiều lượt chấm, hãy thử lại sau một phút.' }, { status: 429 });
      const evaluate = async () => {
        if (!pool.keys.length) return evaluatePronunciationDual(attemptId,audioBase64,mime,policy,key!,'off',settings.model,settings.timeoutMs);
        const value = await runKeyPool(pool,async (secret,remainingMs) => {
          let failure: ProviderFailure | null = null;
          const result = await evaluatePronunciationDual(attemptId,audioBase64,mime,policy,secret,'off',settings.model,remainingMs,errors => {
            const reasons=errors.map(classifyProviderError);
            failure=reasons.includes('auth')?'auth':reasons.includes('quota')?'quota':reasons.includes('transient')?'transient':reasons.length?'other':null;
          });
          return {value:result,failure};
        },settings.timeoutMs);
        if (value) return value;
        throw new Error('KEY_POOL_UNAVAILABLE');
      };
      entry = { until: now + 60000, promise: evaluate().catch(error=>{pending.delete(fingerprint);throw error;}) }; pending.set(fingerprint,entry);
    }
    const result = await entry.promise;
    if (result.status === 'service_error') pending.delete(fingerprint);
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: 'INVALID_INPUT', message: 'Yêu cầu không hợp lệ.' }, { status: 400 });
    return NextResponse.json({ error: 'EVAL_FAILED', message: 'Dịch vụ chấm đang gặp trục trặc. Hãy gửi lại bản ghi.' }, { status: 503 });
  }
}
