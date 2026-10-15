/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');const {NextRequest}=require('next/server');
const {createLoader}=require('./ts-loader.cjs');
fs.mkdirSync(path.join(process.cwd(),'.tmp-learning'),{recursive:true});
process.env.VOCAKIDS_FAMILY_DIR=fs.mkdtempSync(path.join(process.cwd(),'.tmp-learning/family-ai-'));
process.env.JWT_SECRET='dummy-family-ai-test-secret';
const load=createLoader();const core=load('src/lib/backend/familyAi.ts');
const {writeFamilies}=load('src/lib/backend/families.ts');const {signJWT}=load('src/lib/auth.ts');
const accounts=[{id:'parent-a',role:'parent'},{id:'parent-b',role:'parent'},{id:'student-a',role:'student',parentId:'parent-a',profileId:'child-a'}].map(a=>({...a,email:`${a.id}@test.invalid`,displayName:a.id,passwordHash:'unused'}));
writeFamilies({accounts,profiles:[],progresses:{},categories:{},revisions:{}});
const req=(account='parent-a',method='GET',body,origin='http://localhost')=>new NextRequest('http://localhost/api/family/ai-key',{method,headers:{host:'localhost',origin,...(account?{cookie:`vocakids_auth_token=${signJWT({accountId:account,role:accounts.find(a=>a.id===account)?.role,email:'test@test.invalid',displayName:'Test'})}`}:{})},...(body!==undefined&&method!=='GET'?{body:JSON.stringify(body)}:{})});

test('parent key is encrypted, masked, persistent and isolated; students inherit use without management access',async()=>{
  const route=load('src/app/api/family/ai-key/route.ts');
  assert.equal((await route.GET(req())).status,200);
  const saved=await route.PUT(req('parent-a','PUT',{revision:0,mode:'personal',fallbackToShared:false,apiKey:'dummy-private-parent-a'}));
  assert.equal(saved.status,200);const visible=await saved.json();assert.equal(visible.hasKey,true);
  assert.ok(!JSON.stringify(visible).includes('dummy-private-parent-a'));assert.equal(visible.masked,'••••••nt-a');
  const disk=fs.readdirSync(path.join(process.env.VOCAKIDS_FAMILY_DIR,'ai-keys')).filter(f=>f.endsWith('.json')).map(f=>fs.readFileSync(path.join(process.env.VOCAKIDS_FAMILY_DIR,'ai-keys',f),'utf8')).join('');
  assert.ok(!disk.includes('dummy-private-parent-a'));
  const restarted=createLoader()('src/lib/backend/familyAi.ts');assert.equal(restarted.resolveFamilyAi(req()).key,'dummy-private-parent-a');
  assert.equal(core.resolveFamilyAi(req('student-a')).ownerId,'parent-a');
  assert.equal(core.resolveFamilyAi(req('parent-b')),null);
  assert.equal((await (await route.GET(req('parent-b'))).json()).hasKey,false);
  for(const method of ['GET','PUT','DELETE','POST'])assert.equal((await route[method](req('student-a',method,{revision:0,mode:'shared',fallbackToShared:false}))).status,403);
  assert.equal((await route.GET(req(''))).status,403);
  assert.equal((await route.PUT(req('parent-a','PUT',{revision:1,mode:'shared',fallbackToShared:false},'https://wrong.test'))).status,403);
  assert.equal((await route.PUT(req('parent-a','PUT',{revision:0,mode:'shared',fallbackToShared:false}))).status,409);
});

test('changing mode retains the key; replacement, deletion and account IDs cannot affect another family',async()=>{
  const route=load('src/app/api/family/ai-key/route.ts');
  core.saveFamilyAi('parent-b',{revision:0,mode:'personal',fallbackToShared:false,apiKey:'dummy-private-parent-b'});
  const changed=await route.PUT(req('parent-a','PUT',{revision:1,mode:'shared',fallbackToShared:true,ownerId:'parent-b'}));assert.equal(changed.status,200);
  assert.equal(core.resolveFamilyAi(req()),null);assert.equal(core.familyAiSecret('parent-a'),'dummy-private-parent-a');
  const deleted=await route.DELETE(req('parent-a','DELETE',{revision:2,ownerId:'parent-b'}));assert.equal(deleted.status,200);
  assert.equal(core.familyAiSecret('parent-a'),null);assert.equal(core.familyAiSecret('parent-b'),'dummy-private-parent-b');
  assert.equal(core.readFamilyAi('parent-a').mode,'shared');
  assert.throws(()=>core.saveFamilyAi('parent-a',{revision:3,mode:'personal',fallbackToShared:false}),/Nhập API key/);
});

