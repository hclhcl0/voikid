import { NextRequest, NextResponse } from 'next/server';
import { getAccountFromRequest, clearAuthCookie } from '@/lib/auth';

export const runtime = 'nodejs';

// POST /api/auth/logout
export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true, message: 'Đã đăng xuất thành công.' });
  clearAuthCookie(res);
  return res;
}

// GET /api/auth/logout (Support both methods)
export async function GET(req: NextRequest) {
  const res = NextResponse.json({ success: true, message: 'Đã đăng xuất thành công.' });
  clearAuthCookie(res);
  return res;
}
