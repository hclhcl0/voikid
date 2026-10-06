import {NextRequest,NextResponse} from 'next/server';
import * as fs from 'node:fs';
import {mediaRole} from '@/lib/media/access';
import {mediaFile} from '@/lib/media/store';
export const runtime='nodejs';
export async function GET(req:NextRequest,{params}:{params:Promise<{id:string}>}){
  if(!mediaRole(req))return NextResponse.json({message:'Cần đăng nhập.'},{status:401});
  try{const {id}=await params;const data=fs.readFileSync(mediaFile(id));return new Response(data,{headers:{'Content-Type':'audio/mpeg','Content-Length':String(data.length),'Cache-Control':'private, max-age=86400'}});}catch{return NextResponse.json({message:'Không tìm thấy audio.'},{status:404});}
}
