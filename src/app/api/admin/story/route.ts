export const runtime='nodejs';
import {NextRequest,NextResponse} from 'next/server';
import {isBackendAdmin} from '@/lib/backend/auth';
import {POST as generateStory} from '@/app/api/story/route';
export function POST(req:NextRequest) {
  if(!isBackendAdmin(req)) return NextResponse.json({message:'Cần đăng nhập quản trị.'},{status:403});
  return generateStory(req);
}
