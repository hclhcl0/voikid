import {NextRequest} from 'next/server';
import {isBackendAdmin,sameOrigin} from '@/lib/backend/auth';
import {audioId,audioSettingsForPace,findAudio,generateAudio,publicAudioSettings} from '@/lib/media/store';
import {shopItems} from '@/lib/shop';

export const runtime='nodejs';

const ERROR_DESCRIPTIONS: Record<string, string> = {
  QUOTA: 'Hết hạn mức ký tự ElevenLabs (quota exceeded)',
  INVALID_KEY: 'API key ElevenLabs không đúng hoặc bị thu hồi',
  VOICE_NOT_FOUND: 'Không tìm thấy Voice ID này trên ElevenLabs',
  PAID_VOICE: 'Giọng đọc này yêu cầu gói trả phí',
  PERMISSION: 'API key không có quyền tạo giọng với voice này',
  DISABLED: 'ElevenLabs đang tắt hoặc chưa cấu hình',
  BUSY: 'Đang bận hoặc đang trong thời gian cooldown',
  NETWORK: 'Không kết nối được máy chủ ElevenLabs',
  TIMEOUT: 'Quá thời gian phản hồi từ ElevenLabs',
};

// Stream progress back as newline-delimited JSON so client shows live progress
export async function POST(req:NextRequest){
  if(!sameOrigin(req)||!isBackendAdmin(req)){
    return new Response(JSON.stringify({message:'Cần quyền admin.'}),{status:403,headers:{'Content-Type':'application/json'}});
  }
  const words=Array.from(new Set(shopItems.map(w=>w.en)));
  const settings=audioSettingsForPace('normal');
  const pub=publicAudioSettings();
  if(!settings.enabled||!pub.configured||!settings.voiceId){
    return new Response(JSON.stringify({message:'ElevenLabs chưa được cấu hình hoặc chưa bật. Vào Admin → Media để nhập API key và Voice ID rồi lưu cấu hình trước.'}),{status:400,headers:{'Content-Type':'application/json'}});
  }

  // Count how many already exist
  const todo=words.filter(text=>!findAudio(audioId(text,settings)));
  const total=words.length;
  const alreadyDone=total-todo.length;
  const encoder=new TextEncoder();

  const stream=new ReadableStream({
    async start(controller){
      const send=(obj:object)=>controller.enqueue(encoder.encode(JSON.stringify(obj)+'\n'));
      send({type:'start',total,alreadyDone,todo:todo.length});
      let done=alreadyDone,errors=0;
      for(const text of todo){
        send({type:'progress',text,done,total,errors});
        try{
          await generateAudio(text,'normal');
          done++;
          send({type:'ok',text,done,total,errors});
        }catch(err){
          errors++;
          done++;
          const rawMsg=err instanceof Error?err.message:'unknown';
          const friendly=ERROR_DESCRIPTIONS[rawMsg]||rawMsg;
          send({type:'error',text,done,total,errors,msg:friendly,code:rawMsg});
          // Stop early on fatal errors (key invalid, quota exhausted, paid voice, etc.)
          if(['DISABLED','INVALID_KEY','QUOTA','PERMISSION','PAID_VOICE','VOICE_NOT_FOUND'].includes(rawMsg)){
            send({type:'fatal',msg:friendly,code:rawMsg,done,total,errors});
            controller.close();
            return;
          }
        }
        // Small delay to avoid rate limit bursts (~2-3 requests/second)
        await new Promise(r=>setTimeout(r,350));
      }
      send({type:'done',done,total,errors});
      controller.close();
    }
  });

  return new Response(stream,{headers:{'Content-Type':'application/x-ndjson','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
