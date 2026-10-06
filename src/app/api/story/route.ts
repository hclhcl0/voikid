import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { readContent } from '@/lib/backend/store';
import { isBackendAdmin, sameOrigin } from '@/lib/backend/auth';
import { getAccountFromRequest } from '@/lib/auth';
import { readFamilies, ownsProfile } from '@/lib/backend/families';
import { curriculumForCategories } from '@/lib/learning/curriculum';
import { storySource, STORY_SOURCE_VERSION, STORY_GENERATION_VERSION } from '@/lib/stories/source';
import { readingEvidence, readingBand } from '@/lib/stories/learning';
import { generateStory } from '@/lib/stories/generate';
import { readStory, saveStory } from '@/lib/stories/store';
import type { StoryLesson, ReadingEvidence } from '@/lib/stories/types';
import {validateStoryOutput} from '@/lib/stories/validation';
export const runtime='nodejs';
const pending=new Map<string,Promise<StoryLesson>>();
const limits=new Map<string,{count:number;until:number}>();
export async function POST(req:NextRequest) {
  if(!sameOrigin(req)) return NextResponse.json({message:'Nguồn yêu cầu không hợp lệ.'},{status:403});
  try {
    const raw=await req.text();if(Buffer.byteLength(raw)>15000) return NextResponse.json({message:'Yêu cầu quá lớn.'},{status:413});
    const body=JSON.parse(raw);
    if(!body||typeof body.unitId!=='string'||typeof body.profileId!=='string'||body.profileId.length>120||!Number.isInteger(body.variant)||body.variant<0||body.variant>4) return NextResponse.json({message:'Thông tin bài học không hợp lệ.'},{status:400});
    const content=readContent();
    const unit=curriculumForCategories(content.categories.filter(c=>!c.archived)).find(u=>u.id===body.unitId);
    const source=unit&&storySource(unit);
    if(!unit||!source) return NextResponse.json({message:'Unit này chưa có mẫu câu trong học liệu SGK.'},{status:404});
    const payload=getAccountFromRequest(req),families=readFamilies();
    const account=isBackendAdmin(req)?{id:'backend_admin',email:'',displayName:'Admin',passwordHash:'',role:'admin' as const}:families.accounts.find(a=>a.id===payload?.accountId);
    if(!account||!['admin','parent'].includes(account.role)) return NextResponse.json({message:'Chỉ admin và phụ huynh được tạo và xem đoạn văn đầy đủ.'},{status:403});
    let evidence:ReadingEvidence={total:0,independent:0};
    if(account) {
      const profile=families.profiles.find(p=>p.id===body.profileId&&ownsProfile(account,p));
      if(!profile&&account.role!=='admin') return NextResponse.json({message:'Không có quyền truy cập hồ sơ này.'},{status:403});
      if(profile) {
        const grade=profile.gradeId==='maugiao'?1:Number(profile.gradeId.replace('lop',''));
        if(unit.grade!==grade) return NextResponse.json({message:'Chọn unit đúng lớp trong hồ sơ học sinh.'},{status:409});
        if(families.progresses[profile.id]) evidence=readingEvidence(families.progresses[profile.id],profile.id,unit.id);
      }
    }
    if(!account||account.role==='admin'&&!families.profiles.some(p=>p.id===body.profileId)) {
      if(body.gradeId!==`lop${unit.grade}`&&!(body.gradeId==='maugiao'&&unit.grade===1)) return NextResponse.json({message:'Unit không thuộc lớp đang học.'},{status:409});
      const e=body.evidence;
      if(e&&Number.isInteger(e.total)&&Number.isInteger(e.independent)&&e.total>=0&&e.total<=500&&e.independent>=0&&e.independent<=e.total) evidence=e;
    }
    const band=readingBand(evidence);
    const model=content.settings.pronunciation?.model||'gemini-3.5-flash-lite';
    const timeout=content.settings.pronunciation?.timeoutMs||20000;
    const hash=createHash('sha256').update(JSON.stringify([STORY_SOURCE_VERSION,STORY_GENERATION_VERSION,unit.id,source,unit.vocabulary.map(v=>[v.text,v.senses[0].meaningVi]),band,body.variant,model])).digest('hex');
    const cached=readStory(hash);
    if(cached) {
      try {validateStoryOutput(cached,source,band);return NextResponse.json(cached,{headers:{'Cache-Control':'no-store'}});} catch { /* Regenerate older cached output that no longer satisfies the checks. */ }
    }
    if(!pending.has(hash)) {
      const now=Date.now();for(const [id,entry] of limits) if(entry.until<now) limits.delete(id);
      const id=account?.id||req.headers.get('x-forwarded-for')||'local';
      const limit=limits.get(id)||{count:0,until:now+60000};limits.set(id,limit);
      if(++limit.count>6||pending.size>=30) return NextResponse.json({message:'Đang tạo nhiều bài đọc. Hãy thử lại sau một phút.'},{status:429});
      const promise=generateStory(source,band,unit.vocabulary.slice(0,24).map(v=>({en:v.text,vi:v.senses[0].meaningVi})),model,timeout,typeof body.apiKey==='string'&&body.apiKey.length<=300?body.apiKey.trim():undefined).then(result=>{
        const story:StoryLesson={...result,id:`story_${hash}`,unitId:unit.id,grade:unit.grade,topic:source.topic,band,variant:body.variant,patterns:source.patterns,sourceVersion:STORY_SOURCE_VERSION,generatedAt:new Date().toISOString()};
        saveStory(hash,story);return story;
      }).finally(()=>pending.delete(hash));pending.set(hash,promise);
    }
    return NextResponse.json(await pending.get(hash),{headers:{'Cache-Control':'no-store'}});
  } catch(error) {
    if(error instanceof SyntaxError) return NextResponse.json({message:'Yêu cầu không hợp lệ.'},{status:400});
    return NextResponse.json({message:error instanceof Error&&error.message==='NO_API_KEY'?'Chưa có API key. Phụ huynh cấu hình key trong admin để tạo bài đọc.':'Chưa tạo được đoạn văn phù hợp. Kiểm tra key/model hoặc thử lại.'},{status:503});
  }
}
