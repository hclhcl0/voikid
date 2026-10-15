/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {NextRequest}=require('next/server');const {createLoader}=require('./ts-loader.cjs');
fs.mkdirSync(path.join(process.cwd(),'.tmp-learning'),{recursive:true});
process.env.VOCAKIDS_CONTENT_DIR=fs.mkdtempSync(path.join(process.cwd(),'.tmp-learning/shared-content-'));
process.env.VOCAKIDS_FAMILY_DIR=fs.mkdtempSync(path.join(process.cwd(),'.tmp-learning/shared-family-'));
process.env.VOCAKIDS_ADMIN_PASSWORD='dummy-shared-library-admin';
const load=createLoader(),{signJWT}=load('src/lib/auth.ts'),{newAdminToken}=load('src/lib/backend/auth.ts');
const families=load('src/lib/backend/families.ts'),{CURRICULUM}=load('src/lib/learning/curriculum.ts');
const {manualStory}=load('src/lib/stories/library.ts'),{storySource}=load('src/lib/stories/source.ts');
const {newStorySession}=load('src/lib/stories/learning.ts');
const unit=CURRICULUM.find(u=>u.grade===1&&u.order===2&&u.section==='unit');
const accounts=[{id:'a',role:'parent'},{id:'b',role:'parent'},{id:'child-account',role:'student',parentId:'a'}].map(a=>({...a,email:`${a.id}@test.invalid`,displayName:a.id,passwordHash:'unused'}));
const a=families.createFamilyProfile('a','Child A','lop1'),b=families.createFamilyProfile('b','Child B','lop1');
families.writeFamilies({accounts,profiles:[a,b],progresses:{},categories:{},revisions:{}});
const cookie=id=>id==='admin'?`vocakids_backend_session=${newAdminToken()}`:id?`vocakids_auth_token=${signJWT({accountId:id,email:`${id}@test.invalid`,displayName:id,role:accounts.find(a=>a.id===id).role})}`:'';
function request(id,method='GET',body,query=`?unitId=${unit.id}`,origin='http://localhost:3000'){
  return new NextRequest(`http://localhost:3000/api/story/library${query}`,{method,headers:{host:'localhost:3000',origin,cookie:cookie(id)},...(body?{body:JSON.stringify(body)}:{})});
}
const lesson=manualStory({title:'Our shared cat',text:'I have a cat.',translation:'Em có con mèo.',vocabulary:'cat | con mèo'},unit.id,storySource(unit),'manual-admin');
const route=load('src/app/api/story/library/route.ts');let shared;

