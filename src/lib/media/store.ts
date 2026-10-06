import {createHash,randomUUID} from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';

export const mediaDirectory=path.join(process.env.VOCAKIDS_CONTENT_DIR||path.join(process.cwd(),'data','backend'),'media');
const configFile=path.join(mediaDirectory,'settings.json');
export interface AudioSettings {enabled:boolean;voiceId:string;model:string;apiKey:string;speed:number}
export interface MediaAudio {id:string;text:string;voiceId:string;model:string;speed?:number;createdAt:string;bytes:number;url:string}
const defaults:AudioSettings={enabled:false,voiceId:'',model:'eleven_flash_v2_5',apiKey:'',speed:0.85};
function write(file:string,value:string|Buffer) {fs.mkdirSync(mediaDirectory,{recursive:true});const temporary=`${file}.${randomUUID()}.tmp`;fs.writeFileSync(temporary,value,{mode:0o600});fs.renameSync(temporary,file);}
function envAudioSettings():Partial<AudioSettings> {
  const enabled = process.env.ELEVENLABS_ENABLED;
  const model = process.env.ELEVENLABS_MODEL;
  const speed = Number(process.env.ELEVENLABS_SPEED);
  return {
    ...(process.env.ELEVENLABS_API_KEY ? {apiKey:process.env.ELEVENLABS_API_KEY.trim()} : {}),
    ...(process.env.ELEVENLABS_VOICE_ID ? {voiceId:process.env.ELEVENLABS_VOICE_ID.trim()} : {}),
    ...(model ? {model} : {}),
    ...(enabled !== undefined ? {enabled:enabled === 'true' || enabled === '1'} : {}),
    ...(Number.isFinite(speed) && speed > 0 ? {speed} : {}),
  };
}
// Coolify env vars provide a safe first-run default. Once Admin > Media saves
// settings into the persistent volume, the UI values take precedence.
export function audioSettings():AudioSettings {
  const saved = fs.existsSync(configFile) ? JSON.parse(fs.readFileSync(configFile,'utf8')) : {};
  return {...defaults,...envAudioSettings(),...saved};
}
export function publicAudioSettings(){const s=audioSettings();return {enabled:s.enabled,voiceId:s.voiceId,model:s.model,speed:s.speed,configured:!!s.apiKey};}
export function saveAudioSettings(value:unknown) {
  const v=value as Partial<AudioSettings>;
  if(!v||typeof v.enabled!=='boolean'||typeof v.voiceId!=='string'||(v.voiceId!==''&&!/^[a-zA-Z0-9_-]{1,100}$/.test(v.voiceId))||!['eleven_flash_v2_5','eleven_multilingual_v2'].includes(v.model||'')||(v.apiKey!==undefined&&(typeof v.apiKey!=='string'||v.apiKey.length>300)))throw new Error('INVALID');
  if(v.speed!==undefined&&(typeof v.speed!=='number'||!Number.isFinite(v.speed)||v.speed<0.7||v.speed>1.2))throw new Error('INVALID');
  const current=audioSettings();write(configFile,JSON.stringify({...current,enabled:v.enabled,voiceId:v.voiceId,model:v.model,speed:v.speed??current.speed,apiKey:v.apiKey?.trim()||current.apiKey}));
  return publicAudioSettings();
}
export function audioId(text:string,s:AudioSettings){return createHash('sha256').update(JSON.stringify(['eleven-v2',text.trim().normalize('NFC'),s.voiceId,s.model,s.speed])).digest('hex');}
export function audioSettingsForPace(pace:'normal'|'slow'='normal'):AudioSettings {
  const settings=audioSettings();
  return pace==='slow'?{...settings,speed:0.7}:settings;
}
export function mediaFile(id:string){if(!/^[a-f0-9]{64}$/.test(id))throw new Error('INVALID');return path.join(mediaDirectory,`${id}.mp3`);}
export function findAudio(id:string):MediaAudio|null {const file=mediaFile(id);const metadata=path.join(mediaDirectory,`${id}.json`);return fs.existsSync(file)&&fs.existsSync(metadata)?JSON.parse(fs.readFileSync(metadata,'utf8')):null;}
export function listAudio():MediaAudio[]{if(!fs.existsSync(mediaDirectory))return [];return fs.readdirSync(mediaDirectory).filter(n=>/^[a-f0-9]{64}\.json$/.test(n)).map(n=>findAudio(n.slice(0,-5))).filter((m):m is MediaAudio=>!!m).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
const pending=new Map<string,Promise<MediaAudio>>();
let cooldown=0;
export async function generateAudio(text:string,pace:'normal'|'slow'='normal'):Promise<MediaAudio> {
  const s=audioSettingsForPace(pace);if(!s.enabled||!s.apiKey||!s.voiceId)throw new Error('DISABLED');
  const id=audioId(text,s),cached=findAudio(id);if(cached)return cached;
  const existing=pending.get(id);if(existing)return existing;
  if(pending.size>=2||Date.now()<cooldown)throw new Error('BUSY');
  const work=(async()=>{
    const response=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${s.voiceId}?output_format=mp3_44100_128`,{method:'POST',headers:{'xi-api-key':s.apiKey,'Content-Type':'application/json',Accept:'audio/mpeg'},body:JSON.stringify({text:text.trim(),model_id:s.model,language_code:'en',voice_settings:{stability:0.65,similarity_boost:0.75,speed:s.speed}}),signal:AbortSignal.timeout(45000)});
    if(!response.ok){
      if([401,402,403,429].includes(response.status))cooldown=Date.now()+60000;
      const detail=await response.json().catch(()=>null);
      const code=detail?.detail?.code||detail?.detail?.status;
      throw new Error(response.status===402||code==='paid_plan_required'?'PAID_VOICE':response.status===401?'INVALID_KEY':response.status===403?'PERMISSION':response.status===404?'VOICE_NOT_FOUND':response.status===429?'QUOTA':'PROVIDER');
    }
    if(!response.headers.get('content-type')?.includes('audio/'))throw new Error('PROVIDER');
    const buffer=Buffer.from(await response.arrayBuffer());if(!buffer.length||buffer.length>15_000_000)throw new Error('PROVIDER');
    const item:MediaAudio={id,text:text.trim(),voiceId:s.voiceId,model:s.model,speed:s.speed,createdAt:new Date().toISOString(),bytes:buffer.length,url:`/api/media/audio/${id}`};
    write(mediaFile(id),buffer);write(path.join(mediaDirectory,`${id}.json`),JSON.stringify(item));return item;
  })().finally(()=>pending.delete(id));pending.set(id,work);return work;
}
