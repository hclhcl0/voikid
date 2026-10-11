const {test} = require('node:test');
const assert = require('node:assert/strict');
const {load} = require('./ts-loader.cjs');
const {buildWordSearch, searchLetters, matchesSearchPath, searchLine, wordSearchReward} = load('src/lib/wordsearch.ts');
const words = ['apple','banana','pear','mango','orange','watermelon','strawberry','peach','plum','kiwi','pineapple','grape'].map((en,i)=>({id:String(i),en,vi:en}));
test('boards are reproducible and contain all selected targets at every difficulty',()=>{
  for(const level of [0,1,2]) for(let seed=0;seed<20;seed++) {
    const board=buildWordSearch(words,level,String(seed));
    assert.deepEqual(board,buildWordSearch(words,level,String(seed)));
    assert.equal(board.placed.length,[5,7,10][level]);
    for(const p of board.placed) assert.equal(p.cells.map(c=>board.grid[c.row][c.col]).join(''),searchLetters(p.word.en));
    assert.ok(board.grid.every(row=>row.every(c=>/^[A-Z]$/.test(c))));
  }
});
test('long and duplicate words are handled and selections require exact coordinates',()=>{
  const board=buildWordSearch([...words,{id:'long',en:'abcdefghijklmnopqrst',vi:'long'},{id:'dup',en:'APPLE'}],2,'long');
  assert.equal(new Set(board.placed.map(p=>searchLetters(p.word.en))).size,board.placed.length);
  const path=searchLine({row:0,col:0},{row:2,col:2});
  assert.equal(matchesSearchPath([...path].reverse(),path),true);
  assert.equal(matchesSearchPath(searchLine({row:1,col:0},{row:3,col:2}),path),false);
  assert.deepEqual(searchLine({row:0,col:0},{row:1,col:2}),[]);
});
test('rewards require completion and reward difficulty and no hints',()=>{
  assert.deepEqual(wordSearchReward(2,0,10,10),{stars:6,points:60});
  assert.equal(wordSearchReward(0,1,5,5).stars,2);
  assert.equal(wordSearchReward(2,0,9,10).stars,0);
  assert.equal(wordSearchReward(0,0,0,0).stars,0);
});
