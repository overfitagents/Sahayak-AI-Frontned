
"use client";

import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mic, Paperclip, Send, X } from 'lucide-react';
import { cn, getFileIcon } from '@/lib/utils';
import type { Chapter } from '@/lib/lesson-plan-data';
import type { Selection } from '@/lib/chat-data';
import type { PredefinedAction } from '@/lib/actions';
import SelectionBar from './selection-bar';

// Add type definitions for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: () => void;
  onend: () => void;
  onerror: (event: any) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface ChatInputProps {
  onSend: (message: string, file?: File, chapter?: Chapter) => void;
  disabled: boolean;
  selection: Selection | null;
  onClearSelection: () => void;
  onAction: (action: PredefinedAction) => void;
  predefinedActions: readonly PredefinedAction[];
  selectedLanguage: { name: string; code: string; };
}

export default function ChatInput({ 
    onSend, 
    disabled, 
    selection, 
    onClearSelection, 
    onAction, 
    predefinedActions,
    selectedLanguage
}: ChatInputProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [isListening, setIsListening] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const lastTranscriptRef = React.useRef('');

  const handleSend = () => {
    if (inputValue.trim() || file) {
      onSend(inputValue.trim(), file ?? undefined);
      setInputValue('');
      setFile(null);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    // recognition.continuous = true;
    recognition.lang = selectedLanguage.code;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      lastTranscriptRef.current = '';
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: { error: any; }) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      const newFinalTranscript = finalTranscript.substring(lastTranscriptRef.current.length).trim();
      
      if (newFinalTranscript) {
        setInputValue(prev => (prev ? prev + ' ' : '') + newFinalTranscript);
        lastTranscriptRef.current = finalTranscript;
      }
    };

    recognition.start();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [inputValue]);

  const FileIcon = file ? getFileIcon(file.type) : null;
  
  const handleSuggestionClick = (action: PredefinedAction) => {
    if (selection) {
      onAction(action);
    } else {
      setInputValue(action);
    }
  }

  return (
    <div className="p-3 bg-transparent">
        <div className="max-w-4xl mx-auto flex items-end gap-2">
            <div className={cn(
                "relative flex-1 flex flex-col bg-white/95 backdrop-blur-md shadow-lg border border-white/20",
                 selection ? 'rounded-t-2xl' : 'rounded-2xl'
            )}>
                {selection && (
                    <div className="border-b border-white/20">
                        <SelectionBar 
                            selection={selection} 
                            onClear={onClearSelection} 
                            onAction={onAction} 
                            actions={predefinedActions}
                        />
                    </div>
                )}
                {file && (
                <div className="p-2.5 m-2.5 mb-0 border rounded-lg bg-gray-100/80">
                    <div className="flex items-center gap-3">
                    {FileIcon && <FileIcon className="h-6 w-6 text-gray-600" />}
                    <div className="flex-1 text-sm text-gray-700 font-medium truncate">
                        {file.name}
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => setFile(null)}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove file</span>
                    </Button>
                    </div>
                </div>
                )}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="flex items-center"
                >
                    <Button type="button" variant="ghost" size="icon" className="m-1.5 shrink-0 rounded-full text-gray-500 hover:bg-gray-200/50" onClick={() => fileInputRef.current?.click()} disabled={disabled}>
                        <Paperclip />
                        <span className="sr-only">Attach file</span>
                    </Button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <Textarea
                        ref={textareaRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={selection ? "Ask a follow-up question..." : "Type your message here..."}
                        className={cn(
                            "flex-1 resize-none max-h-48 min-h-[40px] px-2 py-3 border-none focus-visible:ring-0 bg-transparent shadow-none text-card-foreground placeholder:text-gray-400",
                            selection ? "rounded-b-2xl" : "rounded-2xl"
                        )}
                        rows={1}
                        disabled={disabled}
                    />
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={handleMicClick} 
                        className={cn(
                            "m-1.5 shrink-0 rounded-full text-gray-500 hover:bg-gray-200/50 transition-colors",
                            isListening && "bg-red-500 text-white hover:bg-red-600 animate-pulse"
                        )} 
                        disabled={disabled}
                    >
                        <Mic />
                        <span className="sr-only">Use voice</span>
                    </Button>
                </form>
            </div>
             <Button type="submit" onClick={handleSend} size="icon" className="shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 text-white shadow-lg hover:-translate-y-0.5 transition-transform" disabled={(!inputValue.trim() && !file) || disabled}>
                <Send />
                <span className="sr-only">Send message</span>
            </Button>
        </div>
      </div>
  );
}
