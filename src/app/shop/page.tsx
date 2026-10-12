'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Gift, HelpCircle, RotateCcw, ShoppingBag, Sparkles, Star, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProfileContext } from '@/context/ProfileContext';
import { useVocabularyCatalog } from '@/hooks/useVocabularyCatalog';
import { useShopAIVoice } from '@/hooks/useShopAIVoice';
import { EmojiImage } from '@/components/WordImage';
import { FighterArt } from '@/components/arena/FighterArt';
import { createShopOrders, prioritizeShopReviews, shopItems, shopReward, shopThemes, type ShopOrder, type ShopSale } from '@/lib/shop';
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
  const {speak,cancel,isSpeaking,error,available:voiceAvailable}=useShopAIVoice();
  const [theme,setTheme]=useState('all');
  const [themePage,setThemePage]=useState(0);
  const [difficulty,setDifficulty]=useState<'normal'|'hard'>('normal');
  const [orders,setOrders]=useState<ShopOrder[]>([]);
  const [sales,setSales]=useState<ShopSale[]>([]);
  const [phase,setPhase]=useState<'lobby'|'play'|'result'>('lobby');
  const [feedback,setFeedback]=useState<'correct'|'wrong'|null>(null);
  const [chosen,setChosen]=useState<string|null>(null);
  const [meaningShown,setMeaningShown]=useState(false);
  const [transcriptShown,setTranscriptShown]=useState(false);
  const [wordFlight,setWordFlight]=useState(0);
  const [motionEnabled,setMotionEnabled]=useState(true);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const locked=useRef(false), mistakes=useRef(0), saved=useRef(false), matchId=useRef('');
  const order=orders[sales.length];
  const hinted=meaningShown||transcriptShown;
  const reward=shopReward(sales,orders.length);
  const needsPractice=sales.filter(s=>s.mistakes>0||s.hinted).filter((s,i,all)=>all.findIndex(other=>other.word.id===s.word.id)===i);
  const customer=customers[order?.customer??0];
  const wordPosition=order?.request.indexOf(order.target.en)??-1;
  const themesPerPage=6;
  const themePageCount=Math.ceil(shopThemes.length/themesPerPage);
  const visibleThemes=shopThemes.slice(themePage*themesPerPage,(themePage+1)*themesPerPage);
  const requestHidden=difficulty==='hard'&&!transcriptShown&&!error&&voiceAvailable!==false;
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
  function stop(){if(timer.current)clearTimeout(timer.current);cancel();locked.current=false;setFeedback(null);setChosen(null);}
  function start() {
    stop();matchId.current=crypto.randomUUID();saved.current=false;mistakes.current=0;
    const words=shopThemes.find(t=>t.id===theme)?.words??shopItems;
    const sessionIndex=progress.unitTestResults?.[`shop:${theme}`]?.attempts??0;
    const next=createShopOrders([...words],`${activeProfile.id}:${theme}`,sessionIndex);
    setOrders(next);setSales([]);setMeaningShown(false);setTranscriptShown(false);setPhase('play');
    if(next[0])speak(next[0].target.en);
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
    const words=shopThemes.find(t=>t.id===theme)?.words??shopItems;
    const nextOrders=prioritizeShopReviews(orders,nextSales,[...words],matchId.current);
    timer.current=setTimeout(()=>{
      setOrders(nextOrders);setSales(nextSales);setMeaningShown(false);setTranscriptShown(false);setFeedback(null);setChosen(null);mistakes.current=0;locked.current=false;
      if(nextSales.length===nextOrders.length){
        setPhase('result');
        if(!saved.current){
          saved.current=true;const earned=shopReward(nextSales,nextOrders.length);const score=Math.round(earned.perfect/nextOrders.length*100);
          recordUnitTest({unitId:`shop:${theme}`,score,grade:score>=90?'excellent':score>=70?'good':score>=50?'pass':'fail',attempts:1,fastAnswers:0,streak:earned.perfect,correctAnswers:earned.perfect,questionCount:nextOrders.length,gameReward:{id:matchId.current,stars:earned.stars,points:earned.points}});
          if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)confetti({particleCount:100,spread:90,origin:{y:.6},colors:['#ffb892','#79c9bb','#ffe6a0']});
        }
      }else speak(nextOrders[nextSales.length].target.en);
    },1400);
  }
  function lobby(){stop();setPhase('lobby');}
  return <div className={styles.page} data-motion={motionEnabled?'on':'off'}>
    <header className={styles.header}><Link href="/" className={styles.back}><ArrowLeft size={17}/> Trang chủ</Link><span className={styles.brand}><ShoppingBag size={18}/> LITTLE MARKET</span><div className={styles.headerActions}><button className={styles.motionToggle} aria-pressed={motionEnabled} aria-label={motionEnabled?'Tắt chuyển động trong cửa hàng':'Bật chuyển động trong cửa hàng'} onClick={()=>setMotionEnabled(enabled=>!enabled)}><Sparkles size={15}/><span>Chuyển động: {motionEnabled?'Bật':'Tắt'}</span></button><span className={styles.balance}><Star size={15}/>{hydrated?progress.totalStars:0}</span></div></header>
    <main className={styles.main}>
      {!hydrated?<p>Đang mở cửa hàng…</p>:!settings.showGames?<section className={styles.empty}><h1>Cửa hàng đang tạm nghỉ</h1><Link href="/">Về trang chủ</Link></section>:!activeProfile.id?<section className={styles.empty}><h1>Chọn hồ sơ để mở tiệm</h1><button className={styles.primary} onClick={openProfileModal}>Chọn hồ sơ</button></section>:phase==='lobby'?<>
        <div className={styles.intro}><span className={styles.eyebrow}>MỘT MÓN HÀNG · MỘT TỪ MỚI</span><h1>Cửa hàng <em>tí hon.</em></h1><p>Mở tiệm, lắng nghe và mang niềm vui đến những vị khách nhỏ.</p></div>
        <section className={styles.lobbyScene}><div className={styles.shopSign}>Little Market <span>OPEN · WELCOME</span></div><div className={styles.welcome}><div className={styles.welcomeArt}><Image src="/shop/shopkeeper.webp" alt="Chủ tiệm chibi đeo tạp dề xanh, vẫy tay chào" width={600} height={1013} priority/></div><div className={styles.welcomeBubble}><span>Hi, shopkeeper!</span><strong>Hôm nay mình bán gì nhỉ?</strong><p>{shopItems.length} món hàng; chơi lại sẽ gặp thêm từ mới.</p></div></div><div className={styles.merchandise}>{shopItems.slice(0,5).map(w=><div key={w.id}><EmojiImage emoji={w.emoji} size="sm"/></div>)}</div></section>
        <section className={styles.setup}><div><span className={styles.eyebrow}>CHỌN GIAN HÀNG</span><div className={styles.themes}><button aria-pressed={theme==='all'} onClick={()=>setTheme('all')}><span>🏡</span>Tiệm đủ thứ<small>{shopItems.length} từ</small><Check size={14}/></button>{visibleThemes.map(t=><button key={t.id} aria-pressed={theme===t.id} onClick={()=>setTheme(t.id)}><span>{t.emoji}</span>{t.name}<small>{t.words.length} từ</small><Check size={14}/></button>)}</div><div className={styles.themePager}><button disabled={themePage===0} onClick={()=>setThemePage(page=>page-1)}>← Trước</button><span>Gian hàng {themePage+1} / {themePageCount}</span><button disabled={themePage===themePageCount-1} onClick={()=>setThemePage(page=>page+1)}>Sau →</button></div><div className={styles.difficulty}><span className={styles.eyebrow}>ĐỘ KHÓ</span><div role="group" aria-label="Độ khó cửa hàng"><button aria-pressed={difficulty==='normal'} onClick={()=>setDifficulty('normal')}>Bình thường <small>Hiện câu hỏi</small></button><button aria-pressed={difficulty==='hard'} onClick={()=>setDifficulty('hard')}>Thử thách <small>Chỉ nghe, không hiện câu hỏi</small></button></div></div></div><div className={styles.startArea}><button className={styles.primary} onClick={start}>Mở cửa hàng <ArrowRight size={18}/></button><span>{voiceAvailable===false?'Giọng AI chưa sẵn sàng · Có thể đọc chữ':'Giọng đọc AI · Không giới hạn thời gian'}</span></div></section>
        <div className={styles.instructions}><span><Volume2 size={16}/> Giọng đọc AI</span><i/><span><ShoppingBag size={16}/> Chọn món theo nghĩa</span><i/><span><Gift size={16}/> Nhận tối đa 5 sao</span></div>
      </>:phase==='result'?<section className={styles.result}><Image className={styles.resultShopkeeper} src="/shop/shopkeeper.webp" alt="Chủ tiệm vui vẻ sau một ngày bán hàng" width={600} height={1013}/><span className={styles.eyebrow}>MỘT NGÀY BÁN HÀNG TUYỆT VỜI</span><h1>Cảm ơn chủ tiệm {activeProfile.name}!</h1><p>Con đã phục vụ đủ {orders.length} vị khách và ôn lại những món vừa học.</p><div className={styles.reward}><Star/> +{reward.stars} sao <span>+{reward.points} điểm</span></div><div className={styles.resultStats}><div><strong>{reward.perfect}/{orders.length}</strong><span>Đúng ngay, không gợi ý</span></div><div><strong>{sales.reduce((n,s)=>n+s.mistakes,0)}</strong><span>Lần chọn cần sửa</span></div><div><strong>{progress.totalStars}</strong><span>Sao trong hồ sơ</span></div></div>{needsPractice.length>0&&<div className={styles.practiceNote}><strong>Con hãy xem lại:</strong><span>{needsPractice.map(s=>`${s.word.en} — ${s.word.vi}`).join(' · ')}</span></div>}<h2>Những món con đã bán</h2><div className={styles.review}>{sales.filter((s,i,a)=>a.findIndex(p=>p.word.id===s.word.id)===i).map(s=><button key={s.word.id} onClick={()=>speak(s.word.en)}>{s.word.emoji?<EmojiImage emoji={s.word.emoji} size="xs"/>:<ShoppingBag size={24}/>}<strong>{s.word.en}</strong><span>{s.word.vi}</span><Volume2 size={14}/></button>)}</div><div className={styles.resultActions}><button className={styles.primary} onClick={start}>Mở tiệm lần nữa</button><button className={styles.secondary} onClick={lobby}>Đổi gian hàng</button></div></section>:order&&<>
        <div className={styles.playHeading} data-feedback={feedback??'idle'}><div className={styles.ownerHeading}><Image src="/shop/shopkeeper.webp" alt="Chủ tiệm" width={600} height={1013}/><div><span className={styles.eyebrow}>TIỆM CỦA {activeProfile.name.toUpperCase()}</span><h1>Chào đón khách nhỏ</h1></div></div><button className={styles.secondary} onClick={lobby}>Đóng tiệm</button></div>
        <div className={styles.orderProgress}><span>Khách {sales.length+1} / {orders.length}</span><div>{orders.map((_,i)=><span key={i} data-done={i<sales.length} data-active={i===sales.length}/>)}</div><strong><ShoppingBag size={14}/>{sales.length} đơn đã giao</strong></div>
        <section className={styles.gameScene} data-feedback={feedback??'idle'}><div className={styles.shopSign}>Little Market <span>MADE WITH LOVE</span></div><div key={sales.length} className={styles.customer}><FighterArt kind={customer.kind} victory={feedback==='correct'}/><span>{customer.name}</span></div><div className={styles.speech}><span className={styles.customerLabel}>{order.review?'ÔN LẠI · ':''}{customer.name} muốn mua…</span><h2>{feedback==='correct'?'Thank you!':requestHidden?'🔊 Nghe tên món':wordPosition<0?`“${order.request}”`:<>“{order.request.slice(0,wordPosition)}<span className={styles.answerSlot}><span key={`${sales.length}:${order.target.id}:${wordFlight}`} className={`${styles.flyingWord} ${order.target.en.length>16?styles.flyingWordLong:''}`}>{order.target.en}</span></span>{order.request.slice(wordPosition+order.target.en.length)}”</>}</h2><p>{feedback==='correct'?`Đúng rồi! ${order.target.en} — ${order.target.vi}`:meaningShown?`Cho mình ${order.target.vi} nhé.`:requestHidden?'Nghe lại rồi chọn món. Nếu cần, con có thể xem chữ.':'Đọc câu và chọn món bên dưới.'}</p><div><button onClick={()=>speak(order.target.en)} disabled={!!feedback||voiceAvailable===false} className={styles.listen}><Volume2 size={16}/>{voiceAvailable===false?'Giọng AI chưa sẵn sàng':isSpeaking?'Đang tải hoặc đọc…':'Nghe tên món'}</button>{!requestHidden&&feedback!=='correct'&&<button className={styles.hint} disabled={!!feedback} onClick={()=>setWordFlight(value=>value+1)}><RotateCcw size={15}/> Xem từ bay</button>}{requestHidden&&<button className={styles.hint} disabled={!!feedback} onClick={()=>setTranscriptShown(true)}><HelpCircle size={15}/> Xem chữ</button>}<button className={styles.hint} disabled={meaningShown||!!feedback} onClick={()=>setMeaningShown(true)}><HelpCircle size={15}/> Nghĩa gợi ý</button></div></div>{feedback==='correct'&&<div className={styles.delivery} aria-hidden="true"><ShoppingBag/><span>✓ Đã giao hàng</span><Sparkles/></div>}</section>
        <section className={styles.productArea}><div className={styles.shelfHeading}><h2>Chọn món để giao</h2><span>Nhấn vào một sản phẩm</span></div><div className={styles.products}>{order.choices.map((w,i)=><button key={`${sales.length}:${w.id}`} data-selected={chosen===w.id} data-feedback={chosen===w.id?feedback:undefined} disabled={!!feedback} onClick={()=>serve(w)}><span className={styles.productNumber}>0{i+1}</span><div className={styles.productArt}>{w.emoji?<EmojiImage emoji={w.emoji} size="lg"/>:<span className={styles.productPlaceholder}><ShoppingBag size={42}/></span>}</div><strong>{w.vi}</strong><span className={styles.productAction}>{chosen===w.id&&feedback==='correct'?<><Check size={14}/> Đã giao</>:<><ShoppingBag size={14}/> Giao món này</>}</span></button>)}</div><p className={styles.feedback} role="status">{feedback==='wrong'?'Món này chưa đúng. Con nghe lại và chọn món khác nhé!':feedback==='correct'?'Khách rất vui! Đang đón vị khách tiếp theo…':'Chọn đúng ngay và không dùng gợi ý để nhận thêm sao.'}</p></section>
      </>}
      {(error||voiceAvailable===false&&phase==='play')&&<p role="alert" className={styles.audioError}>Giọng AI chưa sẵn sàng. Yêu cầu tiếng Anh đã hiện chữ để con tiếp tục.</p>}
    </main>
  </div>;
}
