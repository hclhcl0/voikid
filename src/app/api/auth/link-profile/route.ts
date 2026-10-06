import { NextRequest, NextResponse } from 'next/server';
import { readFamilies } from '@/lib/backend/families';
import { getAccountFromRequest } from '@/lib/auth';
import {
  isPostgresConfigured,
  pgLinkProfileToOwner,
  pgSyncProgress,
  pgCreateProfile,
} from '@/lib/postgres';

export const runtime = 'nodejs';

// POST /api/auth/link-profile — Gán hồ sơ (từ chế độ Khách) vào tài khoản cá nhân đã đăng nhập
export async function POST(req: NextRequest) {
  try {
    const payload = getAccountFromRequest(req);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Bạn cần đăng nhập để liên kết hồ sơ.' },
        { status: 401 }
      );
    }

    if (readFamilies().accounts.some(a => a.id === payload.accountId)) return NextResponse.json({ success: false, message: 'Thêm học sinh trong trang Phụ huynh; không tự liên kết hồ sơ bên ngoài.' }, { status: 403 });
    const body = await req.json();
    const { profile, progress } = body;

    if (!profile || !profile.id) {
      return NextResponse.json(
        { success: false, message: 'Thiếu thông tin hồ sơ cần liên kết.' },
        { status: 400 }
      );
    }

    if (!isPostgresConfigured()) {
      return NextResponse.json({
        success: true,
        message: 'Đã lưu hồ sơ (server chưa kết nối PostgreSQL).',
      });
    }

    // Tạo hoặc cập nhật hồ sơ với owner_id
    await pgCreateProfile(
      {
        ...profile,
        ownerId: payload.accountId,
      } as any,
      progress
    );

    await pgLinkProfileToOwner(profile.id, payload.accountId);

    if (progress) {
      await pgSyncProgress(profile.id, progress, profile);
    }

    return NextResponse.json({
      success: true,
      message: `Đã liên kết hồ sơ của ${profile.name} vào tài khoản cá nhân thành công! 🎉`,
    });
  } catch (err: any) {
    console.error('[Link Profile Error]', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'Không thể liên kết hồ sơ' },
      { status: 500 }
    );
  }
}
