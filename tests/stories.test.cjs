/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const {load}=require('./ts-loader.cjs');
process.env.VOCAKIDS_CONTENT_DIR=fs.mkdtempSync(path.join(process.cwd(),'.tmp-learning/story-content-'));
process.env.VOCAKIDS_FAMILY_DIR=fs.mkdtempSync(path.join(process.cwd(),'.tmp-learning/story-family-'));
process.env.VOCAKIDS_DATA_DIR=fs.mkdtempSync(path.join(process.cwd(),'.tmp-learning/story-profiles-'));
process.env.VOCAKIDS_ADMIN_PASSWORD='story-tests-only';
const {CURRICULUM}=load('src/lib/learning/curriculum.ts');
const {STORY_SOURCES,storySource}=load('src/lib/stories/source.ts');
const {readingBand,readingEvidence,storyLimits,newStorySession,recordStoryAnswer,validStorySession}=load('src/lib/stories/learning.ts');
const {validateStoryOutput}=load('src/lib/stories/validation.ts');
const {listeningTasks,listeningLengthHint,maskedListeningSentence,gradeListeningTask}=load('src/lib/stories/listeningFill.ts');
const {manualStory,deleteStory,mergeStoryLibrary}=load('src/lib/stories/library.ts');
const {wordsFromStory,appendUniqueStoryWords,newStoryVocabulary,mergeExtractedVocabulary}=load('src/lib/stories/vocabulary.ts');
const {validateExtractedVocabulary}=load('src/lib/stories/extractVocabulary.ts');
const {saveApiKeys,readApiKeys}=load('src/lib/backend/apiKeys.ts');
const {writeFamilies,createFamilyProfile,emptyProgress}=load('src/lib/backend/families.ts');
const {signJWT}=load('src/lib/auth.ts');const {newAdminToken}=load('src/lib/backend/auth.ts');const {NextRequest}=require('next/server');
const unit=CURRICULUM.find(u=>u.grade===1&&u.order===2&&u.section==='unit');const source=storySource(unit);
function output(){return {title:'My little things',sentences:[{en:'I have a cat.',vi:'Em có một con mèo.',patternIndexes:[0]},{en:'I have a car.',vi:'Em có một ô tô.',patternIndexes:[0]},{en:'I have a cup.',vi:'Em có một cái cốc.',patternIndexes:[0]}],vocabulary:[{en:'cat',vi:'con mèo',ipa:'/kæt/',sentenceId:'s1'},{en:'car',vi:'ô tô',ipa:'/kɑːr/',sentenceId:'s2'}],questions:[{en:'What animal do I have?',vi:'Em có con vật nào?',options:['cat','dog'],answerIndex:0,sentenceId:'s1',explanationVi:'Câu đầu nói em có con mèo.'},{en:'What toy do I have?',vi:'Em có đồ chơi nào?',options:['ball','car'],answerIndex:1,sentenceId:'s2',explanationVi:'Câu thứ hai nhắc tới ô tô.'}]};}
function lesson(){return {...validateStoryOutput(output(),source,'support'),id:'story-test',unitId:unit.id,grade:1,band:'support',topic:source.topic,patterns:source.patterns,sourceVersion:1,generatedAt:new Date().toISOString()};}
test('pasted passages preserve the authored English and can omit translation, vocabulary and quizzes',()=>{
  const text="Anna is my friend. She's from Japan! We play together.";
  const l=manualStory({title:'My own friends',text,translation:'',vocabulary:''},unit.id,source,'story_manual_test');
  assert.equal(l.originalText,text);assert.equal(l.origin,'manual');assert.equal(l.sentences.length,3);
  assert.equal(l.sentences.map(s=>s.en).join(' '),text);assert.deepEqual(l.questions,[]);assert.deepEqual(l.vocabulary,[]);
  assert.equal(l.grade,source.grade);assert.equal(l.unitId,unit.id);
  assert.ok(listeningTasks(l,2).length>0);assert.ok(validStorySession(newStorySession(l,'child-a'),'child-a'));
});
test('pasted translations and vocabulary match sentence positions without invented meanings',()=>{
  const input={title:'My friends',text:'Anna is my friend. She is happy.',translation:'Anna là bạn em.\nBạn ấy vui vẻ.',vocabulary:'friend | bạn\nhappy | vui vẻ\nFRIEND | bạn'};
  const l=manualStory(input,unit.id,source,'story_manual_test');
  assert.equal(l.vocabulary.length,2);assert.equal(l.vocabulary[1].sentenceId,'s2');assert.equal(l.sentences[1].vi,'Bạn ấy vui vẻ.');
  assert.throws(()=>manualStory({...input,vocabulary:'Ann | bạn'},unit.id,source,'story_manual_test'),/chưa xuất hiện/);
  assert.throws(()=>manualStory({...input,vocabulary:'friend'},unit.id,source,'story_manual_test'),/nghĩa tiếng Việt/);
  assert.throws(()=>manualStory({...input,translation:'Chỉ một dòng'},unit.id,source,'story_manual_test'),/2 dòng/);
  assert.throws(()=>manualStory({...input,text:'a'.repeat(6001)},unit.id,source,'story_manual_test'),/6.000/);
});
test('a manual passage with no vocabulary or questions renders listening activities safely',()=>{
  const React=require('react');const {renderToStaticMarkup}=require('react-dom/server');
  const {StoryActivities}=load('src/components/learning/StoryActivities.tsx');
  const l=manualStory({title:'My friend',text:'Anna is my friend.',translation:'',vocabulary:''},unit.id,source,'story_manual_test');
  const html=renderToStaticMarkup(React.createElement(StoryActivities,{session:newStorySession(l,'child-a'),save:()=>{},play:()=>{},stopAudio:()=>{},audioAvailable:false}));
  assert.ok(html.includes('Nghe câu rồi điền từ còn thiếu'));assert.ok(html.includes('Bài tự viết chưa có câu hỏi hiểu bài'));
  assert.ok(html.includes('is my friend.'));assert.ok(!html.includes('Anna'));assert.ok(!html.includes('undefined'));
});
test('deletion is per profile, keeps other progress, and survives an older device syncing its saved passage',()=>{
  const s={...newStorySession(lesson(),'child-a'),updatedAt:'2026-10-05T10:00:00.000Z',answers:{'quiz:q1':{response:'cat',attempts:1,correct:true,firstCorrect:true,supported:false}}};
  const progress={storySessions:{[s.id]:s},totalStars:15,wordProgress:{cat:{attempts:2}}};
  const deleted=deleteStory(progress,s.id,'child-a','2026-10-05T11:00:00.000Z');
  assert.equal(deleted.totalStars,15);assert.deepEqual(deleted.wordProgress,progress.wordProgress);assert.equal(Object.keys(deleted.storySessions).length,0);
  assert.throws(()=>deleteStory(progress,s.id,'child-b'));
  assert.equal(Object.keys(mergeStoryLibrary(deleted,progress,'child-a').storySessions).length,0);
  assert.equal(Object.keys(mergeStoryLibrary(progress,deleted,'child-a').storySessions).length,0);
  const restored={...s,updatedAt:'2026-10-05T12:00:00.000Z'};
  assert.equal(mergeStoryLibrary(deleted,{storySessions:{[s.id]:restored}},'child-a').storySessions[s.id].answers['quiz:q1'].response,'cat');
  assert.equal(Object.keys(mergeStoryLibrary({},progress,'child-b').storySessions).length,0);
});
test('vocabulary import maps selected terms to real sentence examples and keeps existing word IDs and meanings',()=>{
  const l=lesson();let n=0;const words=wordsFromStory(l,['v1'],()=>`new_${++n}`);
  assert.equal(words.length,1);assert.equal(words[0].en,'cat');assert.equal(words[0].example_en,'I have a cat.');assert.equal(words[0].phonetic,'/kæt/');
  const existing={id:'old-cat',en:' CAT ',vi:'Nghĩa đã sửa',phonetic:'',emoji:'',example_en:'',example_vi:''};
  const cats=[{id:'one',gradeId:'lop1',words:[existing]},{id:'two',gradeId:'lop2',words:[]}];
  const merged=appendUniqueStoryWords(cats,'one',words);
  assert.equal(merged.added,0);assert.deepEqual(merged.categories[0].words,[existing]);assert.deepEqual(merged.categories[1].words,[]);
  const added=appendUniqueStoryWords(cats,'two',words);assert.equal(added.added,1);
  assert.equal(appendUniqueStoryWords(added.categories,'two',words).added,0);
  assert.throws(()=>appendUniqueStoryWords(cats,'missing',words));
  l.vocabulary[0].en='rabbit';assert.throws(()=>wordsFromStory(l,['v1'],()=>''),/khớp đoạn văn/);
});
test('new vocabulary compares every grade up to the current grade, including graded family words',()=>{
  const l=lesson();l.vocabulary=['cat','car','cup','writer'].map((en,index)=>({id:`v${index}`,en,vi:'nghĩa',ipa:'',sentenceId:'s1'}));
  const cats=[{gradeId:'lop1',words:[{en:'CAT'}]},{gradeId:'lop2',words:[{en:' car '}]},{gradeId:'lop4',words:[{en:'cup'}]},{gradeId:'lop5',words:[{en:'writer'}]}];
  assert.deepEqual(newStoryVocabulary(l,cats,4).map(v=>v.en),['writer']);
  assert.deepEqual(newStoryVocabulary(l,cats,1).map(v=>v.en),['car','cup','writer']);
  assert.deepEqual(newStoryVocabulary(l,cats,5),[]);
});
test('new phrases are compared as complete phrases, with Viet Nam/Vietnam spelling and archived grades handled',()=>{
  const l=lesson();l.vocabulary=['Viet Nam','school yard','friend'].map((en,index)=>({id:`v${index}`,en,vi:'nghĩa',ipa:'',sentenceId:'s1'}));
  const cats=[{gradeId:'lop3',words:[{en:'Vietnam'},{en:'school'},{en:'yard'}]},{gradeId:'lop2',archived:true,words:[{en:'friend'}]}];
  assert.deepEqual(newStoryVocabulary(l,cats,4).map(v=>v.en),['school yard','friend']);
  cats.push({gradeId:'lop4',words:[{en:' SCHOOL   YARD '}]});
  assert.deepEqual(newStoryVocabulary(l,cats,4).map(v=>v.en),['friend']);
});
test('full passage vocabulary extraction rejects invented terms and merges without replacing old IDs or answers',()=>{
  const l=lesson();const raw={vocabulary:[{en:'have',vi:'có',ipa:'',sentenceId:'s1'}]};
  const terms=validateExtractedVocabulary(raw,l);assert.equal(terms[0].en,'have');
  const merged=mergeExtractedVocabulary(l,terms);assert.equal(merged.vocabulary.length,3);assert.equal(merged.vocabulary[0].id,l.vocabulary[0].id);assert.deepEqual(merged.questions,l.questions);assert.deepEqual(merged.sentences,l.sentences);
  assert.equal(mergeExtractedVocabulary(merged,terms).vocabulary.length,3);assert.ok(merged.vocabularyScannedAt);
  assert.throws(()=>validateExtractedVocabulary({vocabulary:[{...raw.vocabulary[0],en:'elephant'}]},l));
  assert.throws(()=>validateExtractedVocabulary({vocabulary:[{...raw.vocabulary[0],sentenceId:'missing'}]},l));
  assert.throws(()=>validateExtractedVocabulary({vocabulary:[{...raw.vocabulary[0],vi:''}]},l));
});
test('listening practice covers the whole passage even with a small AI vocabulary list',()=>{
  const l=lesson();const tasks=listeningTasks(l,2);
  assert.equal(l.vocabulary.length,2);
  assert.equal(tasks.flatMap(t=>t.gaps).length,6);
  assert.deepEqual(tasks.map(t=>t.sentenceIndex),[0,1,2]);
  assert.deepEqual(tasks.flatMap(t=>t.gaps.map(g=>g.answer)),['have','cat','have','car','have','cup']);
});
test('one to three blanks and expanded word coverage retain stable progress keys',()=>{
  const l=lesson();const expected=listeningTasks(l,1).flatMap(t=>t.gaps.map(g=>g.key));
  for(const size of [1,2,3]) {
    const tasks=listeningTasks(l,size);
    assert.deepEqual(tasks.flatMap(t=>t.gaps.map(g=>g.key)),expected);
    assert.ok(tasks.every(t=>t.gaps.length>=1&&t.gaps.length<=size));
  }
  const expanded=listeningTasks(l,3,'all').flatMap(t=>t.gaps);
  assert.equal(expanded.length,12);
  assert.equal(new Set(expanded.map(g=>g.key)).size,12);
  assert.ok(expected.every(key=>expanded.some(g=>g.key===key)));
});
test('Viet Nam remains one complete blank in saved stories and requires the full phrase answer',()=>{
  const l=lesson();l.sentences=[{id:'s1',en:'I am from Viet Nam.',vi:'',patternIndexes:[]}];l.vocabulary=[];
  const tasks=listeningTasks(l,1);assert.equal(tasks.length,1);assert.equal(tasks[0].gaps[0].answer,'Viet Nam');
  assert.equal(maskedListeningSentence(tasks[0]),'I am from [1] _____.');
  const s=newStorySession(l,'child-a');
  assert.deepEqual(gradeListeningTask(s,tasks[0],['Viet'],false).correct,[false]);
  assert.deepEqual(gradeListeningTask(s,tasks[0],['viet   nam'],false).correct,[true]);
  assert.ok(tasks[0].gaps[0].key.includes('phrase-v1'));
  assert.equal(listeningTasks(l,1,'all').flatMap(t=>t.gaps).filter(g=>g.answer==='Viet Nam').length,1);
});
test('multiword vocabulary uses longest whole-phrase matches, across case, spacing and repeated occurrences',()=>{
  const l=lesson();l.sentences=[{id:'s1',en:'A big school yard is near the school yard. We visit VIET  NAM, not Vietnamese Street.',vi:'',patternIndexes:[]}];
  l.vocabulary=[{id:'v1',en:'school yard',vi:'sân trường',ipa:'',sentenceId:'s1'},{id:'v2',en:'big school yard',vi:'sân trường lớn',ipa:'',sentenceId:'s1'}];
  const gaps=listeningTasks(l,3).flatMap(t=>t.gaps);
  assert.deepEqual(gaps.filter(g=>/yard/i.test(g.answer)).map(g=>g.answer),['big school yard','school yard']);
  assert.ok(gaps.some(g=>g.answer==='VIET  NAM'));assert.ok(gaps.some(g=>g.answer==='Vietnamese'));
  assert.ok(!gaps.some(g=>['school','yard','VIET','NAM'].includes(g.answer)));
  assert.equal(new Set(gaps.map(g=>g.key)).size,gaps.length);
});
test('character hints distinguish phrase word lengths, spacing and punctuation without showing answers',()=>{
  assert.equal(listeningLengthHint('happy'),'*****');
  assert.equal(listeningLengthHint('Viet Nam'),'**** ***');
  assert.equal(listeningLengthHint(' VIET   NAM '),listeningLengthHint('Viet Nam'));
  assert.equal(listeningLengthHint("It's"),"**'*");
  assert.equal(listeningLengthHint('go to school'),'** ** ******');
  const React=require('react');const {renderToStaticMarkup}=require('react-dom/server');const {StoryListeningFill}=load('src/components/learning/StoryListeningFill.tsx');
  const l=lesson();l.sentences=[{id:'s1',en:'I am from Viet Nam.',vi:'',patternIndexes:[]}];l.vocabulary=[];
  const html=renderToStaticMarkup(React.createElement(StoryListeningFill,{session:newStorySession(l,'child-a'),save:()=>{},play:()=>{},stopAudio:()=>{},audioAvailable:true}));
  assert.ok(html.includes('**** ***'));assert.ok(html.includes('aria-describedby'));assert.ok(!html.includes('Viet Nam'));
});
test('masking uses complete word positions, preserving punctuation, contractions and repeated words',()=>{
  const l=lesson();l.sentences=[{id:'s1',en:'He likes the theatre; he’s happy—very happy!',vi:'',patternIndexes:[]}];
  const tasks=listeningTasks(l,3);
  assert.deepEqual(tasks[0].gaps.map(g=>g.answer),['likes','theatre','he’s']);
  assert.equal(maskedListeningSentence(tasks[0]),'He [1] _____ the [2] _____; [3] _____ happy—very happy!');
  assert.equal(maskedListeningSentence(tasks[1]),'He likes the theatre; he’s [1] _____—[2] _____ [3] _____!');
  assert.equal(new Set(tasks.flatMap(t=>t.gaps.map(g=>g.key))).size,6);
  l.sentences[0].en="It's an ice-cream.";
  assert.deepEqual(listeningTasks(l,3,'all')[0].gaps.map(g=>g.answer),["It's",'an','ice-cream']);
});
test('listening grades each blank separately and preserves first attempts and revealed support',()=>{
  let s=newStorySession(lesson(),'child-a');const task=listeningTasks(s.lesson,2)[0];
  let result=gradeListeningTask(s,task,['HAVE','dog'],false);s=result.session;
  assert.deepEqual(result.correct,[true,false]);
  assert.equal(s.answers[task.gaps[0].key].firstCorrect,true);
  assert.equal(s.answers[task.gaps[1].key].firstCorrect,false);
  result=gradeListeningTask(s,task,['have','cat'],true);s=result.session;
  assert.deepEqual(result.correct,[true,true]);
  assert.equal(s.answers[task.gaps[1].key].firstCorrect,false);
  assert.equal(s.answers[task.gaps[1].key].attempts,2);
  assert.equal(s.answers[task.gaps[0].key].supported,true);
  assert.equal(validStorySession(s,'child-a'),true);
  assert.deepEqual(readingEvidence({storySessions:{[s.id]:s}},'child-a',unit.id),{total:0,independent:0});
  assert.deepEqual(gradeListeningTask(s,task,['have'],false).correct,[true,false]);
});
test('function-only sentences remain available and empty text yields no invented words',()=>{
  const l=lesson();l.sentences=[{id:'s1',en:'It is I.',vi:'',patternIndexes:[]}];
  assert.equal(listeningTasks(l,2).flatMap(t=>t.gaps).length,3);
  l.sentences[0].en='...';assert.deepEqual(listeningTasks(l,2),[]);
});
test('all 92 units map to the supplied grade/unit sentence patterns',()=>{
  assert.equal(STORY_SOURCES.length,92);
  for(const u of CURRICULUM.filter(u=>u.section==='unit')) {const s=storySource(u);assert.ok(s,`${u.grade}:${u.order}`);assert.equal(s.grade,u.grade);assert.equal(s.number,u.order);assert.ok(s.patterns.length);}
  assert.equal(STORY_SOURCES.find(s=>s.grade===4&&s.number===3).topic,'My week');
  assert.equal(storySource({...unit,section:'extension'}),undefined);
});
test('difficulty stays within the grade, with conservative defaults and supported answers excluded',()=>{
  assert.equal(readingBand({total:0,independent:0}),'support');assert.equal(readingBand({total:5,independent:2}),'support');
  assert.equal(readingBand({total:5,independent:4}),'standard');assert.equal(readingBand({total:10,independent:9}),'challenge');
  assert.ok(storyLimits(1,'support').maxWords<storyLimits(5,'support').maxWords);
  let s=newStorySession(lesson(),'child-a');s=recordStoryAnswer(s,'quiz:q1','cat',true,true);s=recordStoryAnswer(s,'quiz:q2','car',true,false);
  const progress={wordProgress:{},totalStars:999,storySessions:{[s.id]:s}};
  assert.deepEqual(readingEvidence(progress,'child-a',unit.id),{total:2,independent:1});
  assert.deepEqual(readingEvidence(progress,'child-b',unit.id),{total:0,independent:0});
  assert.equal(validStorySession(s,'child-b'),false);
});
test('repeat practice preserves the first attempt rather than turning a wrong answer into independent success',()=>{
  let s=newStorySession(lesson(),'child-a');s=recordStoryAnswer(s,'quiz:q1','dog',false,false);s=recordStoryAnswer(s,'quiz:q1','cat',true,false);
  assert.equal(s.answers['quiz:q1'].firstCorrect,false);assert.equal(s.answers['quiz:q1'].attempts,2);
  assert.deepEqual(readingEvidence({storySessions:{[s.id]:s}},'child-a',unit.id),{total:1,independent:0});
});
test('rejects oversized, ungrounded, invalid or contradictory story structures',()=>{
  validateStoryOutput(output(),source,'support');
  const bad=[];
  let v=output();v.sentences[0].patternIndexes=[9];bad.push(v);
  v=output();v.sentences.forEach(s=>s.patternIndexes=[]);bad.push(v);
  v=output();v.sentences[0].en='one '.repeat(30);bad.push(v);
  v=output();v.vocabulary[0].en='elephant';bad.push(v);
  v=output();v.questions[0].answerIndex=8;bad.push(v);
  v=output();v.questions[0].options=['dog','rabbit'];bad.push(v);
  v=output();v.questions[0].options=['cat','CAT'];bad.push(v);
  v=output();v.questions[0].sentenceId='s99';bad.push(v);
  v=output();v.sentences[0].en='I have a cat. I have a car.';bad.push(v);
  v=output();v.sentences[0].en='Because I have a cat.';bad.push(v);
  for(const value of [null,{},...bad]) assert.throws(()=>validateStoryOutput(value,source,'support'));
});
test('narrative questions cannot be disguised by replacing their question mark with a period',()=>{
  const v=output();v.sentences=Array.from({length:14},(_,i)=>structuredClone(output().sentences[i%3]));
  v.sentences[0].en='Why would I like to have a cat.';
  const source5=STORY_SOURCES.find(s=>s.grade===5&&s.number===5);
  assert.throws(()=>validateStoryOutput(v,source5,'challenge'),/complete declarative sentence/);
});
test('invalid educational output gets at most one bounded repair on the same key',async()=>{
  saveApiKeys({...readApiKeys(),keys:[{id:'',name:'Repair primary',project:'repair-project-a',enabled:true,secret:'dummy-repair-primary'},{id:'',name:'Repair fallback',project:'repair-project-b',enabled:true,secret:'dummy-repair-fallback'}]});
  const {GoogleGenerativeAI}=require('@google/generative-ai');const original=GoogleGenerativeAI.prototype.getGenerativeModel;const calls=[];
  GoogleGenerativeAI.prototype.getGenerativeModel=function(){const secret=this.apiKey;return {generateContent:async prompt=>{calls.push({secret,prompt});const result=output();if(calls.length===1) result.vocabulary[0].en='elephant';return {response:{text:()=>JSON.stringify(result)}};}};};
  try {
    const route=load('src/app/api/story/route.ts');const request=new NextRequest('http://localhost:3000/api/story',{method:'POST',headers:{host:'localhost:3000',origin:'http://localhost:3000',cookie:`vocakids_backend_session=${newAdminToken()}`},body:JSON.stringify({unitId:unit.id,profileId:'local-child',gradeId:'lop1',evidence:{total:0,independent:0},variant:1})});
    const result=await route.POST(request);assert.equal(result.status,200);assert.equal(calls.length,2);assert.ok(calls.every(c=>c.secret==='dummy-repair-primary'));assert.ok(calls[1].prompt.includes('Vocabulary 1:'));
  } finally {GoogleGenerativeAI.prototype.getGenerativeModel=original;}
});
test('generation uses server key failover, coalesces duplicates, and reopens cache without another AI call',async()=>{
  saveApiKeys({...readApiKeys(),keys:[{id:'',name:'Primary',project:'story-project-a',enabled:true,secret:'dummy-story-primary'},{id:'',name:'Fallback',project:'story-project-b',enabled:true,secret:'dummy-story-fallback'}]});
  const {GoogleGenerativeAI}=require('@google/generative-ai');const original=GoogleGenerativeAI.prototype.getGenerativeModel;const calls=[],prompts=[];
  GoogleGenerativeAI.prototype.getGenerativeModel=function(){const secret=this.apiKey;return {generateContent:async prompt=>{calls.push(secret);prompts.push(prompt);if(secret==='dummy-story-primary')throw Object.assign(new Error('quota'),{status:429});return {response:{text:()=>JSON.stringify(output())}};}};};
  try {
    const route=load('src/app/api/story/route.ts');
    const req=()=>new NextRequest('http://localhost:3000/api/story',{method:'POST',headers:{host:'localhost:3000',origin:'http://localhost:3000',cookie:`vocakids_backend_session=${newAdminToken()}`,'Content-Type':'application/json'},body:JSON.stringify({unitId:unit.id,profileId:'local-child',gradeId:'lop1',evidence:{total:0,independent:0},variant:0})});
    const result=await Promise.all([route.POST(req()),route.POST(req())]);assert.equal(result[0].status,200);
    const stories=await Promise.all(result.map(r=>r.json()));assert.deepEqual(stories[0],stories[1]);assert.equal(stories[0].unitId,unit.id);assert.equal(stories[0].grade,1);assert.equal(stories[0].topic,'In the dining room');
    assert.deepEqual(calls,['dummy-story-primary','dummy-story-fallback']);assert.ok(prompts[0].includes(source.patterns[0]));assert.ok(!prompts[0].includes('local-child'));
    assert.equal((await route.POST(req())).status,200);assert.equal(calls.length,2);
    assert.ok(!JSON.stringify(stories).includes('dummy-story'));
  } finally {GoogleGenerativeAI.prototype.getGenerativeModel=original;}
});
test('students cannot generate for another profile or a different grade; origin is required',async()=>{
  const profile=createFamilyProfile('parent-a','Test learner','lop1');writeFamilies({accounts:[{id:'parent-a',email:'parent@test.invalid',displayName:'Parent',passwordHash:'unused',role:'parent'},{id:'student-a',email:'student@test.invalid',displayName:'Student',passwordHash:'unused',role:'student',parentId:'parent-a',profileId:profile.id}],profiles:[profile],progresses:{[profile.id]:emptyProgress()},categories:{},revisions:{}});
  const token=signJWT({accountId:'student-a',email:'student@test.invalid',displayName:'Student',role:'student'});
  const route=load('src/app/api/story/route.ts');
  const make=(data,origin='http://localhost:3000')=>new NextRequest('http://localhost:3000/api/story',{method:'POST',headers:{host:'localhost:3000',origin,cookie:`vocakids_auth_token=${token}`},body:JSON.stringify({unitId:unit.id,profileId:profile.id,gradeId:'lop1',variant:0,...data})});
  assert.equal((await route.POST(make({}))).status,403);
  const guest=new NextRequest('http://localhost:3000/api/story',{method:'POST',headers:{host:'localhost:3000',origin:'http://localhost:3000'},body:JSON.stringify({unitId:unit.id,profileId:profile.id,gradeId:'lop1',variant:0})});assert.equal((await route.POST(guest)).status,403);
  assert.equal((await route.POST(make({profileId:'another-child'}))).status,403);
  const wrongGrade=CURRICULUM.find(u=>u.grade===5&&u.section==='unit');assert.equal((await route.POST(make({unitId:wrongGrade.id}))).status,403);
  assert.equal((await route.POST(make({},'https://untrusted.test'))).status,403);
  const parentToken=signJWT({accountId:'parent-a',email:'parent@test.invalid',displayName:'Parent',role:'parent'});
  const parentRequest=data=>new NextRequest('http://localhost:3000/api/story',{method:'POST',headers:{host:'localhost:3000',origin:'http://localhost:3000',cookie:`vocakids_auth_token=${parentToken}`},body:JSON.stringify({unitId:unit.id,profileId:profile.id,gradeId:'lop1',variant:0,...data})});
  assert.equal((await route.POST(parentRequest({}))).status,200);
  assert.equal((await route.POST(parentRequest({unitId:wrongGrade.id}))).status,409);
  const adminRoute=load('src/app/api/admin/story/route.ts');
  assert.equal((await adminRoute.POST(make({}))).status,403);
});
test('full-passage scan coalesces requests, reuses cache, and denies students and other parents before returning cached terms',async()=>{
  const {GoogleGenerativeAI}=require('@google/generative-ai');const original=GoogleGenerativeAI.prototype.getGenerativeModel;
  const l=lesson();l.sentences[0].en='I feel a zephyr.';let calls=0;
  GoogleGenerativeAI.prototype.getGenerativeModel=function(){return {generateContent:async prompt=>{calls++;assert.ok(prompt.includes('I feel a zephyr.'));assert.ok(!prompt.includes('local-scan-child'));return {response:{text:()=>JSON.stringify({vocabulary:[{en:'zephyr',vi:'gió nhẹ',ipa:'',sentenceId:'s1'}]})}};}};};
  try {
    const route=load('src/app/api/story/vocabulary/route.ts');
    const make=(cookie,profileId='local-scan-child',origin='http://localhost:3000')=>new NextRequest('http://localhost:3000/api/story/vocabulary',{method:'POST',headers:{host:'localhost:3000',origin,...(cookie?{cookie}:{})},body:JSON.stringify({lesson:l,profileId})});
    const cookie=`vocakids_backend_session=${newAdminToken()}`;
    const responses=await Promise.all([route.POST(make(cookie)),route.POST(make(cookie))]);assert.equal(responses[0].status,200);assert.equal(calls,1);
    assert.equal((await responses[0].json()).vocabulary[0].en,'zephyr');
    assert.equal((await route.POST(make(cookie))).status,200);assert.equal(calls,1);
    assert.equal((await route.POST(make(''))).status,403);
    const student=signJWT({accountId:'student-a',email:'student@test.invalid',displayName:'Student',role:'student'});
    assert.equal((await route.POST(make(`vocakids_auth_token=${student}`))).status,403);
    const parent=signJWT({accountId:'parent-a',email:'parent@test.invalid',displayName:'Parent',role:'parent'});
    assert.equal((await route.POST(make(`vocakids_auth_token=${parent}`,'other-child'))).status,403);
    assert.equal((await route.POST(make(cookie,'local-scan-child','https://untrusted.test'))).status,403);
    assert.equal(calls,1);
  }finally{GoogleGenerativeAI.prototype.getGenerativeModel=original;}
});
