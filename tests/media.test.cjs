/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {load}=require('./ts-loader.cjs');
process.env.VOCAKIDS_CONTENT_DIR=fs.mkdtempSync(path.join(process.cwd(),'.tmp-learning/media-test-'));
process.env.VOCAKIDS_FAMILY_DIR=fs.mkdtempSync(path.join(process.cwd(),'.tmp-learning/media-family-test-'));
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

test('legacy low speeds cannot make normal and slow reuse the same audio',()=>{
  const settingsFile=path.join(media.mediaDirectory,'settings.json');
  const original=fs.readFileSync(settingsFile,'utf8');
  try{
    for(const speed of [0.7,0.75,0.8,0.85,1,1.2]){
      fs.writeFileSync(settingsFile,JSON.stringify({...JSON.parse(original),speed}));
      const normal=media.audioSettingsForPace('normal'),slow=media.audioSettingsForPace('slow');
      assert.equal(normal.speed,Math.max(0.85,speed));
      assert.equal(slow.speed,0.7);
      assert.notEqual(media.audioId('Same sentence.',normal),media.audioId('Same sentence.',slow));
      assert.equal(media.publicAudioSettings().speed,normal.speed);
    }
    assert.throws(()=>media.saveAudioSettings({enabled:true,voiceId:'test',model:'eleven_flash_v2_5',speed:0.7}));
  }finally{fs.writeFileSync(settingsFile,original);}
});

