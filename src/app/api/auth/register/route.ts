import { NextRequest, NextResponse } from 'next/server';
import { isPostgresConfigured } from '@/lib/postgres';
import {
  pgCreateParentAccount,
  pgCheckEmailExists,
  pgCreateProfileForOwner,
} from '@/lib/postgres';
import {
  hashPassword,
  signJWT,
  setAuthCookie,
  validateEmail,
  validatePassword,
  generateId,
} from '@/lib/auth';

export const runtime = 'nodejs';

// Tạo mã code ngắn gọn cho bé
function generateChildCode(name: string): string {
  const clean = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase();
  const prefix = clean.replace(/^BE/, '').slice(0, 5) || 'KID';
  const num = Math.floor(10 + Math.random() * 90);
  return `${prefix}${num}`;
}

// POST /api/auth/register
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      displayName,
      childName,
      childAvatar = '🐰',
      childGradeId = 'lop1',
      childColor = 'orange',
    } = body;

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

    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) {
      return NextResponse.json(
        { success: false, message: pwCheck.message },
        { status: 400 }
      );
    }

    if (!childName || !childName.trim()) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng nhập tên của bé!' },
        { status: 400 }
      );
    }

    // --- Require PostgreSQL ---
    if (!isPostgresConfigured()) {
      return NextResponse.json(
        { success: false, message: 'Tính năng đăng ký yêu cầu cấu hình DATABASE_URL trên server.' },
        { status: 503 }
      );
    }

    // --- Check email duplicate ---
    const emailTaken = await pgCheckEmailExists(email);
    if (emailTaken) {
      return NextResponse.json(
        { success: false, message: 'Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.' },
        { status: 409 }
      );
    }

    // --- Create parent account ---
    const accountId = generateId();
    const passwordHash = await hashPassword(password);
    const account = await pgCreateParentAccount({
      id: accountId,
      email,
      passwordHash,
      displayName: displayName?.trim() || email.split('@')[0],
    });

    // --- Create first child profile ---
    const profileId = `child_${generateId().replace(/-/g, '').slice(0, 12)}`;
    const childCode = generateChildCode(childName.trim());
    const firstProfile = await pgCreateProfileForOwner({
      id: profileId,
      name: childName.trim(),
      avatar: childAvatar,
      gradeId: childGradeId,
      color: childColor,
      code: childCode,
      ownerId: accountId,
    });

    // --- Sign JWT ---
    const token = signJWT({
      accountId: account.id,
      email: account.email,
      displayName: account.displayName,
    });

    // --- Build response ---
    const res = NextResponse.json({
      success: true,
      message: `Chào mừng ${account.displayName || account.email}! Tài khoản đã được tạo thành công 🎉`,
      account: {
        id: account.id,
        email: account.email,
        displayName: account.displayName,
      },
      firstProfile,
    });

    setAuthCookie(res, token);
    return res;

  } catch (err: any) {
    console.error('[Register API Error]', err);
    return NextResponse.json(
      { success: false, message: `Lỗi server: ${err?.message || 'Không thể tạo tài khoản'}` },
      { status: 500 }
    );
  }
}
