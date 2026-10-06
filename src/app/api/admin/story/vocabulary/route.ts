import {NextRequest,NextResponse} from 'next/server';
import {isBackendAdmin} from '@/lib/backend/auth';
import {POST as scan} from '@/app/api/story/vocabulary/route';
export const runtime='nodejs';
export function POST(req:NextRequest) {if(!isBackendAdmin(req))return NextResponse.json({message:'Cần đăng nhập quản trị.'},{status:403});return scan(req);}
