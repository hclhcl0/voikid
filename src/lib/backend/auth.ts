import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
import type { NextRequest } from 'next/server';
export const ADMIN_COOKIE = 'vocakids_backend_session';
export function adminPassword() { return process.env.VOCAKIDS_ADMIN_PASSWORD || ''; }
export function sameOrigin(req: NextRequest) {
  try { const origin = new URL(req.headers.get('origin') || ''); return ['http:', 'https:'].includes(origin.protocol) && origin.host === req.headers.get('host'); } catch { return false; }
}
function signature(value: string) { return createHmac('sha256', adminPassword()).update(value).digest('hex'); }
export function passwordMatches(password: unknown) {
  if (typeof password !== 'string' || !adminPassword()) return false;
  const left = Buffer.from(signature(password));
  const right = Buffer.from(signature(adminPassword()));
  return timingSafeEqual(left, right);
}
export function newAdminToken() { const value = `${Date.now() + 8 * 60 * 60 * 1000}.${randomBytes(24).toString('hex')}`; return `${value}.${signature(value)}`; }
export function isBackendAdmin(req: NextRequest) {
  if (!adminPassword()) return false;
  const token = req.cookies.get(ADMIN_COOKIE)?.value || '';
  const [expires, nonce, sig] = token.split('.');
  if (!expires || !nonce || !sig || token.split('.').length !== 3 || Number(expires) <= Date.now() || !/^[a-f0-9]{64}$/.test(sig)) return false;
  return timingSafeEqual(Buffer.from(signature(`${expires}.${nonce}`)), Buffer.from(sig));
}

