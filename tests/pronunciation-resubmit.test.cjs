/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test');const assert=require('node:assert/strict');
const {NextRequest}=require('next/server');const {createLoader}=require('./ts-loader.cjs');

test('uncertain recording can be reassessed with the same attempt ID, then a conclusive result is reused',async()=>{
  const old=process.env.GEMINI_API_KEY;process.env.GEMINI_API_KEY='dummy-test-server';
  let calls=0;const ids=[];
  const load=createLoader({
    '@/lib/backend/store':{readContent:()=>({settings:{pronunciation:{enabled:true,model:'test',timeoutMs:20000}}})},
    '@/lib/backend/apiKeys':{readApiKeys:()=>({keys:[]})},
    '@/lib/pronunciation/index':{evaluatePronunciationDual:async id=>{
      calls++;ids.push(id);await new Promise(resolve=>setTimeout(resolve,5));
      return {attemptId:id,status:calls===1?'retry':'pass',reason:calls===1?'conflicting_evidence':'acceptable',passed:calls===1?null:true,score:null};
    }},
  });
  const {POST}=load('src/app/api/pronunciation/route.ts');
  const request=()=>new NextRequest('http://localhost/api/pronunciation',{method:'POST',body:JSON.stringify({attemptId:'one-physical-recording',targetWord:'cat',audioBase64:'A'.repeat(120),mimeType:'audio/webm'})});
  try {
    const concurrent=await Promise.all([POST(request()),POST(request())]);
    assert.equal(calls,1);assert.equal((await concurrent[0].json()).status,'retry');
    const checked=await POST(request());assert.equal((await checked.json()).status,'pass');assert.equal(calls,2);
    await POST(request());assert.equal(calls,2);assert.deepEqual(ids,['one-physical-recording','one-physical-recording']);
  }finally{if(old===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=old;}
});
