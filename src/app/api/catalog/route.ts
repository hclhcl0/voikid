import { NextResponse } from 'next/server';
import { readContent } from '@/lib/backend/store';
import {readFamilies} from '@/lib/backend/families';
import {sharedVocabulary} from '@/lib/sharedVocabulary';
export const runtime = 'nodejs';
export function GET() {
  try { const data = readContent(),families=readFamilies();const adminIds=new Set(['backend_admin',...families.accounts.filter(a=>a.role==='admin').map(a=>a.id)]);const adminCategories=[...adminIds].flatMap(id=>families.categories[id]??[]);return NextResponse.json({ ...data, categories: sharedVocabulary(data.categories,adminCategories) }, { headers: { 'Cache-Control': 'no-store' } }); }
  catch { return NextResponse.json({ message: 'Không đọc được học liệu.' }, { status: 500 }); }
}
