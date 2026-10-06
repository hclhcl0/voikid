import {NextRequest,NextResponse} from 'next/server';
import {isBackendAdmin,sameOrigin} from '@/lib/backend/auth';
import {mediaRole} from '@/lib/media/access';
import {audioId,audioSettingsForPace,findAudio,generateAudio,publicAudioSettings} from '@/lib/media/store';
import {audioFailure} from '@/lib/media/errors';
export const runtime='nodejs';
const limits=new Map<string,{count:number;until:number}>();
export function GET(){const s=publicAudioSettings();return NextResponse.json({available:s.enabled&&s.configured&&!!s.voiceId},{headers:{'Cache-Control':'no-store'}});}
export async function POST(req:NextRequest){
  if(!sameOrigin(req))return NextResponse.json({message:'Nguồn yêu cầu không hợp lệ.'},{status:403});
  const role=mediaRole(req);if(!role)return NextResponse.json({message:'Cần đăng nhập.'},{status:401});
  try{
    const raw=await req.text();if(Buffer.byteLength(raw)>20000)return NextResponse.json({message:'Nội dung quá dài.'},{status:413});
    const body=JSON.parse(raw);if(typeof body.text!=='string'||!body.text.trim()||body.text.length>6000)return NextResponse.json({message:'Nội dung cần từ 1 đến 6.000 ký tự.'},{status:400});
    if(body.pace!==undefined&&body.pace!=='normal'&&body.pace!=='slow')return NextResponse.json({message:'Tốc độ đọc không hợp lệ.'},{status:400});
    const pace=body.pace||'normal';
    const s=audioSettingsForPace(pace);if(!s.enabled)return NextResponse.json({message:'Chưa bật ElevenLabs.'},{status:404});
    const urlFor=(id:string)=>`${isBackendAdmin(req)?'/api/admin/media':'/api/media'}/audio/${id}`;
    const cached=findAudio(audioId(body.text,s));if(cached)return NextResponse.json({id:cached.id,url:urlFor(cached.id)});
    if(role==='student')return NextResponse.json({message:'Audio chưa được chuẩn bị.'},{status:404});
    const key=req.cookies.get('vocakids_backend_session')?.value||req.headers.get('cookie')||'adult',now=Date.now();
    for(const [id,l] of limits)if(l.until<now)limits.delete(id);
    const limit=limits.get(key)||{count:0,until:now+60000};limits.set(key,limit);if(++limit.count>10)return NextResponse.json({message:'Chờ một phút để tạo tiếp.'},{status:429});
    const item=await generateAudio(body.text,pace);return NextResponse.json({id:item.id,url:urlFor(item.id)});
  }catch(error){
    const failure=audioFailure(error);
    const code=failure.code;
    console.error('[media/tts]',{code,providerStatus:failure.providerStatus,providerCode:failure.providerCode});
    const messages:Record<string,string>={
      PAID_VOICE:'Giọng này thuộc Voice Library. ElevenLabs yêu cầu gói trả phí để dùng giọng này qua API. Chọn giọng mặc định được cấp cho tài khoản hoặc nâng gói ElevenLabs.',
      INVALID_KEY:'API key ElevenLabs không hợp lệ hoặc đã bị thu hồi. Nhập key mới trong Media và lưu cấu hình.',
      PERMISSION:'API key hoặc tài khoản ElevenLabs chưa có quyền tạo audio với giọng này.',
      VOICE_NOT_FOUND:'Không tìm thấy giọng đọc. Kiểm tra Voice ID và quyền truy cập giọng trong tài khoản ElevenLabs.',
      QUOTA:'ElevenLabs đã hết hạn mức hoặc đang giới hạn yêu cầu. Thử lại sau hoặc kiểm tra số credit còn lại.',
      BUSY:'Đang tạo audio hoặc vừa bị ElevenLabs giới hạn. Chờ một phút rồi thử lại.',
      DISABLED:'Cần bật ElevenLabs, nhập API key và Voice ID, rồi lưu cấu hình giọng đọc.',
      NETWORK:'Container không kết nối được ElevenLabs. Kiểm tra kết nối Internet, DNS và chứng chỉ TLS trên VPS.',
      TIMEOUT:'ElevenLabs không phản hồi trong 45 giây. Thử tạo một câu ngắn rồi thử lại.',
      STORAGE:'Không ghi được Media trên server. Kiểm tra quyền ghi của volume /app/data cho UID 1001 và dung lượng ổ đĩa.',
      UNUSUAL_ACTIVITY:'ElevenLabs chặn yêu cầu vì phát hiện hoạt động bất thường. Kiểm tra tài khoản ElevenLabs và chính sách sử dụng API từ IP VPS.',
      INVALID_REQUEST:'ElevenLabs từ chối cấu hình tạo giọng. Kiểm tra Voice ID, model và tốc độ đã lưu.',
      INVALID_AUDIO:'ElevenLabs trả phản hồi không phải audio. Kiểm tra log vocakids để xem mã phản hồi.',
    };
    const diagnostic=[failure.providerStatus && `HTTP ${failure.providerStatus}`,failure.providerCode].filter(Boolean).join(' · ');
    return NextResponse.json({code:messages[code]?code:'PROVIDER',message:(messages[code]||'ElevenLabs chưa trả được audio. Hãy thử lại sau.')+(diagnostic?` (${diagnostic})`:'' )},{status:code==='QUOTA'||code==='BUSY'?429:503});
  }
}
