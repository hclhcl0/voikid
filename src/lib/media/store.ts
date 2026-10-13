import {createHash,randomUUID} from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {MediaError,providerAudioError} from './errors';
import {normalAudioSpeed,MIN_NORMAL_SPEED,SLOW_AUDIO_SPEED,MAX_AUDIO_SPEED} from './pace';

export const mediaDirectory=path.join(process.env.VOCAKIDS_CONTENT_DIR||path.join(process.cwd(),'data','backend'),'media');
const configFile=path.join(mediaDirectory,'settings.json');

export interface ElevenApiKey {
  id: string;
  name: string;
  key: string;
  enabled: boolean;
}

export type ElevenKeyMode = 'priority' | 'round_robin';

export interface AudioSettings {
  enabled: boolean;
  voiceId: string;
  model: string;
  apiKey: string;
  apiKeys?: ElevenApiKey[];
  keyMode?: ElevenKeyMode;
  speed: number;
}

export interface MediaAudio {
  id: string;
  text: string;
  voiceId: string;
  model: string;
  speed?: number;
  createdAt: string;
  bytes: number;
  url: string;
}

const defaults: AudioSettings = {
  enabled: false,
  voiceId: '',
  model: 'eleven_flash_v2_5',
  apiKey: '',
  apiKeys: [],
  keyMode: 'priority',
  speed: 0.85,
};

function write(file:string,value:string|Buffer) {
  fs.mkdirSync(mediaDirectory,{recursive:true});
  const temporary=`${file}.${randomUUID()}.tmp`;
  fs.writeFileSync(temporary,value,{mode:0o600});
  fs.renameSync(temporary,file);
}

function envAudioSettings(): Partial<AudioSettings> {
  const enabled = process.env.ELEVENLABS_ENABLED;
  const model = process.env.ELEVENLABS_MODEL;
  const speed = Number(process.env.ELEVENLABS_SPEED);
  const keyMode = process.env.ELEVENLABS_KEY_MODE === 'round_robin' ? 'round_robin' : undefined;
  const rawKeys = process.env.ELEVENLABS_API_KEYS;
  let envKeys: ElevenApiKey[] | undefined;

  if (rawKeys) {
    try {
      if (rawKeys.trim().startsWith('[')) {
        envKeys = JSON.parse(rawKeys);
      } else {
        envKeys = rawKeys.split(',').map((k, i) => ({
          id: `env-${i + 1}`,
          name: `Env Key ${i + 1}`,
          key: k.trim(),
          enabled: true,
        })).filter(k => k.key);
      }
    } catch { /* ignore parse error */ }
  }

  return {
    ...(process.env.ELEVENLABS_API_KEY ? {apiKey:process.env.ELEVENLABS_API_KEY.trim()} : {}),
    ...(process.env.ELEVENLABS_VOICE_ID ? {voiceId:process.env.ELEVENLABS_VOICE_ID.trim()} : {}),
    ...(model ? {model} : {}),
    ...(enabled !== undefined ? {enabled:enabled === 'true' || enabled === '1'} : {}),
    ...(Number.isFinite(speed) && speed > 0 ? {speed} : {}),
    ...(envKeys && envKeys.length > 0 ? {apiKeys: envKeys} : {}),
    ...(keyMode ? {keyMode} : {}),
  };
}

export function audioSettings(): AudioSettings {
  const saved = fs.existsSync(configFile) ? JSON.parse(fs.readFileSync(configFile,'utf8')) : {};
  const settings: AudioSettings = {...defaults,...envAudioSettings(),...saved};
  settings.apiKey = (settings.apiKey || '').trim().replace(/[\u200B-\u200D\uFEFF]/g,'');
  settings.speed = normalAudioSpeed(settings.speed);
  if (!settings.keyMode || !['priority','round_robin'].includes(settings.keyMode)) {
    settings.keyMode = 'priority';
  }
  if (!Array.isArray(settings.apiKeys)) {
    settings.apiKeys = [];
  }
  // Đồng bộ giữa apiKey đơn lẻ và danh sách apiKeys
  if (settings.apiKeys.length === 0 && settings.apiKey) {
    settings.apiKeys = [{
      id: 'primary',
      name: 'Key chính',
      key: settings.apiKey,
      enabled: true,
    }];
  } else if (settings.apiKeys.length > 0 && !settings.apiKey) {
    const first = settings.apiKeys.find(k => k.enabled && k.key) || settings.apiKeys[0];
    if (first) settings.apiKey = first.key;
  }
  return settings;
}

