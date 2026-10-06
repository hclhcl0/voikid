/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const {load}=require('./ts-loader.cjs');
const {phonicsParts}=load('src/lib/kidsPhonics.ts');
const {normalizeKidsPhonics,ipaRhythmPlan}=load('src/lib/ipaRhythm.ts');
const {KidsPhonicsDisplay}=load('src/components/KidsPhonicsDisplay.tsx');
const entry=syllables=>({syllables,text:syllables.join('-'),mouth_tip:'Nghe rồi nói theo.',audio_slow_text:''});

test('America renders only one strong beat with the corrected approximate spelling',()=>{
  const phonics=normalizeKidsPhonics(' America ','/əˈmerɪkə/',entry(['Ơ','ME','RI','KƠ']));
  assert.deepEqual(phonics.syllables,['ờ','ME','ri','kờ']);
  const {parts,hasRhythm}=phonicsParts(phonics);
  assert.equal(hasRhythm,true);
  assert.deepEqual(parts.map(p=>p.stressed),[false,true,false,false]);
  const html=renderToStaticMarkup(React.createElement(KidsPhonicsDisplay,{phonics}));
  assert.ok(html.includes('Nhịp đọc: nhẹ – MẠNH – nhẹ – nhẹ'));
  assert.ok(html.includes('>ờ</span>'));
  assert.ok(html.includes('>ME</span>'));
  assert.ok(html.includes('>kờ</span>'));
});

test('explicit stress corrects legacy all-capital syllables without guessing ambiguous data',()=>{
  const old=entry(['Ơ','ME','RI','KƠ']);
  assert.equal(phonicsParts(old).hasRhythm,false);
  assert.equal(phonicsParts(old).parts.some(p=>p.stressed),false);
  assert.deepEqual(phonicsParts({...old,stressIndex:1}).parts.map(p=>p.main),['ơ','ME','ri','kơ']);
  assert.equal(phonicsParts({...old,stressIndex:99}).hasRhythm,false);
});

test('existing single-stress words keep their final consonant hints',()=>{
  const parts=phonicsParts(entry(['É','li','phần-(t)'])).parts;
  assert.equal(parts[0].stressed,true);
  assert.equal(parts[2].main,'phần');
  assert.equal(parts[2].ending,'(t)');
});

test('stress is repaired from IPA for any word, overriding incorrect AI stress fields',()=>{
  const cases=[
    ['banana','/bəˈnɑːnə/',['BỜ','NEN','NỜ'],1,3],
    ['Japan','/dʒəˈpæn/',['DỜ','PAN'],1,2],
    ['teacher','/ˈtiːtʃə(r)/',['ti','CHƠ'],0,2],
    ['computer','/kəmˈpjuːtə/',['kờm','piu','TƠ'],1,3],
    ['kangaroo','/ˌkæŋgəˈruː/',['KENG','GƠ','RU'],2,3],
  ];
  for(const [word,ipa,hints,stress,count] of cases){
    const result=normalizeKidsPhonics(word,ipa,{...entry(hints),stressIndex:0});
    assert.equal(result.stressIndex,stress,word);
    assert.equal(result.syllables.length,count,word);
    assert.equal(phonicsParts(result).parts.filter(p=>p.stressed).length,1,word);
    assert.deepEqual(normalizeKidsPhonics(word,ipa,result),result,word+' is idempotent');
  }
});

test('consonant clusters are merged instead of creating extra Vietnamese syllables',()=>{
  for(const [word,ipa,hints,count] of [
    ['blue','/bluː/',['bờ','LU'],1],
    ['green','/griːn/',['gờ','RIN'],1],
    ['Britain','/ˈbrɪtən/',['BỜ','RÍT','TẦN'],2],
    ['Australia','/ɒˈstreɪliə/',['Ó','SỜ','TRÂY','LI','Ơ'],4],
  ]){
    const result=normalizeKidsPhonics(word,ipa,entry(hints));
    assert.equal(result.syllables.length,count,word);
    assert.ok(!result.syllables.some(s=>/^([bgpst]|sh)ờ$/i.test(s)),word);
  }
});

test('new vocabulary gets a rhythm offline from IPA; diphthongs and syllabic consonants count once',()=>{
  assert.equal(normalizeKidsPhonics('snow','/snəʊ/').syllables.length,1);
  assert.equal(normalizeKidsPhonics('button','/ˈbʌtn̩/').syllables.length,2);
  assert.equal(normalizeKidsPhonics('unknown','/ʌnˈnəʊn/').stressIndex,1);
  assert.deepEqual(ipaRhythmPlan('/ˈgʊd ˈmɔːnɪŋ/','Good morning').stressIndices,[0,1]);
  assert.deepEqual(ipaRhythmPlan('/ə ˈtiːtʃə/','a teacher').stressIndices,[1]);
  assert.equal(normalizeKidsPhonics('grape','/greɪp/',entry(['G-RẾP-(p)'])).syllables[0],'GRẾP(p)');
});

test('missing stress, corrupt IPA and phrase data never fabricate a single-word stress',()=>{
  const noStress=normalizeKidsPhonics('banana','/bənɑːnə/',entry(['BỜ','NEN','NỜ']));
  assert.equal(phonicsParts(noStress).hasRhythm,false);
  assert.equal(ipaRhythmPlan('/hello invalid data/','word'),null);
  assert.equal(ipaRhythmPlan('/əˈmerɪkə / other /','America'),null);
  assert.equal(ipaRhythmPlan('/ˈˈ/','word'),null);
  const invalid=normalizeKidsPhonics('bad data','/Vietnamese translation/',entry(['ALL','CAPITALS']));
  assert.equal(phonicsParts(invalid).hasRhythm,false);
  assert.equal(normalizeKidsPhonics('no IPA'),null);
  assert.equal(normalizeKidsPhonics('no IPA',undefined,{syllables:'BROKEN'}),null);
});

test('all other units get the same corrected rhythm in the rendered component',()=>{
  const phonics=normalizeKidsPhonics('Britain','/ˈbrɪtən/',entry(['BỜ','RÍT','TẦN']));
  const html=renderToStaticMarkup(React.createElement(KidsPhonicsDisplay,{phonics}));
  assert.ok(html.includes('Nhịp đọc: MẠNH – nhẹ'));
  assert.ok(html.includes('>BRÍT</span>'));
  assert.ok(html.includes('>tần</span>'));
  assert.ok(!html.includes('>BỜ</span>'));
});
