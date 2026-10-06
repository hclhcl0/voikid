import type { AppProgress, Sticker, StickerTier } from '@/types';
import { sessionsFor } from '@/lib/learning/progress';
import { validStorySession } from '@/lib/stories/learning';
import { mergeIpaPractice, validIpaRecord, type IpaPracticeRecord } from '@/lib/ipa/practice';

export const STICKER_COLLECTIONS = [
  {id:'pets', name:'Thú cưng', emoji:'🐱', description:'Những người bạn đầu tiên'},
  {id:'magic', name:'Thế giới phép thuật', emoji:'🦄', description:'Mỗi bước nhỏ là một phép màu'},
  {id:'explorers', name:'Nhà thám hiểm', emoji:'🚀', description:'Khám phá thêm mỗi ngày'},
  {id:'stars', name:'Ngôi sao học tập', emoji:'🌟', description:'Ghi dấu những cố gắng của bé'},
  {id:'ocean', name:'Đại dương', emoji:'🌊', description:'Lặn tìm những bất ngờ dưới biển'},
  {id:'jungle', name:'Rừng xanh', emoji:'🌿', description:'Gặp bạn mới giữa khu rừng'},
  {id:'garden', name:'Vườn xinh', emoji:'🌼', description:'Chăm khu vườn bằng từng ngày học'},
  {id:'treats', name:'Tiệm bánh', emoji:'🍬', description:'Những phần thưởng ngọt ngào'},
  {id:'vehicles', name:'Xe cộ', emoji:'🛣️', description:'Lên đường khám phá cùng nhau'},
  {id:'music', name:'Âm nhạc', emoji:'🎶', description:'Mỗi cố gắng là một giai điệu'},
] as const;
export type StickerCollection = typeof STICKER_COLLECTIONS[number]['id'];
export interface StickerStats {
  words:number; ipa:number; attentiveIpa:number; stories:number; lessons:number;
  studyDays:number; activities:number; stars:number; streak:number; tests:number;
  excellentTests:number; perfectTests:number; ipaReview:number;
}
export interface StickerMilestone extends Omit<Sticker,'earnedAt'|'setId'> {
  setId:StickerCollection; metric:keyof StickerStats; target:number;
  href:string; action:string;
}
export function stickerDisplayName(sticker:Pick<Sticker,'name'>,revealed:boolean):string {
  return revealed ? sticker.name : 'Quà bí mật';
}
function milestone(id:string,name:string,emoji:string,setId:StickerCollection,metric:keyof StickerStats,target:number,condition:string,href:string,action:string,tier:StickerTier='basic'):StickerMilestone {
  return {id,name,emoji,setId,metric,target,condition,href,action,tier};
}
export const STICKER_MILESTONES:StickerMilestone[] = [
  milestone('pets_first_word','Mèo ham học','🐱','pets','words',1,'Luyện nói 1 từ. Thử sức là đã đáng khen!','/','Luyện từ'),
  milestone('pets_words_5','Cún chăm chỉ','🐶','pets','words',5,'Luyện nói 5 từ khác nhau.','/','Luyện từ'),
  milestone('pets_ipa_1','Thỏ lắng nghe','🐰','pets','ipa',1,'Hoàn thành một bài luyện âm: nghe, chọn và thử nói.','/ipa','Luyện âm'),
  milestone('pets_story_1','Cáo mê chuyện','🦊','pets','stories',1,'Hoàn thành bài tập của 1 đoạn văn.','/curriculum','Học bài đọc'),
  milestone('pets_lesson_1','Gấu chăm luyện','🐼','pets','lessons',1,'Hoàn thành bài đọc hoặc chặng luyện của 1 chủ đề.','/curriculum','Học theo chủ đề'),
  milestone('pets_days_3','Sư tử bền bỉ','🦁','pets','studyDays',3,'Có hoạt động học trong 3 ngày khác nhau, không cần liên tiếp.','/','Học hôm nay'),
  milestone('magic_ipa_3','Kỳ lân nghe giỏi','🦄','magic','ipa',3,'Hoàn thành bài luyện của 3 âm khác nhau.','/ipa','Luyện âm','star'),
  milestone('magic_stories_3','Rồng kể chuyện','🐉','magic','stories',3,'Hoàn thành bài tập của 3 đoạn văn khác nhau.','/curriculum','Học bài đọc','star'),
  milestone('magic_attentive_3','Cầu vồng tinh tai','🌈','magic','attentiveIpa',3,'Chọn đúng cả 2 câu nghe ngay lần đầu ở 3 âm khác nhau.','/ipa','Thử nghe','rare'),
  milestone('magic_days_5','Đũa phép siêng năng','🪄','magic','studyDays',5,'Có hoạt động học trong 5 ngày khác nhau.','/','Học hôm nay','star'),
  milestone('perfect_test','Viên ngọc chính xác','💎','magic','perfectTests',1,'Trả lời đúng tất cả câu trong một bài kiểm tra.','/test','Làm bài kiểm tra','legendary'),
  milestone('streak_30','Vương miện kiên trì','👑','magic','streak',30,'Luyện từ vựng 30 ngày liên tiếp.','/','Luyện từ','legendary'),
  milestone('explorers_lessons_3','Tên lửa khởi hành','🚀','explorers','lessons',3,'Hoàn thành bài đọc hoặc chặng luyện của 3 chủ đề khác nhau.','/curriculum','Học theo chủ đề','star'),
  milestone('explorers_ipa_review','La bàn ôn tập','🧭','explorers','ipaReview',1,'Hoàn thành lại một bài luyện âm khi đã đến lịch ôn.','/ipa','Ôn âm'),
  milestone('explorers_stories_5','Hòn đảo truyện hay','🏝️','explorers','stories',5,'Hoàn thành bài tập của 5 đoạn văn khác nhau.','/curriculum','Học bài đọc','rare'),
  milestone('explorers_ipa_6','Hành tinh âm thanh','🪐','explorers','ipa',6,'Hoàn thành bài luyện của 6 âm khác nhau.','/ipa','Luyện âm','rare'),
  milestone('explorers_activities_10','Vòng quanh thế giới','🌍','explorers','activities',10,'Hoàn thành tổng cộng 10 bài luyện âm, đoạn văn hoặc chặng bổ trợ khác nhau.','/curriculum','Khám phá bài học','rare'),
  milestone('explorers_lessons_5','Ba lô khám phá','🎒','explorers','lessons',5,'Hoàn thành bài đọc hoặc chặng luyện của 5 chủ đề khác nhau.','/curriculum','Học theo chủ đề','rare'),
  milestone('stars_first_test','Niềm vui đầu tiên','🎉','stars','tests',1,'Đạt hạng Đạt, Giỏi hoặc Xuất sắc trong 1 bài kiểm tra.','/test','Làm bài kiểm tra'),
  milestone('stars_excellent','Ngôi sao rực rỡ','🌟','stars','excellentTests',1,'Đạt hạng Xuất sắc trong 1 bài kiểm tra.','/test','Làm bài kiểm tra','rare'),
  milestone('stars_100','Một trăm ngôi sao','💯','stars','stars',100,'Tích lũy 100 sao từ các hoạt động học.','/','Luyện từ','star'),
  milestone('streak_7','Ngọn lửa nhỏ','🔥','stars','streak',7,'Luyện từ vựng 7 ngày liên tiếp.','/','Luyện từ','star'),
  milestone('stars_500','Chiếc cúp tỏa sáng','🏆','stars','stars',500,'Tích lũy 500 sao từ các hoạt động học.','/','Luyện từ','legendary'),
  milestone('stars_days_7','Huy chương cố gắng','🎖️','stars','studyDays',7,'Có hoạt động học trong 7 ngày khác nhau, không cần liên tiếp.','/','Học hôm nay','rare'),
  milestone('ocean_words_3','Cá nhỏ tung tăng','🐠','ocean','words',3,'Luyện nói 3 từ khác nhau.','/','Luyện từ'),
  milestone('ocean_ipa_2','Cá heo tinh nghịch','🐬','ocean','ipa',2,'Hoàn thành bài luyện của 2 âm khác nhau.','/ipa','Luyện âm'),
  milestone('ocean_days_4','Rùa biển bền bỉ','🐢','ocean','studyDays',4,'Có hoạt động học trong 4 ngày khác nhau.','/','Học hôm nay','star'),
  milestone('ocean_stories_2','Bạch tuộc mê truyện','🐙','ocean','stories',2,'Hoàn thành bài tập của 2 đoạn văn khác nhau.','/curriculum','Học bài đọc','star'),
  milestone('ocean_lessons_4','Cua nhỏ khám phá','🦀','ocean','lessons',4,'Hoàn thành bài đọc hoặc chặng luyện của 4 chủ đề khác nhau.','/curriculum','Học theo chủ đề','rare'),
  milestone('ocean_activities_15','Cá voi hát vang','🐳','ocean','activities',15,'Hoàn thành 15 bài luyện âm, đoạn văn hoặc chặng bổ trợ khác nhau.','/curriculum','Khám phá bài học','rare'),
  milestone('jungle_words_10','Khỉ con lanh lợi','🐵','jungle','words',10,'Luyện nói 10 từ khác nhau.','/','Luyện từ','star'),
  milestone('jungle_ipa_4','Hươu cao cổ chăm nghe','🦒','jungle','ipa',4,'Hoàn thành bài luyện của 4 âm khác nhau.','/ipa','Luyện âm','star'),
  milestone('jungle_stories_4','Voi con kể chuyện','🐘','jungle','stories',4,'Hoàn thành bài tập của 4 đoạn văn khác nhau.','/curriculum','Học bài đọc','star'),
  milestone('jungle_days_10','Hổ con kiên trì','🐯','jungle','studyDays',10,'Có hoạt động học trong 10 ngày khác nhau.','/','Học hôm nay','rare'),
  milestone('jungle_lessons_6','Ngựa vằn phiêu lưu','🦓','jungle','lessons',6,'Hoàn thành bài đọc hoặc chặng luyện của 6 chủ đề khác nhau.','/curriculum','Học theo chủ đề','rare'),
  milestone('jungle_words_50','Khỉ đột học giỏi','🦍','jungle','words',50,'Luyện nói 50 từ khác nhau.','/','Luyện từ','legendary'),
  milestone('garden_days_2','Hoa nhỏ chào bé','🌸','garden','studyDays',2,'Có hoạt động học trong 2 ngày khác nhau.','/','Học hôm nay'),
  milestone('garden_words_15','Bọ rùa chăm chỉ','🐞','garden','words',15,'Luyện nói 15 từ khác nhau.','/','Luyện từ','star'),
  milestone('garden_ipa_5','Bươm bướm nghe giỏi','🦋','garden','ipa',5,'Hoàn thành bài luyện của 5 âm khác nhau.','/ipa','Luyện âm','star'),
  milestone('garden_stories_6','Hoa tulip mê sách','🌷','garden','stories',6,'Hoàn thành bài tập của 6 đoạn văn khác nhau.','/curriculum','Học bài đọc','rare'),
  milestone('garden_days_14','Hướng dương tỏa nắng','🌻','garden','studyDays',14,'Có hoạt động học trong 14 ngày khác nhau.','/','Học hôm nay','rare'),
  milestone('garden_lessons_8','Cây xanh lớn lên','🌳','garden','lessons',8,'Hoàn thành bài đọc hoặc chặng luyện của 8 chủ đề khác nhau.','/curriculum','Học theo chủ đề','legendary'),
  milestone('treats_words_20','Dâu tây vui vẻ','🍓','treats','words',20,'Luyện nói 20 từ khác nhau.','/','Luyện từ','star'),
  milestone('treats_activities_5','Bánh nhỏ xinh xắn','🧁','treats','activities',5,'Hoàn thành 5 bài luyện âm, đoạn văn hoặc chặng bổ trợ khác nhau.','/curriculum','Khám phá bài học'),
  milestone('treats_ipa_8','Kem mát tinh tai','🍦','treats','ipa',8,'Hoàn thành bài luyện của 8 âm khác nhau.','/ipa','Luyện âm','rare'),
  milestone('treats_stories_8','Bánh vòng kể chuyện','🍩','treats','stories',8,'Hoàn thành bài tập của 8 đoạn văn khác nhau.','/curriculum','Học bài đọc','rare'),
  milestone('treats_days_21','Bánh ngọt bền bỉ','🍰','treats','studyDays',21,'Có hoạt động học trong 21 ngày khác nhau.','/','Học hôm nay','legendary'),
  milestone('treats_words_75','Kẹo ngọt chăm học','🍭','treats','words',75,'Luyện nói 75 từ khác nhau.','/','Luyện từ','legendary'),
  milestone('vehicles_words_30','Xe đua khởi hành','🏎️','vehicles','words',30,'Luyện nói 30 từ khác nhau.','/','Luyện từ','star'),
  milestone('vehicles_activities_8','Xe buýt vui nhộn','🚌','vehicles','activities',8,'Hoàn thành 8 bài luyện âm, đoạn văn hoặc chặng bổ trợ khác nhau.','/curriculum','Khám phá bài học','star'),
  milestone('vehicles_ipa_10','Trực thăng nghe giỏi','🚁','vehicles','ipa',10,'Hoàn thành bài luyện của 10 âm khác nhau.','/ipa','Luyện âm','rare'),
  milestone('vehicles_stories_10','Thuyền buồm đọc sách','⛵','vehicles','stories',10,'Hoàn thành bài tập của 10 đoạn văn khác nhau.','/curriculum','Học bài đọc','rare'),
  milestone('vehicles_lessons_10','Tàu hỏa khám phá','🚂','vehicles','lessons',10,'Hoàn thành bài đọc hoặc chặng luyện của 10 chủ đề khác nhau.','/curriculum','Học theo chủ đề','legendary'),
  milestone('vehicles_days_28','Máy bay ước mơ','✈️','vehicles','studyDays',28,'Có hoạt động học trong 28 ngày khác nhau, không cần liên tiếp.','/','Học hôm nay','legendary'),
  milestone('music_activities_3','Nốt nhạc đầu tiên','🎵','music','activities',3,'Hoàn thành 3 bài luyện âm, đoạn văn hoặc chặng bổ trợ khác nhau.','/curriculum','Khám phá bài học'),
  milestone('music_words_40','Trống nhỏ rộn ràng','🥁','music','words',40,'Luyện nói 40 từ khác nhau.','/','Luyện từ','star'),
  milestone('music_attentive_6','Đàn ghi ta tinh tai','🎸','music','attentiveIpa',6,'Chọn đúng cả 2 câu nghe ngay lần đầu ở 6 âm khác nhau.','/ipa','Thử nghe','rare'),
  milestone('music_ipa_12','Kèn vang vui vẻ','🎺','music','ipa',12,'Hoàn thành bài luyện của 12 âm khác nhau.','/ipa','Luyện âm','rare'),
  milestone('music_stories_12','Vi ô lông mê truyện','🎻','music','stories',12,'Hoàn thành bài tập của 12 đoạn văn khác nhau.','/curriculum','Học bài đọc','legendary'),
  milestone('music_days_35','Ca sĩ chăm học','🎤','music','studyDays',35,'Có hoạt động học trong 35 ngày khác nhau, không cần liên tiếp.','/','Học hôm nay','legendary'),
];

