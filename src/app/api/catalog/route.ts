import { NextResponse } from 'next/server';
import { readContent } from '@/lib/backend/store';
export const runtime = 'nodejs';
export function GET() {
  try { const data = readContent(); return NextResponse.json({ ...data, categories: data.categories.filter(c => !c.archived) }, { headers: { 'Cache-Control': 'no-store' } }); }
  catch { return NextResponse.json({ message: 'Không đọc được học liệu.' }, { status: 500 }); }
}
