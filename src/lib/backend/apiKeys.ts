import * as fs from 'node:fs';
import * as path from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
export interface StoredApiKey { id: string; name: string; project: string; secret: string; enabled: boolean }
export interface KeyStore { revision: number; mode: 'priority' | 'round_robin'; maxAttempts: number; cooldownSeconds: number; keys: StoredApiKey[] }
const file = () => path.join(process.env.VOCAKIDS_CONTENT_DIR || path.join(process.cwd(),'data','backend'),'api-keys.json');
export function readApiKeys(): KeyStore {
  return fs.existsSync(file()) ? JSON.parse(fs.readFileSync(file(),'utf8')) : { revision: 0, mode: 'priority', maxAttempts: 2, cooldownSeconds: 60, keys: [] };
}
export const credentialId = (key: StoredApiKey) => createHash('sha256').update(key.id + key.secret).digest('hex');
export function saveApiKeys(input: unknown): KeyStore {
  const data = input as KeyStore;
  if (!data || !Number.isInteger(data.revision) || !['priority','round_robin'].includes(data.mode) || !Number.isInteger(data.maxAttempts) || data.maxAttempts < 1 || data.maxAttempts > 3 || !Number.isInteger(data.cooldownSeconds) || data.cooldownSeconds < 30 || data.cooldownSeconds > 3600 || !Array.isArray(data.keys) || data.keys.length > 10) throw new Error('Cấu hình key không hợp lệ. Tối đa 10 key, 1–3 lượt thử, thời gian nghỉ 30–3600 giây.');
  const current = readApiKeys();
  if (data.revision !== current.revision) throw new Error('CONFLICT');
  const ids = new Set<string>(), secrets = new Set<string>();
  const keys = data.keys.map(k => {
    if (!k || typeof k.name !== 'string' || !k.name.trim() || k.name.length > 80 || typeof k.project !== 'string' || !k.project.trim() || k.project.length > 100 || typeof k.enabled !== 'boolean' || (k.secret !== undefined && typeof k.secret !== 'string')) throw new Error('Tên key, mã project và trạng thái không hợp lệ.');
    const previous = current.keys.find(old => old.id === k.id);
    if (k.id && !previous) throw new Error('Key không tồn tại. Tải lại danh sách.');
    const id = previous?.id || randomUUID();
    const secret = k.secret?.trim() || previous?.secret;
    if (!secret || !/^[A-Za-z0-9_.-]{10,300}$/.test(secret) || ids.has(id) || secrets.has(secret)) throw new Error('Key thiếu, trùng hoặc không hợp lệ.');
    ids.add(id); secrets.add(secret);
    return { id, name: k.name.trim(), project: k.project.trim(), enabled: k.enabled, secret };
  });
  const next = { revision: current.revision + 1, mode: data.mode, maxAttempts: data.maxAttempts, cooldownSeconds: data.cooldownSeconds, keys };
  fs.mkdirSync(path.dirname(file()),{recursive:true});
  const tmp = `${file()}.${process.pid}.tmp`;
  fs.writeFileSync(tmp,JSON.stringify(next,null,2),{mode:0o600}); fs.renameSync(tmp,file());
  return next;
}
export function maskedApiKeys(store = readApiKeys()) {
  return { ...store, keys: store.keys.map(({secret,...key}) => ({ ...key, masked: `••••••${secret.slice(-4)}` })) };
}
