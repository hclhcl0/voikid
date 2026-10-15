/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {NextRequest}=require('next/server');const {createLoader}=require('./ts-loader.cjs');
fs.mkdirSync(path.join(process.cwd(),'.tmp-learning'),{recursive:true});
process.env.VOCAKIDS_FAMILY_DIR=fs.mkdtempSync(path.join(process.cwd(),'.tmp-learning/switch-family-'));
process.env.VOCAKIDS_CONTENT_DIR=fs.mkdtempSync(path.join(process.cwd(),'.tmp-learning/switch-content-'));
process.env.VOCAKIDS_ADMIN_PASSWORD='dummy-shared-password-test';process.env.JWT_SECRET='dummy-switch-jwt-secret';
const load=createLoader(),auth=load('src/lib/auth.ts'),backend=load('src/lib/backend/auth.ts');
const family=load('src/app/api/family/route.ts'),session=load('src/app/api/admin/session/route.ts');
const store=load('src/lib/backend/families.ts');
const jar=new Map();
function apply(response){for(const line of response.headers.getSetCookie()){
  const [pair,...attributes]=line.split(';').map(s=>s.trim());const split=pair.indexOf('=');const name=pair.slice(0,split),value=pair.slice(split+1);
  const cookiePath=attributes.find(s=>s.startsWith('Path='))?.slice(5)||'/';
  const key=`${name}:${cookiePath}`;
  if(attributes.includes('Max-Age=0'))jar.delete(key);else jar.set(key,{name,value,path:cookiePath});
}}
function request(url,method='GET',body){const cookies=[...jar.values()].filter(c=>url.startsWith(c.path)).sort((a,b)=>b.path.length-a.path.length).map(c=>`${c.name}=${c.value}`).join('; ');return new NextRequest(`http://localhost:3000${url}`,{method,headers:{host:'localhost:3000',origin:'http://localhost:3000',cookie:cookies},...(body?{body:JSON.stringify(body)}:{})});}

test('admin logout followed by parent login with an identical password remains parent and cannot list other families',async()=>{
  const passwordHash=await auth.hashPassword(process.env.VOCAKIDS_ADMIN_PASSWORD);
  const otherHash=await auth.hashPassword('dummy-other-password');
  const parent={id:'parent-a',email:'parent-a@test.invalid',displayName:'Parent A',passwordHash,role:'parent'};
  const other={id:'parent-b',email:'parent-b@test.invalid',displayName:'Parent B',passwordHash:otherHash,role:'parent'};
  const a=store.createFamilyProfile(parent.id,'Child A','lop1'),b=store.createFamilyProfile(other.id,'Child B','lop1');
  store.writeFamilies({accounts:[parent,other],profiles:[a,b],progresses:{},categories:{},revisions:{}});
  const adminLogin=await session.POST(request('/api/admin/session','POST',{password:process.env.VOCAKIDS_ADMIN_PASSWORD}));assert.equal(adminLogin.status,200);apply(adminLogin);
  const adminFamily=load('src/app/api/admin/family/route.ts');assert.equal((await adminFamily.GET(request('/api/admin/family'))).status,200);
  const logout=session.DELETE(request('/api/admin/session','DELETE'));apply(logout);
  assert.equal((await session.GET(request('/api/admin/session')).json()).authenticated,false);
  const parentLogin=await family.POST(request('/api/family','POST',{action:'login',email:parent.email,password:process.env.VOCAKIDS_ADMIN_PASSWORD}));assert.equal(parentLogin.status,200);
  const loggedIn=await parentLogin.json();assert.equal(loggedIn.account.role,'parent');assert.equal(loggedIn.account.id,parent.id);apply(parentLogin);
  assert.ok([...jar.values()].every(c=>c.name!==backend.ADMIN_COOKIE));
  assert.equal((await session.GET(request('/api/admin/session')).json()).authenticated,false);
  assert.equal((await adminFamily.GET(request('/api/admin/family'))).status,403);
  assert.equal(load('src/app/api/admin/content/route.ts').GET(request('/api/admin/content')).status,401);
  const own=await family.GET(request('/api/family')).json();assert.deepEqual(own.parents,[]);assert.deepEqual(own.profiles.map(p=>p.id),[a.id]);assert.ok(!JSON.stringify(own).includes(other.email));
  const me=await load('src/app/api/auth/me/route.ts').GET(request('/api/auth/me'));const identity=await me.json();assert.equal(identity.account.role,'parent');assert.deepEqual(identity.profiles.map(p=>p.id),[a.id]);
  for(const email of [other.email,'unknown@test.invalid']){
    const response=await family.POST(request('/api/family','POST',{action:'login',email,password:process.env.VOCAKIDS_ADMIN_PASSWORD}));assert.equal(response.status,401);
  }
  const legacy=load('src/app/api/auth/login/route.ts');
  const legacyLogin=await legacy.POST(request('/api/auth/login','POST',{email:parent.email,password:process.env.VOCAKIDS_ADMIN_PASSWORD}));assert.equal(legacyLogin.status,200);assert.equal((await legacyLogin.json()).account.role,'parent');
  const realAdmin=await family.POST(request('/api/family','POST',{action:'login',email:'admin@vocakids.com',password:process.env.VOCAKIDS_ADMIN_PASSWORD}));assert.equal(realAdmin.status,200);assert.equal((await realAdmin.json()).account.role,'admin');
});

test('old misissued admin JWTs and old signed admin cookies are revoked by the new session version',async()=>{
  const jwt=require('jsonwebtoken');
  const oldJWT=jwt.sign({accountId:'backend_admin',role:'admin',email:'parent-a@test.invalid',displayName:'Wrong admin'},process.env.JWT_SECRET,{expiresIn:3600});
  const value=`${Date.now()+3600000}.${crypto.randomBytes(24).toString('hex')}`;
  const signature=crypto.createHmac('sha256',process.env.VOCAKIDS_ADMIN_PASSWORD).update(value).digest('hex');
  const oldCookie=`${value}.${signature}`;
  for(const cookie of [`${auth.AUTH_COOKIE_NAME}=${oldJWT}`,`${backend.ADMIN_COOKIE}=${oldCookie}`,`${auth.AUTH_COOKIE_NAME}=${oldJWT}; ${backend.ADMIN_COOKIE}=${backend.newAdminToken()}`]){
    const req=new NextRequest('http://localhost:3000/api/admin/family',{headers:{cookie}});
    assert.equal(backend.isBackendAdmin(req),false);assert.equal(load('src/app/api/admin/family/route.ts').GET(req).status,403);
  }
  const me=await load('src/app/api/auth/me/route.ts').GET(new NextRequest('http://localhost:3000/api/auth/me',{headers:{cookie:`${auth.AUTH_COOKIE_NAME}=${oldJWT}`}}));
  assert.equal(me.status,401);assert.ok(me.headers.getSetCookie().some(line=>line.startsWith(`${auth.AUTH_COOKIE_NAME}=`)&&line.includes('Max-Age=0')));
});

test('an existing parent using an admin-shaped email keeps the stored parent role',async()=>{
  const data=store.readFamilies();data.accounts.push({id:'reserved-parent',email:'admin@vocakids.local',displayName:'Parent',role:'parent',passwordHash:await auth.hashPassword(process.env.VOCAKIDS_ADMIN_PASSWORD)});store.writeFamilies(data);
  const response=await family.POST(request('/api/family','POST',{action:'login',email:'admin@vocakids.local',password:process.env.VOCAKIDS_ADMIN_PASSWORD}));
  assert.equal(response.status,200);assert.equal((await response.json()).account.role,'parent');
});
