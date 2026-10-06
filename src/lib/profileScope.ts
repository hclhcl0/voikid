import type { UserProfile } from '@/types';

export function profileScope(accountId:string|undefined,backendAdmin:boolean):string {
  return backendAdmin ? 'admin' : accountId ? `account:${accountId}` : 'guest';
}
export function profileStorageKeys(scope:string) {
  const suffix = scope === 'guest' ? '' : `_${encodeURIComponent(scope)}`;
  return {profiles:`vocakids_profiles_v1${suffix}`,active:`vocakids_active_profile_id${suffix}`};
}
export function profilesForScope(value:unknown,scope:string):UserProfile[] {
  if (!Array.isArray(value)) return [];
  return value.filter((profile):profile is UserProfile => {
    if (!profile || typeof profile.id !== 'string' || !profile.id || typeof profile.name !== 'string' || typeof profile.avatar !== 'string' || typeof profile.gradeId !== 'string') return false;
    if (scope !== 'guest') return profile.id !== 'default';
    // Recover local guest profiles without importing another account's cached children.
    return !profile.id.startsWith('student_') && !profile.ownerId && !profile.owner_id;
  });
}
export function selectProfile(profiles:UserProfile[],savedId:string|null):UserProfile|null {
  return profiles.find(profile => profile.id === savedId) ?? profiles[0] ?? null;
}