test('fallback to shared credentials is opt-in, bounded and never triggered by invalid model output',async()=>{
  const personal={ownerId:'parent-a',key:'dummy-private',fallbackToShared:false};let sharedCalls=0;
  const shared=async budget=>{sharedCalls++;assert.ok(budget>0&&budget<=20000);return 'shared';};
  await assert.rejects(core.runFamilyAi(personal,async()=>({value:null,failure:'quota'}),shared,20000),e=>e.code==='quota');assert.equal(sharedCalls,0);
  assert.equal(await core.runFamilyAi({...personal,fallbackToShared:true},async()=>({value:null,failure:'quota'}),shared,20000),'shared');assert.equal(sharedCalls,1);
  await assert.rejects(core.runFamilyAi({...personal,fallbackToShared:true},async()=>({value:null,failure:'other'}),shared,20000));assert.equal(sharedCalls,1);
  assert.equal(await core.runFamilyAi(personal,async()=>({value:[],failure:null}),shared,20000) instanceof Array,true);
});

test('connection check uses the saved personal key and redacts provider errors',async()=>{
  const calls=[];const custom=createLoader({'@google/generative-ai':{GoogleGenerativeAI:class{constructor(key){this.key=key;}getGenerativeModel(){return {generateContent:async()=>{calls.push(this.key);throw Object.assign(new Error(`bad ${this.key}`),{status:429});}};}}}});
  const route=custom('src/app/api/family/ai-key/route.ts');
  const response=await route.POST(req('parent-b','POST'));assert.equal(response.status,503);const body=await response.json();
  assert.match(body.message,/hạn mức/);assert.ok(!JSON.stringify(body).includes('dummy-private-parent-b'));assert.deepEqual(calls,['dummy-private-parent-b']);
  assert.equal((await route.POST(req('parent-b','POST'))).status,429);
});

test('pronunciation uses the authenticated family key ahead of the shared pool and browser key',async()=>{
  core.saveFamilyAi('parent-a',{revision:3,mode:'personal',fallbackToShared:false,apiKey:'dummy-private-parent-a'});
  const calls=[];let fail=false;
  const custom=createLoader({
    '@/lib/backend/store':{readContent:()=>({settings:{pronunciation:{enabled:true,model:'test-model',timeoutMs:20000}}})},
    '@/lib/backend/apiKeys':{readApiKeys:()=>({mode:'priority',maxAttempts:1,cooldownSeconds:60,keys:[{id:'shared',secret:'dummy-shared-pool',enabled:true,project:'test'}]}),credentialId:k=>k.id},
    '@/lib/pronunciation/index':{evaluatePronunciationDual:async(id,audio,mime,policy,key,score,model,budget,onError)=>{calls.push(key);if(fail&&key==='dummy-private-parent-a')onError?.([{status:429}]);return {attemptId:id,status:fail&&key==='dummy-private-parent-a'?'service_error':'pass',passed:true,score:null};}},
  });
  const {POST}=custom('src/app/api/pronunciation/route.ts');let sequence=0;
  const evaluate=who=>POST(new NextRequest('http://localhost/api/pronunciation',{method:'POST',headers:req(who).headers,body:JSON.stringify({attemptId:`test_${++sequence}`,targetWord:'cat',mimeType:'audio/webm',audioBase64:'A'.repeat(120),apiKey:'dummy-browser-key'})}));
  assert.equal((await evaluate('parent-a')).status,200);assert.deepEqual(calls,['dummy-private-parent-a']);
  assert.equal((await evaluate('student-a')).status,200);assert.equal(calls.at(-1),'dummy-private-parent-a');
  fail=true;const denied=await evaluate('parent-a');assert.equal(denied.status,429);assert.ok(!calls.includes('dummy-shared-pool'));
  core.saveFamilyAi('parent-a',{revision:4,mode:'personal',fallbackToShared:true});
  assert.equal((await evaluate('parent-a')).status,200);assert.equal(calls.at(-1),'dummy-shared-pool');
  const {GET}=custom('src/app/api/pronunciation/config/route.ts');const config=await GET(req('student-a')).json();assert.equal(config.hasServerKey,true);assert.ok(!JSON.stringify(config).includes('dummy-private'));
});

