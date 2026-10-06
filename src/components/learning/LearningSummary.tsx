'use client';

import Link from 'next/link';
import { useProfileContext } from '@/context/ProfileContext';
import { CURRICULUM, curriculumForCategories } from '@/lib/learning/curriculum';
import { currentSessions, dueVocabularyIds, sessionsFor, skillReport } from '@/lib/learning/progress';
import { useVocabularyCatalog } from '@/hooks/useVocabularyCatalog';
import type { Grade } from '@/lib/learning/types';
import {storySource} from '@/lib/stories/source';
import {BAND_LABELS,validStorySession} from '@/lib/stories/learning';

export function LearningEntry() {
  const { categories } = useVocabularyCatalog();
  const curriculum = curriculumForCategories(categories);
  const ctx = useProfileContext();
  const stories=Object.values(ctx.progress.storySessions??{}).filter(s=>validStorySession(s,ctx.activeProfileId)).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
  const number = Number(ctx.activeProfile.gradeId.replace('lop', ''));
  const grade = ([1, 2, 3, 4, 5].includes(number) ? number : 1) as Grade;
  const resume=stories.find(s=>!s.completed&&curriculum.some(u=>u.id===s.unitId&&u.grade===grade));
  const unit = curriculum.find(u => u.id === resume?.unitId&&u.grade===grade) ?? curriculum.find(u => u.grade === grade && storySource(u));
  if (!unit) return <Link className="learning-button border bg-white" href="/curriculum">Chọn bài đọc →</Link>;
  return <section className="rounded-2xl border border-slate-200 bg-orange-50 p-5 sm:p-7 space-y-3">
    <p className="text-xs font-bold text-orange-700">HỌC THEO ĐOẠN VĂN · LỚP {grade}</p><h2 className="text-xl font-extrabold text-slate-900">{resume ? 'Tiếp tục bài đang đọc' : 'Đọc một câu chuyện, học cả chủ đề'}</h2><p className="text-slate-600">Unit {unit.order} · {storySource(unit)?.topic}</p>
    <div className="flex flex-wrap gap-2"><Link className="learning-button bg-orange-600 text-white hover:bg-orange-700" href={`/unit/${unit.id}`}>{resume ? 'Tiếp tục học →' : 'Bắt đầu học →'}</Link><Link className="learning-button border border-slate-200 bg-white text-slate-700" href={`/curriculum?grade=${grade}`}>Chọn bài học</Link></div>
    <p className="text-xs text-slate-500">AI tạo đoạn văn từ mẫu câu SGK, điều chỉnh độ hỗ trợ theo kết quả học của con.</p>
  </section>;
}

export function LearningSummary() {
  const ctx = useProfileContext();
  const sessions = sessionsFor(ctx.progress.learningSessions, ctx.activeProfileId);
  const report = skillReport(sessions);
  const due = dueVocabularyIds(sessions);
  const current = currentSessions(sessions)[0];
  const stories=Object.values(ctx.progress.storySessions??{}).filter(s=>validStorySession(s,ctx.activeProfileId)).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
    <h2 className="text-xl font-bold">Tiến độ học qua đoạn văn</h2><p className="text-sm text-slate-600">{stories.filter(s=>s.completed).length} bài hoàn thành · {stories.filter(s=>s.listened).length} bài đã nghe · {stories.filter(s=>s.speakingPracticed).length} bài đã đọc theo (chưa chấm).</p>
    {stories.map(s=><article className="rounded-xl bg-slate-50 p-4" key={s.id}><Link className="font-bold text-orange-800" href={`/unit/${s.unitId}`}>{s.lesson.title}</Link><p className="mt-1 text-xs text-slate-500">Lớp {s.lesson.grade} · {BAND_LABELS[s.lesson.band]} · {s.completed?'Đã hoàn thành':'Đang học'} · {new Date(s.updatedAt).toLocaleDateString('vi-VN')}</p><p className="mt-2 text-sm">Câu hỏi hiểu bài tự làm đúng lần đầu: {s.lesson.questions.filter(q=>s.answers[`quiz:${q.id}`]?.firstCorrect&&!s.answers[`quiz:${q.id}`]?.supported).length}/{s.lesson.questions.length}</p></article>)}
    <div className="flex flex-wrap justify-between gap-2"><h2 className="text-xl font-bold">Kỹ năng trong chặng luyện mới</h2><Link className="learning-button bg-slate-50 text-orange-700" href="/learning-report">Báo cáo & ôn tập →</Link></div>
    <p className="text-sm text-slate-600">{current ? `Bài hiện tại: ${CURRICULUM.find(u => u.id === current.unitId)?.title ?? current.unitId}` : 'Chưa có chặng đang học.'} · {due.length} từ/cụm từ cần ôn.</p>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{report.filter(r => !['speaking', 'application'].includes(r.skill)).map(r => <div key={r.skill} className="rounded-2xl bg-slate-50 p-4"><h3 className="font-bold">{r.label}</h3><p className="text-sm mt-2">Tự làm được: {r.independent}</p><p className="text-sm">Có hỗ trợ: {r.supported} · Cần ôn: {r.needsReview}</p></div>)}</div>
    <p className="text-sm">Vận dụng: {sessions.filter(s => s.applicationCompleted).length} lượt thực hành chưa chấm. Nói: {sessions.filter(s => s.speakingPracticed).length} lượt tự ghi nhận chưa chấm.</p>
    <p className="text-xs text-slate-500">Đúng độc lập = đúng lần đầu, không gợi ý và không xem đáp án. Báo cáo tách khỏi sao thưởng và chỉ tổng hợp chặng học mới của hồ sơ đang chọn.</p>
  </section>;
}
