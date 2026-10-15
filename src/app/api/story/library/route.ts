import {NextRequest,NextResponse} from 'next/server';
import {getAccountFromRequest} from '@/lib/auth';
import {isBackendAdmin,sameOrigin} from '@/lib/backend/auth';
import {readFamilies} from '@/lib/backend/families';
import {readContent} from '@/lib/backend/store';
import {curriculumForCategories} from '@/lib/learning/curriculum';
import {listSharedStories,publishSharedStory,removeSharedStory} from '@/lib/stories/shared';
export const runtime='nodejs';
const json=(value:unknown,status=200)=>NextResponse.json(value,{status,headers:{'Cache-Control':'no-store'}});
function unit(id:unknown){return typeof id==='string'?curriculumForCategories(readContent().categories.filter(c=>!c.archived)).find(u=>u.id===id):undefined;}
export function GET(req:NextRequest){
  const payload=getAccountFromRequest(req),account=payload&&readFamilies().accounts.find(a=>a.id===payload.accountId);
  if(!isBackendAdmin(req)&&account?.role!=='parent')return json({message:'Chỉ phụ huynh và admin được xem bài đọc đầy đủ.'},403);
  const selected=unit(req.nextUrl.searchParams.get('unitId'));if(!selected)return json({message:'Không tìm thấy unit.'},404);
  return json({stories:listSharedStories(selected.id).filter(s=>s.lesson.grade===selected.grade)});
}
export async function POST(req:NextRequest){
  if(!sameOrigin(req)||!isBackendAdmin(req))return json({message:'Chỉ admin được thêm bài đọc chung.'},403);
  try {const raw=await req.text();if(Buffer.byteLength(raw)>80000)return json({message:'Bài đọc quá dài.'},413);const body=JSON.parse(raw),selected=unit(body?.lesson?.unitId);
    if(!selected||selected.grade!==body?.lesson?.grade)return json({message:'Bài đọc không đúng unit/lớp.'},400);
    return json(publishSharedStory(body.lesson));
  }catch(error){return json({message:error instanceof SyntaxError?'Dữ liệu không hợp lệ.':error instanceof Error&&!('code'in error)?error.message:'Chưa lưu được bài đọc chung.'},400);}
}
export async function DELETE(req:NextRequest){
  if(!sameOrigin(req)||!isBackendAdmin(req))return json({message:'Chỉ admin được gỡ bài đọc chung.'},403);
  try{const body=await req.json();if(!unit(body?.unitId)||typeof body.id!=='string')return json({message:'Thông tin bài đọc không hợp lệ.'},400);removeSharedStory(body.unitId,body.id);return json({success:true});}catch{return json({message:'Chưa gỡ được bài đọc chung.'},400);}
}
