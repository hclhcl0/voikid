import * as fs from 'node:fs';
import * as path from 'node:path';
import {createHash,randomBytes,createCipheriv,createDecipheriv} from 'node:crypto';
import type {NextRequest} from 'next/server';
import {getAccountFromRequest} from '@/lib/auth';
import {isBackendAdmin} from './auth';
import {readFamilies,familyId} from './families';
import type {ProviderFailure} from '@/lib/pronunciation/keyPool';

interface FamilyAiSettings {revision:number;mode:'shared'|'personal';fallbackToShared:boolean;sealed?:string;suffix?:string}
export interface FamilyAiChoice {ownerId:string;key:string;fallbackToShared:boolean}
export class FamilyAiError extends Error {
  constructor(public code:'auth'|'quota'|'transient'|'provider'|'configuration') {
    const messages={auth:'Key Gemini riêng bị từ chối. Phụ huynh kiểm tra key và quyền truy cập model trong Góc gia đình.',quota:'Key Gemini riêng đã hết hạn mức. Phụ huynh có thể bật dự phòng sang key chung trong Góc gia đình.',transient:'Gemini dùng key riêng đang phản hồi chậm. Hãy thử lại.',provider:'Chưa gọi được Gemini bằng key riêng. Phụ huynh kiểm tra kết nối và model trong Góc gia đình.',configuration:'Chưa đọc được key Gemini riêng. Phụ huynh lưu lại key trong Góc gia đình.'};
    super(messages[code]);
  }
}
const directory=()=>path.join(process.env.VOCAKIDS_FAMILY_DIR||path.join(process.cwd(),'data','families'),'ai-keys');
const file=(ownerId:string)=>path.join(directory(),`${createHash('sha256').update(ownerId).digest('hex')}.json`);
const defaults=():FamilyAiSettings=>({revision:0,mode:'shared',fallbackToShared:false});
export function readFamilyAi(ownerId:string):FamilyAiSettings {
  return fs.existsSync(file(ownerId))?JSON.parse(fs.readFileSync(file(ownerId),'utf8')):defaults();
}
function masterKey(create=true) {
  fs.mkdirSync(directory(),{recursive:true});const target=path.join(directory(),'master.key');
  if(!create&&!fs.existsSync(target))throw new FamilyAiError('configuration');
  if(!fs.existsSync(target)){try{fs.writeFileSync(target,randomBytes(32),{flag:'wx',mode:0o600});}catch(error){if((error as NodeJS.ErrnoException).code!=='EEXIST')throw error;}}
  const key=fs.readFileSync(target);if(key.length!==32)throw new FamilyAiError('configuration');return key;
}
function seal(secret:string,ownerId:string) {
  const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',masterKey(),iv);cipher.setAAD(Buffer.from(ownerId));
  const encrypted=Buffer.concat([cipher.update(secret,'utf8'),cipher.final()]);
  return Buffer.concat([iv,cipher.getAuthTag(),encrypted]).toString('base64');
}
export function familyAiSecret(ownerId:string,settings=readFamilyAi(ownerId)) {
  if(!settings.sealed)return null;
  try {const data=Buffer.from(settings.sealed,'base64'),decipher=createDecipheriv('aes-256-gcm',masterKey(false),data.subarray(0,12));decipher.setAAD(Buffer.from(ownerId));decipher.setAuthTag(data.subarray(12,28));return Buffer.concat([decipher.update(data.subarray(28)),decipher.final()]).toString('utf8');}
  catch{throw new FamilyAiError('configuration');}
}
export function publicFamilyAi(settings:FamilyAiSettings) {
  return {revision:settings.revision,mode:settings.mode,fallbackToShared:settings.fallbackToShared,hasKey:!!settings.sealed,masked:settings.sealed?`••••••${settings.suffix||''}`:''};
}
export function saveFamilyAi(ownerId:string,value:unknown,remove=false) {
  const body=value as {revision?:number;mode?:string;fallbackToShared?:boolean;apiKey?:string};
  const current=readFamilyAi(ownerId);
  if(!body||body.revision!==current.revision)throw new Error('CONFLICT');
  let next:FamilyAiSettings;
  if(remove)next={...defaults(),revision:current.revision+1};
  else {
    if(!['shared','personal'].includes(body.mode||'')||typeof body.fallbackToShared!=='boolean'||(body.apiKey!==undefined&&typeof body.apiKey!=='string'))throw new Error('Cài đặt key không hợp lệ.');
    const key=body.apiKey?.trim();
    if(key&&!/^[A-Za-z0-9_.-]{10,300}$/.test(key))throw new Error('API key không hợp lệ. Chỉ dán key, không kèm lời giải thích.');
    next={...current,revision:current.revision+1,mode:body.mode as FamilyAiSettings['mode'],fallbackToShared:body.fallbackToShared};
    if(key){next.sealed=seal(key,ownerId);next.suffix=key.slice(-4);}
    if(next.mode==='personal'&&!next.sealed)throw new Error('Nhập API key riêng trước khi chọn dùng key riêng.');
  }
  fs.mkdirSync(directory(),{recursive:true});const tmp=`${file(ownerId)}.${randomBytes(8).toString('hex')}.tmp`;
  fs.writeFileSync(tmp,JSON.stringify(next),{mode:0o600});fs.renameSync(tmp,file(ownerId));return publicFamilyAi(next);
}
export function familyAiIdentity(req:NextRequest) {
  if(isBackendAdmin(req))return {ownerId:'backend_admin',canManage:true};
  const payload=getAccountFromRequest(req),account=payload&&readFamilies().accounts.find(a=>a.id===payload.accountId);
  if(!account)return null;
  if(account.role==='student') {
    if(account.parentId==='backend_admin')return {ownerId:'backend_admin',canManage:false};
    const parent=readFamilies().accounts.find(a=>a.id===account.parentId&&['parent','admin'].includes(a.role));
    return parent?{ownerId:parent.id,canManage:false}:null;
  }
  return {ownerId:familyId(account),canManage:true};
}
export function resolveFamilyAi(req?:NextRequest):FamilyAiChoice|null {
  if(!req)return null;const identity=familyAiIdentity(req);if(!identity)return null;
  const settings=readFamilyAi(identity.ownerId);if(settings.mode!=='personal')return null;
  const key=familyAiSecret(identity.ownerId,settings);if(!key)throw new FamilyAiError('configuration');
  return {ownerId:identity.ownerId,key,fallbackToShared:settings.fallbackToShared};
}
export function familyAiScope(choice:FamilyAiChoice|null) {
  return choice?`${choice.ownerId}:${createHash('sha256').update(choice.key).digest('hex')}:${choice.fallbackToShared}`:'shared';
}
export async function runFamilyAi<T>(choice:FamilyAiChoice,execute:(key:string,budget:number)=>Promise<{value:T|null;failure:ProviderFailure|null}>,shared:(budget:number)=>Promise<T>,budget:number):Promise<T> {
  const deadline=Date.now()+budget;
  const result=await execute(choice.key,choice.fallbackToShared?Math.max(1000,Math.floor(budget*0.65)):budget);
  if(result.failure===null&&result.value!==null)return result.value;
  const remaining=deadline-Date.now();
  if(choice.fallbackToShared&&result.failure!=='other'&&remaining>=1000)return shared(remaining);
  throw new FamilyAiError(result.failure==='other'||!result.failure?'provider':result.failure);
}
