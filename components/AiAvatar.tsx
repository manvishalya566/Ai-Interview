import React, { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle, memo } from 'react';

interface TalkingHeadAvatarProps {
  avatarUrl?: string;
  voice?: string;
  apiEndpoint?: string;
  initialText?: string;
  onSpeakStart?: () => void;
  onSpeakEnd?: () => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface TalkingHeadHandle {
  speak: (text: string) => Promise<void>;
  setMood: (mood: string) => void;
  playGesture: (name: string, dur?: number) => void;
  lookAtCamera: (duration?: number) => void;
  stop: () => void;
  isSpeaking: boolean;
  error: string | null;
}

interface TTSResponse {
  audio: string;
  words: string[];
  wtimes: number[];
  wdurations: number[];
  audioFormat: string;
  error?: string;
}

declare global {
  interface Window {
    TalkingHead: any;
  }
}

const speechCache = new Map<string, TTSResponse>()

const TalkingHeadAvatarInner = forwardRef<TalkingHeadHandle, TalkingHeadAvatarProps>(({
  avatarUrl = 'https://met4citizen.github.io/TalkingHead/avatars/avaturn.glb',
  voice = 'en-IN-NeerjaExpressiveNeural',
  apiEndpoint = '/api/synthesize',
  initialText,
  onSpeakStart,
  onSpeakEnd,
  onError,
  className = '',
  style = {},
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<any>(null);
  const speakingRef = useRef(false);
  const errorRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTalkingHead = useCallback(async () => {
    if (window.TalkingHead) {
      return window.TalkingHead;
    }

    return new Promise<any>((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.textContent = `
        import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
        import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
        import { TalkingHead } from "https://cdn.jsdelivr.net/gh/met4citizen/TalkingHead@1.7/modules/talkinghead.mjs";

        const origParse = GLTFLoader.prototype.parse;
        GLTFLoader.prototype.parse = function(...args) {
          this.setMeshoptDecoder(MeshoptDecoder);
          return origParse.apply(this, args);
        };

        window.TalkingHead = TalkingHead;
        window.dispatchEvent(new Event('talkinghead-loaded'));
      `;
      window.addEventListener('talkinghead-loaded', () => {
        resolve(window.TalkingHead);
      }, { once: true });
      script.onerror = () => reject(new Error('Failed to load TalkingHead script'));
      document.head.appendChild(script);
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const TalkingHead = await loadTalkingHead();

        if (!mounted || !containerRef.current) return;

        headRef.current = new TalkingHead(containerRef.current, {
          lipsyncModules: ['en'],
          cameraView: 'upper',
          cameraRotateEnable: false,
          cameraPanEnable: false,
          cameraZoomEnable: false,
        });

        await headRef.current.showAvatar({
          url: avatarUrl,
          body: 'F',
          avatarMood: 'neutral',
          modelRoot: 'Hips',
        });

        if (mounted) {
          setIsLoading(false);
          setError(null);

          if (initialText) {
            await speak(initialText);
          }
        }
      } catch (err) {
        if (mounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to initialize avatar';
          setError(errorMessage);
          setIsLoading(false);
          onError?.(err instanceof Error ? err : new Error(errorMessage));
        }
      }
    };

    init();

    return () => {
      mounted = false;
      if (headRef.current) {
        try {
          headRef.current.dispose();
        } catch {
          headRef.current.stop();
        }
        headRef.current = null;
      }
      if (containerRef.current) {
        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
          const gl = canvas.getContext('webgl2');
          if (gl) {
            try { gl.getExtension('WEBGL_lose_context')?.loseContext(); } catch {}
          }
          canvas.remove();
        }
      }
    };
  }, [avatarUrl, loadTalkingHead, initialText, onError]);

  const playAudio = useCallback(async (data: TTSResponse) => {
    const th = headRef.current;
    if (!th) return;

    const audioBytes = Uint8Array.from(atob(data.audio), c => c.charCodeAt(0));
    const audioBlob = new Blob([audioBytes], { type: 'audio/mpeg' });
    const arrayBuffer = await audioBlob.arrayBuffer();

    if (!headRef.current) return;
    const audioBuffer = await headRef.current.audioCtx.decodeAudioData(arrayBuffer);

    th.speakAudio({
      audio: audioBuffer,
      words: (data.words || []).map(w => w ?? ''),
      wtimes: data.wtimes,
      wdurations: data.wdurations,
    });

    let count = 0;
    const check = setInterval(() => {
      const current = headRef.current;
      if (++count > 120 || !current || current.stateName === 'idle') {
        clearInterval(check);
        speakingRef.current = false;
        setIsSpeaking(false);
        onSpeakEnd?.();
      }
    }, 500);
  }, [onSpeakEnd])

  const speak = useCallback(async (text: string) => {
    if (!headRef.current || speakingRef.current) return;

    const th = headRef.current;
    if (th.isSpeaking) {
      th.stopSpeaking();
    }

    speakingRef.current = true;
    setIsSpeaking(true);
    onSpeakStart?.();

    try {
      const cacheKey = `${voice}:${text}`
      const cached = speechCache.get(cacheKey)

      if (cached) {
        await playAudio(cached)
        return
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const data: TTSResponse = await response.json();

      if (data.error) throw new Error(data.error);
      if (!data.audio) throw new Error('API response missing audio data');

      speechCache.set(cacheKey, data)

      await playAudio(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to speak';
      errorRef.current = errorMessage;
      setError(errorMessage);
      speakingRef.current = false;
      setIsSpeaking(false);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    }
  }, [apiEndpoint, voice, onSpeakStart, onSpeakEnd, onError, playAudio]);

  const setMood = useCallback((mood: string) => {
    headRef.current?.setMood(mood);
  }, []);

  const playGesture = useCallback((name: string, dur = 3) => {
    headRef.current?.playGesture(name, dur);
  }, []);

  const lookAtCamera = useCallback((duration = 500) => {
    headRef.current?.lookAtCamera(duration);
  }, []);

  const stop = useCallback(() => {
    const th = headRef.current;
    if (th) {
      th.stopSpeaking();
    }
    speakingRef.current = false;
    setIsSpeaking(false);
  }, []);

  useImperativeHandle(ref, () => ({
    speak,
    setMood,
    playGesture,
    lookAtCamera,
    stop,
    get isSpeaking() { return speakingRef.current; },
    get error() { return errorRef.current; },
  }), [speak, setMood, playGesture, lookAtCamera, stop]);

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    background: '#111',
    ...style,
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={containerStyle}
    >
      {isLoading && (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: 'Arial, sans-serif',
        }}>Loading avatar...</div>
      )}
      {error && (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff6b6b',
          fontFamily: 'Arial, sans-serif',
        }}>Error: {error}</div>
      )}
    </div>
  );
});

export const TalkingHeadAvatar = memo(TalkingHeadAvatarInner);
export default TalkingHeadAvatar;