// Keep earned stickers forever, including older units and devices that sync late.
export function mergeStickers(current:unknown,incoming:unknown):Sticker[] {
  const merged = new Map<string,Sticker>();
  for (const rows of [current,incoming]) {
    if (!Array.isArray(rows)) continue;
    for (const value of rows) {
      if (!value || typeof value !== 'object') continue;
      const s = value as Sticker;
      if (typeof s.id !== 'string' || !s.id || typeof s.name !== 'string' || typeof s.emoji !== 'string' || typeof s.earnedAt !== 'string'
        || typeof s.setId !== 'string' || typeof s.condition !== 'string' || !Number.isFinite(Date.parse(s.earnedAt))
        || !['basic','star','rare','legendary','special'].includes(s.tier)) continue;
      const old = merged.get(s.id);
      if (!old || Date.parse(s.earnedAt) < Date.parse(old.earnedAt)) merged.set(s.id,s);
    }
  }
  return [...merged.values()];
}
// An explicit reset starts a new generation; an old device must not restore it.
export function progressResetTime(progress:{progressResetAt?:string}) {
  const time = Date.parse(progress.progressResetAt ?? '');
  return Number.isFinite(time) ? time : 0;
}
export function mergeStickerStudyDays(current:unknown,incoming:unknown):string[] {
  return [...new Set([current,incoming].flatMap(rows => Array.isArray(rows) ? rows.filter(day => typeof day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(day) && Number.isFinite(Date.parse(day))) : []))].sort();
}
function stickerSummary(progress:AppProgress,profileId:string):{stats:StickerStats;studyDates:string[]} {
  const lessons = sessionsFor(progress.learningSessions,profileId).filter(s => s.completed);
  const stories = Object.values(progress.storySessions ?? {}).filter(s => validStorySession(s,profileId) && s.completed);
  const ipa = Object.values(mergeIpaPractice({},progress.ipaPractice,profileId));
  const words = Object.values(progress.wordProgress ?? {}).filter(w => w && w.attempts > 0);
  const tests = Object.values(progress.unitTestResults ?? {}).filter(t => t && ['pass','good','excellent'].includes(t.grade));
  const days = new Set<string>();
  const addDay = (date:string) => {if (/^\d{4}-\d{2}-\d{2}/.test(date) && Number.isFinite(Date.parse(date))) days.add(date.slice(0,10));};
  for (const day of mergeStickerStudyDays(progress.stickerStudyDays,[])) addDay(day);
  for (const d of progress.dailyStats ?? []) if (d.wordsStudied > 0) addDay(d.date);
  for (const w of words) addDay(w.lastPracticed);
  for (const s of [...lessons,...stories,...ipa,...tests]) addDay('completedAt' in s ? s.completedAt : s.updatedAt);
  const lessonCount = new Set(lessons.map(s => s.unitId)).size;
  const unitCount = new Set([...lessons,...stories].map(s => s.unitId)).size;
  const storyCount = new Set(stories.map(s => s.id)).size;
  const stickers = mergeStickers(progress.stickers,[]);
  // Earlier test awards also serve as evidence when the latest retake was lower.
  const legacyTests = stickers.filter(s => s.setId === 'unit_test');
  return {studyDates:[...days].sort(),stats:{
    words:new Set(words.map(w => w.wordId)).size, ipa:ipa.length,
    attentiveIpa:ipa.filter(s => s.firstTry.every(Boolean)).length,
    lessons:unitCount, stories:storyCount, studyDays:days.size,
    activities:lessonCount + storyCount + ipa.length,
    stars:Math.max(0,progress.totalStars || 0), streak:Math.max(0,progress.streak || 0),
    tests:new Set([...tests.map(t => t.unitId),...legacyTests.map(s => s.unitId ?? s.id)]).size,
    excellentTests:new Set([...tests.filter(t => t.grade === 'excellent').map(t => t.unitId),...legacyTests.filter(s => s.id.endsWith('_test_excellent')).map(s => s.unitId ?? s.id)]).size,
    perfectTests:tests.filter(t => (t.questionCount ?? 0) > 0 && t.correctAnswers === t.questionCount).length,
    ipaReview:stickers.some(s => s.id === 'explorers_ipa_review') ? 1 : 0,
  }};
}
export function stickerStats(progress:AppProgress,profileId:string):StickerStats {
  return stickerSummary(progress,profileId).stats;
}
export function isDueIpaReview(previous:unknown,record:IpaPracticeRecord,profileId:string):boolean {
  return validIpaRecord(previous,profileId) && validIpaRecord(record,profileId)
    && previous.sound === record.sound && Date.parse(record.updatedAt) > Date.parse(previous.updatedAt)
    && Date.parse(record.updatedAt) >= Date.parse(previous.reviewDueAt);
}
export const GRADE_REWARD_EDITIONS = [
  {gradeId:'lop1',label:'Lớp 1',name:'Đồng',tier:'basic',level:1},
  {gradeId:'lop2',label:'Lớp 2',name:'Bạc',tier:'star',level:2},
  {gradeId:'lop3',label:'Lớp 3',name:'Vàng',tier:'rare',level:3},
  {gradeId:'lop4',label:'Lớp 4',name:'Kim cương',tier:'special',level:4},
  {gradeId:'lop5',label:'Lớp 5',name:'Huyền thoại',tier:'legendary',level:5},
] as const;

