import {NextRequest,NextResponse} from 'next/server';
import {createHash} from 'node:crypto';
import {isBackendAdmin,sameOrigin} from '@/lib/backend/auth';
import {getAccountFromRequest} from '@/lib/auth';
import {readFamilies,ownsProfile,familyId} from '@/lib/backend/families';
import {readContent} from '@/lib/backend/store';
import {curriculumForCategories} from '@/lib/learning/curriculum';
import {validStorySession,newStorySession} from '@/lib/stories/learning';
import {newStoryVocabulary} from '@/lib/stories/vocabulary';
import {extractVocabulary,validateExtractedVocabulary} from '@/lib/stories/extractVocabulary';
import {readVocabulary,saveVocabulary} from '@/lib/stories/store';
import type {StoryLesson} from '@/lib/stories/types';
export const runtime='nodejs';
const pending=new Map<string,Promise<StoryLesson['vocabulary']>>(),limits=new Map<string,{count:number;until:number}>();
export async function POST(req:NextRequest) {
  if(!sameOrigin(req)) return NextResponse.json({message:'Nguồn yêu cầu không hợp lệ.'},{status:403});
  try {
    const families=readFamilies(),payload=getAccountFromRequest(req);
    const account=isBackendAdmin(req)?{id:'backend_admin',role:'admin' as const,email:'',displayName:'Admin',passwordHash:''}:families.accounts.find(a=>a.id===payload?.accountId);
    if(!account||account.role==='student') return NextResponse.json({message:'Chỉ admin và phụ huynh được rà soát từ vựng.'},{status:403});
    const raw=await req.text();if(Buffer.byteLength(raw)>60000)return NextResponse.json({message:'Bài đọc quá dài.'},{status:413});
    const body=JSON.parse(raw),lesson=body?.lesson as StoryLesson;
    if(typeof body?.profileId!=='string'||!lesson||!validStorySession(newStorySession(lesson,body.profileId),body.profileId)||!lesson.sentences.length||lesson.sentences.length>60||lesson.sentences.some(s=>s.en.length>600)||lesson.sentences.map(s=>s.en).join(' ').length>6000) return NextResponse.json({message:'Bài đọc không hợp lệ.'},{status:400});
    const content=readContent(),unit=curriculumForCategories(content.categories).find(u=>u.id===lesson.unitId);
    if(!unit||unit.grade!==lesson.grade) return NextResponse.json({message:'Bài đọc không đúng unit/lớp.'},{status:400});
    const profile=families.profiles.find(p=>p.id===body.profileId&&ownsProfile(account,p));
    if(!profile&&account.role!=='admin')return NextResponse.json({message:'Không có quyền với hồ sơ này.'},{status:403});
    if(profile&&(profile.gradeId==='maugiao'?1:Number(profile.gradeId.replace('lop','')))!==lesson.grade)return NextResponse.json({message:'Bài đọc không thuộc lớp của hồ sơ.'},{status:409});
    const model=content.settings.pronunciation?.model||'gemini-3.5-flash-lite',timeout=content.settings.pronunciation?.timeoutMs||20000;
    const hash=createHash('sha256').update(JSON.stringify(['vocabulary_v1',lesson.grade,lesson.sentences,model])).digest('hex');
    let vocabulary:StoryLesson['vocabulary']|null=null;
    try {const cached=readVocabulary(hash);if(cached)vocabulary=validateExtractedVocabulary(cached,lesson);}catch { /* Ignore invalid cached output. */ }
    if(!vocabulary) {
      if(!pending.has(hash)) {
        const now=Date.now();for(const [id,entry]of limits)if(entry.until<now)limits.delete(id);
        const limit=limits.get(account.id)??{count:0,until:now+60000};limits.set(account.id,limit);
        if(++limit.count>6||pending.size>=30)return NextResponse.json({message:'Hãy thử lại sau một phút.'},{status:429});
        const work=extractVocabulary(lesson,model,timeout,typeof body.apiKey==='string'&&body.apiKey.length<=300?body.apiKey.trim():undefined).then(terms=>{saveVocabulary(hash,terms);return terms;}).finally(()=>pending.delete(hash));pending.set(hash,work);
      }
      vocabulary=(await pending.get(hash))!;
    }
    const categories=[...content.categories,...(families.categories[familyId(account)]??[])];
    return NextResponse.json({vocabulary:newStoryVocabulary({...lesson,vocabulary},categories,lesson.grade),scanned:true},{headers:{'Cache-Control':'no-store'}});
  } catch(error) {return NextResponse.json({message:error instanceof SyntaxError?'Dữ liệu không hợp lệ.':error instanceof Error&&error.message==='NO_API_KEY'?'Chưa có API key để rà soát từ vựng.':'Chưa rà soát được từ vựng. Kiểm tra key/model hoặc thử lại.'},{status:error instanceof SyntaxError?400:503});}
}
