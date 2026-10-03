'use client';

// Redirect old quiz URL to new 8-exercise test & practice suite
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function QuizRedirectPage() {
  const params = useParams<{ catId: string }>();
  const router = useRouter();

  useEffect(() => {
    if (params.catId) {
      router.replace(`/test/${params.catId}`);
    } else {
      router.replace('/');
    }
  }, [params.catId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50">
      <div className="text-center">
        <div className="text-6xl animate-bounce mb-3">🎯</div>
        <p className="text-violet-600 font-bold">Đang mở 8 Dạng Bài Tập Cho Bé…</p>
      </div>
    </div>
  );
}
