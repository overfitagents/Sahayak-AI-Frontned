"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mic, Paperclip, Send, X } from 'lucide-react';
import { cn, getFileIcon } from '@/lib/utils';
import { Chapter } from '@/lib/lesson-plan-data';

interface ChatInputProps {
  onSend: (message: string, file?: File, chapter?: Chapter) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (inputValue.trim() || file) {
      onSend(inputValue.trim(), file ?? undefined);
      setInputValue('');
      setFile(null);
    }
  };

  const handleMicClick = () => {
    setIsListening(prev => !prev);
    // NOTE: Here you would add the actual logic for voice recognition
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

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [inputValue]);

  const FileIcon = file ? getFileIcon(file.type) : null;

  return (
    <div className="p-3 bg-transparent">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="max-w-4xl mx-auto flex items-end gap-2"
        >
          <div className="relative flex-1 flex flex-col bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
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
             <div className="flex items-center">
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
                placeholder="Type your message here..."
                className="flex-1 resize-none max-h-48 min-h-[40px] px-2 py-3 border-none focus-visible:ring-0 bg-transparent shadow-none text-card-foreground placeholder:text-gray-400"
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
            </div>
          </div>

          <Button type="submit" size="icon" className="shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 text-white shadow-lg hover:-translate-y-0.5 transition-transform" disabled={(!inputValue.trim() && !file) || disabled}>
            <Send />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
  );
}
