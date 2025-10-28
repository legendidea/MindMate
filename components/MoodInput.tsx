
import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { SparklesIcon, MicrophoneIcon } from './icons';

interface MoodInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

const MoodInput: React.FC<MoodInputProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');
  const { 
    isListening, 
    transcript, 
    handleListen, 
    hasSupport 
  } = useSpeechRecognition();

  // When speech recognition provides a transcript, update the text area.
  useEffect(() => {
    setText(transcript);
  }, [transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(text);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isListening ? "Listening..." : "e.g., I don’t feel good today, everything seems heavy."}
          className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent transition duration-200 resize-none"
          rows={4}
          disabled={isLoading || isListening}
        />
        <button 
          type="button"
          onClick={handleListen}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            isListening 
              ? 'text-white bg-red-500 animate-pulse' 
              : 'text-gray-500 hover:text-brand-primary hover:bg-gray-100'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={!hasSupport || isLoading}
          title={
            !hasSupport 
              ? "Voice input not supported by your browser" 
              : isListening ? "Stop recording" : "Use microphone"
          }
          aria-label={isListening ? "Stop recording" : "Start voice input"}
        >
          <MicrophoneIcon className="w-6 h-6" />
        </button>
      </div>
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5" />
            Analyze My Mood
          </>
        )}
      </button>
    </form>
  );
};

export default MoodInput;
