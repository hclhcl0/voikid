'use client';

// =============================================
// Dạng 7: Nghe, nói và nghe lại giọng mình (Kèm Tùy Chọn AI Chấm Điểm)
// Nghe mẫu → ghi âm → nghe lại → nhờ AI nhận xét & chấm điểm.
// Mục tiêu: Luyện nói, tạo sự tự tin & chuẩn hóa phát âm
// =============================================

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Word, PronunciationResult } from '@/types';
import { useTTS } from '@/hooks/useTTS';
import { useSettings } from '@/hooks/useSettings';
import { useProfileContext } from '@/context/ProfileContext';
import confetti from 'canvas-confetti';
import { WordImage } from '@/components/WordImage';

interface Props {
  targetWord: Word;
  onAnswer: (correct: boolean, isFast: boolean) => void;
}

export function ExerciseListenRecordReview({ targetWord, onAnswer }: Props) {
  const { speak, isSpeaking } = useTTS();
  const { apiKey } = useSettings();
  const { recordAttempt } = useProfileContext();

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPlayingSelf, setIsPlayingSelf] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  // ── AI Evaluation States ──
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<PronunciationResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setRecordedAudioUrl(null);
    setRecordedBlob(null);
    setIsRecording(false);
    setIsPlayingSelf(false);
    setHasCompleted(false);
    setMicError(null);
    setAiResult(null);
    setAiError(null);

    // Auto-play model pronunciation when component opens
    const t = setTimeout(() => {
      speak(targetWord.en, 'en-US', 0.85);
    }, 300);
    return () => clearTimeout(t);
  }, [targetWord.id, speak]);

  const handlePlayModel = (slow = false) => {
    speak(targetWord.en, 'en-US', slow ? 0.6 : 0.85);
  };

  const handleStartRecording = async () => {
    setMicError(null);
    setAiResult(null);
    setAiError(null);
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicError('Trình duyệt không hỗ trợ micro trên trang này (cần HTTPS hoặc localhost).');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedBlob(audioBlob);
        setRecordedAudioUrl(url);
        setIsRecording(false);

        // Stop all tracks to release mic hardware
        stream.getTracks().forEach((track) => track.stop());

        // Encourage child
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#ec4899', '#f59e0b', '#10b981'],
        });
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Auto-stop recording after 4.5 seconds to prevent runaway recordings
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 4500);
    } catch (err) {
      console.warn('Microphone error:', err);
      setMicError('Chưa cấp quyền Micro. Vui lòng cho phép Micro trên trình duyệt để ghi âm giọng bé!');
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handlePlaySelf = () => {
    if (!recordedAudioUrl) return;
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }

    const audio = new Audio(recordedAudioUrl);
    audioElementRef.current = audio;
    setIsPlayingSelf(true);

    audio.onended = () => {
      setIsPlayingSelf(false);
    };

    audio.onerror = () => {
      setIsPlayingSelf(false);
    };

    audio.play().catch(() => setIsPlayingSelf(false));
  };

  // ── AI Evaluation Trigger ──
  const handleEvaluateWithAI = async () => {
    if (!recordedBlob) return;
    setAiLoading(true);
    setAiError(null);

    try {
      // 1. Convert Blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const res = reader.result as string;
          // Format: "data:audio/webm;base64,AAAA..." -> take content after comma
          const base64 = res.split(',')[1] || '';
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(recordedBlob);
      const audioBase64 = await base64Promise;

      // 2. Call /api/pronunciation
      const mimeType = recordedBlob.type || 'audio/webm';
      const res = await fetch('/api/pronunciation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64,
          mimeType,
          targetWord: targetWord.en,
          targetVi: targetWord.vi,
          phonetic: targetWord.phonetic,
          apiKey: apiKey || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (err.error === 'NO_API_KEY') {
          setAiError('Chưa có Gemini API Key. Bạn vào mục Cài đặt (⚙️) nhập key miễn phí để kích hoạt AI nhé!');
          setAiLoading(false);
          return;
        }
        throw new Error(err.message || `Lỗi máy chủ (${res.status})`);
      }

      const data = (await res.json()) as PronunciationResult;
      setAiResult(data);

      if (data.score && data.score >= 70) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#ec4899', '#6366f1'],
        });
      }
    } catch (e: any) {
      console.warn('AI evaluation error:', e);
      setAiError('Không thể kết nối AI. Kiểm tra internet hoặc API Key.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleComplete = () => {
    setHasCompleted(true);
    onAnswer(true, true);
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Header prompt */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-black mb-2">
          <span>🎙️</span> Dạng 7: Nghe, nói & nghe lại (Kèm AI)
        </span>
        <h3 className="text-base font-black text-gray-800">
          Nghe mẫu ➡️ Bé ghi âm ➡️ Nghe lại giọng mình!
        </h3>
      </div>

      {/* Target Word Card */}
      <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-rose-100 text-center flex flex-col items-center">
        <div className="mb-2 flex items-center justify-center">
          <WordImage word={targetWord} size="xl" />
        </div>
        <h2 className="font-andika font-black text-3xl text-rose-600 mb-1">
          {targetWord.en}
        </h2>
        <p className="text-xs font-mono text-gray-400 mb-1">{targetWord.phonetic}</p>
        <p className="text-xs text-gray-500 font-bold">
          🇻🇳 Nghĩa: <span className="text-gray-800">{targetWord.vi}</span>
        </p>
      </div>

      {/* Mic error warning if any */}
      {micError && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-800 font-semibold flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <span>⚠️</span>
            <span>{micError}</span>
          </div>
          <button
            type="button"
            onClick={handleComplete}
            className="self-end px-3 py-1.5 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-colors text-xs"
          >
            Bỏ qua câu nói & Tiếp tục →
          </button>
        </div>
      )}

      {/* Step Buttons */}
      <div className="space-y-2.5">
        {/* Step 1: Model voice */}
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePlayModel(false)}
            className={`flex-1 py-3 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border-2 transition-all ${
              isSpeaking
                ? 'bg-amber-400 text-amber-950 border-amber-400 scale-102 shadow-sm'
                : 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100'
            }`}
          >
            <span>🔊</span>
            <span>1. Nghe người bản xứ đọc</span>
          </motion.button>

          <button
            type="button"
            onClick={() => handlePlayModel(true)}
            className="py-3 px-3 rounded-2xl font-bold text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
            title="Nghe tốc độ chậm"
          >
            🐢 Chậm
          </button>
        </div>

        {/* Step 2: Record child's voice */}
        <div>
          {!isRecording ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleStartRecording}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-base shadow-md shadow-rose-200 flex items-center justify-center gap-2.5 hover:opacity-95 transition-all"
            >
              <span className="w-4 h-4 rounded-full bg-white animate-pulse" />
              <span>2. Nhấn vào đây để bé thu âm</span>
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleStopRecording}
              className="w-full py-4 rounded-2xl bg-red-600 text-white font-black text-base shadow-lg ring-4 ring-red-200 flex items-center justify-center gap-2.5 animate-pulse"
            >
              <span className="text-xl">⏹️</span>
              <span>Đang thu âm... (Bấm để DỪNG)</span>
            </motion.button>
          )}
        </div>

        {/* Fallback skip / complete after listening */}
        {!recordedAudioUrl && !isRecording && (
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleComplete}
              className="text-xs font-bold text-gray-400 hover:text-gray-600 underline py-1"
            >
              Bé đã luyện nói theo mẫu rồi? Bấm vào đây để tiếp tục →
            </button>
          </div>
        )}

        {/* Step 3: Listen back to child's voice & AI Scoring */}
        <AnimatePresence>
          {recordedAudioUrl && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-1 space-y-2.5"
            >
              {/* Playback self button */}
              <button
                type="button"
                onClick={handlePlaySelf}
                className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border-2 transition-all ${
                  isPlayingSelf
                    ? 'bg-emerald-400 text-emerald-950 border-emerald-400 scale-102 shadow-sm'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                }`}
              >
                <span>{isPlayingSelf ? '🔊' : '🎧'}</span>
                <span>3. Nghe lại giọng bé vừa nói {isPlayingSelf ? '(Đang phát...)' : ''}</span>
              </button>

              {/* 🤖 Button: Ask AI to evaluate */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handleEvaluateWithAI}
                disabled={aiLoading}
                className="w-full py-3.5 px-4 rounded-2xl font-black text-sm bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-100 flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50 transition-all"
              >
                {aiLoading ? (
                  <>
                    <span className="animate-spin text-lg">⏳</span>
                    <span>Cô Giáo AI đang nghe và chấm điểm...</span>
                  </>
                ) : (
                  <>
                    <span className="text-lg">🤖</span>
                    <span>Nhờ Cô Giáo AI Chấm Điểm & Nhận Xét</span>
                  </>
                )}
              </motion.button>

              {/* AI Error Warning */}
              {aiError && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-800 font-semibold flex items-start gap-2">
                  <span>💡</span>
                  <span>{aiError}</span>
                </div>
              )}

              {/* 🌟 AI Result Card Display */}
              {aiResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl p-4 border-2 border-violet-200 shadow-md space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-violet-700 flex items-center gap-1">
                      <span>🤖</span> Nhận xét từ Cô Giáo AI:
                    </span>
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <span className="text-amber-500 font-black text-sm">
                        ⭐ {aiResult.score ?? 85} điểm
                      </span>
                    </div>
                  </div>

                  {/* Feedback text */}
                  {aiResult.feedbackVi && (
                    <div className="bg-violet-50/70 rounded-2xl p-3 text-xs text-violet-900 font-bold leading-relaxed border border-violet-100">
                      💬 "{aiResult.feedbackVi}"
                    </div>
                  )}

                  {/* AI reason / guidance */}
                  {aiResult.reason && (
                    <div className="text-[11px] font-bold text-gray-600 flex items-center gap-1.5">
                      <span>🎯</span>
                      <span>Đánh giá: <strong>{aiResult.reason}</strong></span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Action buttons: Retry or Finish */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="flex-1 py-2.5 rounded-2xl font-bold text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                >
                  🔄 Luyện lại lần nữa
                </button>
                <button
                  type="button"
                  onClick={handleComplete}
                  className="flex-1 py-2.5 rounded-2xl font-black text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  ⭐ Tuyệt vời! Hoàn thành
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
