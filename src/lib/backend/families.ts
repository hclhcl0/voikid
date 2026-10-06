import * as fs from 'node:fs';
import * as path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { UserProfile, AppProgress } from '@/types';
import type { CustomCategory } from '@/hooks/useCustomCategories';
export interface FamilyAccount { id: string; email: string; displayName: string; passwordHash: string; role: 'admin' | 'parent' | 'student'; parentId?: string; profileId?: string }
export interface FamilyStore { accounts: FamilyAccount[]; profiles: (UserProfile & { ownerId: string })[]; progresses: Record<string, AppProgress>; categories: Record<string, CustomCategory[]>; revisions: Record<string, number> }
const directory = process.env.VOCAKIDS_FAMILY_DIR || path.join(process.cwd(), 'data', 'families');
const file = path.join(directory, 'families.json');
export function readFamilies(): FamilyStore {
  if (!fs.existsSync(/* turbopackIgnore: true */ file)) return { accounts: [], profiles: [], progresses: {}, categories: {}, revisions: {} };
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
export function writeFamilies(data: FamilyStore) {
  fs.mkdirSync(directory, { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`; fs.writeFileSync(tmp, JSON.stringify(data, null, 2), { mode: 0o600 }); fs.renameSync(tmp, file);
}
export function publicAccount(account: FamilyAccount) { return { id: account.id, email: account.email, displayName: account.displayName, role: account.role, parentId: account.parentId, profileId: account.profileId }; }
export function ownsProfile(account: FamilyAccount, profile: FamilyStore['profiles'][number]) { return account.role === 'admin' || (account.role === 'parent' ? profile.ownerId === account.id : profile.ownerId === account.parentId && profile.id === account.profileId); }
export function familyId(account: FamilyAccount) { return account.role !== 'student' ? account.id : account.parentId!; }
export function emptyProgress(): AppProgress { return { totalStars: 0, streak: 0, lastActiveDate: '', wordProgress: {}, dailyStats: [], stickers: [], badges: [], unitTestResults: {}, unlockedUnits: [], totalPoints: 0 }; }
export function createFamilyProfile(ownerId: string, name: string, gradeId: string, avatar = '🐰'): FamilyStore['profiles'][number] {
  if (!name.trim() || name.length > 80 || !['maugiao','lop1','lop2','lop3','lop4','lop5'].includes(gradeId)) throw new Error('Tên học sinh hoặc lớp không hợp lệ.');
  const id = `student_${randomUUID()}`;
  return { id, ownerId, name: name.trim(), gradeId, avatar, color: 'orange', code: id, createdAt: new Date().toISOString() };
}
