const {test}=require('node:test');
const assert=require('node:assert/strict');
const {load}=require('./ts-loader.cjs');
const {shopItems,shopThemes,createShopOrders,prioritizeShopReviews,shopReward,shopRequest,isShopVoiceText}=load('src/lib/shop.ts');
test('shop requests use articles and quantities for natural English',()=>{
  assert.equal(shopRequest('apple'),'Can I have an apple, please?');
  assert.equal(shopRequest('ball'),'Can I have a ball, please?');
  assert.equal(shopRequest('milk'),'Can I have some milk, please?');
  assert.equal(shopRequest('scissors'),'Can I have a pair of scissors, please?');
  assert.equal(shopRequest('rice cooker'),'Can I have a rice cooker, please?');
  assert.equal(shopRequest('eggplant'),'Can I have an eggplant, please?');
  assert.equal(shopRequest('fish sauce'),'Can I have some fish sauce, please?');
  assert.equal(shopRequest('USB drive'),'Can I have a USB drive, please?');
  assert.equal(shopRequest('apple',1),"I'd like an apple, please.");
  assert.equal(shopRequest('milk',2),'Do you have some milk?');
});
test('shop vocabulary is varied and later sessions cover the whole chosen shelf',()=>{
  assert.equal(shopItems.length,500);
  assert.equal(shopThemes.length,17);
  assert.equal(new Set(shopItems.map(word=>word.en)).size,shopItems.length);
  assert.equal(new Set(shopItems.map(word=>word.vi)).size,shopItems.length);
  assert.equal(new Set(shopItems.map(word=>word.id)).size,shopItems.length);
  assert.ok(shopItems.every(word=>word.en&&word.vi&&word.example_en===shopRequest(word.en)));
  assert.deepEqual(shopItems.slice(0,56).map((word,i)=>word.id===`shop-${i}`).every(Boolean),true);
  for(const pool of [shopItems,...shopThemes.map(theme=>theme.words)]){
    const seen=new Set();
    for(let session=0;session<Math.ceil(pool.length/6);session++)for(const order of createShopOrders(pool,'learner',session).filter(order=>!order.review))seen.add(order.target.id);
    assert.equal(seen.size,pool.length);
  }
});
test('AI audio access is limited to curated product names',()=>{
  for(const item of shopItems)assert.ok(isShopVoiceText(item.en));
  assert.equal(isShopVoiceText(shopRequest('apple')),false);
  assert.equal(isShopVoiceText('Read any arbitrary text.'),false);
  assert.equal(isShopVoiceText('Thank you! unknown item.'),false);
});
test('shop sessions have eight valid orders with four distinct choices',()=>{
  for(const pool of [shopItems,...shopThemes.map(t=>t.words)]){
    const orders=createShopOrders(pool,'test');
    assert.deepEqual(orders,createShopOrders(pool,'test'));
    assert.equal(orders.length,8);
    assert.equal(new Set(orders.slice(0,6).map(order=>order.style)).size,3);
    for(const order of orders){assert.equal(order.request,shopRequest(order.target.en,order.style));assert.equal(order.choices.length,4);assert.equal(order.choices.filter(w=>w.id===order.target.id).length,1);assert.equal(new Set(order.choices.map(w=>w.vi)).size,4);assert.ok(order.choices.every(w=>pool.some(p=>p.id===w.id)));}
    const firstPass=orders.filter(order=>!order.review);
    assert.equal(firstPass.length,Math.min(6,pool.length));
    assert.equal(new Set(firstPass.map(order=>order.target.id)).size,firstPass.length);
    assert.ok(orders.filter(order=>order.review).every(order=>firstPass.some(first=>first.target.id===order.target.id)));
    assert.ok(orders.filter(order=>order.review).every(order=>order.style!==firstPass.find(first=>first.target.id===order.target.id).style));
  }
  assert.deepEqual(createShopOrders(shopItems.slice(0,3),'test'),[]);
});
test('missed and hinted words are prioritized in later review orders',()=>{
  const orders=createShopOrders(shopItems,'study');
  const sales=orders.slice(0,6).map((order,i)=>({word:order.target,mistakes:i===3?1:0,hinted:i===1}));
  const planned=prioritizeShopReviews(orders,sales,shopItems,'study');
  assert.deepEqual(planned.slice(0,6),orders.slice(0,6));
  assert.deepEqual(planned.slice(6).map(order=>order.target.id),[orders[1].target.id,orders[3].target.id]);
  assert.ok(planned.slice(6).every(order=>order.choices.filter(choice=>choice.id===order.target.id).length===1));
});
test('shop reward requires completion and excludes retries and hints from perfect sales',()=>{
  const sales=shopItems.slice(0,8).map(word=>({word,mistakes:0,hinted:false}));
  assert.deepEqual(shopReward(sales,8),{stars:5,points:50,perfect:8});
  assert.equal(shopReward(sales.slice(0,7),8).stars,0);
  assert.equal(shopReward(sales.map(s=>({...s,mistakes:1})),8).stars,2);
  assert.equal(shopReward(sales.map(s=>({...s,hinted:true})),8).perfect,0);
  assert.equal(shopReward([],0).stars,0);
});
