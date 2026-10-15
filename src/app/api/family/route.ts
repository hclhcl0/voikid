import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { getAccountFromRequest, hashPassword, verifyPassword, signJWT, setAuthCookie, validateEmail, validatePassword } from '@/lib/auth';
import { sameOrigin, isBackendAdmin, ADMIN_COOKIE, newAdminToken, passwordMatches } from '@/lib/backend/auth';
import { readFamilies, writeFamilies, publicAccount, createFamilyProfile, emptyProgress, ownsProfile, familyId } from '@/lib/backend/families';
import { validateContent, defaultSettings } from '@/lib/backend/types';
export const runtime = 'nodejs';
const attempts = new Map<string, { count: number; until: number }>();
export function GET(req: NextRequest) {
  const payload = getAccountFromRequest(req); const store = readFamilies(); const account = isBackendAdmin(req) ? { id: 'backend_admin', email: 'admin@vocakids.local', displayName: 'Quản trị viên (Admin)', passwordHash: '', role: 'admin' as const } : store.accounts.find(a => a.id === payload?.accountId);
  if (!account) return NextResponse.json({ success: false, message: 'Cần đăng nhập.' }, { status: 401 });
  const profiles = store.profiles.filter(p => ownsProfile(account, p));
  const parents = account.role === 'admin' 
    ? store.accounts.filter(a => a.role === 'parent').map(a => ({
        id: a.id,
        email: a.email,
        displayName: a.displayName,
        role: a.role,
        children: store.profiles.filter(p => p.ownerId === a.id).map(p => ({
          id: p.id,
          name: p.name,
          gradeId: p.gradeId,
          avatar: p.avatar,
          stars: store.progresses[p.id]?.totalStars ?? 0,
          wordsStudied: Object.keys(store.progresses[p.id]?.wordProgress ?? {}).length,
          lastActiveDate: store.progresses[p.id]?.lastActiveDate || '',
        })),
        customWordsCount: (store.categories[a.id] ?? []).reduce((n, c) => n + c.words.length, 0),
      }))
    : [];

  return NextResponse.json({ 
    success: true, 
    account: publicAccount(account), 
    profiles, 
    progresses: Object.fromEntries(profiles.map(p => [p.id, store.progresses[p.id] ?? emptyProgress()])), 
    categories: store.categories[familyId(account)] ?? [], 
    revision: store.revisions[familyId(account)] ?? 0, 
    studentAccounts: account.role !== 'student' ? store.accounts.filter(a => a.role === 'student' && (account.role === 'admin' || a.parentId === account.id)).map(publicAccount) : [],
    parents,
  }, { headers: { 'Cache-Control': 'no-store' } });
}
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return NextResponse.json({ success: false, message: 'Nguồn yêu cầu không hợp lệ.' }, { status: 403 });
  try {
    const body = await req.json();
    if (body.action === 'register' || body.action === 'login') {
      const key = req.headers.get('x-forwarded-for') || 'local'; const now = Date.now();
      for (const [id, entry] of attempts) if (entry.until < now) attempts.delete(id);
      const entry = attempts.get(key) ?? { count: 0, until: now + 60000 }; attempts.set(key, entry);
      if (++entry.count > 10) return NextResponse.json({ success: false, message: 'Thử lại sau một phút.' }, { status: 429 });

      let account;
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      const password = typeof body.password === 'string' ? body.password : '';

      const isSystemAdmin = body.action === 'login' && passwordMatches(password);

      if (isSystemAdmin) {
        account = { id: 'backend_admin', email: email.includes('@') ? email : 'admin@vocakids.com', displayName: 'Quản trị viên (Admin)', passwordHash: '', role: 'admin' as const };
      } else {
        if (!email || !password || !validateEmail(email) || !validatePassword(password).valid) {
          throw new Error('Email hoặc mật khẩu không hợp lệ.');
        }
        if (body.action === 'register') {
          const store = readFamilies();
          if (store.accounts.some(a => a.email === email)) throw new Error('Email đã được sử dụng.');
          const passwordHash = await hashPassword(password);
          account = { id: randomUUID(), email, displayName: String(body.displayName || email).slice(0,80), passwordHash, role: 'parent' as const };
          const profile = createFamilyProfile(account.id, String(body.childName || ''), String(body.childGradeId || 'lop1'), String(body.childAvatar || '🐰').slice(0,32));
          store.accounts.push(account); store.profiles.push(profile); store.progresses[profile.id] = emptyProgress(); writeFamilies(store);
        } else {
          account = readFamilies().accounts.find(a => a.email === email);
          if (!account || !await verifyPassword(password, account.passwordHash)) return NextResponse.json({ success: false, message: 'Email hoặc mật khẩu không đúng.' }, { status: 401 });
        }
      }


      attempts.delete(key);
      const store = readFamilies(); const profiles = store.profiles.filter(p => ownsProfile(account, p));
      const message = account.role === 'admin' ? 'Đã đăng nhập với quyền Quản trị viên (Admin).' : 'Đã đăng nhập.';
      const response = NextResponse.json({ success: true, message, account: publicAccount(account), profiles, firstProfile: profiles[0] });
      setAuthCookie(response, signJWT({ accountId: account.id, email: account.email, displayName: account.displayName, role: account.role }));

      if (account.role === 'admin') {
        const adminTok = newAdminToken();
        response.cookies.set(ADMIN_COOKIE, adminTok, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 28800, path: '/' });
        response.cookies.set(ADMIN_COOKIE, adminTok, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 28800, path: '/api/admin' });
      }

      return response;
    }

    const payload = getAccountFromRequest(req); const initial = readFamilies(); const account = isBackendAdmin(req) ? { id: 'backend_admin', email: '', displayName: 'Admin', passwordHash: '', role: 'admin' as const } : initial.accounts.find(a => a.id === payload?.accountId);
    if (!account || account.role === 'student') return NextResponse.json({ success: false, message: 'Chỉ phụ huynh được quản lý học sinh và kho từ.' }, { status: 403 });
    if (body.action === 'create_student') {
      if (typeof body.name !== 'string' || typeof body.gradeId !== 'string' || typeof body.email !== 'string' || typeof body.password !== 'string' || !validateEmail(body.email) || !validatePassword(body.password).valid) throw new Error('Nhập tên, lớp, email và mật khẩu từ 6 ký tự.');
      const passwordHash = await hashPassword(body.password); const store = readFamilies(); const email = body.email.trim().toLowerCase();
      if (store.accounts.some(a => a.email === email)) throw new Error('Email đã được sử dụng.');
      const existing = body.profileId ? store.profiles.find(p => p.id === body.profileId && ownsProfile(account,p)) : undefined;
      if (body.profileId && (!existing || store.accounts.some(a => a.profileId === existing.id))) throw new Error('Hồ sơ không thuộc phụ huynh hoặc đã có đăng nhập.');
      const profile = existing ?? createFamilyProfile(account.id, body.name, body.gradeId);
      if (!existing) { store.profiles.push(profile); store.progresses[profile.id] = emptyProgress(); }
      store.accounts.push({ id: randomUUID(), email, displayName: profile.name, passwordHash, role: 'student', parentId: profile.ownerId, profileId: profile.id }); writeFamilies(store);
    } else if (body.action === 'save_categories') {
      validateContent({ revision: 0, categories: body.categories, settings: defaultSettings, updatedAt: '' });
      if (body.revision !== (initial.revisions[account.id] ?? 0)) return NextResponse.json({ success: false, message: 'Kho từ đã đổi, tải lại trước khi lưu.' }, { status: 409 });
      initial.categories[account.id] = body.categories; initial.revisions[account.id] = (initial.revisions[account.id] ?? 0) + 1; writeFamilies(initial);
    } else if (body.action === 'update_student') {
      const profile = initial.profiles.find(p => p.id === body.profileId && ownsProfile(account,p));
      if (!profile) return NextResponse.json({ success: false, message: 'Không có quyền với học sinh này.' }, { status: 403 });
      const validated = createFamilyProfile(account.id, body.name, body.gradeId); profile.name = validated.name; profile.gradeId = validated.gradeId; writeFamilies(initial);
    } else if (body.action === 'admin_reset_password') {
      if (account.role !== 'admin') return NextResponse.json({ success: false, message: 'Chỉ Admin mới có quyền đổi mật khẩu.' }, { status: 403 });
      const target = initial.accounts.find(a => a.id === body.parentId);
      if (!target) return NextResponse.json({ success: false, message: 'Không tìm thấy tài khoản phụ huynh.' }, { status: 404 });
      if (!body.newPassword || String(body.newPassword).length < 6) throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự.');
      target.passwordHash = await hashPassword(String(body.newPassword));
      writeFamilies(initial);
      return NextResponse.json({ success: true, message: `Đã đổi mật khẩu cho ${target.email} thành công.` });
    } else if (body.action === 'admin_delete_parent') {
      if (account.role !== 'admin') return NextResponse.json({ success: false, message: 'Chỉ Admin mới có quyền xóa tài khoản.' }, { status: 403 });
      const targetId = String(body.parentId);
      const target = initial.accounts.find(a => a.id === targetId);
      if (!target) return NextResponse.json({ success: false, message: 'Không tìm thấy tài khoản phụ huynh.' }, { status: 404 });
      const childIds = initial.profiles.filter(p => p.ownerId === targetId).map(p => p.id);
      initial.profiles = initial.profiles.filter(p => p.ownerId !== targetId);
      for (const cid of childIds) {
        delete initial.progresses[cid];
      }
      initial.accounts = initial.accounts.filter(a => a.id !== targetId && a.parentId !== targetId);
      delete initial.categories[targetId];
      delete initial.revisions[targetId];
      writeFamilies(initial);
      return NextResponse.json({ success: true, message: `Đã xóa tài khoản ${target.email} và dữ liệu liên quan.` });
    } else if (body.action === 'admin_create_parent') {
      if (account.role !== 'admin') return NextResponse.json({ success: false, message: 'Chỉ Admin mới có quyền tạo tài khoản.' }, { status: 403 });
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      if (!email || !password || !validateEmail(email) || !validatePassword(password).valid) throw new Error('Email hoặc mật khẩu không hợp lệ.');
      if (initial.accounts.some(a => a.email === email)) throw new Error('Email này đã được sử dụng.');
      const passwordHash = await hashPassword(password);
      const newAccount = { id: randomUUID(), email, displayName: String(body.displayName || email).slice(0, 80), passwordHash, role: 'parent' as const };
      const profile = createFamilyProfile(newAccount.id, String(body.childName || 'Bé').slice(0, 80), String(body.childGradeId || 'lop1'), String(body.childAvatar || '🐰'));
      initial.accounts.push(newAccount);
      initial.profiles.push(profile);
      initial.progresses[profile.id] = emptyProgress();
      writeFamilies(initial);
      return NextResponse.json({ success: true, message: `Đã tạo tài khoản cho phụ huynh ${email}.` });
    } else throw new Error('Thao tác không hợp lệ.');
    return GET(req);
  } catch (error) { return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Không thực hiện được thao tác.' }, { status: 400 }); }
}
