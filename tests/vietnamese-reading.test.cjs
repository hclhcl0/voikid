/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const {load}=require('./ts-loader.cjs');
const {vietnameseReadingGroups:groups,vietnameseReadingCue:cue}=load('src/lib/vietnameseReading.ts');
const {WordReadingGuide}=load('src/components/learning/WordReadingGuide.tsx');

test('Vietnamese guides keep stress and final sounds across units',()=>{
  assert.deepEqual(groups('America','/əˈmerɪkə/')[0].map(b=>b.main),['ờ','ME','ri','kờ']);
  const tuesday=groups('Tuesday','/ˈtjuːzdeɪ/')[0];
  assert.deepEqual(tuesday.map(b=>b.main),['TIU','đây']);
  assert.equal(tuesday[0].ending,'d');
  assert.equal(groups('Monday','/ˈmʌndeɪ/')[0][0].main,'MÂN');
  assert.equal(groups('blue','/bluː/')[0].length,1);
  assert.equal(groups('Britain','/ˈbrɪtən/')[0].length,2);
});
test('phrases retain word boundaries and consonant clusters',()=>{
  const phrase=groups('Maths teacher','/mæθs ˈtiːtʃə/');
  assert.deepEqual(phrase.map(beats=>beats.length),[1,2]);
  assert.equal(phrase[0][0].ending,'thx');
  assert.deepEqual(phrase[1].map(b=>b.main),['TI','chờ']);
  assert.equal(groups('Hello there','/həˈləʊ/'),null);
  assert.equal(groups('Hello','/not ipa/'),null);
});
test('child guide shows Vietnamese aids instead of English labels and retains endings',()=>{
  const html=renderToStaticMarkup(React.createElement(WordReadingGuide,{word:'Tuesday',phonetic:'/ˈtjuːzdeɪ/'}));
  assert.ok(html.includes('TIU'));
  assert.ok(html.includes('(d)'));
  assert.ok(!html.includes('Tuesday'));
  assert.ok(html.includes('Nhịp đọc: nhấn – nhẹ'));
});

test('Saturday keeps its first final t and the open ae vowel differs from e in all words',()=>{
  const saturday=groups('Saturday','/ˈsæt.ə.deɪ/')[0];
  assert.deepEqual(saturday.map(b=>b.main),['XAT','ờ','đây']);
  assert.deepEqual(groups('Saturday','/ˈsætədeɪ/')[0],saturday);
  assert.deepEqual(saturday.map(b=>b.stressed),[true,false,false]);
  assert.equal(groups('cat','/kæt/')[0][0].main,'KAT');
  assert.equal(groups('bag','/bæɡ/')[0][0].main,'BA');
  assert.equal(groups('hat','/hæt/')[0][0].main,'HAT');
  assert.equal(groups('bed','/bed/')[0][0].main,'BE');
  assert.ok(cue('/kæt/').includes('a bẹt'));
  assert.equal(cue('/bed/'),null);
  const html=renderToStaticMarkup(React.createElement(WordReadingGuide,{word:'Saturday',phonetic:'/ˈsæt.ə.deɪ/'}));
  assert.ok(html.includes('XAT'));
  assert.ok(html.includes('a bẹt'));
  assert.ok(!html.includes('XE'));
});
