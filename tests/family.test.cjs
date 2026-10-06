/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const {load}=require('./ts-loader.cjs');const {NextRequest}=require('next/server');
process.env.VOCAKIDS_FAMILY_DIR=fs.mkdtempSync(path.join(process.cwd(),'.tmp-learning/family-test-'));
process.env.JWT_SECRET='isolated-family-test-secret';
const api=load('src/app/api/family/route.ts');const {familyProfileRequest}=load('src/lib/backend/family-profiles.ts');const {readFamilies}=load('src/lib/backend/families.ts');const {signJWT}=load('src/lib/auth.ts');
function req(body,token){return new NextRequest('http://localhost:3000/api/family',{method:body?'POST':'GET',headers:{host:'localhost:3000',origin:'http://localhost:3000',...(token?{cookie:`vocakids_auth_token=${token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});}
function token(account){return signJWT({accountId:account.id,email:account.email,displayName:account.displayName,role:account.role});}

test('sticker sync retains older awards, deduplicates and honors an explicit reset',async()=>{
 const email='sticker-parent@test.local';
 await api.POST(req({action:'register',email,password:'password-test',childName:'Sticker Kid',childGradeId:'lop2'}));
 const account=readFamilies().accounts.find(a=>a.email===email);const parentToken=token(account);
 const profile=readFamilies().profiles.find(p=>p.ownerId===account.id);
 assert.ok(profile);
 const initial=readFamilies().progresses[profile.id];
 const award={id:'pets_ipa_1',name:'Thỏ lắng nghe',emoji:'🐰',tier:'basic',setId:'pets',condition:'Hoàn thành bài luyện âm',earnedAt:'2026-10-01T12:00:00Z'};
 const sync=progress=>familyProfileRequest(req({action:'sync',profileId:profile.id,progress},parentToken),{action:'sync',profileId:profile.id,progress});
 assert.equal(sync({...initial,stickers:[award],stickerStudyDays:['2026-10-01']}).status,200);
 assert.equal(sync({...initial,stickers:[],stickerStudyDays:['2026-10-03']}).status,200);
 assert.equal(readFamilies().progresses[profile.id].stickers.length,1);
 assert.deepEqual(readFamilies().progresses[profile.id].stickerStudyDays,['2026-10-01','2026-10-03']);
 sync({...initial,stickers:[{...award,earnedAt:'2026-10-03T12:00:00Z'}]});
 assert.equal(readFamilies().progresses[profile.id].stickers[0].earnedAt,award.earnedAt);
 const reset={...initial,progressResetAt:'2026-10-06T12:00:00Z'};
 sync(reset);assert.equal(readFamilies().progresses[profile.id].stickers.length,0);
 sync({...initial,stickers:[award],totalStars:999});
 assert.equal(readFamilies().progresses[profile.id].stickers.length,0);
 assert.equal(readFamilies().progresses[profile.id].totalStars,0);
 sync({...reset,stickers:[{...award,earnedAt:'2026-10-07T12:00:00Z'}],totalStars:1});
 assert.equal(readFamilies().progresses[profile.id].stickers.length,1);
 assert.equal(readFamilies().progresses[profile.id].totalStars,1);
});
test('three roles: parent registration, owned student creation, isolated progress and vocabulary',async()=>{
 for(const email of ['parent-a@test.local','parent-b@test.local']){const response=await api.POST(req({action:'register',email,password:'password-test',childName:'Bé',childGradeId:'lop1',role:'admin'}));assert.equal(response.status,200);}
 const [a,b]=readFamilies().accounts;assert.equal(a.role,'parent');const ta=token(a),tb=token(b);
 let response=await api.POST(req({action:'create_student',name:'Bé A',gradeId:'lop2',email:'student-a@test.local',password:'password-test'},ta));assert.equal(response.status,200);
 const student=readFamilies().accounts.find(a=>a.role==='student');const ts=token(student);const own=student.profileId;
 response=await api.GET(req(undefined,ts));const snapshot=await response.json();assert.equal(snapshot.profiles.length,1);assert.equal(snapshot.profiles[0].id,own);
 response=await api.POST(req({action:'create_student',name:'bad',gradeId:'lop1',email:'bad@test.local',password:'password-test'},ts));assert.equal(response.status,403);
 response=await api.POST(req({action:'update_student',profileId:own,name:'Stolen',gradeId:'lop5'},tb));assert.equal(response.status,403);
 response=familyProfileRequest(req({action:'sync',profileId:own,progress:{totalStars:7}},ts),{action:'sync',profileId:own,progress:{totalStars:7}});assert.equal(response.status,200);
 response=familyProfileRequest(req({action:'sync',profileId:own,progress:{totalStars:999}},tb),{action:'sync',profileId:own,progress:{totalStars:999}});assert.equal(response.status,403);
 response=familyProfileRequest(req({action:'update',profileId:own,data:{gradeId:'lop5'}},ts),{action:'update',profileId:own,data:{gradeId:'lop5'}});assert.equal(response.status,403);
 const cat={id:'custom_family',name_vi:'Từ riêng',name_en:'Private',emoji:'📚',color:'',gradient:'',gradeId:'lop2',words:[{id:'word1',en:'cat',vi:'mèo',phonetic:'',emoji:'',example_en:'',example_vi:''}],createdAt:'',sourceType:'manual'};
 response=await api.POST(req({action:'save_categories',categories:[cat],revision:0},ta));assert.equal(response.status,200);
 response=await api.GET(req(undefined,ts));assert.equal((await response.json()).categories.length,1);
 response=await api.GET(req(undefined,tb));assert.equal((await response.json()).categories.length,0);
 response=await api.POST(req({action:'save_categories',categories:[],revision:1},ts));assert.equal(response.status,403);
 response=await api.POST(req({action:'login',email:student.email,password:'password-test'}));assert.equal(response.status,200);assert.equal((await response.json()).account.role,'student');
});

test('backend admin inherits parent operations through its own signed session',async()=>{
 process.env.VOCAKIDS_ADMIN_PASSWORD='test-backend-admin-secret';
 const {newAdminToken}=load('src/lib/backend/auth.ts');
 const adminReq=body=>new NextRequest('http://localhost:3000/api/admin/family',{method:body?'POST':'GET',headers:{host:'localhost:3000',origin:'http://localhost:3000',cookie:`vocakids_backend_session=${newAdminToken()}`},...(body?{body:JSON.stringify(body)}:{})});
 let response=await api.GET(adminReq());assert.equal(response.status,200);const before=await response.json();assert.equal(before.account.role,'admin');assert.ok(before.profiles.length>=3);
 const profile=before.profiles[0];
 response=await api.POST(adminReq({action:'update_student',profileId:profile.id,name:'Admin updated',gradeId:'lop3'}));assert.equal(response.status,200);
 response=await api.POST(adminReq({action:'create_student',name:'Admin child',gradeId:'lop1',email:'admin-child@test.local',password:'password-test'}));assert.equal(response.status,200);const after=await response.json();assert.ok(after.studentAccounts.some(a=>a.email==='admin-child@test.local'));
 const student=readFamilies().accounts.find(a=>a.email==='admin-child@test.local');const st=token(student);
 response=await api.GET(req(undefined,st));const child=await response.json();assert.equal(child.profiles.length,1);assert.equal(child.profiles[0].name,'Admin child');
 const fake=new NextRequest('http://localhost:3000/api/admin/family',{headers:{cookie:'vocakids_backend_session=fake'}});response=await api.GET(fake);assert.equal(response.status,401);
});

test('IPA practice sync is isolated per student and survives a stale progress upload',async()=>{
 const {practiceRecord}=load('src/lib/ipa/practice.ts');
 const student=readFamilies().accounts.find(a=>a.role==='student');
 const profileId=student.profileId;
 const current=practiceRecord(profileId,'m',[true,true],new Date('2026-10-06'));
 const old=practiceRecord(profileId,'m',[false,false],new Date('2026-10-05'));
 const sync=ipaPractice=>{const body={action:'sync',profileId,progress:{...readFamilies().progresses[profileId],ipaPractice}};return familyProfileRequest(req(body,token(student)),body);};
 assert.equal(sync({m:current}).status,200);
 assert.equal(sync({m:old,s:practiceRecord('someone-else','s',[true,true])}).status,200);
 assert.deepEqual(readFamilies().progresses[profileId].ipaPractice,{m:current});
 const response=await api.GET(req(undefined,token(student)));
 assert.deepEqual((await response.json()).progresses[profileId].ipaPractice,{m:current});
});

test('saved passages sync through the admin endpoint and deleted passages do not return from stale student progress',async()=>{
 const {newAdminToken}=load('src/lib/backend/auth.ts');const {newStorySession}=load('src/lib/stories/learning.ts');
 const {deleteStory}=load('src/lib/stories/library.ts');const adminApi=load('src/app/api/admin/profiles/route.ts');
 const student=readFamilies().accounts.find(a=>a.role==='student');const profile=readFamilies().profiles.find(p=>p.id===student.profileId);
 const l={id:'story_family_test',unitId:'unit_test',grade:1,band:'support',title:'My friend',origin:'manual',generatedAt:'2026-10-05T10:00:00.000Z',sourceVersion:1,topic:'Friends',patterns:[],sentences:[{id:'s1',en:'Anna is my friend.',vi:'',patternIndexes:[]}],vocabulary:[],questions:[]};
 const s={...newStorySession(l,profile.id),updatedAt:'2026-10-05T10:00:00.000Z'};
 const progress={...readFamilies().progresses[profile.id],storySessions:{[s.id]:s}};
 const request=body=>new NextRequest('http://localhost:3000/api/admin/profiles',{method:'POST',headers:{host:'localhost:3000',origin:'http://localhost:3000',cookie:`vocakids_backend_session=${newAdminToken()}`},body:JSON.stringify(body)});
 let response=await adminApi.POST(request({action:'sync',profileId:profile.id,progress}));assert.equal(response.status,200);
 assert.equal(readFamilies().progresses[profile.id].storySessions[s.id].lesson.title,'My friend');
 const deleted=deleteStory(progress,s.id,profile.id,'2026-10-05T11:00:00.000Z');
 response=await adminApi.POST(request({action:'sync',profileId:profile.id,progress:deleted}));assert.equal(response.status,200);
 const body={action:'sync',profileId:profile.id,progress};response=familyProfileRequest(req(body,token(student)),body);assert.equal(response.status,200);
 assert.equal(readFamilies().progresses[profile.id].storySessions[s.id],undefined);
 response=await adminApi.POST(req(body,token(student)));assert.equal(response.status,403);
});
