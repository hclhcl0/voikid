import { NextRequest, NextResponse } from 'next/server';
import { readFamilies, publicAccount, ownsProfile } from '@/lib/backend/families';
import { getAccountFromRequest,clearAuthCookie,clearAdminSessionCookies } from '@/lib/auth';
import { isBackendAdmin } from '@/lib/backend/auth';
import { isPostgresConfigured, pgGetParentAccountById, pgGetProfilesByOwner } from '@/lib/postgres';

export const runtime = 'nodejs';

// GET /api/auth/me — Trả về thông tin tài khoản đang đăng nhập + danh sách hồ sơ bé
export async function GET(req: NextRequest) {
  try {
    const payload = getAccountFromRequest(req);
    const isAdmin = isBackendAdmin(req);
    if(payload?.role==='admin'&&!isAdmin){
      const response=NextResponse.json({success:false,message:'Phiên quản trị cũ đã hết hiệu lực. Vui lòng đăng nhập lại đúng tài khoản.'},{status:401,headers:{'Cache-Control':'no-store'}});
      clearAuthCookie(response);clearAdminSessionCookies(response);return response;
    }

    if (isAdmin) {
      const family = readFamilies();
      return NextResponse.json({
        success: true,
        account: {
          id: 'backend_admin',
          email: payload?.email || 'admin@vocakids.local',
          displayName: payload?.displayName || 'Quản trị viên (Admin)',
          role: 'admin',
        },
        profiles: family.profiles,
        isGuest: false,
      }, { headers: { 'Cache-Control': 'no-store' } });
    }

    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Chưa đăng nhập hoặc phiên đã hết hạn.' },
        { status: 401 }
      );
    }

    const family = readFamilies();
    const member = family.accounts.find(a => a.id === payload.accountId);
    if (member) return NextResponse.json({ success: true, account: publicAccount(member), profiles: family.profiles.filter(p => ownsProfile(member,p)), isGuest: false }, { headers: { 'Cache-Control': 'no-store' } });
    if (payload.role && !member) return NextResponse.json({ success: false, message: 'Tài khoản không còn tồn tại.' }, { status: 401 });

    // If PostgreSQL is not configured, return payload-only (from JWT)
    if (!isPostgresConfigured()) {
      return NextResponse.json({
        success: true,
        account: {
          id: payload.accountId,
          email: payload.email,
          displayName: payload.displayName,
        },
        profiles: [],
        isGuest: false,
      });
    }

    // Fetch full account + profiles from DB
    const account = await pgGetParentAccountById(payload.accountId);
    if (!account) {
      // Token references deleted account
      return NextResponse.json(
        { success: false, message: 'Tài khoản không còn tồn tại.' },
        { status: 401 }
      );
    }

    const profiles = await pgGetProfilesByOwner(account.id);

    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        email: account.email,
        displayName: account.displayName,
        adminPin: account.adminPin,
      },
      profiles,
      isGuest: false,
    });

  } catch (err: any) {
    console.error('[Auth/me Error]', err);
    return NextResponse.json(
      { success: false, message: `Lỗi server: ${err?.message || 'Không thể lấy thông tin tài khoản'}` },
      { status: 500 }
    );
  }
}
