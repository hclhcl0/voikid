import type {PronunciationResult} from '@/types';

export function recordingAttemptFor<T>(blob:T,previous:{blob:T;id:string}|null,newId:()=>string) {
  return previous?.blob===blob?previous:{blob,id:newId()};
}

export function canReassessRecording(result: Pick<PronunciationResult,'status'|'reason'> | null): boolean {
  return !result || result.status === 'service_error' ||
    (result.status === 'retry' && ['conflicting_evidence','uncertain_assessment'].includes(result.reason));
}

export function pronunciationResultTitle(result: Pick<PronunciationResult,'status'|'reason'>): string {
  if(result.status==='pass')return 'Con đọc rõ rồi!';
  if(result.status==='practice')return 'Mình luyện thêm một chút nhé';
  if(result.status==='service_error')return 'Chưa chấm được bản ghi';
  if(result.reason==='interference')return 'Có tiếng nói chen vào';
  if(['no_clear_speech','poor_recording'].includes(result.reason))return 'Cần kiểm tra bản thu';
  return 'AI chưa kết luận';
}
