/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {load}=require('./ts-loader.cjs');
process.env.VOCAKIDS_CONTENT_DIR=fs.mkdtempSync(path.join(process.cwd(),'.tmp-learning/media-test-'));
delete process.env.ELEVENLABS_API_KEY;
const media=load('src/lib/media/store.ts');
test('settings never expose credentials; malformed voice/model rejected',()=>{
  media.saveAudioSettings({enabled:true,voiceId:'test_voice',model:'eleven_flash_v2_5',apiKey:'test-secret'});
  assert.equal(media.publicAudioSettings().configured,true);
  assert.equal('apiKey' in media.publicAudioSettings(),false);
  assert.throws(()=>media.saveAudioSettings({enabled:true,voiceId:'../escape',model:'eleven_flash_v2_5'}));
  assert.throws(()=>media.saveAudioSettings({enabled:true,voiceId:'test',model:'invalid'}));
  assert.throws(()=>media.mediaFile('../settings'));
  assert.throws(()=>media.saveAudioSettings({enabled:true,voiceId:'test_voice',model:'eleven_flash_v2_5',speed:0.1}));
  const s=media.audioSettings();assert.notEqual(media.audioId('Hello.',s),media.audioId('Hello.',{...s,speed:1}));
});
test('concurrent generation coalesces, persists MP3, cache avoids provider calls',async()=>{
  const original=global.fetch;let calls=0;
  global.fetch=async()=>{calls++;await new Promise(r=>setTimeout(r,10));return new Response(Buffer.from('ID3audio'),{headers:{'content-type':'audio/mpeg'}});};
  try{
    const [first,second]=await Promise.all([media.generateAudio('Hello world.'),media.generateAudio('Hello world.')]);
    assert.equal(calls,1);assert.equal(first.id,second.id);
    assert.equal(fs.readFileSync(media.mediaFile(first.id)).toString(),'ID3audio');
    await media.generateAudio('Hello world.');assert.equal(calls,1);assert.equal(media.listAudio().length,1);
    media.saveAudioSettings({enabled:true,voiceId:'different',model:'eleven_flash_v2_5'});
    const next=await media.generateAudio('Hello world.');assert.notEqual(next.id,first.id);assert.equal(calls,2);
  }finally{global.fetch=original;}
});
test('slow audio uses provider pace, a separate cache, and preserves normal settings',async()=>{
  const original=global.fetch;const speeds=[];
  global.fetch=async(_url,options)=>{speeds.push(JSON.parse(options.body).voice_settings.speed);return new Response(Buffer.from('ID3slow'),{headers:{'content-type':'audio/mpeg'}});};
  try {
    const normal=await media.generateAudio('Read slowly.');
    const slow=await media.generateAudio('Read slowly.','slow');
    assert.notEqual(normal.id,slow.id);
    assert.deepEqual(speeds,[0.85,0.7]);
    assert.equal(slow.speed,0.7);
    assert.equal(media.audioSettings().speed,0.85);
    await media.generateAudio('Read slowly.','slow');
    assert.equal(speeds.length,2);
  }finally{global.fetch=original;}
});

test('provider failures and non-audio responses never save invalid media',async()=>{
  const original=global.fetch;
  try{
    const before=media.listAudio().length;
    global.fetch=async()=>new Response('bad',{status:500});await assert.rejects(media.generateAudio('Failure.'),/PROVIDER/);
    global.fetch=async()=>new Response('{}',{headers:{'content-type':'application/json'}});await assert.rejects(media.generateAudio('Invalid response.'),/PROVIDER/);
    assert.equal(media.listAudio().length,before);
  }finally{global.fetch=original;}
});
test('media configuration and generation reject unauthenticated requests',async()=>{
  const {NextRequest}=require('next/server');
  const settings=load('src/app/api/admin/media/route.ts');
  const tts=load('src/app/api/media/tts/route.ts');
  const request=new NextRequest('http://localhost:3000/api/media/tts',{method:'POST',headers:{host:'localhost:3000',origin:'http://localhost:3000','content-type':'application/json'},body:JSON.stringify({text:'Hello.'})});
  assert.equal((await tts.POST(request)).status,401);
  assert.equal(settings.GET(new NextRequest('http://localhost:3000/api/admin/media')).status,401);
});
test('admin scoped cookie creates and plays media through admin endpoints',async()=>{
  const {NextRequest}=require('next/server');
  process.env.VOCAKIDS_ADMIN_PASSWORD='media-test-admin-password';
  const {newAdminToken}=load('src/lib/backend/auth.ts');
  const cookie=`vocakids_backend_session=${newAdminToken()}`;
  const tts=load('src/app/api/admin/media/tts/route.ts');
  const audio=load('src/app/api/admin/media/audio/[id]/route.ts');
  const original=global.fetch;
  global.fetch=async()=>new Response(Buffer.from('ID3admin'),{headers:{'content-type':'audio/mpeg'}});
  try{
    const response=await tts.POST(new NextRequest('http://localhost:3000/api/admin/media/tts',{method:'POST',headers:{cookie,host:'localhost:3000',origin:'http://localhost:3000','content-type':'application/json'},body:JSON.stringify({text:'Admin lesson.'})}));
    assert.equal(response.status,200);
    const result=await response.json();assert.equal(result.url,`/api/admin/media/audio/${result.id}`);
    const played=await audio.GET(new NextRequest(`http://localhost:3000${result.url}`,{headers:{cookie}}),{params:Promise.resolve({id:result.id})});
    assert.equal(played.status,200);assert.equal(await played.text(),'ID3admin');
    const denied=await audio.GET(new NextRequest(`http://localhost:3000${result.url}`),{params:Promise.resolve({id:result.id})});assert.equal(denied.status,401);
  }finally{global.fetch=original;}
});
test('paid library voice rejection explains the plan requirement without leaking provider details',async()=>{
  const {NextRequest}=require('next/server');
  const {newAdminToken}=load('src/lib/backend/auth.ts');
  const tts=load('src/app/api/admin/media/tts/route.ts');
  const original=global.fetch;
  global.fetch=async()=>new Response(JSON.stringify({detail:{code:'paid_plan_required',message:'provider-secret'}}),{status:402,headers:{'content-type':'application/json'}});
  try{
    const response=await tts.POST(new NextRequest('http://localhost:3000/api/admin/media/tts',{method:'POST',headers:{cookie:`vocakids_backend_session=${newAdminToken()}`,host:'localhost:3000',origin:'http://localhost:3000','content-type':'application/json'},body:JSON.stringify({text:'Paid voice test.'})}));
    const result=await response.json();assert.equal(result.code,'PAID_VOICE');assert.match(result.message,/gói trả phí/);assert.doesNotMatch(JSON.stringify(result),/provider-secret/);
  }finally{global.fetch=original;}
});
