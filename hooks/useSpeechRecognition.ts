import { useState, useEffect, useRef, useCallback } from 'react';

// FIX: Add type definitions for the Web Speech API to resolve TypeScript errors.
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

type SpeechRecognitionConstructor = new () => SpeechRecognition;

// For cross-browser compatibility
// FIX: Cast `window` to `any` to access non-standard SpeechRecognition properties and apply the constructor type.
const SpeechRecognition: SpeechRecognitionConstructor | undefined =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const hasSupport = !!SpeechRecognition;

  useEffect(() => {
    if (!hasSupport) {
      console.warn('SpeechRecognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false; // We only care about the final result
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const newTranscript = event.results[event.results.length - 1][0].transcript;
      setTranscript(newTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    // This is called when recognition ends naturally or is stopped.
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [hasSupport]);

  const handleListen = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setTranscript(''); // Clear previous transcript before starting
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  return {
    isListening,
    transcript,
    handleListen,
    hasSupport,
  };
};
