import {NextRequest,NextResponse} from 'next/server';
import {isBackendAdmin} from '@/lib/backend/auth';
import {POST as syncProfiles} from '@/app/api/profiles/route';
export const runtime='nodejs';
export function POST(req:NextRequest) {
  if(!isBackendAdmin(req)) return NextResponse.json({success:false,message:'Cần đăng nhập quản trị.'},{status:403});
  return syncProfiles(req);
}
