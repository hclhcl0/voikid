import type {AppProgress,WordProgress} from '@/types';

export function dailyWordStatus(progress?:WordProgress) {
  const isLearned=!!progress?.dailyLearnedAt||(progress?.stars??0)>0;
  const isSpoken=!!progress?.lastPronunciationAttemptId&&(progress.consecutivePasses??0)>0;
  return {isLearned,isSpoken,isCompleted:isLearned&&isSpoken};
}

/** A child's self-report is learning evidence, never an AI pronunciation pass. */
export function markDailyWordLearned(progress:AppProgress,catId:string,wordId:string,now=new Date().toISOString()):AppProgress {
  const key=`${catId}:${wordId}`;
  const old=progress.wordProgress[key]??{catId,wordId,stars:0,attempts:0,bestScore:0,lastPracticed:''};
  if(old.dailyLearnedAt)return progress;
  return {...progress,wordProgress:{...progress.wordProgress,[key]:{...old,dailyLearnedAt:now}}};
}
