/* eslint-disable @typescript-eslint/no-require-imports */
const {test} = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
const {load,createLoader} = require('./ts-loader.cjs');
const {STICKER_MILESTONES,stickerDisplayName} = load('src/lib/stickers.ts');
const {emojiToTwemojiCode} = load('src/lib/twemoji.ts');
const assets = require('../src/lib/sticker-assets.json');
const {StickerPreview} = load('src/components/StickerPreview.tsx');
const empty = () => ({totalStars:0,streak:0,lastActiveDate:'',wordProgress:{},dailyStats:[],stickers:[],badges:[],unitTestResults:{},unlockedUnits:[],totalPoints:0});
let context;
const Page = createLoader({
  '@/context/ProfileContext':{useProfileContext:()=>context},
  '@/hooks/useVocabularyCatalog':{useVocabularyCatalog:()=>({categories:[]})},
  '@/hooks/useCustomCategories':{useCustomCategories:()=>({categories:[]})},
  '@/components/ChildBadge':{ChildBadge:()=>null},
  './stickers.module.css':{},
})('src/app/stickers/page.tsx').default;
const renderAlbum = progress => {
  context={progress,hydrated:true,activeProfile:{id:'child-a',name:'Bé An',gradeId:'lop4'},activeProfileId:'child-a',reconcileStickerRewards:()=>{}};
  return renderToStaticMarkup(React.createElement(Page));
};

test('every locked preview uses a mystery gift, including the image URL and display name', () => {
  for (const sticker of STICKER_MILESTONES) {
    const html = renderToStaticMarkup(React.createElement(StickerPreview,{emoji:sticker.emoji,revealed:false}));
    assert.ok(html.includes('wrapped_gift_3d.png'));
    assert.ok(!html.includes(assets[emojiToTwemojiCode(sticker.emoji)]),sticker.name);
    assert.equal(stickerDisplayName(sticker,false),'Quà bí mật');
  }
});

test('an empty album hides actual names and images in the hero, upcoming rewards and cards', () => {
  const html=renderAlbum(empty());
  assert.ok(html.includes('60 mốc trong 10 bộ sưu tập'));
  for (const sticker of STICKER_MILESTONES) {
    assert.ok(!html.includes(sticker.name),sticker.name);
    assert.ok(!html.includes(assets[emojiToTwemojiCode(sticker.emoji)]),sticker.name);
  }
  assert.ok(html.includes('Quà bí mật'));
  assert.ok(html.includes(STICKER_MILESTONES[0].condition));
});

test('only an earned sticker is revealed; previous awards remain visible', () => {
  const s=STICKER_MILESTONES.find(s=>s.id==='ocean_ipa_2');
  const awarded={...s,earnedAt:'2026-10-06T12:00:00Z'};
  const legacy={id:'old_sticker',name:'Kỷ niệm cũ',emoji:'⭐',earnedAt:'2026-10-01T12:00:00Z',condition:'Hoàn thành bài cũ',setId:'unit_test',tier:'star'};
  const html=renderAlbum({...empty(),stickers:[awarded,legacy]});
  assert.ok(html.includes(s.name));
  assert.ok(html.includes(assets[emojiToTwemojiCode(s.emoji)]));
  assert.ok(html.includes(legacy.name));
  assert.ok(html.includes('wrapped_gift_3d.png'));
  for (const locked of STICKER_MILESTONES.filter(m=>m.id!==s.id)) assert.ok(!html.includes(locked.name),locked.name);
});
