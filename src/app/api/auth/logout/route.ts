import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';
import { ADMIN_COOKIE } from '@/lib/backend/auth';

export const runtime = 'nodejs';

// POST /api/auth/logout
export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true, message: 'Đã đăng xuất thành công.' });
  clearAuthCookie(res);
  res.cookies.set(ADMIN_COOKIE, '', { path: '/', maxAge: 0 });
  res.cookies.set(ADMIN_COOKIE, '', { path: '/api/admin', maxAge: 0 });
  return res;
}

// GET /api/auth/logout (Support both methods)
export async function GET(req: NextRequest) {
  const res = NextResponse.json({ success: true, message: 'Đã đăng xuất thành công.' });
  clearAuthCookie(res);
  res.cookies.set(ADMIN_COOKIE, '', { path: '/', maxAge: 0 });
  res.cookies.set(ADMIN_COOKIE, '', { path: '/api/admin', maxAge: 0 });
  return res;
}

