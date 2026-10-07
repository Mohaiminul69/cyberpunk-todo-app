import { useEffect, useRef, useState } from "react";

// Minimal Web Speech API typings — not included in TypeScript's DOM lib
interface SpeechRecognitionResultEvent {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

const SpeechRecognitionApi: SpeechRecognitionConstructor | undefined =
  (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor })
    .SpeechRecognition ??
  (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionConstructor })
    .webkitSpeechRecognition;

export const isSpeechSupported = Boolean(SpeechRecognitionApi);

/** Calls onTranscript with each finalized chunk of speech while listening. */
export const useSpeechToText = (onTranscript: (transcript: string) => void) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  });

  useEffect(() => {
    if (!SpeechRecognitionApi) return;

    const recognition = new SpeechRecognitionApi();
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalTranscript += result[0].transcript;
      }

      if (finalTranscript.trim()) onTranscriptRef.current(finalTranscript.trim());
    };

    // Recognition stops by itself after a pause in speech
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;

    return () => recognition.abort();
  }, []);

  const startListening = () => {
    recognitionRef.current?.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return { listening, startListening, stopListening };
};
