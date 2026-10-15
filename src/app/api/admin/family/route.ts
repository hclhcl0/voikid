import { GET as readFamily, POST as writeFamily } from '@/app/api/family/route';
import type { NextRequest } from 'next/server';
import {NextResponse} from 'next/server';
import {isBackendAdmin} from '@/lib/backend/auth';
export const runtime = 'nodejs';
export function GET(req: NextRequest) { if(!isBackendAdmin(req))return NextResponse.json({message:'Cần đăng nhập quản trị.'},{status:403});return readFamily(req); }
export function POST(req: NextRequest) { if(!isBackendAdmin(req))return NextResponse.json({message:'Cần đăng nhập quản trị.'},{status:403});return writeFamily(req); }
