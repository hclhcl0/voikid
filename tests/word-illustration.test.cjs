/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {load}=require('./ts-loader.cjs');
const {wordNumber,wordIllustrationEmoji,displayWordEmoji}=load('src/lib/wordIllustration.ts');
test('numbers display quantities rather than unrelated emoji',()=>{
  assert.equal(wordNumber('Fifteen'),15);assert.equal(wordNumber('Forty-five'),45);assert.equal(wordNumber('Thirty'),30);assert.equal(wordNumber('six o’clock'),null);assert.equal(wordNumber('I am fifteen'),null);
});
test('clocks use exact hours and half hours',()=>{
  assert.equal(wordIllustrationEmoji('six o’clock'),'🕕');assert.equal(wordIllustrationEmoji('half past seven'),'🕢');assert.equal(wordIllustrationEmoji('twelve o\'clock'),'🕛');
});
test('replace generic topic icons, preserve a deliberately assigned illustration',()=>{
  assert.equal(displayWordEmoji('Go to school','🌊'),'🏫');assert.equal(displayWordEmoji('Get up','🌊'),'🌅');assert.equal(displayWordEmoji('eat lunch','📖'),'🍱');assert.equal(displayWordEmoji('Get up','🛏️'),'🛏️');
});
test('automatic endpoint rejects cross-origin requests and applies known rules without AI',async()=>{
  const {NextRequest}=require('next/server');
  const {POST}=load('src/app/api/word/illustration/route.ts');
  const req=origin=>new NextRequest('http://localhost:3000/api/word/illustration',{method:'POST',headers:{host:'localhost:3000',origin,'content-type':'application/json'},body:JSON.stringify({en:'Go to school',vi:'Đi học'})});
  assert.equal((await POST(req('https://example.com'))).status,403);
  assert.equal((await (await POST(req('http://localhost:3000'))).json()).emoji,'🏫');
});
