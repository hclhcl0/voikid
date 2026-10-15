import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
import type { NextRequest } from 'next/server';
import { getAccountFromRequest,ADMIN_SESSION_COOKIE_NAME } from '@/lib/auth';

export const ADMIN_COOKIE = ADMIN_SESSION_COOKIE_NAME;
export function adminPassword() { return process.env.VOCAKIDS_ADMIN_PASSWORD || ''; }
export function sameOrigin(req: NextRequest) {
  try { const origin = new URL(req.headers.get('origin') || ''); return ['http:', 'https:'].includes(origin.protocol) && origin.host === req.headers.get('host'); } catch { return false; }
}
function signature(value: string) { return createHmac('sha256', adminPassword()).update(value).digest('hex'); }
export function passwordMatches(password: unknown) {
  if (typeof password !== 'string') return false;
  if (!adminPassword()) return false;
  const left = Buffer.from(signature(password));
  const right = Buffer.from(signature(adminPassword()));
  return timingSafeEqual(left, right);
}
export function isAdminLoginEmail(email:string) {
  return ['admin','admin@vocakids.com','admin@vocakids.local','admin@vocakids.vn',process.env.VOCAKIDS_ADMIN_EMAIL?.trim().toLowerCase()].includes(email.trim().toLowerCase());
}
export function newAdminToken() { const value = `${Date.now() + 8 * 60 * 60 * 1000}.${randomBytes(24).toString('hex')}`; return `${value}.${signature(`admin-session-v2:${value}`)}`; }
export function isBackendAdmin(req: NextRequest) {
  const jwtAccount = getAccountFromRequest(req);
  // An authenticated non-admin account cannot inherit an older admin cookie.
  if (jwtAccount) return jwtAccount.role === 'admin' && jwtAccount.adminSessionVersion===2;

  if (!adminPassword()) return false;
  const token = req.cookies.get(ADMIN_COOKIE)?.value || '';
  const [expires, nonce, sig] = token.split('.');
  if (!expires || !nonce || !sig || token.split('.').length !== 3 || Number(expires) <= Date.now() || !/^[a-f0-9]{64}$/.test(sig)) return false;
  return timingSafeEqual(Buffer.from(signature(`admin-session-v2:${expires}.${nonce}`)), Buffer.from(sig));
}


