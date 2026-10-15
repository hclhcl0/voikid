import { NextRequest,NextResponse } from 'next/server';
import {resolveFamilyAi} from '@/lib/backend/familyAi';
import { readContent } from '@/lib/backend/store';
import { readApiKeys } from '@/lib/backend/apiKeys';
export const runtime = 'nodejs';
export function GET(req?:NextRequest) {
  const pool=readApiKeys();
  let personal=false;try{personal=!!resolveFamilyAi(req);}catch{/* Evaluation reports configuration errors. */}
  return NextResponse.json({...readContent().settings.pronunciation,hasServerKey:personal||pool.keys.some(k=>k.enabled)||!!process.env.GEMINI_API_KEY},{headers:{'Cache-Control':'no-store'}});
}
