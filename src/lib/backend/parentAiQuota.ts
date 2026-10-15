import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { randomUUID } from 'node:crypto';
import { defaultParentAiSettings, validateParentAiSettings, type ParentAiSettings } from '@/lib/stories/parentAiSettings';
export function quotaDay(now: number) { return new Date(now + 7 * 60 * 60 * 1000).toISOString().slice(0, 10); }
export function quotaReset(now: number) {
  const day = quotaDay(now);
  return new Date(Date.parse(`${day}T00:00:00+07:00`) + 24 * 60 * 60 * 1000).toISOString();
}
export class ParentAiQuotaError extends Error {
  constructor(public limit: number, public resetsAt: string) {
    super(limit === 0 ? 'Admin đã tạm dừng tạo bài đọc AI cho phụ huynh. Bạn vẫn có thể dùng bài đã lưu hoặc dán đoạn văn tự viết.' : `Tài khoản phụ huynh đã dùng hết ${limit} lượt tạo bài đọc AI hôm nay (kể cả lượt đang xử lý). Hạn mức làm mới lúc 00:00 giờ Việt Nam. Bạn vẫn có thể dùng bài đã lưu hoặc dán đoạn văn tự viết.`);
  }
}
interface Entry { accountId: string; day: string; used: number; pending: { id: string; expires: number }[] }
interface Ledger { version: 1; entries: Entry[] }
export interface AiReservation { accountId: string; day: string; id: string }
const directory = process.env.VOCAKIDS_CONTENT_DIR || path.join(process.cwd(), 'data', 'backend');
const file = path.join(directory, 'parent-ai-usage.json');
const lockFile = `${file}.lock`;

/** Shared-volume file lock keeps concurrent requests/processes from overspending. */
async function updateLedger<T>(now: number, change: (data: Ledger) => T): Promise<T> {
  await fs.mkdir(directory, { recursive: true });
  let lock: Awaited<ReturnType<typeof fs.open>> | undefined;
  for (let attempt = 0; attempt < 40; attempt++) {
    try { lock = await fs.open(lockFile, 'wx', 0o600); break; }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      // The critical section only performs local file IO; recover a crashed writer.
      const stat = await fs.stat(lockFile).catch(() => null);
      if (stat && Date.now() - stat.mtimeMs > 60000) await fs.unlink(lockFile).catch(() => {});
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  if (!lock) throw new Error('AI_QUOTA_BUSY');
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    let data: Ledger;
    try { data = JSON.parse(await fs.readFile(/* turbopackIgnore: true */ file, 'utf8')); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; data = { version: 1, entries: [] }; }
    if (data.version !== 1 || !Array.isArray(data.entries) || data.entries.some(e => !e || typeof e.accountId !== 'string' || typeof e.day !== 'string' || !Number.isSafeInteger(e.used) || e.used < 0 || !Array.isArray(e.pending) || e.pending.some(p => typeof p.id !== 'string' || !Number.isFinite(p.expires)))) throw new Error('AI_QUOTA_CORRUPT');
    const oldest = quotaDay(now - 7 * 86400000);
    data.entries = data.entries.filter(e => e.day >= oldest);
    for (const entry of data.entries) entry.pending = entry.pending.filter(p => p.expires > now);
    const result = change(data);
    await fs.writeFile(temporary, JSON.stringify(data), { mode: 0o600 });
    await fs.rename(temporary, file);
    return result;
  } finally {
    await fs.unlink(temporary).catch(() => {});
    await lock.close();
    await fs.unlink(lockFile).catch(() => {});
  }
}

export async function reserveParentAi(accountId: string, role: string, settings: ParentAiSettings = defaultParentAiSettings, now = Date.now()): Promise<AiReservation | null> {
  validateParentAiSettings(settings);
  if (role !== 'parent' || !settings.enabled) return null;
  if (settings.dailyLimit === 0) throw new ParentAiQuotaError(0, quotaReset(now));
  return updateLedger(now, data => {
    const day = quotaDay(now);
    let entry = data.entries.find(e => e.accountId === accountId && e.day === day);
    if (!entry) { entry = { accountId, day, used: 0, pending: [] }; data.entries.push(entry); }
    if (entry.used + entry.pending.length >= settings.dailyLimit) throw new ParentAiQuotaError(settings.dailyLimit, quotaReset(now));
    const id = randomUUID();
    entry.pending.push({ id, expires: now + 10 * 60 * 1000 });
    return { accountId, day, id };
  });
}

export async function finishParentAi(reservation: AiReservation | null, succeeded: boolean, now = Date.now()): Promise<void> {
  if (!reservation) return;
  await updateLedger(now, data => {
    const entry = data.entries.find(e => e.accountId === reservation.accountId && e.day === reservation.day);
    if (!entry?.pending.some(p => p.id === reservation.id)) return;
    entry.pending = entry.pending.filter(p => p.id !== reservation.id);
    if (succeeded) entry.used++;
  });
}
