import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { isBackendAdmin, sameOrigin } from '@/lib/backend/auth';
import { maskedApiKeys, readApiKeys, saveApiKeys } from '@/lib/backend/apiKeys';
import { keyUsage, resetKeyUsage, classifyProviderError } from '@/lib/pronunciation/keyPool';
import { readContent } from '@/lib/backend/store';
export const runtime = 'nodejs';
const snapshot = () => { const store=readApiKeys(); return {...maskedApiKeys(store),keys:maskedApiKeys(store).keys.map(k=>({...k,usage:keyUsage(store.keys.find(s=>s.id===k.id)!)}))}; };
export function GET(req: NextRequest) {
  if (!isBackendAdmin(req)) return NextResponse.json({message:'Cần đăng nhập quản trị.'},{status:401});
  return NextResponse.json(snapshot(),{headers:{'Cache-Control':'no-store'}});
}
export async function PUT(req: NextRequest) {
  if (!isBackendAdmin(req) || !sameOrigin(req)) return NextResponse.json({message:'Không có quyền lưu key.'},{status:403});
  try {
    const raw = await req.text();
    if (Buffer.byteLength(raw)>20000) return NextResponse.json({message:'Dữ liệu quá lớn.'},{status:413});
    saveApiKeys(JSON.parse(raw));
    return NextResponse.json(snapshot(),{headers:{'Cache-Control':'no-store'}});
  } catch(error) {
    if (error instanceof Error && error.message==='CONFLICT') return NextResponse.json({message:'Danh sách đã đổi ở phiên khác. Tải lại trước khi sửa.'},{status:409});
    return NextResponse.json({message:error instanceof Error && !('code' in error) && !(error instanceof SyntaxError) ? error.message : 'Không lưu được cấu hình key.'},{status:400});
  }
}
const testLimits = new Map<string,number>();
export async function POST(req: NextRequest) {
  if (!isBackendAdmin(req) || !sameOrigin(req)) return NextResponse.json({message:'Không có quyền kiểm tra key.'},{status:403});
  try {
    const body=await req.json();
    const key=readApiKeys().keys.find(k=>k.id===body?.id);
    if (!key) return NextResponse.json({message:'Key không tồn tại. Lưu danh sách trước khi kiểm tra.'},{status:404});
    if ((testLimits.get(key.id)||0)>Date.now()) return NextResponse.json({message:'Chờ 10 giây trước khi kiểm tra lại.'},{status:429});
    testLimits.set(key.id,Date.now()+10000);
    const model=readContent().settings.pronunciation?.model || 'gemini-3.5-flash-lite';
    const result=await new GoogleGenerativeAI(key.secret).getGenerativeModel({model},{timeout:10000}).generateContent('Reply with OK only.');
    if (!result.response.text().trim()) throw new Error('empty');
    resetKeyUsage(key);
    return NextResponse.json({message:'Key kết nối thành công với model đã chọn. Chưa kiểm tra bằng audio.',data:snapshot()},{headers:{'Cache-Control':'no-store'}});
  } catch(error) {
    const kind=classifyProviderError(error);
    return NextResponse.json({message:kind==='auth'?'Key không hợp lệ hoặc chưa có quyền truy cập.':kind==='quota'?'Project đang hết hạn mức.':'Chưa kết nối được. Kiểm tra model và kết nối mạng.'},{status:502});
  }
}