test('admin content becomes common to parents without sharing profile data, answers or scores',async()=>{
  const response=await route.POST(request('admin','POST',{lesson:{...lesson,profileId:'private-profile',answers:{private:'secret-answer'},totalStars:123}}));
  assert.equal(response.status,200);shared=await response.json();assert.match(shared.id,/^shared_[a-f0-9]{64}$/);
  assert.doesNotMatch(JSON.stringify(shared),/private-profile|secret-answer|totalStars/);
  for(const id of ['a','b']){const list=await route.GET(request(id)).json();assert.equal(list.stories[0].id,shared.id);assert.equal(list.stories[0].lesson.sentences[0].en,'I have a cat.');}
  assert.equal(route.GET(request('a')).headers.get('Cache-Control'),'no-store');
});
test('parents and students cannot modify the common library; full passages require parent/admin access',async()=>{
  for(const id of ['a','b','child-account',null]){
    assert.equal((await route.POST(request(id,'POST',{lesson}))).status,403);
    assert.equal((await route.DELETE(request(id,'DELETE',{unitId:unit.id,id:shared.id}))).status,403);
  }
  assert.equal(route.GET(request('child-account')).status,403);assert.equal(route.GET(request(null)).status,403);
  assert.equal((await route.POST(request('admin','POST',{lesson},'', 'https://wrong.test'))).status,403);
  assert.equal((await route.POST(request('admin','POST',{lesson:{...lesson,grade:5}}))).status,400);
  assert.equal(route.GET(request('a','GET',undefined,'?unitId=unknown')).status,404);
});
test('shared lessons reject broken references and oversized text while keeping authored passage text',async()=>{
  assert.equal(shared.lesson.originalText,lesson.originalText);
  for(const invalid of [
    {...lesson,sentences:[]},
    {...lesson,originalText:'a'.repeat(6001)},
    {...lesson,vocabulary:[{...lesson.vocabulary[0],sentenceId:'missing'}]},
    {...lesson,questions:[{id:'q1',en:'What?',vi:'Gì?',sentenceId:'s1',options:['cat','dog'],answerIndex:7,explanationVi:''}]},
  ])assert.equal((await route.POST(request('admin','POST',{lesson:invalid}))).status,400);
});
test('publication is content-deduplicated and individual study progress remains isolated',async()=>{
  const repeated=await route.POST(request('admin','POST',{lesson:{...lesson,generatedAt:new Date().toISOString()}}));assert.equal((await repeated.json()).id,shared.id);
  const sessionA=newStorySession(structuredClone(shared.lesson),a.id),sessionB=newStorySession(structuredClone(shared.lesson),b.id);sessionA.read=true;sessionA.answers.private={response:'my answer',attempts:1,correct:true,firstCorrect:true,supported:false};
  const {familyProfileRequest}=load('src/lib/backend/family-profiles.ts');
  for(const [id,profile,session] of [['a',a,sessionA],['b',b,sessionB]]){
    const progress={...families.emptyProgress(),storySessions:{[session.id]:session}};
    assert.equal(familyProfileRequest(request(id,'POST',{}),{action:'sync',profileId:profile.id,progress}).status,200);
  }
  const data=families.readFamilies();assert.equal(data.progresses[a.id].storySessions[shared.id].read,true);assert.equal(data.progresses[b.id].storySessions[shared.id].read,false);assert.deepEqual(data.progresses[b.id].storySessions[shared.id].answers,{});
  const common=await route.GET(request('b')).json();assert.doesNotMatch(JSON.stringify(common),/my answer|private-profile/);
});
test('editing or removing shared content does not erase a child saved copy or study evidence',async()=>{
  const updated=await route.POST(request('admin','POST',{lesson:{...lesson,title:'Another shared cat'}}));const next=await updated.json();assert.notEqual(next.id,shared.id);
  assert.equal((await route.DELETE(request('admin','DELETE',{unitId:unit.id,id:shared.id}))).status,200);
  const list=await route.GET(request('a')).json();assert.ok(!list.stories.some(s=>s.id===shared.id));
  assert.equal(families.readFamilies().progresses[a.id].storySessions[shared.id].lesson.title,'Our shared cat');
  assert.equal((await route.DELETE(request('admin','DELETE',{unitId:unit.id,id:'../../content'}))).status,400);
});
test('catalog exposes admin vocabulary collections and never publishes another family private words',async()=>{
  const word=(id,en)=>({id,en,vi:'nghĩa',phonetic:'',emoji:'',example_en:'',example_vi:''});
  const category=(id,en)=>({id,name_vi:id,name_en:id,emoji:'',color:'',gradient:'',gradeId:'lop1',words:[word(id,en)],createdAt:'',sourceType:'manual'});
  const data=families.readFamilies();data.categories.backend_admin=[category('custom_admin','sharedword')];data.categories.a=[category('custom_private','privateword')];families.writeFamilies(data);
  const {GET}=load('src/app/api/catalog/route.ts'),response=await GET().json();
  assert.ok(response.categories.some(c=>c.id==='custom_admin'&&c.words[0].en==='sharedword'));
  assert.ok(!response.categories.some(c=>c.id==='custom_private'));assert.ok(!JSON.stringify(response).includes('privateword'));
  const {sharedVocabulary}=load('src/lib/sharedVocabulary.ts');const base=category('same','cat'),extra={...category('same','cat'),words:[word('duplicate','cat'),word('new','dog')]};
  const merged=sharedVocabulary([base],[extra]);assert.deepEqual(merged[0].words.map(w=>w.en),['cat','dog']);assert.equal(base.words.length,1);
  assert.deepEqual(sharedVocabulary([{...base,archived:true}],[extra]),[]);
});
test('admin AI generation automatically publishes; parent AI generation stays private',async()=>{
  const generated={title:'AI prepared story',sentences:[{id:'s1',en:'I have a cup.',vi:'Em có cái cốc.',patternIndexes:[0]}],vocabulary:[{id:'v1',en:'cup',vi:'cái cốc',ipa:'',sentenceId:'s1'}],questions:[]};
  const custom=createLoader({'@/lib/stories/store':{readStory:()=>null,saveStory:()=>{}},'@/lib/stories/generate':{generateStory:async()=>generated}});
  const api=custom('src/app/api/story/route.ts');
  const before=(await route.GET(request('a')).json()).stories.length;
  const make=(id,profile)=>new NextRequest('http://localhost:3000/api/story',{method:'POST',headers:{host:'localhost:3000',origin:'http://localhost:3000',cookie:cookie(id)},body:JSON.stringify({unitId:unit.id,profileId:profile,gradeId:'lop1',variant:0})});
  assert.equal((await api.POST(make('a',a.id))).status,200);assert.equal((await route.GET(request('a')).json()).stories.length,before);
  assert.equal((await api.POST(make('admin','local-admin-profile'))).status,200);assert.equal((await route.GET(request('a')).json()).stories.length,before+1);
});