export function gradeRewardEdition(gradeId?:string) {
  return GRADE_REWARD_EDITIONS.find(edition => edition.gradeId === gradeId);
}

// Separate IDs keep the original edition intact when a child moves up a grade.
// Targets use accumulated, verified learning activity; changing grade alone is not a milestone.
export function gradeStickerMilestones(gradeId?:string):StickerMilestone[] {
  const edition = gradeRewardEdition(gradeId);
  if (!edition) return [];
  const g = edition.level;
  const create = (key:string,name:string,emoji:string,setId:StickerCollection,metric:keyof StickerStats,target:number,condition:string,href:string,action:string):StickerMilestone => ({
    ...milestone(`edition_${gradeId}_${key}`,`${name} · ${edition.name}`,emoji,setId,metric,target,condition,href,action,edition.tier),gradeId,
  });
  return [
    create('words','Ngôi sao ngôn ngữ','🌟','stars','words',10*g,`Luyện nói ${10*g} từ khác nhau.`,`/`,'Luyện từ'),
    create('ipa','Viên ngọc âm thanh','💎','magic','ipa',2*g,`Hoàn thành bài luyện của ${2*g} âm khác nhau.`,'/ipa','Luyện âm'),
    create('stories','Rồng đọc sách','🐉','magic','stories',2*g,`Hoàn thành bài tập của ${2*g} đoạn văn khác nhau.`,'/curriculum','Học bài đọc'),
    create('lessons','Tên lửa tri thức','🚀','explorers','lessons',2*g,`Hoàn thành bài đọc hoặc chặng luyện của ${2*g} chủ đề khác nhau.`,'/curriculum','Học theo chủ đề'),
    create('days','Vương miện chăm học','👑','stars','studyDays',7*g,`Có hoạt động học trong ${7*g} ngày khác nhau, không cần liên tiếp.`,'/','Học hôm nay'),
    create('stars','Cúp thành tựu','🏆','stars','stars',200*g,`Tích lũy ${200*g} sao từ các hoạt động học.`,'/','Luyện từ'),
  ];
}

