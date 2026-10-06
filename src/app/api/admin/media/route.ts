import {NextRequest,NextResponse} from 'next/server';
import {isBackendAdmin,sameOrigin} from '@/lib/backend/auth';
import {listAudio,publicAudioSettings,saveAudioSettings} from '@/lib/media/store';
export const runtime='nodejs';
export function GET(req:NextRequest){if(!isBackendAdmin(req))return NextResponse.json({message:'Cần quyền admin.'},{status:401});return NextResponse.json({settings:publicAudioSettings(),items:listAudio().map(item=>({...item,url:`/api/admin/media/audio/${item.id}`}))},{headers:{'Cache-Control':'no-store'}});}
export async function PUT(req:NextRequest){if(!sameOrigin(req)||!isBackendAdmin(req))return NextResponse.json({message:'Cần quyền admin.'},{status:403});try{const raw=await req.text();if(raw.length>2000)throw new Error();return NextResponse.json(saveAudioSettings(JSON.parse(raw)));}catch{return NextResponse.json({message:'Cấu hình không hợp lệ.'},{status:400});}}
