// =============================================
// VocaKids – useAudioRecorder Hook
// Ghi âm với Voice Activity Detection (VAD)
// =============================================

'use client';

import { defaultPronunciationSettings, type PronunciationSettings } from '@/lib/pronunciation/settings';
import { frameQuality, recordingProblem } from '@/lib/pronunciation/audioQuality';
import { useCallback, useEffect, useRef, useState } from 'react';

export type RecorderStatus = 'idle' | 'requesting' | 'recording' | 'processing' | 'error';

interface UseAudioRecorderReturn {
  status: RecorderStatus;
  audioBlob: Blob | null;
  audioBase64: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecorder: () => void;
  error: string | null;
  inputLevel: number;
  hasServerKey: boolean;
}

const SILENCE_THRESHOLD = 0.01;   // RMS below this = silence

export function useAudioRecorder(taskKind: 'word' | 'sentence' = 'word'): UseAudioRecorderReturn {
  const configRef = useRef<PronunciationSettings>(defaultPronunciationSettings);
  const qualityRef = useRef({ speechMs: 0, clipped: 0, frames: 0 });
  const [inputLevel, setInputLevel] = useState(0);
  const [hasServerKey,setHasServerKey] = useState(false);
  useEffect(() => { const controller = new AbortController(); fetch('/api/pronunciation/config', { signal: controller.signal, cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(data => { if (data) { configRef.current = data; setHasServerKey(data.hasServerKey === true); } }).catch(() => {}); return () => controller.abort(); }, []);
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
  const audioContextRef = useRef<AudioContext | null>(null);
  const mountedRef = useRef(true);
  const generationRef = useRef(0);

  const cleanup = useCallback(() => {
    if (silenceTimerRef.current)  clearTimeout(silenceTimerRef.current);
    if (maxTimerRef.current)      clearTimeout(maxTimerRef.current);
    if (animFrameRef.current)     cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current)        streamRef.current.getTracks().forEach((t) => t.stop());
    if (audioContextRef.current) void audioContextRef.current.close().catch(() => {});
    audioContextRef.current = null;
    silenceTimerRef.current = null;
    maxTimerRef.current     = null;
    animFrameRef.current    = null;
    streamRef.current       = null;
  }, []);

  useEffect(() => {
    const generationCounter = generationRef;
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      generationCounter.current++;
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = null;
        if (mediaRecorderRef.current.state === 'recording') mediaRecorderRef.current.stop();
      }
      cleanup();
    };
  }, [cleanup]);

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

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (maxTimerRef.current) clearTimeout(maxTimerRef.current);
  }, []);

  const startRecording = useCallback(async () => {
    const generation = ++generationRef.current;
    setError(null);
    setAudioBlob(null);
    setBase64(null);
    chunksRef.current = [];
    qualityRef.current = { speechMs: 0, clipped: 0, frames: 0 };
    setInputLevel(0);
    const config = configRef.current;
    window.speechSynthesis?.cancel();
    document.querySelectorAll('audio').forEach(audio => audio.pause());

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
      if (!mountedRef.current || generation !== generationRef.current) { stream.getTracks().forEach(t => t.stop()); return; }
      streamRef.current = stream;

      // Set up Web Audio analyser for VAD (supporting Safari webkitAudioContext)
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      audioContextRef.current = audioCtx;
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      if (!mountedRef.current || generation !== generationRef.current) { stream.getTracks().forEach(t => t.stop()); void audioCtx.close().catch(() => {}); return; }
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
        if (!mountedRef.current || generation !== generationRef.current) return;
        cleanup();
        setInputLevel(0);
        const quality = qualityRef.current;
        const problem = recordingProblem(quality.speechMs, quality.clipped / Math.max(1,quality.frames), config.minSpeechMs);
        if (problem) { setError(problem); setStatus('error'); return; }
        setStatus('processing');
        const blob   = new Blob(chunksRef.current, { type: actualMime });
        let b64: string;
        try { b64 = await blobToBase64(blob); } catch { if (mountedRef.current && generation === generationRef.current) { setError('Không đọc được bản ghi. Hãy thu lại.'); setStatus('error'); } return; }
        if (!mountedRef.current || generation !== generationRef.current) return;
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
      const MAX_WAIT_TO_SPEAK = config.waitForSpeechMs;
      let noiseFloor = 0.004;
      let previousFrame = startTime;
      let lastMeter = startTime;

      const vadLoop = () => {
        analyser.getByteTimeDomainData(dataArr);
        const { rms, clippedFraction } = frameQuality(dataArr);
        const now = Date.now();
        const elapsed = Math.min(100,now - previousFrame); previousFrame = now;
        if (!hasSpoken && now - startTime < 350 && rms < SPEECH_THRESHOLD) noiseFloor = 0.9 * noiseFloor + 0.1 * rms;
        const speechThreshold = config.adaptiveVad ? Math.min(0.08, Math.max(0.012,noiseFloor * 3)) : SPEECH_THRESHOLD;
        const silenceThreshold = config.adaptiveVad ? Math.max(0.006,noiseFloor * 1.8) : SILENCE_THRESHOLD;
        if (rms >= speechThreshold) qualityRef.current.speechMs += elapsed;
        qualityRef.current.clipped += clippedFraction; qualityRef.current.frames++;
        if (now-lastMeter >= 120) { setInputLevel(Math.min(1,rms*8)); lastMeter=now; }

        if (!hasSpoken) {
          if (rms >= speechThreshold) {
            hasSpoken = true;
          } else if (Date.now() - startTime > MAX_WAIT_TO_SPEAK) {
            // Hết thời gian chờ mà chưa phát hiện tiếng nói.
            stopRecording();
            return;
          }
        } else {
          // User already spoke at least once, now monitor trailing silence
          if (rms < silenceThreshold) {
            if (!silenceAfterSpeechStart) {
              silenceAfterSpeechStart = Date.now();
            } else if (Date.now() - silenceAfterSpeechStart > config.silenceDurationMs) {
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

      // Giới hạn thời lượng riêng cho từ và câu.
      maxTimerRef.current = setTimeout(() => stopRecording(), taskKind === 'sentence' ? config.sentenceDurationMs : config.wordDurationMs);

    } catch (err: unknown) {
      if (!mountedRef.current || generation !== generationRef.current) return;
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
  }, [cleanup, stopRecording, taskKind]);

  const resetRecorder = useCallback(() => {
    generationRef.current++;
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = null;
      if (mediaRecorderRef.current.state === 'recording') mediaRecorderRef.current.stop();
    }
    cleanup();
    setStatus('idle');
    setAudioBlob(null);
    setBase64(null);
    setError(null);
    chunksRef.current = [];
    setInputLevel(0);
  }, [cleanup]);

  return { status, audioBlob, audioBase64, startRecording, stopRecording, resetRecorder, error, inputLevel, hasServerKey };
}
