import {NextRequest,NextResponse} from 'next/server';
import {createHash} from 'node:crypto';
import {isBackendAdmin,sameOrigin} from '@/lib/backend/auth';
import {getAccountFromRequest} from '@/lib/auth';
import {readFamilies,ownsProfile,familyId} from '@/lib/backend/families';
import {readContent} from '@/lib/backend/store';
import {curriculumForCategories} from '@/lib/learning/curriculum';
import {validStorySession,newStorySession} from '@/lib/stories/learning';
import {newStoryVocabulary} from '@/lib/stories/vocabulary';
import {extractVocabulary,validateExtractedVocabulary,VocabularyScanError} from '@/lib/stories/extractVocabulary';
import {readVocabulary,saveVocabulary} from '@/lib/stories/store';
import type {StoryLesson} from '@/lib/stories/types';
import {resolveFamilyAi,familyAiScope,FamilyAiError} from '@/lib/backend/familyAi';
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
      const personal=resolveFamilyAi(req),workId=`${hash}:${familyAiScope(personal)}`;
      if(!pending.has(workId)) {
        const now=Date.now();for(const [id,entry]of limits)if(entry.until<now)limits.delete(id);
        const limit=limits.get(account.id)??{count:0,until:now+60000};limits.set(account.id,limit);
        if(++limit.count>6||pending.size>=30)return NextResponse.json({message:'Hãy thử lại sau một phút.'},{status:429});
        const work=extractVocabulary(lesson,model,timeout,typeof body.apiKey==='string'&&body.apiKey.length<=300?body.apiKey.trim():undefined,personal).then(terms=>{saveVocabulary(hash,terms);return terms;}).finally(()=>pending.delete(workId));pending.set(workId,work);
      }
      vocabulary=(await pending.get(workId))!;
    }
    const categories=[...content.categories,...(families.categories[familyId(account)]??[])];
    return NextResponse.json({vocabulary:newStoryVocabulary({...lesson,vocabulary},categories,lesson.grade),scanned:true},{headers:{'Cache-Control':'no-store'}});
  } catch(error) {
    if(error instanceof FamilyAiError)return NextResponse.json({code:'FAMILY_AI_'+error.code.toUpperCase(),message:error.message},{status:error.code==='quota'?429:503,headers:{'Cache-Control':'no-store'}});
    if(error instanceof VocabularyScanError) {
      const messages:Record<VocabularyScanError['code'],string>={
        NO_API_KEY:'Chưa cấu hình Gemini API key trên server. Nhờ admin thêm key trong cài đặt AI; phụ huynh không cần nhập key riêng.',
        auth:'Gemini từ chối API key dùng để rà soát. Admin kiểm tra key và quyền truy cập model trong cài đặt AI.',
        quota:'Gemini đang hết hạn mức hoặc các key đang tạm nghỉ. Hãy thử lại sau.',
        transient:'Gemini phản hồi chậm hoặc mất kết nối. Hãy thử rà soát lại.',
        invalid_output:'AI chưa trả được danh sách từ khớp đoạn văn sau khi sửa lại. Hãy thử rà soát lại.',
        provider:'Chưa gọi được Gemini để rà soát. Admin kiểm tra model đang chọn và trạng thái các key trong cài đặt AI.',
      };
      return NextResponse.json({code:error.code,message:messages[error.code]},{status:error.code==='quota'?429:503,headers:{'Cache-Control':'no-store'}});
    }
    return NextResponse.json({message:error instanceof SyntaxError?'Dữ liệu không hợp lệ.':'Chưa rà soát được từ vựng. Hãy thử lại.'},{status:error instanceof SyntaxError?400:503});
  }
}
