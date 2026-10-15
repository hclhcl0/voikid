export type AppSection='learning'|'reading'|'games'|'stickers'|'family'|'review';
export function appSection(path:string):AppSection {
  const first=path.split('/')[1];
  if(['curriculum','unit'].includes(first))return 'reading';
  if(['games','arena','shop','treasure','wordsearch','quiz'].includes(first))return 'games';
  if(first==='stickers')return 'stickers';
  if(['parent','admin','settings','manage','import','learning-report','login'].includes(first))return 'family';
  if(first==='review')return 'review';
  return 'learning';
}
export function primaryNavigation(role?:string){
  return [
    {id:'learning',href:'/',label:'Học từ'},
    {id:'reading',href:'/curriculum',label:'Bài đọc'},
    {id:'games',href:'/games',label:'Trò chơi'},
    {id:'stickers',href:'/stickers',label:'Sticker'},
    role==='student'?{id:'review',href:'/review',label:'Ôn tập'}:{id:'family',href:'/parent',label:'Gia đình'},
  ] as const;
}
export function navigationActive(id:AppSection,path:string,role?:string){
  const section=appSection(path);
  return id===section||(id==='learning'&&section==='review'&&role!=='student');
}
