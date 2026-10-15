import {NextRequest,NextResponse} from 'next/server';
import {GoogleGenerativeAI} from '@google/generative-ai';
import {sameOrigin} from '@/lib/backend/auth';
import {familyAiIdentity,readFamilyAi,publicFamilyAi,saveFamilyAi,familyAiSecret} from '@/lib/backend/familyAi';
import {readContent} from '@/lib/backend/store';
import {classifyProviderError} from '@/lib/pronunciation/keyPool';
export const runtime='nodejs';
const tests=new Map<string,number>();
const json=(value:unknown,status=200)=>NextResponse.json(value,{status,headers:{'Cache-Control':'no-store'}});
function identity(req:NextRequest){const user=familyAiIdentity(req);return user?.canManage?user:null;}
export function GET(req:NextRequest){const user=identity(req);if(!user)return json({message:'Chỉ phụ huynh và admin được quản lý key riêng.'},403);return json(publicFamilyAi(readFamilyAi(user.ownerId)));}
async function change(req:NextRequest,remove:boolean){
  if(!sameOrigin(req))return json({message:'Nguồn yêu cầu không hợp lệ.'},403);
  const user=identity(req);if(!user)return json({message:'Chỉ phụ huynh và admin được quản lý key riêng.'},403);
  try {const text=await req.text();if(text.length>2000)return json({message:'Yêu cầu quá lớn.'},413);return json(saveFamilyAi(user.ownerId,JSON.parse(text),remove));}
  catch(error){const conflict=error instanceof Error&&error.message==='CONFLICT';return json({message:conflict?'Cấu hình đã đổi. Tải lại trang trước khi lưu.':error instanceof SyntaxError?'Dữ liệu không hợp lệ.':error instanceof Error&&/key|cài đặt/i.test(error.message)?error.message:'Chưa lưu được key riêng. Hãy thử lại.'},conflict?409:400);}
}
export const PUT=(req:NextRequest)=>change(req,false);
export const DELETE=(req:NextRequest)=>change(req,true);
export async function POST(req:NextRequest){
  if(!sameOrigin(req))return json({message:'Nguồn yêu cầu không hợp lệ.'},403);
  const user=identity(req);if(!user)return json({message:'Chỉ phụ huynh và admin được kiểm tra key riêng.'},403);
  const now=Date.now();for(const [id,until]of tests)if(until<=now)tests.delete(id);
  if((tests.get(user.ownerId)||0)>now)return json({message:'Đợi một phút trước khi kiểm tra lại.'},429);
  tests.set(user.ownerId,now+60000);
  try {
    const key=familyAiSecret(user.ownerId);if(!key)return json({message:'Lưu API key riêng trước khi kiểm tra kết nối.'},400);
    const model=readContent().settings.pronunciation?.model||'gemini-3.5-flash-lite';
    await new GoogleGenerativeAI(key).getGenerativeModel({model},{timeout:10000}).generateContent('Reply with OK.');
    return json({message:'Key riêng kết nối Gemini thành công với model đang dùng.'});
  }catch(error){const reason=classifyProviderError(error);return json({message:reason==='auth'?'Key riêng bị từ chối. Kiểm tra key và quyền truy cập.':reason==='quota'?'Key riêng đã hết hạn mức.':reason==='transient'?'Kết nối Gemini đang chậm. Hãy thử lại sau.':'Chưa kết nối được. Kiểm tra key và model đang chọn.'},503);}
}
