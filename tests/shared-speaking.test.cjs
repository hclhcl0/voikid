/* eslint-disable @typescript-eslint/no-require-imports -- Uses the project's TS loader. */
const test=require('node:test');const assert=require('node:assert/strict');
const React=require('react');const {renderToStaticMarkup}=require('react-dom/server');
const {createLoader}=require('./ts-loader.cjs');
const words=[{id:'friend',en:'friend',vi:'bạn',emoji:'',phonetic:'/frend/',example_en:'My friend.',example_vi:'Bạn em.'},{id:'hello',en:'hello',vi:'xin chào',emoji:'',phonetic:'',example_en:'Hello!',example_vi:'Xin chào!'}];
const category={id:'test-unit',gradeId:'lop1',name_vi:'Bạn bè',name_en:'Friends',emoji:'',words,color:'',gradient:''};
let serverConfigLoaded=false;
const useTTS=()=>({speak:()=>{},cancel:()=>{},isSpeaking:false,audioSource:null});
const load=createLoader({
  'next/navigation':{useParams:()=>({catId:category.id}),useSearchParams:()=>new Map([['tab','speak']]),useRouter:()=>({back:()=>{}})},
  '@/hooks/useVocabularyCatalog':{useVocabularyCatalog:()=>({categories:[category],settings:{dailyNewWordsCount:2,dailyNewWordsSource:'curriculum'}})},
  '@/hooks/useCustomCategories':{NEW_WORDS_CAT_ID:'custom_new_words',useCustomCategories:()=>({categories:[],hydrated:true,updateWord:()=>{}})},
  '@/hooks/useEnrichedWord':{useEnrichedWord:(cat,word)=>({word})},
  '@/hooks/useProgress':{useProgress:()=>({hydrated:true,activeProfile:{id:'test-child',gradeId:'lop1'},progress:{wordProgress:{},totalStars:0},getWordProgress:()=>null,recordAttempt:()=>{},markDailyWordLearned:()=>{}})},
  '@/hooks/useAudioRecorder':{useAudioRecorder:()=>({status:'idle',audioBase64:null,audioBlob:null,inputLevel:0,hasServerKey:false,serverConfigLoaded,resetRecorder:()=>{},startRecording:()=>{},stopRecording:()=>{}})},
  '@/hooks/useSettings':{useSettings:()=>({apiKey:'',hasKey:false,hydrated:true})},
  '@/hooks/useTTS':{useTTS},
  '@/components/learning/WordStudyCard':{WordStudyCard:({word})=>React.createElement('article',null,word.en)},
  '@/components/learning/WordLearningNavigation':{WordLearningNavigation:()=>React.createElement('nav',null,'Học từ · Luyện nói')},
});

test('daily and unit speaking render the same recorder and slider rather than the old self-completion exercise',()=>{
  const Unit=load('src/app/speak/[catId]/page.tsx').default;
  const Daily=load('src/app/daily/page.tsx').default;
  const unitHtml=renderToStaticMarkup(React.createElement(Unit));
  const dailyHtml=renderToStaticMarkup(React.createElement(Daily));
  for(const html of [unitHtml,dailyHtml]){
    assert.match(html,/aria-label="Luyện nói từ vựng"/);
    assert.match(html,/Nhấn để nói/);
    assert.match(html,/Từ trước/);
    assert.match(html,/Từ tiếp theo/);
    assert.ok(!html.includes('Phụ huynh không cần nhập key riêng'));
    assert.ok(!html.includes('Nhờ AI chấm điểm!'));
  }
});

test('shared practice only warns about credentials after server configuration has loaded',()=>{
  const {WordSpeakingPractice}=load('src/components/learning/WordSpeakingPractice.tsx');
  serverConfigLoaded=true;
  const html=renderToStaticMarkup(React.createElement(WordSpeakingPractice,{word:words[0],categoryId:category.id}));
  assert.match(html,/Phụ huynh không cần nhập key riêng/);
  serverConfigLoaded=false;
});

test('retry/service feedback never offers pass-only next controls; a confirmed pass does',()=>{
  const {SpeakingFeedback}=load('src/components/learning/WordSpeakingPractice.tsx');
  const render=(status,passed,onNext=()=>{})=>renderToStaticMarkup(React.createElement(SpeakingFeedback,{word:words[0],recordedBlob:null,result:{status,passed,score:null,feedbackVi:'Phản hồi thử nghiệm'},onRetry:()=>{},onNext}));
  for(const status of ['retry','service_error','practice']){
    const html=render(status,false);assert.match(html,/Thử lại/);assert.ok(!html.includes('Tiếp<'));
  }
  assert.match(render('pass',true),/Tiếp/);
  assert.ok(!render('pass',true,null).includes('Tiếp<'));
  assert.ok(!render('retry',true).includes('Tiếp<'));
});

test('feedback distinguishes uncertain AI from recording problems and exposes reassessment only when appropriate',()=>{
  const {SpeakingFeedback}=load('src/components/learning/WordSpeakingPractice.tsx');
  const render=(status,reason,busy=false)=>renderToStaticMarkup(React.createElement(SpeakingFeedback,{word:words[0],recordedBlob:new Blob(['test']),result:{status,reason,passed:null,score:null,feedbackVi:'Phản hồi'},onRetry:()=>{},onReassess:()=>{},busy}));
  const uncertain=render('retry','conflicting_evidence');
  assert.match(uncertain,/AI chưa kết luận/);assert.match(uncertain,/Chấm lại bản ghi này/);
  assert.ok(!uncertain.includes('Chưa rõ tiếng!'));assert.match(uncertain,/không làm mất sao/);
  assert.match(render('service_error','provider_unavailable'),/Chấm lại bản ghi này/);
  for(const [status,reason] of [['retry','no_clear_speech'],['retry','interference'],['pass','acceptable'],['practice','pronunciation_needs_practice']]){
    assert.ok(!render(status,reason).includes('Chấm lại bản ghi này'));
  }
  const checking=render('retry','uncertain_assessment',true);
  assert.match(checking,/Đang chấm lại/);assert.match(checking,/aria-busy="true"/);
});
