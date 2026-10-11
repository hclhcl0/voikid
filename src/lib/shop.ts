import type { Word } from '@/types';
import { shuffle } from '@/lib/learning/engine';

const items = [
  ['apple','quả táo','🍎'],['banana','quả chuối','🍌'],['orange','quả cam','🍊'],['grape','quả nho','🍇'],
  ['watermelon','quả dưa hấu','🍉'],['milk','sữa','🥛'],['bread','bánh mì','🍞'],['egg','quả trứng','🥚'],
  ['cake','bánh ngọt','🍰'],['water','nước uống','💧'],['rice','gạo','🍚'],['ice cream','kem','🍦'],
  ['book','quyển sách','📚'],['pencil','bút chì','✏️'],['pen','bút mực','🖊️'],['ruler','thước kẻ','📏'],
  ['bag','cặp sách','🎒'],['teddy bear','gấu bông','🧸'],['ball','quả bóng','⚽'],['gift','hộp quà','🎁'],
] as const;
export function shopRequest(en:string) {
  const amount=['milk','bread','cake','water','rice','ice cream'].includes(en)?'some':/^[aeiou]/i.test(en)?'an':'a';
  return `Can I have ${amount} ${en}, please?`;
}
export const shopItems: Word[] = items.map(([en,vi,emoji],i) => ({id:`shop-${i}`,en,vi,emoji,phonetic:'',example_en:shopRequest(en),example_vi:`Cho mình ${vi} nhé.`}));
export const shopThemes = [
  {id:'fruit',name:'Vườn trái cây',emoji:'🍓',words:shopItems.slice(0,5)},
  {id:'bakery',name:'Tiệm bánh & đồ uống',emoji:'🥐',words:shopItems.slice(5,12)},
  {id:'school',name:'Góc đồ dùng & quà',emoji:'🎁',words:shopItems.slice(12)},
] as const;
export interface ShopOrder {target: Word; choices: Word[]; customer: number;}
export function createShopOrders(words: Word[],seed:string): ShopOrder[] {
  const unique = words.filter((w,i)=>w.vi.trim()&&words.findIndex(p=>p.en.toLowerCase()===w.en.toLowerCase()||p.vi===w.vi)===i);
  if(unique.length<4)return [];
  return Array.from({length:8},(_,i)=>{
    const target=shuffle(unique,`${seed}:cycle:${Math.floor(i/unique.length)}`)[i%unique.length];
    const others=shuffle(unique.filter(w=>w.id!==target.id),`${seed}:others:${i}`).slice(0,3);
    return {target,choices:shuffle([target,...others],`${seed}:choices:${i}`),customer:i%3};
  });
}
export interface ShopSale {word:Word; mistakes:number; hinted:boolean;}
export function shopReward(sales:ShopSale[],total:number) {
  const perfect=sales.filter(s=>s.mistakes===0&&!s.hinted).length;
  const complete=total>0&&sales.length===total;
  const stars=complete?2+(perfect===total?3:perfect>=Math.ceil(total*.75)?2:perfect>=Math.ceil(total*.5)?1:0):0;
  return {stars,points:stars*10,perfect};
}
