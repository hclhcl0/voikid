import type { Word } from '@/types';
import { shuffle } from '@/lib/learning/engine';
import { extraShopGroups } from '@/lib/shopExtra';

type ShopGroup = {id:string;name:string;emoji:string;items:readonly (readonly [string,string,string,string?])[]};
const groups:ShopGroup[] = [
  {id:'fruit',name:'Vườn trái cây',emoji:'🍓',items:[
    ['apple','quả táo','🍎'],['banana','quả chuối','🍌'],['orange','quả cam','🍊'],['grape','quả nho','🍇'],['watermelon','quả dưa hấu','🍉'],['strawberry','quả dâu tây','🍓'],['pear','quả lê','🍐'],['pineapple','quả dứa','🍍'],['mango','quả xoài','🥭'],['peach','quả đào','🍑'],['lemon','quả chanh','🍋'],['cherry','quả anh đào','🍒'],
  ]},
  {id:'bakery',name:'Đồ ăn & thức uống',emoji:'🥐',items:[
    ['milk','sữa','🥛'],['bread','bánh mì','🍞'],['egg','quả trứng','🥚'],['cake','bánh ngọt','🍰'],['water','nước uống','💧'],['rice','cơm','🍚'],['ice cream','kem','🍦'],['cookie','bánh quy','🍪'],['sandwich','bánh kẹp','🥪'],['juice','nước ép','🧃'],['cheese','phô mai','🧀'],['chocolate','sô cô la','🍫'],['donut','bánh vòng','🍩'],['pizza','bánh pizza','🍕'],
  ]},
  {id:'school',name:'Đồ dùng học tập',emoji:'📚',items:[
    ['book','quyển sách','📚'],['pencil','bút chì','✏️'],['pen','bút mực','🖊️'],['ruler','thước kẻ','📏'],['bag','cặp sách','🎒'],['notebook','vở ghi','📓'],['crayon','bút sáp màu','🖍️'],['scissors','cái kéo','✂️'],['calculator','máy tính cầm tay','🧮'],['paper','giấy','📄'],
  ]},
  {id:'toys',name:'Đồ chơi & quà',emoji:'🧸',items:[
    ['teddy bear','gấu bông','🧸'],['ball','quả bóng','⚽'],['gift','hộp quà','🎁'],['doll','búp bê','🪆'],['kite','con diều','🪁'],['puzzle','trò ghép hình','🧩'],['robot','người máy đồ chơi','🤖'],['toy car','xe đồ chơi','🚗'],['drum','cái trống','🥁'],['train','tàu đồ chơi','🚂'],
  ]},
  {id:'clothes',name:'Quần áo & phụ kiện',emoji:'👗',items:[
    ['shirt','áo thun','👕'],['dress','váy liền','👗'],['hat','mũ lưỡi trai','🧢'],['shoe','chiếc giày','👟'],['coat','áo khoác','🧥'],['sock','chiếc tất','🧦'],['scarf','khăn quàng','🧣'],['glove','chiếc găng tay','🧤'],['boot','chiếc ủng','🥾'],['umbrella','ô che mưa','☂️'],
  ]},
];
const allGroups: ShopGroup[] = [...groups,...extraShopGroups];
const grammarByEnglish=new Map(extraShopGroups.flatMap(group=>group.items.map(([en,,,grammar])=>[en,grammar] as const)));
export type ShopRequestStyle = 0 | 1 | 2;
export function shopRequest(en:string,style:ShopRequestStyle=0) {
  const grammar=grammarByEnglish.get(en);
  const amount=en==='scissors'||grammar==='pair'?'a pair of':grammar==='some'?'some':grammar==='an'?'an':grammar==='a'?'a':['milk','bread','cake','water','rice','ice cream','juice','cheese','chocolate','paper'].includes(en)?'some':/^[aeiou]/i.test(en)?'an':'a';
  const item=`${amount} ${en}`;
  if(style===1)return `I'd like ${item}, please.`;
  if(style===2)return `Do you have ${item}?`;
  return `Can I have ${item}, please?`;
}
export const shopItems: Word[] = allGroups.flatMap(group=>group.items).map(([en,vi,emoji],i) => ({id:i<56?`shop-${i}`:`shop-extra-${i-56}`,en,vi,emoji,phonetic:'',example_en:shopRequest(en),example_vi:`Cho mình ${vi} nhé.`}));
const shopVoiceTexts=new Set(shopItems.map(item=>item.en));
export function isShopVoiceText(text:string){return shopVoiceTexts.has(text.trim());}
export const shopThemes = allGroups.map(group=>({id:group.id,name:group.name,emoji:group.emoji,words:shopItems.filter(item=>group.items.some(([en])=>en===item.en))}));
export interface ShopOrder {target: Word; choices: Word[]; customer: number; review: boolean; style:ShopRequestStyle; request:string;}
function makeOrder(target:Word, pool:Word[], seed:string, index:number, review:boolean,style:ShopRequestStyle):ShopOrder {
  const others=shuffle(pool.filter(w=>w.id!==target.id),`${seed}:others:${index}`).slice(0,3);
  return {target,choices:shuffle([target,...others],`${seed}:choices:${index}`),customer:index%3,review,style,request:shopRequest(target.en,style)};
}
export function createShopOrders(words: Word[],seed:string,sessionIndex=0): ShopOrder[] {
  const seenEnglish=new Set<string>(),seenVietnamese=new Set<string>();
  const unique=words.filter(word=>{
    const en=word.en.toLowerCase(),vi=word.vi.toLowerCase();
    if(!vi.trim()||seenEnglish.has(en)||seenVietnamese.has(vi))return false;
    seenEnglish.add(en);seenVietnamese.add(vi);return true;
  });
  if(unique.length<4)return [];
  const deck=shuffle(unique,`${seed}:new`);
  const firstPass=Array.from({length:Math.min(6,unique.length)},(_,i)=>deck[(sessionIndex*6+i)%deck.length]);
  const repeats=shuffle(firstPass,`${seed}:repeat:${sessionIndex}`);
  return Array.from({length:8},(_,i)=>{
    const review=i>=firstPass.length;
    const target=review?repeats[(i-firstPass.length)%repeats.length]:firstPass[i];
    const firstIndex=firstPass.findIndex(word=>word.id===target.id);
    const style=((firstIndex+(review?1:0)+sessionIndex)%3) as ShopRequestStyle;
    return makeOrder(target,unique,`${seed}:session:${sessionIndex}`,i,review,style);
  });
}
export function prioritizeShopReviews(orders:ShopOrder[],sales:ShopSale[],pool:Word[],seed:string):ShopOrder[] {
  const weak=sales.filter((sale,i)=>!orders[i]?.review&&(sale.mistakes>0||sale.hinted)).map(sale=>sale.word);
  const scheduled=orders.filter(order=>order.review).map(order=>order.target);
  const targets=[...weak,...scheduled].filter((word,i,all)=>all.findIndex(other=>other.id===word.id)===i);
  let reviewIndex=0;
  return orders.map((order,i)=>{
    if(!order.review)return order;
    const target=targets[reviewIndex++]??order.target;
    if(i<sales.length)return order;
    const first=orders.find(previous=>!previous.review&&previous.target.id===target.id);
    const style=(((first?.style??order.style)+1)%3) as ShopRequestStyle;
    return makeOrder(target,pool,seed,i,true,style);
  });
}
export interface ShopSale {word:Word; mistakes:number; hinted:boolean;}
export function shopReward(sales:ShopSale[],total:number) {
  const perfect=sales.filter(s=>s.mistakes===0&&!s.hinted).length;
  const complete=total>0&&sales.length===total;
  const stars=complete?2+(perfect===total?3:perfect>=Math.ceil(total*.75)?2:perfect>=Math.ceil(total*.5)?1:0):0;
  return {stars,points:stars*10,perfect};
}