export function getActiveApiKeys(s: AudioSettings = audioSettings()): ElevenApiKey[] {
  if (Array.isArray(s.apiKeys) && s.apiKeys.length > 0) {
    const active = s.apiKeys.filter(k => k.enabled && k.key && k.key.trim());
    if (active.length > 0) return active;
  }
  if (s.apiKey && s.apiKey.trim()) {
    return [{ id: 'primary', name: 'Key chính', key: s.apiKey.trim(), enabled: true }];
  }
  return [];
}

interface KeyUsageState {
  uses: number;
  successes: number;
  failures: number;
  cooldownUntil: number;
  lastError: string | null;
}
const keyUsage = new Map<string, KeyUsageState>();
let keyCursor = 0;

export function resetKeyUsagePool() {
  keyUsage.clear();
  keyCursor = 0;
  cooldown = 0;
}

export function publicAudioSettings() {
  const s = audioSettings();
  const activeKeys = getActiveApiKeys(s);
  const primaryKey = activeKeys[0]?.key || s.apiKey || '';
  return {
    enabled: s.enabled,
    voiceId: s.voiceId,
    model: s.model,
    speed: s.speed,
    configured: activeKeys.length > 0 || !!s.apiKey,
    activeKeyCount: activeKeys.length,
    keyMode: s.keyMode || 'priority',
    keyFingerprint: primaryKey ? createHash('sha256').update(primaryKey).digest('hex').slice(0, 12) : '',
    keySource: fs.existsSync(configFile) ? 'settings' : 'environment',
    apiKeys: (s.apiKeys || []).map(k => {
      const u = keyUsage.get(k.id) || { uses: 0, successes: 0, failures: 0, cooldownUntil: 0, lastError: null };
      return {
        id: k.id,
        name: k.name,
        enabled: k.enabled,
        masked: k.key ? `••••••${k.key.slice(-4)}` : '',
        fingerprint: k.key ? createHash('sha256').update(k.key).digest('hex').slice(0, 8) : '',
        uses: u.uses,
        successes: u.successes,
        failures: u.failures,
        isCooldown: u.cooldownUntil > Date.now(),
        lastError: u.lastError,
      };
    }),
  };
}

