import { NextRequest, NextResponse } from 'next/server';
import { isBackendAdmin, sameOrigin } from '@/lib/backend/auth';
import { readContent, writeContent } from '@/lib/backend/store';
export const runtime = 'nodejs';
export function GET(req: NextRequest) {
  if (!isBackendAdmin(req)) return NextResponse.json({ message: 'Cần đăng nhập quản trị.' }, { status: 401 });
  try { return NextResponse.json(readContent(), { headers: { 'Cache-Control': 'no-store' } }); }
  catch { return NextResponse.json({ message: 'Không đọc được dữ liệu server.' }, { status: 500 }); }
}
export async function PUT(req: NextRequest) {
  if (!sameOrigin(req) || !isBackendAdmin(req)) return NextResponse.json({ message: 'Không có quyền lưu dữ liệu.' }, { status: 403 });
  try {
    const raw = await req.text();
    if (Buffer.byteLength(raw) > 5_000_000) return NextResponse.json({ message: 'Dữ liệu vượt 5 MB.' }, { status: 413 });
    return NextResponse.json(writeContent(JSON.parse(raw)));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Không lưu được dữ liệu.';
    if (message === 'CONFLICT') return NextResponse.json({ message: 'Dữ liệu đã được thay đổi ở phiên khác. Tải lại trước khi sửa.' }, { status: 409 });
    if (error instanceof SyntaxError || (error instanceof Error && !('code' in error))) return NextResponse.json({ message }, { status: 400 });
    return NextResponse.json({ message: 'Không ghi được dữ liệu server.' }, { status: 500 });
  }
}
