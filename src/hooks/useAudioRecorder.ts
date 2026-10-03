// =============================================
// VocaKids – useAudioRecorder Hook
// Ghi âm với Voice Activity Detection (VAD)
// =============================================

'use client';

import { useCallback, useRef, useState } from 'react';

export type RecorderStatus = 'idle' | 'requesting' | 'recording' | 'processing' | 'error';

interface UseAudioRecorderReturn {
  status: RecorderStatus;
  audioBlob: Blob | null;
  audioBase64: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecorder: () => void;
  error: string | null;
}

const SILENCE_THRESHOLD = 0.01;   // RMS below this = silence
const SILENCE_DURATION  = 1500;   // ms of silence → auto-stop
const MAX_DURATION      = 8000;   // max recording ms

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [status, setStatus]         = useState<RecorderStatus>('idle');
  const [audioBlob, setAudioBlob]   = useState<Blob | null>(null);
  const [audioBase64, setBase64]    = useState<string | null>(null);
  const [error, setError]           = useState<string | null>(null);

  const mediaRecorderRef  = useRef<MediaRecorder | null>(null);
  const chunksRef         = useRef<Blob[]>([]);
  const streamRef         = useRef<MediaStream | null>(null);
  const analyserRef       = useRef<AnalyserNode | null>(null);
  const silenceTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimerRef       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animFrameRef      = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (silenceTimerRef.current)  clearTimeout(silenceTimerRef.current);
    if (maxTimerRef.current)      clearTimeout(maxTimerRef.current);
    if (animFrameRef.current)     cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current)        streamRef.current.getTracks().forEach((t) => t.stop());
    silenceTimerRef.current = null;
    maxTimerRef.current     = null;
    animFrameRef.current    = null;
    streamRef.current       = null;
  }, []);

  const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Strip the data:xxx;base64, prefix
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const startRecording = useCallback(async () => {
    setError(null);
    setAudioBlob(null);
    setBase64(null);
    chunksRef.current = [];

    try {
      setStatus('requesting');

      if (typeof window !== 'undefined' && !window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        throw new Error('INSECURE_CONTEXT');
      }

      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error('NO_MEDIA_DEVICES');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: false, // Không khử ồn thô bạo để giữ trọn âm gió /s/ và âm bật /t/
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Set up Web Audio analyser for VAD (supporting Safari webkitAudioContext)
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      const source   = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Choose best MIME type supported by browser (iOS Safari supports audio/mp4)
      let mimeType = '';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/aac')) {
          mimeType = 'audio/aac';
        }
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      const actualMime = recorder.mimeType || mimeType || 'audio/webm';
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        cleanup();
        setStatus('processing');
        const blob   = new Blob(chunksRef.current, { type: actualMime });
        const b64    = await blobToBase64(blob);
        setAudioBlob(blob);
        setBase64(b64);
        setStatus('idle');
      };

      recorder.start(100); // collect data every 100ms
      setStatus('recording');

      // VAD loop: Wait for speech first, then detect end-of-speech silence
      const dataArr = new Uint8Array(analyser.fftSize);
      const startTime = Date.now();
      let hasSpoken = false;
      let silenceAfterSpeechStart: number | null = null;
      const SPEECH_THRESHOLD = 0.018; // RMS above this means child/user has started speaking
      const MAX_WAIT_TO_SPEAK = 4500; // Allow child up to 4.5 seconds to start reading

      const vadLoop = () => {
        analyser.getByteTimeDomainData(dataArr);
        let sum = 0;
        for (const v of dataArr) sum += Math.abs(v / 128 - 1);
        const rms = sum / dataArr.length;

        if (!hasSpoken) {
          if (rms >= SPEECH_THRESHOLD) {
            hasSpoken = true;
          } else if (Date.now() - startTime > MAX_WAIT_TO_SPEAK) {
            // Waited 4.5s without any speech -> auto stop
            stopRecording();
            return;
          }
        } else {
          // User already spoke at least once, now monitor trailing silence
          if (rms < SILENCE_THRESHOLD) {
            if (!silenceAfterSpeechStart) {
              silenceAfterSpeechStart = Date.now();
            } else if (Date.now() - silenceAfterSpeechStart > SILENCE_DURATION) {
              stopRecording();
              return;
            }
          } else {
            silenceAfterSpeechStart = null;
          }
        }
        animFrameRef.current = requestAnimationFrame(vadLoop);
      };
      animFrameRef.current = requestAnimationFrame(vadLoop);

      // Hard cap: stop after MAX_DURATION
      maxTimerRef.current = setTimeout(() => stopRecording(), MAX_DURATION);

    } catch (err: unknown) {
      cleanup();
      const errorObj = err as { name?: string; message?: string };
      if (errorObj?.message === 'INSECURE_CONTEXT' || errorObj?.message === 'NO_MEDIA_DEVICES') {
        setError('Trình duyệt điện thoại yêu cầu kết nối HTTPS bảo mật để bật Micro! Hãy dùng link HTTPS.');
      } else if (errorObj?.name === 'NotAllowedError' || errorObj?.name === 'PermissionDeniedError') {
        setError('Bạn chưa cấp quyền Micro! Nhấn vào biểu tượng Cài đặt trang/Khóa trên thanh địa chỉ để Bật Micro.');
      } else {
        setError('Không thể truy cập microphone. Vui lòng kiểm tra quyền thiết bị!');
      }
      setStatus('error');
      console.error('[AudioRecorder]', err);
    }
  }, [cleanup]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (maxTimerRef.current) clearTimeout(maxTimerRef.current);
  }, []);

  const resetRecorder = useCallback(() => {
    cleanup();
    setStatus('idle');
    setAudioBlob(null);
    setBase64(null);
    setError(null);
    chunksRef.current = [];
  }, [cleanup]);

  return { status, audioBlob, audioBase64, startRecording, stopRecording, resetRecorder, error };
}
