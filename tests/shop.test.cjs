const {test}=require('node:test');
const assert=require('node:assert/strict');
const {load}=require('./ts-loader.cjs');
const {shopItems,shopThemes,createShopOrders,shopReward,shopRequest}=load('src/lib/shop.ts');
test('shop requests use articles and quantities for natural English',()=>{
  assert.equal(shopRequest('apple'),'Can I have an apple, please?');
  assert.equal(shopRequest('ball'),'Can I have a ball, please?');
  assert.equal(shopRequest('milk'),'Can I have some milk, please?');
});
test('shop sessions have eight valid orders with four distinct choices',()=>{
  for(const pool of [shopItems,...shopThemes.map(t=>t.words)]){
    const orders=createShopOrders(pool,'test');
    assert.deepEqual(orders,createShopOrders(pool,'test'));
    assert.equal(orders.length,8);
    for(const order of orders){assert.equal(order.choices.length,4);assert.equal(order.choices.filter(w=>w.id===order.target.id).length,1);assert.equal(new Set(order.choices.map(w=>w.vi)).size,4);assert.ok(order.choices.every(w=>pool.some(p=>p.id===w.id)));}
  }
  assert.deepEqual(createShopOrders(shopItems.slice(0,3),'test'),[]);
});
test('shop reward requires completion and excludes retries and hints from perfect sales',()=>{
  const sales=shopItems.slice(0,8).map(word=>({word,mistakes:0,hinted:false}));
  assert.deepEqual(shopReward(sales,8),{stars:5,points:50,perfect:8});
  assert.equal(shopReward(sales.slice(0,7),8).stars,0);
  assert.equal(shopReward(sales.map(s=>({...s,mistakes:1})),8).stars,2);
  assert.equal(shopReward(sales.map(s=>({...s,hinted:true})),8).perfect,0);
  assert.equal(shopReward([],0).stars,0);
});
