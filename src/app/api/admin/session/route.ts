import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminPassword, isBackendAdmin, newAdminToken, passwordMatches, sameOrigin } from '@/lib/backend/auth';
import { signJWT, setAuthCookie, clearAuthCookie } from '@/lib/auth';
export const runtime = 'nodejs';
const attempts = new Map<string, { count: number; until: number }>();
export function GET(req: NextRequest) { return NextResponse.json({ authenticated: isBackendAdmin(req), configured: !!adminPassword() }, { headers: { 'Cache-Control': 'no-store' } }); }
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return NextResponse.json({ message: 'Nguồn yêu cầu không hợp lệ.' }, { status: 403 });
  if (!adminPassword()) return NextResponse.json({ message: 'Cần cấu hình VOCAKIDS_ADMIN_PASSWORD trên server.' }, { status: 503 });
  const key = req.headers.get('x-forwarded-for') || 'local';
  const now = Date.now();
  for (const [id, entry] of attempts) if (entry.until < now) attempts.delete(id);
  const entry = attempts.get(key) || { count: 0, until: now + 60000 };
  if (++entry.count > 8) return NextResponse.json({ message: 'Thử lại sau một phút.' }, { status: 429 });
  attempts.set(key, entry);
  try {
    const body = await req.json();
    if (!passwordMatches(body.password)) return NextResponse.json({ message: 'Mật khẩu không đúng.' }, { status: 401 });
    attempts.delete(key);
    const account = { id: 'backend_admin', email: 'admin@vocakids.local', displayName: 'Quản trị viên (Admin)', role: 'admin' as const };
    const response = NextResponse.json({ authenticated: true, success: true, account });
    const token = newAdminToken();
    response.cookies.set(ADMIN_COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 28800, path: '/' });
    response.cookies.set(ADMIN_COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 28800, path: '/api/admin' });
    setAuthCookie(response, signJWT({ accountId: account.id, email: account.email, displayName: account.displayName, role: account.role }));
    return response;
  } catch { return NextResponse.json({ message: 'Yêu cầu không hợp lệ.' }, { status: 400 }); }
}
export function DELETE(req: NextRequest) {
  if (!sameOrigin(req)) return NextResponse.json({ message: 'Nguồn yêu cầu không hợp lệ.' }, { status: 403 });
  const response = NextResponse.json({ authenticated: false, success: true });
  response.cookies.set(ADMIN_COOKIE, '', { path: '/', maxAge: 0 });
  response.cookies.set(ADMIN_COOKIE, '', { path: '/api/admin', maxAge: 0 });
  clearAuthCookie(response);
  return response;
}