export function stickerMilestonesForGrade(gradeId?:string):StickerMilestone[] {
  return [...STICKER_MILESTONES,...gradeStickerMilestones(gradeId)];
}

export function applyStickerRewards(progress:AppProgress,profileId:string,now = new Date().toISOString(),dueIpaReview = false,gradeId?:string):AppProgress {
  const existing = mergeStickers(progress.stickers,[]);
  const earned = new Set(existing.map(s => s.id));
  const {stats,studyDates} = stickerSummary(progress,profileId);
  if (dueIpaReview) stats.ipaReview = 1;
  const additions = stickerMilestonesForGrade(gradeId).filter(s => !earned.has(s.id) && stats[s.metric] >= s.target).map(s => {
    return {id:s.id,name:s.name,emoji:s.emoji,tier:s.tier,setId:s.setId,condition:s.condition,earnedAt:now,...(s.gradeId ? {gradeId:s.gradeId} : {})};
  });
  const sameDays = JSON.stringify(studyDates) === JSON.stringify(progress.stickerStudyDays ?? []);
  if (!additions.length && sameDays && existing.length === (progress.stickers ?? []).length) return progress;
  return {...progress,stickerStudyDays:studyDates,stickers:[...existing,...additions]};
}
export function milestoneProgress(milestone:StickerMilestone,stats:StickerStats) {
  return Math.min(milestone.target,Math.max(0,stats[milestone.metric]));
}
