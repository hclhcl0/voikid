'use client';

// =============================================
// Dạng 7: Nghe, nói và nghe lại giọng mình
// Nghe mẫu → ghi âm → nghe lại → luyện lần nữa.
// Mục tiêu: Luyện nói, tạo sự tự tin
// =============================================

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Word } from '@/types';
import { useTTS } from '@/hooks/useTTS';
import confetti from 'canvas-confetti';

interface Props {
  targetWord: Word;
  onAnswer: (correct: boolean, isFast: boolean) => void;
}

export function ExerciseListenRecordReview({ targetWord, onAnswer }: Props) {
  const { speak, isSpeaking } = useTTS();

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingSelf, setIsPlayingSelf] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setRecordedAudioUrl(null);
    setIsRecording(false);
    setIsPlayingSelf(false);
    setHasCompleted(false);
    setMicError(null);

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

  const handleComplete = () => {
    setHasCompleted(true);
    onAnswer(true, true);
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Header prompt */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-black mb-2">
          <span>🎙️</span> Dạng 7: Nghe, nói và nghe lại giọng mình
        </span>
        <h3 className="text-base font-black text-gray-800">
          Nghe mẫu ➡️ Bé ghi âm ➡️ Nghe lại giọng mình!
        </h3>
      </div>

      {/* Target Word Card */}
      <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-rose-100 text-center">
        <span className="text-7xl block mb-2 select-none">{targetWord.emoji}</span>
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
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-800 font-semibold flex items-start gap-2">
          <span>⚠️</span>
          <span>{micError}</span>
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

        {/* Step 3: Listen back to child's voice */}
        <AnimatePresence>
          {recordedAudioUrl && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-1 space-y-2"
            >
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

              <div className="flex gap-2">
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
