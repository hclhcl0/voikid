import { NextRequest, NextResponse } from 'next/server';
import { isPostgresConfigured } from '@/lib/postgres';
import { pgGetParentAccountByEmail, pgGetProfilesByOwner } from '@/lib/postgres';
import {
  verifyPassword,
  signJWT,
  setAuthCookie,
  validateEmail,
} from '@/lib/auth';

export const runtime = 'nodejs';

// Simple in-memory rate limiter (resets when server restarts, good enough for basic protection)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 60_000 }); // 1 min window
    return true;
  }
  
  if (entry.count >= 10) return false; // max 10 attempts/min
  entry.count++;
  return true;
}

// POST /api/auth/login
export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: 'Quá nhiều lần thử. Vui lòng đợi 1 phút rồi thử lại.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    // --- Validation ---
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng nhập email và mật khẩu!' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Địa chỉ email không hợp lệ!' },
        { status: 400 }
      );
    }

    // --- Require PostgreSQL ---
    if (!isPostgresConfigured()) {
      return NextResponse.json(
        { success: false, message: 'Tính năng đăng nhập yêu cầu cấu hình DATABASE_URL trên server.' },
        { status: 503 }
      );
    }

    // --- Lookup account ---
    const found = await pgGetParentAccountByEmail(email);
    if (!found) {
      // Don't reveal whether email exists
      return NextResponse.json(
        { success: false, message: 'Email hoặc mật khẩu không chính xác.' },
        { status: 401 }
      );
    }

    const { account, passwordHash } = found;

    // --- Verify password ---
    const isValid = await verifyPassword(password, passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Email hoặc mật khẩu không chính xác.' },
        { status: 401 }
      );
    }

    // --- Load child profiles ---
    const profiles = await pgGetProfilesByOwner(account.id);

    // --- Sign JWT ---
    const token = signJWT({
      accountId: account.id,
      email: account.email,
      displayName: account.displayName,
    });

    // --- Build response ---
    const res = NextResponse.json({
      success: true,
      message: `Chào mừng ${account.displayName || account.email} quay lại! 👋`,
      account: {
        id: account.id,
        email: account.email,
        displayName: account.displayName,
        adminPin: account.adminPin,
      },
      profiles,
    });

    setAuthCookie(res, token);
    return res;

  } catch (err: any) {
    console.error('[Login API Error]', err);
    return NextResponse.json(
      { success: false, message: `Lỗi server: ${err?.message || 'Không thể đăng nhập'}` },
      { status: 500 }
    );
  }
}
