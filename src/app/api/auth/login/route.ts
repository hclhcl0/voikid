import { NextRequest, NextResponse } from 'next/server';
import { isPostgresConfigured } from '@/lib/postgres';
import { pgGetParentAccountByEmail, pgGetProfilesByOwner } from '@/lib/postgres';
import {
  verifyPassword,
  signJWT,
  setAuthCookie,
  validateEmail,
} from '@/lib/auth';
import { passwordMatches, ADMIN_COOKIE, newAdminToken } from '@/lib/backend/auth';
import { readFamilies, publicAccount, ownsProfile } from '@/lib/backend/families';

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

    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    // --- Admin Check ---
    const isSystemAdmin = passwordMatches(password);

    if (isSystemAdmin) {
      const adminEmail = cleanEmail.includes('@') ? cleanEmail : 'admin@vocakids.com';
      const adminAccount = {
        id: 'backend_admin',
        email: adminEmail,
        displayName: 'Quản trị viên (Admin)',
        role: 'admin' as const,
      };
      const profiles = readFamilies().profiles;
      const token = signJWT({
        accountId: adminAccount.id,
        email: adminAccount.email,
        displayName: adminAccount.displayName,
        role: adminAccount.role,
      });
      const res = NextResponse.json({
        success: true,
        message: 'Đăng nhập thành công với quyền Quản trị viên (Admin)! 👑',
        account: adminAccount,
        profiles,
      });
      setAuthCookie(res, token);
      const adminTok = newAdminToken();
      res.cookies.set(ADMIN_COOKIE, adminTok, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 28800, path: '/' });
      res.cookies.set(ADMIN_COOKIE, adminTok, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 28800, path: '/api/admin' });
      return res;
    }

    if (!validateEmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: 'Địa chỉ email không hợp lệ!' },
        { status: 400 }
      );
    }

    // --- Lookup account (Postgres or File-based fallback) ---
    let account: any = null;
    let passwordHash = '';
    let profiles: any[] = [];

    if (isPostgresConfigured()) {
      const found = await pgGetParentAccountByEmail(email);
      if (found) {
        account = found.account;
        passwordHash = found.passwordHash;
        profiles = await pgGetProfilesByOwner(account.id);
      }
    } else {
      const store = readFamilies();
      const cleanEmail = email.trim().toLowerCase();
      const found = store.accounts.find((a) => a.email === cleanEmail);
      if (found) {
        account = publicAccount(found);
        passwordHash = found.passwordHash;
        profiles = store.profiles.filter((p) => ownsProfile(found, p));
      }
    }

    if (!account || !passwordHash) {
      return NextResponse.json(
        { success: false, message: 'Email hoặc mật khẩu không chính xác.' },
        { status: 401 }
      );
    }

    // --- Verify password ---
    const isValid = await verifyPassword(password, passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Email hoặc mật khẩu không chính xác.' },
        { status: 401 }
      );
    }

    // --- Sign JWT ---
    const token = signJWT({
      accountId: account.id,
      email: account.email,
      displayName: account.displayName,
      role: account.role || 'parent',
    });

    // --- Build response ---
    const res = NextResponse.json({
      success: true,
      message: `Chào mừng ${account.displayName || account.email} quay lại! 👋`,
      account: {
        id: account.id,
        email: account.email,
        displayName: account.displayName,
        role: account.role || 'parent',
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
