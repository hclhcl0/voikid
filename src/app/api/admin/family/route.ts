import { GET as readFamily, POST as writeFamily } from '@/app/api/family/route';
import type { NextRequest } from 'next/server';
export const runtime = 'nodejs';
export function GET(req: NextRequest) { return readFamily(req); }
export function POST(req: NextRequest) { return writeFamily(req); }
