import {NextRequest,NextResponse} from 'next/server';
import {isBackendAdmin,sameOrigin} from '@/lib/backend/auth';
import {audioId,audioSettingsForPace,findAudio,generateAudio,publicAudioSettings} from '@/lib/media/store';
import {readContent} from '@/lib/backend/store';
import {shopItems} from '@/lib/shop';

export const runtime='nodejs';

export type BatchScope = 'all' | 'shop' | 'curriculum';

export const ERROR_DESCRIPTIONS: Record<string, string> = {
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

export function getWordsForScope(scope: BatchScope = 'all'): string[] {
  const shopWords = Array.from(new Set(shopItems.map(w => w.en.trim()).filter(Boolean)));
  const content = readContent();
  const curriculumWords = Array.from(
    new Set(content.categories.flatMap(c => c.words.map(w => w.en.trim())).filter(Boolean))
  );

  if (scope === 'shop') return shopWords;
  if (scope === 'curriculum') return curriculumWords;
  return Array.from(new Set([...curriculumWords, ...shopWords]));
}

export function getScopeStats() {
  const settings = audioSettingsForPace('normal');
  const isCached = (text: string) => !!findAudio(audioId(text, settings));

  const shopWords = getWordsForScope('shop');
  const curriculumWords = getWordsForScope('curriculum');
  const allWords = getWordsForScope('all');

  const shopCached = shopWords.filter(isCached).length;
  const curriculumCached = curriculumWords.filter(isCached).length;
  const allCached = allWords.filter(isCached).length;

  return {
    shop: { total: shopWords.length, cached: shopCached, missing: shopWords.length - shopCached },
    curriculum: { total: curriculumWords.length, cached: curriculumCached, missing: curriculumWords.length - curriculumCached },
    all: { total: allWords.length, cached: allCached, missing: allWords.length - allCached },
  };
}

export async function GET(req:NextRequest){
  if(!isBackendAdmin(req)){
    return NextResponse.json({message:'Cần quyền admin.'},{status:403});
  }
  return NextResponse.json(getScopeStats(),{headers:{'Cache-Control':'no-store'}});
}

export async function POST(req:NextRequest){
  if(!sameOrigin(req)||!isBackendAdmin(req)){
    return new Response(JSON.stringify({message:'Cần quyền admin.'}),{status:403,headers:{'Content-Type':'application/json'}});
  }

  let scope: BatchScope = 'all';
  let limit: number | undefined;
  try{
    const body = await req.json().catch(()=>({}));
    if(body.scope === 'shop' || body.scope === 'curriculum' || body.scope === 'all') {
      scope = body.scope;
    }
    if(typeof body.limit === 'number' && body.limit > 0) {
      limit = body.limit;
    }
  }catch{/* fallback to all */}

  const settings = audioSettingsForPace('normal');
  const pub = publicAudioSettings();
  if(!settings.enabled||!pub.configured||!settings.voiceId){
    return new Response(JSON.stringify({message:'ElevenLabs chưa được cấu hình hoặc chưa bật. Vào Admin → Media để nhập API key và Voice ID rồi lưu cấu hình trước.'}),{status:400,headers:{'Content-Type':'application/json'}});
  }

  const allWordsInScope = getWordsForScope(scope);
  let todo = allWordsInScope.filter(text => !findAudio(audioId(text, settings)));
  if(limit && limit > 0) {
    todo = todo.slice(0, limit);
  }

  const total = allWordsInScope.length;
  const alreadyDone = total - todo.length;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller){
      const send = (obj:object) => controller.enqueue(encoder.encode(JSON.stringify(obj)+'\n'));
      send({type:'start',scope,total,alreadyDone,todo:todo.length});
      let done = alreadyDone, errors = 0;

      for(const text of todo){
        send({type:'progress',text,done,total,errors});
        try{
          await generateAudio(text,'normal');
          done++;
          send({type:'ok',text,done,total,errors});
        }catch(err){
          errors++;
          done++;
          const rawMsg = err instanceof Error ? err.message : 'unknown';
          const friendly = ERROR_DESCRIPTIONS[rawMsg] || rawMsg;
          send({type:'error',text,done,total,errors,msg:friendly,code:rawMsg});
          // Stop early on fatal errors (quota, invalid key, etc.)
          if(['DISABLED','INVALID_KEY','QUOTA','PERMISSION','PAID_VOICE','VOICE_NOT_FOUND'].includes(rawMsg)){
            send({type:'fatal',msg:friendly,code:rawMsg,done,total,errors});
            controller.close();
            return;
          }
        }
        // Rate limit safety delay
        await new Promise(r => setTimeout(r, 350));
      }
      send({type:'done',done,total,errors});
      controller.close();
    }
  });

  return new Response(stream,{headers:{'Content-Type':'application/x-ndjson','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