export function saveAudioSettings(value: unknown) {
  const v = value as Partial<AudioSettings> & { apiKeys?: unknown[]; keyMode?: string };
  if (!v || typeof v.enabled !== 'boolean' || typeof v.voiceId !== 'string' ||
      (v.voiceId !== '' && !/^[a-zA-Z0-9_-]{1,100}$/.test(v.voiceId)) ||
      !['eleven_flash_v2_5', 'eleven_multilingual_v2'].includes(v.model || '') ||
      (v.apiKey !== undefined && (typeof v.apiKey !== 'string' || v.apiKey.length > 300))) {
    throw new Error('INVALID');
  }
  if (v.speed !== undefined && (typeof v.speed !== 'number' || !Number.isFinite(v.speed) || v.speed < MIN_NORMAL_SPEED || v.speed > MAX_AUDIO_SPEED)) {
    throw new Error('INVALID');
  }

  const current = audioSettings();
  let validatedKey = v.apiKey?.trim().replace(/[\u200B-\u200D\uFEFF]/g, '');
  if (validatedKey && /[\s"'`]/.test(validatedKey)) throw new Error('INVALID_KEY_FORMAT');

  const keyMode: ElevenKeyMode = v.keyMode === 'round_robin' ? 'round_robin' : 'priority';
  let validatedKeys: ElevenApiKey[] = current.apiKeys || [];

  if (v.apiKeys !== undefined) {
    if (!Array.isArray(v.apiKeys) || v.apiKeys.length > 20) throw new Error('INVALID');
    const existingMap = new Map((current.apiKeys || []).map(k => [k.id, k]));
    validatedKeys = v.apiKeys.map((item: any, idx) => {
      if (!item || typeof item !== 'object') throw new Error('INVALID');
      const name = typeof item.name === 'string' && item.name.trim() ? item.name.trim().slice(0, 80) : `Key ${idx + 1}`;
      const enabled = typeof item.enabled === 'boolean' ? item.enabled : true;
      const previous = item.id ? existingMap.get(item.id) : undefined;
      const id = item.id && /^[a-zA-Z0-9_-]{1,64}$/.test(item.id) ? item.id : (previous?.id || randomUUID());
      let rawKey = typeof item.key === 'string' ? item.key.trim().replace(/[\u200B-\u200D\uFEFF]/g, '') : '';
      if (!rawKey && previous?.key) {
        rawKey = previous.key;
      }
      if (rawKey && /[\s"'`]/.test(rawKey)) throw new Error('INVALID_KEY_FORMAT');
      if (!rawKey) throw new Error('INVALID');
      return { id, name, key: rawKey, enabled };
    });
  } else if (validatedKey) {
    if (validatedKeys.length === 0) {
      validatedKeys = [{ id: 'primary', name: 'Key chính', key: validatedKey, enabled: true }];
    } else {
      validatedKeys = validatedKeys.map((k, idx) => idx === 0 ? { ...k, key: validatedKey! } : k);
    }
  }

  const firstActive = validatedKeys.find(k => k.enabled && k.key) || validatedKeys[0];
  const primaryKey = firstActive?.key || validatedKey || current.apiKey;

  write(configFile, JSON.stringify({
    ...current,
    enabled: v.enabled,
    voiceId: v.voiceId,
    model: v.model,
    speed: v.speed ?? current.speed,
    apiKey: primaryKey,
    apiKeys: validatedKeys,
    keyMode,
  }));
  return publicAudioSettings();
}

export function audioId(text:string,s:AudioSettings){
  return createHash('sha256').update(JSON.stringify(['eleven-v2',text.trim().normalize('NFC'),s.voiceId,s.model,s.speed])).digest('hex');
}

export function audioSettingsForPace(pace:'normal'|'slow'='normal'):AudioSettings {
  const settings=audioSettings();
  return pace==='slow'?{...settings,speed:SLOW_AUDIO_SPEED}:settings;
}

export function mediaFile(id:string){
  if(!/^[a-f0-9]{64}$/.test(id))throw new Error('INVALID');
  return path.join(mediaDirectory,`${id}.mp3`);
}

export function findAudio(id:string):MediaAudio|null {
  const file=mediaFile(id);
  const metadata=path.join(mediaDirectory,`${id}.json`);
  return fs.existsSync(file)&&fs.existsSync(metadata)?JSON.parse(fs.readFileSync(metadata,'utf8')):null;
}

export function listAudio():MediaAudio[]{
  if(!fs.existsSync(mediaDirectory))return [];
  return fs.readdirSync(mediaDirectory)
    .filter(n=>/^[a-f0-9]{64}\.json$/.test(n))
    .map(n=>findAudio(n.slice(0,-5)))
    .filter((m):m is MediaAudio=>!!m)
    .sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
}

const pending=new Map<string,Promise<MediaAudio>>();
let cooldown=0;

export async function generateAudio(text:string,pace:'normal'|'slow'='normal'):Promise<MediaAudio> {
  const s = audioSettingsForPace(pace);
  if (!s.enabled || !s.voiceId) throw new Error('DISABLED');
  const activeKeys = getActiveApiKeys(s);
  if (activeKeys.length === 0) throw new Error('DISABLED');

  const id = audioId(text, s);
  const cached = findAudio(id);
  if (cached) return cached;

  const existing = pending.get(id);
  if (existing) return existing;

  if (pending.size >= 2) throw new Error('BUSY');

  const work = (async () => {
    let candidateKeys = [...activeKeys];
    if (s.keyMode === 'round_robin' && candidateKeys.length > 1) {
      const offset = (keyCursor++) % candidateKeys.length;
      candidateKeys = [...candidateKeys.slice(offset), ...candidateKeys.slice(0, offset)];
    }

    const now = Date.now();
    const notInCooldown = candidateKeys.filter(k => {
      const u = keyUsage.get(k.id);
      return !u || u.cooldownUntil <= now;
    });

    const keysToTry = notInCooldown.length > 0 ? notInCooldown : candidateKeys;
    let lastError: Error | null = null;

    for (let i = 0; i < keysToTry.length; i++) {
      const currentKey = keysToTry[i];
      let u = keyUsage.get(currentKey.id);
      if (!u) {
        u = { uses: 0, successes: 0, failures: 0, cooldownUntil: 0, lastError: null };
        keyUsage.set(currentKey.id, u);
      }
      u.uses++;

      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${s.voiceId}?output_format=mp3_44100_128`,
          {
            method: 'POST',
            headers: {
              'xi-api-key': currentKey.key,
              'Content-Type': 'application/json',
              Accept: 'audio/mpeg',
            },
            body: JSON.stringify({
              text: text.trim(),
              model_id: s.model,
              language_code: 'en',
              voice_settings: { stability: 0.65, similarity_boost: 0.75, speed: s.speed },
            }),
            signal: AbortSignal.timeout(45000),
          }
        );

        if (!response.ok) {
          const detail = await response.json().catch(() => null);
          const err = providerAudioError(response.status, detail);
          u.failures++;
          u.lastError = err.code;

          if (err.code === 'INVALID_KEY') {
            u.cooldownUntil = Infinity;
          } else if (err.code === 'QUOTA') {
            u.cooldownUntil = Date.now() + 60000;
          } else if (err.code === 'PAID_VOICE') {
            u.cooldownUntil = Infinity;
          } else if ([408, 429, 500, 502, 503, 504].includes(response.status)) {
            u.cooldownUntil = Date.now() + 30000;
          }

          lastError = err;

          // Nếu có nhiều key và gặp lỗi auth/quota/network/provider, thử failover sang key tiếp theo
          if (['QUOTA', 'INVALID_KEY', 'PERMISSION', 'PROVIDER', 'NETWORK', 'TIMEOUT'].includes(err.code) && i < keysToTry.length - 1) {
            console.warn(`[ElevenLabs Pool] Key "${currentKey.name}" gặp lỗi ${err.code}. Thử key tiếp theo trong danh sách...`);
            continue;
          }

          throw err;
        }

        if (!response.headers.get('content-type')?.includes('audio/')) {
          u.failures++;
          u.lastError = 'INVALID_AUDIO';
          throw new MediaError('INVALID_AUDIO', response.status);
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        if (!buffer.length || buffer.length > 15_000_000) {
          u.failures++;
          u.lastError = 'PROVIDER';
          throw new Error('PROVIDER');
        }

        u.successes++;
        u.lastError = null;

        const item: MediaAudio = {
          id,
          text: text.trim(),
          voiceId: s.voiceId,
          model: s.model,
          speed: s.speed,
          createdAt: new Date().toISOString(),
          bytes: buffer.length,
          url: `/api/media/audio/${id}`,
        };
        write(mediaFile(id), buffer);
        write(path.join(mediaDirectory, `${id}.json`), JSON.stringify(item));
        return item;
      } catch (err) {
        if (err instanceof MediaError && ['VOICE_NOT_FOUND', 'INVALID_REQUEST', 'PAID_VOICE'].includes(err.code)) {
          throw err;
        }
        lastError = err instanceof Error ? err : new Error(String(err));
        if (i < keysToTry.length - 1) {
          continue;
        }
        throw lastError;
      }
    }

    if (lastError) throw lastError;
    throw new Error('PROVIDER');
  })().finally(() => pending.delete(id));

  pending.set(id, work);
  return work;
}
