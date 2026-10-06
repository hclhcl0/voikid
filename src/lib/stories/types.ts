export type ReadingBand = 'support' | 'standard' | 'challenge';
export interface StorySource { grade:number; number:number; topic:string; patterns:string[] }
export interface StoryLesson {
  id:string; unitId:string; grade:number; band:ReadingBand; title:string; generatedAt:string;
  origin?:'ai'|'manual'; originalText?:string;
  vocabularyScannedAt?:string;
  sourceVersion:number; variant?:number; topic:string; patterns:string[];
  sentences:{id:string; en:string; vi:string; patternIndexes:number[]}[];
  vocabulary:{id:string; en:string; vi:string; ipa:string; sentenceId:string}[];
  questions:{id:string; en:string; vi:string; options:string[]; answerIndex:number; sentenceId:string; explanationVi:string}[];
}
export interface StoryAnswer { response:string; attempts:number; firstCorrect:boolean; correct:boolean; supported:boolean }
export interface StorySession {
  id:string; profileId:string; unitId:string; lesson:StoryLesson; updatedAt:string;
  savedAt?:string;
  read:boolean; listened:boolean; speakingPracticed:boolean; completed:boolean;
  answers:Record<string,StoryAnswer>;
}
export interface ReadingEvidence { total:number; independent:number }
