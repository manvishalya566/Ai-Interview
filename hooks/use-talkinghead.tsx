import { useCallback, useRef, useState } from 'react';

interface UseTalkingHeadOptions {
  apiEndpoint?: string;
  voice?: string;
  onSpeakStart?: () => void;
  onSpeakEnd?: () => void;
  onError?: (error: Error) => void;
}

interface UseTalkingHeadReturn {
  speak: (text: string) => Promise<void>;
  setMood: (mood: string) => void;
  lookAtCamera: (duration?: number) => void;
  stop: () => void;
  isSpeaking: boolean;
  error: string | null;
  headRef: React.RefObject<any>;
}

export function useTalkingHead(
  headRef: React.RefObject<any>,
  options: UseTalkingHeadOptions = {}
): UseTalkingHeadReturn {
  const {
    apiEndpoint = '/v1/synthesize',
    voice = 'en-IN-NeerjaExpressiveNeural',
    onSpeakStart,
    onSpeakEnd,
    onError,
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const speak = useCallback(async (text: string) => {
    const head = headRef.current;
    if (!head || isSpeaking) return;

    try {
      setIsSpeaking(true);
      setError(null);
      onSpeakStart?.();

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const audioBytes = Uint8Array.from(atob(data.audio), c => c.charCodeAt(0));
      const audioBlob = new Blob([audioBytes], { type: 'audio/mpeg' });
      const arrayBuffer = await audioBlob.arrayBuffer();

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

      head.speakAudio({
        audio: audioBuffer,
        words: data.words,
        wtimes: data.wtimes,
        wdurations: data.wdurations,
      });

      head.speechQueue.push({ break: 1000 });
      head.startSpeaking();

      const checkQueue = setInterval(() => {
        if (!head || head.speechQueue.length === 0) {
          clearInterval(checkQueue);
          setIsSpeaking(false);
          onSpeakEnd?.();
        }
      }, 500);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to speak';
      setError(errorMessage);
      setIsSpeaking(false);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    }
  }, [apiEndpoint, voice, onSpeakStart, onSpeakEnd, onError, isSpeaking]);

  const setMood = useCallback((mood: string) => {
    headRef.current?.setMood(mood);
  }, []);

  const lookAtCamera = useCallback((duration = 500) => {
    headRef.current?.lookAtCamera(duration);
  }, []);

  const stop = useCallback(() => {
    headRef.current?.stop();
    setIsSpeaking(false);
  }, []);

  return {
    speak,
    setMood,
    lookAtCamera,
    stop,
    isSpeaking,
    error,
    headRef,
  };
}

export default useTalkingHead;