test('story and vocabulary providers honor the same personal key despite a configured shared pool',async()=>{
  const {CURRICULUM}=load('src/lib/learning/curriculum.ts');const {storySource}=load('src/lib/stories/source.ts');
  const unit=CURRICULUM.find(u=>u.grade===1&&u.order===2&&u.section==='unit'),source=storySource(unit);
  const raw={title:'My things',sentences:[{en:'I have a cat.',vi:'Em có con mèo.',patternIndexes:[0]},{en:'I have a car.',vi:'Em có xe ô tô.',patternIndexes:[0]},{en:'I have a cup.',vi:'Em có cái cốc.',patternIndexes:[0]}],vocabulary:[{en:'cat',vi:'con mèo',ipa:'',sentenceId:'s1'},{en:'car',vi:'xe ô tô',ipa:'',sentenceId:'s2'}],questions:[{en:'What animal do I have?',vi:'Em có con gì?',options:['cat','dog'],answerIndex:0,sentenceId:'s1',explanationVi:'Câu đầu có cat.'},{en:'What toy do I have?',vi:'Em có đồ chơi gì?',options:['ball','car'],answerIndex:1,sentenceId:'s2',explanationVi:'Câu hai có car.'}]};
  const {GoogleGenerativeAI}=require('@google/generative-ai');const original=GoogleGenerativeAI.prototype.getGenerativeModel;const keys=[];
  GoogleGenerativeAI.prototype.getGenerativeModel=function(){keys.push(this.apiKey);return {generateContent:async prompt=>({response:{text:()=>JSON.stringify(prompt.startsWith('Scan EVERY')?{vocabulary:raw.vocabulary}:raw)}})};};
  try {
    const custom=createLoader({'@/lib/backend/apiKeys':{readApiKeys:()=>({keys:[{enabled:true,secret:'dummy-shared'}]})}});
    const choice={ownerId:'parent-a',key:'dummy-personal-provider',fallbackToShared:false};
    const generated=await custom('src/lib/stories/generate.ts').generateStory(source,'support',[], 'test-model',20000,'dummy-browser',choice);
    const terms=await custom('src/lib/stories/extractVocabulary.ts').extractVocabulary({...generated,grade:1},'test-model',20000,'dummy-browser',choice);
    assert.equal(terms[0].en,'cat');assert.deepEqual(keys,['dummy-personal-provider','dummy-personal-provider']);
  }finally{GoogleGenerativeAI.prototype.getGenerativeModel=original;}
});

test('story and scan endpoints pass the family choice; personal keys retain the admin daily generation limit',async()=>{
  process.env.VOCAKIDS_CONTENT_DIR=fs.mkdtempSync(path.join(process.cwd(),'.tmp-learning/family-ai-content-'));
  const families=load('src/lib/backend/families.ts'),store=families.readFamilies();const profile=families.createFamilyProfile('parent-a','Test child','lop1');store.profiles.push(profile);families.writeFamilies(store);
  const {CURRICULUM}=load('src/lib/learning/curriculum.ts');const unit=CURRICULUM.find(u=>u.grade===1&&u.order===2&&u.section==='unit');
  let generatedChoice,scanChoice;
  const custom=createLoader({
    '@/lib/backend/store':{readContent:()=>({categories:[],settings:{parentAi:{enabled:true,dailyLimit:1},pronunciation:{model:'test-model',timeoutMs:20000}}})},
    '@/lib/learning/curriculum':{curriculumForCategories:()=>[unit]},
    '@/lib/stories/store':{readStory:()=>null,saveStory:()=>{},readVocabulary:()=>null,saveVocabulary:()=>{}},
    '@/lib/stories/generate':{generateStory:async(...args)=>{generatedChoice=args[6];return {title:'My cat',sentences:[{id:'s1',en:'I have a cat.',vi:'Em có mèo.'}],vocabulary:[],questions:[]};}},
    '@/lib/stories/extractVocabulary':{extractVocabulary:async(...args)=>{scanChoice=args[4];return [{id:'v1',en:'cat',vi:'con mèo',ipa:'',sentenceId:'s1'}];},validateExtractedVocabulary:value=>value.vocabulary},
  });
  const story=custom('src/app/api/story/route.ts');
  const make=variant=>new NextRequest('http://localhost/api/story',{method:'POST',headers:req().headers,body:JSON.stringify({unitId:unit.id,profileId:profile.id,gradeId:'lop1',variant})});
  const first=await story.POST(make(0));assert.equal(first.status,200);const lesson=await first.json();
  assert.equal(generatedChoice.ownerId,'parent-a');assert.equal(generatedChoice.key,'dummy-private-parent-a');
  assert.ok(!JSON.stringify(lesson).includes('dummy-private'));
  const capped=await story.POST(make(1));assert.equal(capped.status,429);assert.equal((await capped.json()).code,'PARENT_AI_DAILY_LIMIT');
  const scan=custom('src/app/api/story/vocabulary/route.ts');
  const result=await scan.POST(new NextRequest('http://localhost/api/story/vocabulary',{method:'POST',headers:req().headers,body:JSON.stringify({lesson,profileId:profile.id})}));
  assert.equal(result.status,200);assert.equal(scanChoice.ownerId,'parent-a');assert.equal(scanChoice.key,'dummy-private-parent-a');
});
