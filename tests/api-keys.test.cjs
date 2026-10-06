/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {load}=require('./ts-loader.cjs');
process.env.VOCAKIDS_CONTENT_DIR=fs.mkdtempSync(path.join(process.cwd(),'.tmp-learning/api-key-test-'));
const {readApiKeys,saveApiKeys,maskedApiKeys}=load('src/lib/backend/apiKeys.ts');
const {runKeyPool,keyUsage,resetKeyUsage,classifyProviderError}=load('src/lib/pronunciation/keyPool.ts');
process.env.VOCAKIDS_ADMIN_PASSWORD='api-key-tests-only';
const {newAdminToken}=load('src/lib/backend/auth.ts');
const adminRoute=load('src/app/api/admin/api-keys/route.ts');
const {NextRequest}=require('next/server');
const key=(id,project=id)=>({id,name:id,project,secret:`dummy-secret-${id}`,enabled:true});
const pool=(keys,mode='priority')=>({revision:0,mode,maxAttempts:3,cooldownSeconds:60,keys});
test('secrets persist separately, stay masked, and blank edits preserve old credentials',()=>{
  const original=readApiKeys();
  const saved=saveApiKeys({...original,keys:[{...key(''),name:'Primary',project:'project-a',secret:'dummy-secret-123456'}]});
  const publicData=maskedApiKeys(saved);
  assert.equal(publicData.keys[0].secret,undefined);
  assert.ok(!JSON.stringify(publicData).includes('dummy-secret-123456'));
  assert.equal(publicData.keys[0].masked,'••••••3456');
  const next=saveApiKeys({...publicData,keys:publicData.keys.map(k=>({...k,secret:''}))});
  assert.equal(next.keys[0].secret,'dummy-secret-123456');
  assert.throws(()=>saveApiKeys(publicData),/CONFLICT/);
  assert.throws(()=>saveApiKeys({...maskedApiKeys(next),maxAttempts:99}));
  assert.throws(()=>saveApiKeys({...maskedApiKeys(next),keys:[next.keys[0],next.keys[0]]}),/trùng/);
});
test('primary success never calls fallback, including child practice/retry',async()=>{
  const keys=[key('primary-ok'),key('fallback-unused')], calls=[];
  const result=await runKeyPool(pool(keys),async secret=>{calls.push(secret);return {value:{status:'practice'},failure:null};},10000);
  assert.equal(result.status,'practice'); assert.deepEqual(calls,[keys[0].secret]);
  assert.equal(keyUsage(keys[0]).successes,1);
});
test('quota cooldown skips every key in the same project',async()=>{
  const keys=[key('quota','shared'),key('same-quota','shared'),key('other-project')],calls=[];
  const execute=async secret=>{calls.push(secret); return {value:secret,failure:secret===keys[0].secret?'quota':null};};
  assert.equal(await runKeyPool(pool(keys),execute,10000),keys[2].secret);
  assert.deepEqual(calls,[keys[0].secret,keys[2].secret]);
  assert.ok(keyUsage(keys[1]).retryAt); calls.length=0;
  await runKeyPool(pool(keys),execute,10000); assert.deepEqual(calls,[keys[2].secret]);
});
test('auth failures stay blocked until credentials are replaced or a test succeeds',async()=>{
  const k=key('invalid-key'); await runKeyPool(pool([k]),async()=>({value:'error',failure:'auth'}),10000);
  assert.equal(keyUsage(k).blocked,true);
  assert.equal(await runKeyPool(pool([k]),async()=>{throw new Error('must skip');},10000),null);
  assert.equal(keyUsage({...k,secret:'replacement-secret'}).blocked,false);
  resetKeyUsage(k); assert.equal(keyUsage(k).blocked,false);
});
test('round robin rotates starting credentials',async()=>{
  const keys=[key('rotation-a'),key('rotation-b')],calls=[];
  const execute=async secret=>{calls.push(secret);return {value:secret,failure:null};};
  await runKeyPool(pool(keys,'round_robin'),execute,10000);
  await runKeyPool(pool(keys,'round_robin'),execute,10000);
  assert.equal(new Set(calls).size,2);
});
test('invalid model output does not cause retry on another key',async()=>{
  let calls=0; await runKeyPool(pool([key('schema-a'),key('schema-b')]),async()=>{calls++;return {value:'invalid output',failure:'other'};},10000);
  assert.equal(calls,1);
});
test('attempt count and total time budget cap fallback work',async()=>{
  let calls=0;
  const config={...pool([key('limit-a'),key('limit-b'),key('limit-c')]),maxAttempts:1};
  await runKeyPool(config,async()=>{calls++;return {value:'error',failure:'transient'};},10000);
  assert.equal(calls,1);
  let clock=0; calls=0;
  await runKeyPool(pool([key('deadline-a'),key('deadline-b')]),async(secret,remaining)=>{calls++;assert.equal(remaining,5000);clock=10000;return {value:'timeout',failure:'transient'};},10000,()=>clock);
  assert.equal(calls,1);
});
test('a timed-out primary leaves budget for a fallback key',async()=>{
  let clock=0; const timeouts=[];
  const config={...pool([key('timeout-primary'),key('timeout-fallback')]),maxAttempts:2};
  const value=await runKeyPool(config,async(secret,timeout)=>{
    timeouts.push(timeout); clock+=timeout;
    return {value:secret,failure:timeouts.length===1?'transient':null};
  },10000,()=>clock);
  assert.deepEqual(timeouts,[5000,5000]);
  assert.equal(value,config.keys[1].secret);
});
test('recognizes SDK auth, quota, transient and non-retryable failures without returning raw errors',()=>{
  assert.equal(classifyProviderError({status:429}),'quota');
  assert.equal(classifyProviderError({status:403}),'auth');
  assert.equal(classifyProviderError({status:400,message:'API_KEY_INVALID'}),'auth');
  assert.equal(classifyProviderError({status:503}),'transient');
  assert.equal(classifyProviderError(new Error('fetch failed')),'transient');
  assert.equal(classifyProviderError(new Error('invalid_model_output')),'other');
});
test('admin routes enforce cookie and origin and never return stored secrets',async()=>{
  const url='http://localhost:3000/api/admin/api-keys';
  assert.equal(adminRoute.GET(new NextRequest(url)).status,401);
  assert.equal((await adminRoute.PUT(new NextRequest(url,{method:'PUT',body:'{}'}))).status,403);
  assert.equal((await adminRoute.POST(new NextRequest(url,{method:'POST',body:'{}'}))).status,403);
  const headers={cookie:`vocakids_backend_session=${newAdminToken()}`,host:'localhost:3000',origin:'https://untrusted.test'};
  assert.equal((await adminRoute.PUT(new NextRequest(url,{method:'PUT',headers,body:'{}'}))).status,403);
  const result=await adminRoute.GET(new NextRequest(url,{headers})).json();
  assert.equal(result.keys[0].secret,undefined);
  assert.ok(!JSON.stringify(result).includes('dummy-secret-123456'));
  const publicRoute=load('src/app/api/pronunciation/config/route.ts');
  const publicConfig=await publicRoute.GET().json();
  assert.equal(publicConfig.hasServerKey,true);
  assert.ok(!JSON.stringify(publicConfig).includes('dummy-secret'));
  assert.equal(publicConfig.keys,undefined);
});
test('pronunciation endpoint shares duplicate work and uses a complete fallback pair without exposing keys',async()=>{
  const {GoogleGenerativeAI}=require('@google/generative-ai');
  const original=GoogleGenerativeAI.prototype.getGenerativeModel;
  const config=saveApiKeys({...readApiKeys(),maxAttempts:2,keys:[{...key(''),name:'First',project:'e2e-primary',secret:'dummy-e2e-primary'},{...key(''),name:'Second',project:'e2e-fallback',secret:'dummy-e2e-fallback'}]});
  const calls=[];
  GoogleGenerativeAI.prototype.getGenerativeModel=function(options){
    const secret=this.apiKey;
    return {generateContent:async()=>{
      calls.push(secret);
      if(secret==='dummy-e2e-primary') throw Object.assign(new Error('quota'),{status:429});
      const result=options.systemInstruction.includes('You transcribe')?{speechStatus:'clear',transcript:'cat',interference:'none_detected'}:{assessability:'usable',contentMatch:'match',pronunciation:'acceptable',issues:[],rawModelScore:null};
      return {response:{text:()=>JSON.stringify(result)}};
    }};
  };
  try {
    const route=load('src/app/api/pronunciation/route.ts');
    const request=()=>new NextRequest('http://localhost:3000/api/pronunciation',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({attemptId:'duplicate-e2e-attempt',audioBase64:'A'.repeat(120),targetWord:'cat',apiKey:'ignored-local-secret'})});
    const responses=await Promise.all([route.POST(request()),route.POST(request())]);
    const results=await Promise.all(responses.map(r=>r.json()));
    assert.deepEqual(results[0],results[1]);
    assert.equal(results[0].status,'pass'); assert.equal(results[0].attemptId,'duplicate-e2e-attempt');
    assert.deepEqual(calls,['dummy-e2e-primary','dummy-e2e-primary','dummy-e2e-fallback','dummy-e2e-fallback']);
    assert.equal(keyUsage(config.keys[0]).uses,1); assert.equal(keyUsage(config.keys[1]).uses,1);
    assert.ok(!JSON.stringify(results).includes('dummy-e2e'));
  } finally {GoogleGenerativeAI.prototype.getGenerativeModel=original;}
});
