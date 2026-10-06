import {NextRequest,NextResponse} from 'next/server';
import {isBackendAdmin} from '@/lib/backend/auth';
import {GET as readAudio} from '@/app/api/media/audio/[id]/route';
export const runtime='nodejs';
export function GET(req:NextRequest,context:{params:Promise<{id:string}>}){
  if(!isBackendAdmin(req))return NextResponse.json({message:'Cần đăng nhập quản trị.'},{status:401});
  return readAudio(req,context);
}
