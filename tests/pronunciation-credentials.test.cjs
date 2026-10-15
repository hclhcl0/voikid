/* eslint-disable @typescript-eslint/no-require-imports -- Uses the project's TS test loader. */
const test=require('node:test');
const assert=require('node:assert/strict');
const {NextRequest}=require('next/server');
const {createLoader}=require('./ts-loader.cjs');

test('parents can evaluate without a personal key using shared server credentials, without disclosing them',async()=>{
  const originalEnv=process.env.GEMINI_API_KEY;
  const calls=[];
  let pool={revision:0,mode:'priority',maxAttempts:2,cooldownSeconds:60,keys:[]};
  const load=createLoader({
    '@/lib/backend/apiKeys':{readApiKeys:()=>pool,credentialId:key=>`${key.id}:${key.secret}`},
    '@/lib/backend/store':{readContent:()=>({settings:{pronunciation:{enabled:true,model:'test-model',timeoutMs:20000,allowArticles:true}}})},
    '@/lib/pronunciation/index':{evaluatePronunciationDual:async(attemptId,audio,mime,policy,key)=>{calls.push(key);return {attemptId,status:'pass',passed:true,score:null,feedbackVi:'Đọc đúng!'};}},
  });
  const {POST}=load('src/app/api/pronunciation/route.ts');
  const {GET}=load('src/app/api/pronunciation/config/route.ts');
  let attempt=0;
  const req=apiKey=>new NextRequest('https://app.test/api/pronunciation',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({attemptId:`credentials_${++attempt}`,targetWord:'friend',phonetic:'/frend/',mimeType:'audio/webm',audioBase64:'A'.repeat(120),...(apiKey?{apiKey}:{})})});
  try {
    process.env.GEMINI_API_KEY='dummy-server-key';
    assert.equal((await POST(req())).status,200);
    assert.equal(calls.at(-1),'dummy-server-key');
    assert.equal((await POST(req('dummy-stale-parent-key'))).status,200);
    assert.equal(calls.at(-1),'dummy-server-key');
    const config=await GET().json();
    assert.equal(config.hasServerKey,true);
    assert.ok(!JSON.stringify(config).includes('dummy-server-key'));

    pool={...pool,keys:[{id:'shared',name:'Shared',project:'credentials-test',enabled:true,secret:'dummy-shared-pool-key'}]};
    delete process.env.GEMINI_API_KEY;
    assert.equal((await POST(req())).status,200);
    assert.equal(calls.at(-1),'dummy-shared-pool-key');
    assert.equal((await GET().json()).hasServerKey,true);

    pool={...pool,keys:[]};
    assert.equal((await GET().json()).hasServerKey,false);
    const missing=await POST(req());
    assert.equal(missing.status,401);
    const body=await missing.json();
    assert.equal(body.error,'NO_API_KEY');
    assert.match(body.message,/Phụ huynh không cần nhập key riêng/);
    assert.equal((await POST(req('dummy-legacy-personal-key'))).status,200);
    assert.equal(calls.at(-1),'dummy-legacy-personal-key');
  } finally {
    if(originalEnv===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=originalEnv;
  }
});
