'use client';

import { useBackendSession } from '@/hooks/useBackendSession';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { LearningSummary } from '@/components/learning/LearningSummary';
import { useProfileContext } from '@/context/ProfileContext';
import { CURRICULUM } from '@/lib/learning/curriculum';
import { dueVocabularyIds, sessionsFor } from '@/lib/learning/progress';
import { useAdminContext } from '@/context/AdminContext';
import {mergeIpaPractice} from '@/lib/ipa/practice';

export default function LearningReportPage() {
  const { account } = useAuth();
  const adminSession = useBackendSession();
  const ctx = useProfileContext();
  const { isAdmin, openAdminModal } = useAdminContext();
  const sessions = sessionsFor(ctx.progress.learningSessions, ctx.activeProfileId);
  const due = dueVocabularyIds(sessions);
  const reviewUnits = CURRICULUM.filter(u => u.vocabulary.some(v => due.includes(v.id)));
  const ipaRecords=Object.values(mergeIpaPractice(ctx.progress.ipaPractice,{},ctx.activeProfileId));
  if (!ctx.hydrated) return <p role="status" className="p-8">Đang mở báo cáo…</p>;
  if (account?.role === 'student') return <main className="p-8">Phần này dành cho phụ huynh. <Link href="/">Về học bài</Link></main>;
  if (!isAdmin && account?.role !== 'parent' && !adminSession.authenticated) return <main className="min-h-screen flex items-center justify-center p-6"><section className="rounded-2xl bg-white p-8 space-y-4 max-w-md"><h1 className="text-2xl font-bold">Báo cáo dành cho phụ huynh</h1><p>Mở bằng mã PIN phụ huynh hiện có.</p><button className="learning-button bg-orange-600 text-white" onClick={() => openAdminModal()}>Mở báo cáo</button><Link href="/curriculum" className="learning-button inline-flex bg-orange-50">Quay lại bài học</Link></section></main>;
  return <main className="learning-shell min-h-screen bg-orange-50 p-4 py-6"><div className="max-w-5xl mx-auto space-y-5">
    <header className="flex flex-wrap items-center justify-between gap-3"><Link href="/curriculum" className="learning-button bg-white">← Bài học</Link><button className="learning-button bg-white" onClick={ctx.openProfileModal}>{ctx.activeProfile.avatar} {ctx.activeProfile.name} · Đổi hồ sơ</button></header>
    <h1 className="text-3xl font-bold">Tiến độ đọc và luyện tập</h1><LearningSummary />
    <section className="rounded-2xl bg-white p-5 space-y-3"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold">Luyện âm IPA · {ipaRecords.length}/44 âm đã luyện</h2><Link href="/ipa" className="learning-button bg-orange-50 text-orange-700">Mở luyện âm</Link></div><p className="text-sm text-slate-600">Kết quả dưới đây là nghe chọn từ đúng ngay lần đầu. Phần đọc theo đã được bé xác nhận luyện tập, chưa phải đánh giá độ chính xác phát âm.</p>{ipaRecords.map(record=><div className="flex flex-wrap justify-between gap-2 border-t py-3" key={record.sound}><p className="font-bold">/{record.sound}/ · {record.firstTry.filter(Boolean).length}/2 câu nghe</p><p className="text-sm text-slate-500">Luyện {new Date(record.updatedAt).toLocaleDateString('vi-VN')} · Ôn {new Date(record.reviewDueAt).toLocaleDateString('vi-VN')}</p></div>)}{!ipaRecords.length&&<p className="text-slate-500">Chưa có bài luyện âm hoàn thành.</p>}</section>
    <section className="rounded-2xl bg-white p-5 space-y-3"><h2 className="text-xl font-bold">Gợi ý ôn tập cá nhân</h2><p className="text-sm text-slate-600">Mục cần hỗ trợ được ưu tiên. Mục tự làm được hẹn ôn ngày tiếp theo; chưa gắn nhãn Review chính khóa.</p>{reviewUnits.length ? reviewUnits.map(unit => <div key={unit.id} className="flex flex-wrap items-center justify-between gap-3 border-t py-3"><p>{unit.title} · {unit.vocabulary.filter(v => due.includes(v.id)).length} mục</p><Link className="learning-button bg-slate-50 text-orange-700" href={`/unit/${unit.id}`}>Mở bài & chọn Ôn</Link></div>) : <p>Chưa có mục đến hạn. Bắt đầu một chặng học để có kết quả.</p>}</section>
    <section className="rounded-2xl bg-white p-5 space-y-3"><h2 className="text-xl font-bold">Lịch sử lượt học</h2>{sessions.map(session => <div key={session.id} className="border-t py-3"><Link className="font-bold text-orange-700 underline" href={`/unit/${session.unitId}`}>{CURRICULUM.find(u => u.id === session.unitId)?.title ?? session.unitId}</Link><p className="text-sm text-slate-500">{new Date(session.updatedAt).toLocaleString('vi-VN')} · {session.completed ? 'Hoàn thành' : 'Đang học'} · Phiên bản {session.contentVersion}</p>{session.applicationResponse && <p className="mt-2 whitespace-pre-wrap">Bài viết chưa chấm: {session.applicationResponse}</p>}</div>)}{!sessions.length && <p>Chưa có lượt học mới.</p>}</section>
  </div></main>;
}
