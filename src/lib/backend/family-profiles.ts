import { NextRequest, NextResponse } from 'next/server';
import { getAccountFromRequest } from '@/lib/auth';
import { sameOrigin,isBackendAdmin } from './auth';
import {mergeStoryLibrary} from '@/lib/stories/library';
import {mergeIpaPractice} from '@/lib/ipa/practice';
import {mergeStickers,mergeStickerStudyDays,progressResetTime} from '@/lib/stickers';
import { readFamilies, writeFamilies, ownsProfile, createFamilyProfile, emptyProgress } from './families';
export function familyProfileRequest(req: NextRequest, body?: Record<string, unknown>): NextResponse | null {
  const payload = getAccountFromRequest(req); const store = readFamilies(); const account = isBackendAdmin(req)?{id:'backend_admin',email:'',displayName:'Admin',passwordHash:'',role:'admin' as const}:store.accounts.find(a => a.id === payload?.accountId);
  if (!account) {
    if (payload?.role) return NextResponse.json({ success: false, message: 'Phiên không còn hợp lệ.' }, { status: 401 });
    if (body && String(body.profileId || (body.profile as { id?: string })?.id || body.query || '').startsWith('student_')) return NextResponse.json({ success: false, message: 'Cần đăng nhập học sinh hoặc phụ huynh.' }, { status: 401 });
    return null;
  }
  const profiles = store.profiles.filter(p => ownsProfile(account,p));
  const denied = () => NextResponse.json({ success: false, message: 'Không có quyền với hồ sơ này.' }, { status: 403 });
  if (!body) return NextResponse.json({ success: true, profiles, source: 'family', exclusive: true });
  if (!sameOrigin(req)) return denied();
  const action = body.action;
  if (action === 'login') {
    const profile = profiles.find(p => p.id === body.query || p.code === body.query || p.name === body.query);
    return profile ? NextResponse.json({ success: true, profile, progress: store.progresses[profile.id] ?? emptyProgress() }) : denied();
  }
  const profile = profiles.find(p => p.id === body.profileId);
  if(account.role==='admin'&&!profile&&action==='sync'&&!String(body.profileId).startsWith('student_')) return null;
  if (action === 'sync') {
    if (!profile || !body.progress || typeof body.progress !== 'object') return denied();
    // Learning progress can be written by its student; profile metadata cannot.
    const incoming=body.progress as ReturnType<typeof emptyProgress>;
    const saved=store.progresses[profile.id]??emptyProgress();
    if(progressResetTime(incoming)<progressResetTime(saved)) return NextResponse.json({success:true,message:'Tiến độ đã được đặt lại trên thiết bị khác. Tải lại hồ sơ.'});
    const current=progressResetTime(incoming)>progressResetTime(saved)?emptyProgress():saved;
    store.progresses[profile.id] = {...incoming,...mergeStoryLibrary(current,incoming,profile.id),ipaPractice:mergeIpaPractice(current.ipaPractice,incoming.ipaPractice,profile.id),stickers:mergeStickers(current.stickers,incoming.stickers),stickerStudyDays:mergeStickerStudyDays(current.stickerStudyDays,incoming.stickerStudyDays)}; writeFamilies(store);
    return NextResponse.json({ success: true });
  }
  if (account.role !== 'parent'&&account.role!=='admin') return denied();
  if (action === 'create') {
    const input = body.profile as { id?: string; name: string; gradeId: string; avatar: string };
    if (!input || typeof input.name !== 'string') return denied();
    const created = createFamilyProfile(account.id,input.name,input.gradeId,input.avatar);
    // The browser creates a random ID before syncing; claim only a globally unused ID.
    if (input.id && /^[a-zA-Z0-9_-]{1,120}$/.test(input.id) && !store.profiles.some(p => p.id === input.id)) created.id = input.id;
    else if (input.id) return denied();
    store.profiles.push(created); store.progresses[created.id] = emptyProgress(); writeFamilies(store);
    return NextResponse.json({ success: true, profile: created });
  }
  if (!profile) return denied();
  if (action === 'update') {
    const changes = body.data as { name?: string; gradeId?: string; avatar?: string };
    const validated = createFamilyProfile(account.id,changes.name ?? profile.name,changes.gradeId ?? profile.gradeId,changes.avatar ?? profile.avatar);
    Object.assign(profile,{name:validated.name,gradeId:validated.gradeId,avatar:validated.avatar}); writeFamilies(store); return NextResponse.json({ success: true });
  }
  if (action === 'delete') {
    store.profiles = store.profiles.filter(p => p.id !== profile.id); store.accounts = store.accounts.filter(a => a.profileId !== profile.id); delete store.progresses[profile.id]; writeFamilies(store); return NextResponse.json({ success: true });
  }
  return denied();
}
