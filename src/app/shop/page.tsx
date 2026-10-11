'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Gift, HelpCircle, ShoppingBag, Sparkles, Star, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProfileContext } from '@/context/ProfileContext';
import { useVocabularyCatalog } from '@/hooks/useVocabularyCatalog';
import { useTTS } from '@/hooks/useTTS';
import { EmojiImage } from '@/components/WordImage';
import { FighterArt } from '@/components/arena/FighterArt';
import { createShopOrders, shopItems, shopRequest, shopReward, shopThemes, type ShopOrder, type ShopSale } from '@/lib/shop';
import type { Word } from '@/types';
import styles from './shop.module.css';

const customers = [{name:'Lily',kind:'flower'}, {name:'Milo',kind:'star'}, {name:'Ruby',kind:'rainbow'}] as const;
export default function ShopPage() {
  const {activeProfile}=useProfileContext();
  return <ShopGame key={activeProfile.id}/>;
}
function ShopGame() {
  const {activeProfile,hydrated,progress,recordUnitTest,openProfileModal}=useProfileContext();
  const {settings}=useVocabularyCatalog();
  const {speak,cancel,isSpeaking,error}=useTTS();
  const [theme,setTheme]=useState('all');
  const [orders,setOrders]=useState<ShopOrder[]>([]);
  const [sales,setSales]=useState<ShopSale[]>([]);
  const [phase,setPhase]=useState<'lobby'|'play'|'result'>('lobby');
  const [feedback,setFeedback]=useState<'correct'|'wrong'|null>(null);
  const [chosen,setChosen]=useState<string|null>(null);
  const [hinted,setHinted]=useState(false);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const locked=useRef(false), mistakes=useRef(0), saved=useRef(false), matchId=useRef('');
  const order=orders[sales.length];
  const reward=shopReward(sales,orders.length);
  const customer=customers[order?.customer??0];
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
  function stop(){if(timer.current)clearTimeout(timer.current);cancel();locked.current=false;setFeedback(null);setChosen(null);}
  function start() {
    stop();matchId.current=crypto.randomUUID();saved.current=false;mistakes.current=0;
    const words=shopThemes.find(t=>t.id===theme)?.words??shopItems;
    const next=createShopOrders([...words],matchId.current);
    setOrders(next);setSales([]);setHinted(false);setPhase('play');
    if(next[0])speak(shopRequest(next[0].target.en));
  }
  function serve(word:Word){
    if(!order||phase!=='play'||locked.current)return;
    locked.current=true;cancel();setChosen(word.id);
    if(word.id!==order.target.id){
      mistakes.current++;setFeedback('wrong');
      timer.current=setTimeout(()=>{setFeedback(null);setChosen(null);locked.current=false;},800);return;
    }
    setFeedback('correct');
    const nextSales=[...sales,{word:order.target,mistakes:mistakes.current,hinted}];
    speak(`Thank you! ${order.target.en}.`);
    timer.current=setTimeout(()=>{
      setSales(nextSales);setHinted(false);setFeedback(null);setChosen(null);mistakes.current=0;locked.current=false;
      if(nextSales.length===orders.length){
        setPhase('result');
        if(!saved.current){
          saved.current=true;const earned=shopReward(nextSales,orders.length);const score=Math.round(earned.perfect/orders.length*100);
          recordUnitTest({unitId:`shop:${theme}`,score,grade:score>=90?'excellent':score>=70?'good':score>=50?'pass':'fail',attempts:1,fastAnswers:0,streak:earned.perfect,correctAnswers:earned.perfect,questionCount:orders.length,gameReward:{id:matchId.current,stars:earned.stars,points:earned.points}});
          if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)confetti({particleCount:100,spread:90,origin:{y:.6},colors:['#ffb892','#79c9bb','#ffe6a0']});
        }
      }else speak(shopRequest(orders[nextSales.length].target.en));
    },1400);
  }
  function lobby(){stop();setPhase('lobby');}
  return <div className={styles.page}>
    <header className={styles.header}><Link href="/" className={styles.back}><ArrowLeft size={17}/> Trang chủ</Link><span className={styles.brand}><ShoppingBag size={18}/> LITTLE MARKET</span><span className={styles.balance}><Star size={15}/>{hydrated?progress.totalStars:0}</span></header>
    <main className={styles.main}>
      {!hydrated?<p>Đang mở cửa hàng…</p>:!settings.showGames?<section className={styles.empty}><h1>Cửa hàng đang tạm nghỉ</h1><Link href="/">Về trang chủ</Link></section>:!activeProfile.id?<section className={styles.empty}><h1>Chọn hồ sơ để mở tiệm</h1><button className={styles.primary} onClick={openProfileModal}>Chọn hồ sơ</button></section>:phase==='lobby'?<>
        <div className={styles.intro}><span className={styles.eyebrow}>MỘT MÓN HÀNG · MỘT TỪ MỚI</span><h1>Cửa hàng <em>tí hon.</em></h1><p>Mở tiệm, lắng nghe và mang niềm vui đến những vị khách nhỏ.</p></div>
        <section className={styles.lobbyScene}><div className={styles.shopSign}>Little Market <span>OPEN · WELCOME</span></div><div className={styles.welcome}><div className={styles.welcomeArt}><FighterArt kind="flower"/></div><div className={styles.welcomeBubble}><span>Hi, shopkeeper!</span><strong>Hôm nay mình bán gì nhỉ?</strong><p>8 vị khách đang chờ con phục vụ.</p></div></div><div className={styles.merchandise}>{shopItems.slice(0,5).map(w=><div key={w.id}><EmojiImage emoji={w.emoji} size="sm"/></div>)}</div></section>
        <section className={styles.setup}><div><span className={styles.eyebrow}>CHỌN GIAN HÀNG</span><div className={styles.themes}>{[{id:'all',name:'Tiệm đủ thứ',emoji:'🏡'},...shopThemes].map(t=><button key={t.id} aria-pressed={theme===t.id} onClick={()=>setTheme(t.id)}><span>{t.emoji}</span>{t.name}<Check size={14}/></button>)}</div></div><div className={styles.startArea}><button className={styles.primary} onClick={start}>Mở cửa hàng <ArrowRight size={18}/></button><span>Nghe hoặc đọc · Không giới hạn thời gian</span></div></section>
        <div className={styles.instructions}><span><Volume2 size={16}/> Nghe yêu cầu</span><i/><span><ShoppingBag size={16}/> Chọn món theo nghĩa</span><i/><span><Gift size={16}/> Nhận tối đa 5 sao</span></div>
      </>:phase==='result'?<section className={styles.result}><span className={styles.resultIcon}>🏆</span><span className={styles.eyebrow}>MỘT NGÀY BÁN HÀNG TUYỆT VỜI</span><h1>Cảm ơn chủ tiệm {activeProfile.name}!</h1><p>Con đã phục vụ đủ {orders.length} vị khách.</p><div className={styles.reward}><Star/> +{reward.stars} sao <span>+{reward.points} điểm</span></div><div className={styles.resultStats}><div><strong>{reward.perfect}/{orders.length}</strong><span>Đúng ngay, không gợi ý</span></div><div><strong>{sales.reduce((n,s)=>n+s.mistakes,0)}</strong><span>Lần chọn cần sửa</span></div><div><strong>{progress.totalStars}</strong><span>Sao trong hồ sơ</span></div></div><h2>Những món con đã bán</h2><div className={styles.review}>{sales.filter((s,i,a)=>a.findIndex(p=>p.word.id===s.word.id)===i).map(s=><button key={s.word.id} onClick={()=>speak(s.word.en)}><EmojiImage emoji={s.word.emoji} size="xs"/><strong>{s.word.en}</strong><span>{s.word.vi}</span><Volume2 size={14}/></button>)}</div><div className={styles.resultActions}><button className={styles.primary} onClick={start}>Mở tiệm lần nữa</button><button className={styles.secondary} onClick={lobby}>Đổi gian hàng</button></div></section>:order&&<>
        <div className={styles.playHeading}><div><span className={styles.eyebrow}>TIỆM CỦA {activeProfile.name.toUpperCase()}</span><h1>Chào đón khách nhỏ</h1></div><button className={styles.secondary} onClick={lobby}>Đóng tiệm</button></div>
        <div className={styles.orderProgress}><span>Khách {sales.length+1} / {orders.length}</span><div>{orders.map((_,i)=><span key={i} data-done={i<sales.length} data-active={i===sales.length}/>)}</div><strong><ShoppingBag size={14}/>{sales.length} đơn đã giao</strong></div>
        <section className={styles.gameScene} data-feedback={feedback??'idle'}><div className={styles.shopSign}>Little Market <span>MADE WITH LOVE</span></div><div key={sales.length} className={styles.customer}><FighterArt kind={customer.kind} victory={feedback==='correct'}/><span>{customer.name}</span></div><div className={styles.speech}><span className={styles.customerLabel}>{customer.name} muốn mua…</span><h2>{feedback==='correct'?'Thank you!':`“${shopRequest(order.target.en)}”`}</h2><p>{feedback==='correct'?`Đúng rồi! ${order.target.en} — ${order.target.vi}`:hinted?`Cho mình ${order.target.vi} nhé.`:'Nghe hoặc đọc rồi chọn món bên dưới.'}</p><div><button onClick={()=>speak(shopRequest(order.target.en))} disabled={!!feedback} className={styles.listen}><Volume2 size={16}/>{isSpeaking?'Đang đọc…':'Nghe yêu cầu'}</button><button className={styles.hint} disabled={hinted||!!feedback} onClick={()=>setHinted(true)}><HelpCircle size={15}/> Nghĩa gợi ý</button></div></div>{feedback==='correct'&&<div className={styles.delivery} aria-hidden="true"><ShoppingBag/><span>✓ Đã giao hàng</span><Sparkles/></div>}</section>
        <section className={styles.productArea}><div className={styles.shelfHeading}><h2>Chọn món để giao</h2><span>Nhấn vào một sản phẩm</span></div><div className={styles.products}>{order.choices.map((w,i)=><button key={`${sales.length}:${w.id}`} data-selected={chosen===w.id} data-feedback={chosen===w.id?feedback:undefined} disabled={!!feedback} onClick={()=>serve(w)}><span className={styles.productNumber}>0{i+1}</span><div className={styles.productArt}><EmojiImage emoji={w.emoji} size="lg"/></div><strong>{w.vi}</strong><span className={styles.productAction}>{chosen===w.id&&feedback==='correct'?<><Check size={14}/> Đã giao</>:<><ShoppingBag size={14}/> Giao món này</>}</span></button>)}</div><p className={styles.feedback} role="status">{feedback==='wrong'?'Món này chưa đúng. Con nghe lại và chọn món khác nhé!':feedback==='correct'?'Khách rất vui! Đang đón vị khách tiếp theo…':'Chọn đúng ngay và không dùng gợi ý để nhận thêm sao.'}</p></section>
      </>}
      {error&&<p role="alert" className={styles.audioError}>{error} Con có thể đọc yêu cầu trên màn hình.</p>}
    </main>
  </div>;
}
