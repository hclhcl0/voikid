import { credentialId, type KeyStore, type StoredApiKey } from '@/lib/backend/apiKeys';
export type ProviderFailure = 'auth' | 'quota' | 'transient' | 'other';
interface Usage { uses: number; successes: number; failures: number; until: number; lastError: ProviderFailure | null }
const usage = new Map<string,Usage>();
const projectUntil = new Map<string,number>();
let cursor = 0;
function state(key: StoredApiKey) {
  const id = credentialId(key);
  if (!usage.has(id)) usage.set(id,{uses:0,successes:0,failures:0,until:0,lastError:null});
  return usage.get(id)!;
}
export function classifyProviderError(error: unknown): ProviderFailure {
  const e = error as {status?: number; name?: string; message?: string};
  if (e?.status === 401 || e?.status === 403 || /API_KEY_INVALID|API key not valid/i.test(e?.message || '')) return 'auth';
  if (e?.status === 429) return 'quota';
  if ((e?.status && e.status >= 500) || ['AbortError','TimeoutError'].includes(e?.name || '') || /fetch failed|timed? ?out|timeout|network/i.test(e?.message || '')) return 'transient';
  return 'other';
}
export function keyUsage(key: StoredApiKey) {
  const s = state(key); const until = Math.max(s.until,projectUntil.get(key.project) || 0);
  return { uses: s.uses, successes: s.successes, failures: s.failures, lastError: s.lastError, blocked: s.until === Infinity, retryAt: Number.isFinite(until) && until > Date.now() ? until : null };
}
export function resetKeyUsage(key: StoredApiKey) { usage.delete(credentialId(key)); projectUntil.delete(key.project); }
export async function runKeyPool<T>(store: KeyStore, execute: (secret: string, remainingMs: number) => Promise<{value:T; failure:ProviderFailure|null}>, budgetMs: number, now: () => number = Date.now): Promise<T | null> {
  const keys = store.keys.filter(k=>k.enabled);
  if (store.mode === 'round_robin' && keys.length) { const offset = cursor++ % keys.length; keys.push(...keys.splice(0,offset)); }
  const deadline = now() + budgetMs;
  let last: T | null = null, attempts = 0;
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const s = state(key);
    if (s.until > now() || (projectUntil.get(key.project) || 0) > now()) continue;
    if (attempts >= store.maxAttempts || deadline - now() < 1000) break;
    attempts++; s.uses++;
    // Reserve time for fallback instead of allowing the first timeout to consume the whole budget.
    const slots = Math.min(store.maxAttempts - attempts + 1,keys.length - index);
    const timeout = Math.floor((deadline - now()) / slots);
    const {value,failure} = await execute(key.secret,timeout); last = value;
    if (!failure) { s.successes++; s.lastError=null; return value; }
    s.failures++; s.lastError=failure;
    if (failure === 'other') return value;
    s.until = failure === 'auth' ? Infinity : now() + store.cooldownSeconds*1000;
    if (failure === 'quota') projectUntil.set(key.project,s.until);
  }
  return last;
}
