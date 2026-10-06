import { NextResponse } from 'next/server';
import { readContent } from '@/lib/backend/store';
import { readApiKeys } from '@/lib/backend/apiKeys';
export const runtime = 'nodejs';
export function GET() {
  const pool=readApiKeys();
  return NextResponse.json({...readContent().settings.pronunciation,hasServerKey:pool.keys.length ? pool.keys.some(k=>k.enabled) : !!process.env.GEMINI_API_KEY},{headers:{'Cache-Control':'no-store'}});
}
