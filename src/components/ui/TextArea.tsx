import { type TextareaHTMLAttributes } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechToText } from '../../hooks/useSpeechToText';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  enableVoice?: boolean;
  onVoiceResult?: (transcript: string) => void;
}

export function TextArea({ label, className = '', enableVoice, onVoiceResult, ...props }: TextAreaProps) {
  const { isListening, interim, isSupported, toggle } = useSpeechToText({
    onResult: onVoiceResult,
  });

  const showVoice = enableVoice && isSupported;

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-apple-600">{label}</label>
      )}
      <div className="relative">
        <textarea
          className={`w-full rounded-2xl border border-white/40 bg-white/40 backdrop-blur-sm px-4 py-3 text-apple-900 placeholder:text-apple-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 resize-none transition-all ${showVoice ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {showVoice && (
          <button
            type="button"
            onClick={toggle}
            className={`absolute right-3 top-3 p-1.5 rounded-full transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-accent/10 text-accent hover:bg-accent/20'
            }`}
            title={isListening ? 'Stop recording' : 'Start voice input'}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        )}
      </div>
      {isListening && interim && (
        <p className="text-xs text-apple-400 italic px-1">{interim}</p>
      )}
    </div>
  );
}