test('provider failures and non-audio responses never save invalid media',async()=>{
  const original=global.fetch;
  try{
    const before=media.listAudio().length;
    global.fetch=async()=>new Response('bad',{status:500});await assert.rejects(media.generateAudio('Failure.'),/PROVIDER/);
    global.fetch=async()=>new Response('{}',{headers:{'content-type':'application/json'}});await assert.rejects(media.generateAudio('Invalid response.'),/INVALID_AUDIO/);
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
test('guests can play only cached shop words without generating new audio',async()=>{
  const {NextRequest}=require('next/server');
  const tts=load('src/app/api/media/tts/route.ts');
  const audio=load('src/app/api/media/audio/[id]/route.ts');
  const {shopItems}=load('src/lib/shop.ts');
  const original=global.fetch;let calls=0;
  global.fetch=async()=>{calls++;return new Response(Buffer.from('ID3guest'),{headers:{'content-type':'audio/mpeg'}});};
  try{
    const saved=await media.generateAudio(shopItems[0].en);
    const privateAudio=await media.generateAudio('Private lesson.');
    const missing=shopItems.find(item=>item.en!==shopItems[0].en&&!media.findAudio(media.audioId(item.en,media.audioSettingsForPace())));
    assert.ok(missing);
    const request=text=>new NextRequest('http://localhost:3000/api/media/tts',{method:'POST',headers:{host:'localhost:3000',origin:'http://localhost:3000','content-type':'application/json'},body:JSON.stringify({text})});
    assert.equal((await tts.GET()).status,200);
    assert.equal((await tts.GET().json()).available,true);
    const ready=await tts.POST(request(shopItems[0].en));assert.equal(ready.status,200);
    assert.equal((await ready.json()).id,saved.id);
    const play=await audio.GET(new NextRequest(`http://localhost:3000/api/media/audio/${saved.id}`),{params:Promise.resolve({id:saved.id})});
    assert.equal(play.status,200);assert.equal(await play.text(),'ID3guest');
    const notReady=await tts.POST(request(missing.en));assert.equal(notReady.status,404);
    assert.equal((await notReady.json()).code,'AUDIO_NOT_READY');
    assert.equal((await tts.POST(request('Private lesson.'))).status,401);
    assert.equal((await audio.GET(new NextRequest(`http://localhost:3000/api/media/audio/${privateAudio.id}`),{params:Promise.resolve({id:privateAudio.id})})).status,401);
    assert.equal(calls,2);
  }finally{global.fetch=original;}
});
test('student may generate only fixed shop product names and play the cached AI audio',async()=>{
  const {NextRequest}=require('next/server');
  const {signJWT}=load('src/lib/auth.ts');
  const {writeFamilies}=load('src/lib/backend/families.ts');
  const tts=load('src/app/api/media/tts/route.ts');
  const audio=load('src/app/api/media/audio/[id]/route.ts');
  const student={id:'shop-child',email:'shop-child@test.local',displayName:'Shop child',passwordHash:'',role:'student'};
  writeFamilies({accounts:[student],profiles:[],progresses:{},categories:{},revisions:{}});
  const cookie=`vocakids_auth_token=${signJWT({accountId:student.id,email:student.email,displayName:student.displayName,role:'student'})}`;
  const request=text=>new NextRequest('http://localhost:3000/api/media/tts',{method:'POST',headers:{cookie,host:'localhost:3000',origin:'http://localhost:3000','content-type':'application/json'},body:JSON.stringify({text})});
  const original=global.fetch;let calls=0;
  global.fetch=async()=>{calls++;return new Response(Buffer.from('ID3shop'),{headers:{'content-type':'audio/mpeg'}});};
  try{
    const denied=await tts.POST(request('Read an unrelated passage.'));assert.equal(denied.status,404);assert.equal(calls,0);
    const sentence=await tts.POST(request('Can I have a strawberry, please?'));assert.equal(sentence.status,404);assert.equal(calls,0);
    const allowed=await tts.POST(request('strawberry'));assert.equal(allowed.status,200);assert.equal(calls,1);
    const item=await allowed.json();assert.match(item.url,/^\/api\/media\/audio\/[a-f0-9]{64}$/);
    const played=await audio.GET(new NextRequest(`http://localhost:3000${item.url}`,{headers:{cookie}}),{params:Promise.resolve({id:item.id})});
    assert.equal(played.status,200);assert.equal(await played.text(),'ID3shop');
    const repeat=await tts.POST(request('strawberry'));assert.equal(repeat.status,200);assert.equal(calls,1);
  }finally{global.fetch=original;}
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

test('batch shop route rejects unauthenticated requests and streams audio generation for admin',async()=>{
  const {NextRequest}=require('next/server');
  const {newAdminToken}=load('src/lib/backend/auth.ts');
  const batchRoute=load('src/app/api/admin/media/tts/batch-shop/route.ts');
  // Unauthenticated
  const denied=await batchRoute.POST(new NextRequest('http://localhost:3000/api/admin/media/tts/batch-shop',{method:'POST',headers:{host:'localhost:3000',origin:'http://localhost:3000'}}));
  assert.equal(denied.status,403);

  // Authenticated
  const original=global.fetch;
  global.fetch=async()=>new Response(Buffer.from('ID3batchaudio'),{headers:{'content-type':'audio/mpeg'}});
  try{
    const response=await batchRoute.POST(new NextRequest('http://localhost:3000/api/admin/media/tts/batch-shop',{method:'POST',headers:{cookie:`vocakids_backend_session=${newAdminToken()}`,host:'localhost:3000',origin:'http://localhost:3000'}}));
    assert.equal(response.status,200);
    assert.equal(response.headers.get('content-type'),'application/x-ndjson');
    const reader=response.body.getReader();
    const decoder=new TextDecoder();
    let text='';
    while(true){
      const {done,value}=await reader.read();
      if(done)break;
      text+=decoder.decode(value);
      // We only need to check the initial streaming events without waiting for all items in the test
      if(text.includes('"type":"start"'))break;
    }
    assert.match(text,/"type":"start"/);
    reader.cancel();
  }finally{global.fetch=original;}
});

test('generic batch route returns stats via GET and streams generation for chosen scope',async()=>{
  const {NextRequest}=require('next/server');
  const {newAdminToken}=load('src/lib/backend/auth.ts');
  const batchRoute=load('src/app/api/admin/media/tts/batch/route.ts');
  const cookie=`vocakids_backend_session=${newAdminToken()}`;

  // GET stats
  const statsRes=await batchRoute.GET(new NextRequest('http://localhost:3000/api/admin/media/tts/batch',{headers:{cookie}}));
  assert.equal(statsRes.status,200);
  const stats=await statsRes.json();
  assert.equal(typeof stats.all.total,'number');
  assert.equal(typeof stats.shop.total,'number');
  assert.equal(typeof stats.curriculum.total,'number');
  assert.ok(stats.all.total>=1400);

  // POST with scope
  const original=global.fetch;
  global.fetch=async()=>new Response(Buffer.from('ID3scopeaudio'),{headers:{'content-type':'audio/mpeg'}});
  try{
    const response=await batchRoute.POST(new NextRequest('http://localhost:3000/api/admin/media/tts/batch',{method:'POST',headers:{cookie,host:'localhost:3000',origin:'http://localhost:3000','content-type':'application/json'},body:JSON.stringify({scope:'curriculum',limit:3})}));
    assert.equal(response.status,200);
    assert.equal(response.headers.get('content-type'),'application/x-ndjson');
    const reader=response.body.getReader();
    const decoder=new TextDecoder();
    let text='';
    while(true){
      const {done,value}=await reader.read();
      if(done)break;
      text+=decoder.decode(value);
      if(text.includes('"type":"start"'))break;
    }
    assert.match(text,/"type":"start"/);
    reader.cancel();
  }finally{global.fetch=original;}
});

test('settings can store and mask multiple ElevenLabs API keys; keyMode priority and round_robin validated',()=>{
  media.saveAudioSettings({
    enabled: true,
    voiceId: 'test_voice',
    model: 'eleven_flash_v2_5',
    keyMode: 'priority',
    apiKeys: [
      { id: 'k1', name: 'Key Một', key: 'eleven-secret-key-1', enabled: true },
      { id: 'k2', name: 'Key Hai', key: 'eleven-secret-key-2', enabled: false },
    ],
  });
  const pub = media.publicAudioSettings();
  assert.equal(pub.configured, true);
  assert.equal(pub.activeKeyCount, 1);
  assert.equal(pub.keyMode, 'priority');
  assert.equal(pub.apiKeys.length, 2);
  assert.equal(pub.apiKeys[0].name, 'Key Một');
  assert.equal(pub.apiKeys[0].masked, '••••••ey-1');
  assert.equal(pub.apiKeys[1].name, 'Key Hai');
  assert.equal(pub.apiKeys[1].enabled, false);
  // Ensure raw keys never leak
  assert.equal(JSON.stringify(pub).includes('eleven-secret-key-1'), false);
  assert.equal(JSON.stringify(pub).includes('eleven-secret-key-2'), false);

  // Switch to round_robin mode
  media.saveAudioSettings({
    enabled: true,
    voiceId: 'test_voice',
    model: 'eleven_flash_v2_5',
    keyMode: 'round_robin',
    apiKeys: [
      { id: 'k1', name: 'Key Một', key: 'eleven-secret-key-1', enabled: true },
      { id: 'k2', name: 'Key Hai', key: 'eleven-secret-key-2', enabled: true },
    ],
  });
  const pub2 = media.publicAudioSettings();
  assert.equal(pub2.keyMode, 'round_robin');
  assert.equal(pub2.activeKeyCount, 2);
});

test('multi-key pool fails over when key 1 encounters quota 429 and succeeds on key 2',async()=>{
  media.resetKeyUsagePool();
  media.saveAudioSettings({
    enabled: true,
    voiceId: 'failover_voice',
    model: 'eleven_flash_v2_5',
    keyMode: 'priority',
    apiKeys: [
      { id: 'key_exhausted', name: 'Key Hết Quota', key: 'secret_key_1111', enabled: true },
      { id: 'key_backup', name: 'Key Dự Phòng', key: 'secret_key_2222', enabled: true },
    ],
  });

  const usedKeys = [];
  const original = global.fetch;
  global.fetch = async (_url, options) => {
    const key = options.headers['xi-api-key'];
    usedKeys.push(key);
    if (key === 'secret_key_1111') {
      return new Response(JSON.stringify({ detail: { status: 'quota_exceeded' } }), {
        status: 429,
        headers: { 'content-type': 'application/json' },
      });
    }
    return new Response(Buffer.from('ID3backupaudio'), {
      headers: { 'content-type': 'audio/mpeg' },
    });
  };

  try {
    const audio = await media.generateAudio('Testing failover message.');
    assert.ok(audio.id);
    assert.deepEqual(usedKeys, ['secret_key_1111', 'secret_key_2222']);
    const pub = media.publicAudioSettings();
    const k1 = pub.apiKeys.find(k => k.id === 'key_exhausted');
    const k2 = pub.apiKeys.find(k => k.id === 'key_backup');
    assert.equal(k1.failures, 1);
    assert.equal(k1.isCooldown, true);
    assert.equal(k2.successes, 1);
  } finally {
    global.fetch = original;
  }
});

test('multi-key pool fails over when key 1 encounters 401 invalid key and uses key 2',async()=>{
  media.resetKeyUsagePool();
  media.saveAudioSettings({
    enabled: true,
    voiceId: 'auth_failover_voice',
    model: 'eleven_flash_v2_5',
    keyMode: 'priority',
    apiKeys: [
      { id: 'key_bad_auth', name: 'Key Hỏng', key: 'secret_bad_key', enabled: true },
      { id: 'key_good_auth', name: 'Key Tốt', key: 'secret_good_key', enabled: true },
    ],
  });

  const usedKeys = [];
  const original = global.fetch;
  global.fetch = async (_url, options) => {
    const key = options.headers['xi-api-key'];
    usedKeys.push(key);
    if (key === 'secret_bad_key') {
      return new Response(JSON.stringify({ detail: { status: 'invalid_api_key' } }), {
        status: 401,
        headers: { 'content-type': 'application/json' },
      });
    }
    return new Response(Buffer.from('ID3goodauthaudio'), {
      headers: { 'content-type': 'audio/mpeg' },
    });
  };

  try {
    const audio = await media.generateAudio('Testing auth failover.');
    assert.ok(audio.id);
    assert.deepEqual(usedKeys, ['secret_bad_key', 'secret_good_key']);
  } finally {
    global.fetch = original;
  }
});

test('multi-key round_robin mode rotates requests across enabled keys',async()=>{
  media.resetKeyUsagePool();
  media.saveAudioSettings({
    enabled: true,
    voiceId: 'rr_voice',
    model: 'eleven_flash_v2_5',
    keyMode: 'round_robin',
    apiKeys: [
      { id: 'rr_1', name: 'RR 1', key: 'secret_rr_1', enabled: true },
      { id: 'rr_2', name: 'RR 2', key: 'secret_rr_2', enabled: true },
    ],
  });

  const usedKeys = [];
  const original = global.fetch;
  global.fetch = async (_url, options) => {
    const key = options.headers['xi-api-key'];
    usedKeys.push(key);
    return new Response(Buffer.from('ID3rraudio'), {
      headers: { 'content-type': 'audio/mpeg' },
    });
  };

  try {
    await media.generateAudio('First sentence in round robin.');
    await media.generateAudio('Second sentence in round robin.');
    assert.equal(usedKeys.length, 2);
    assert.notEqual(usedKeys[0], usedKeys[1]);
    assert.deepEqual(new Set(usedKeys), new Set(['secret_rr_1', 'secret_rr_2']));
  } finally {
    global.fetch = original;
  }
});

test('multi-key pool throws quota error only when all keys are exhausted',async()=>{
  media.resetKeyUsagePool();
  media.saveAudioSettings({
    enabled: true,
    voiceId: 'all_fail_voice',
    model: 'eleven_flash_v2_5',
    keyMode: 'priority',
    apiKeys: [
      { id: 'all_1', name: 'All 1', key: 'secret_all_1', enabled: true },
      { id: 'all_2', name: 'All 2', key: 'secret_all_2', enabled: true },
    ],
  });

  const original = global.fetch;
  global.fetch = async () => new Response(JSON.stringify({ detail: { status: 'quota_exceeded' } }), {
    status: 429,
    headers: { 'content-type': 'application/json' },
  });

  try {
    await assert.rejects(media.generateAudio('All keys exhausted.'), /QUOTA/);
  } finally {
    global.fetch = original;
  }
});



