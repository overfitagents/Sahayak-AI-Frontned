"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mic, Paperclip, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSend(inputValue.trim());
      setInputValue('');
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

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [inputValue]);


  return (
    <div className="p-3 bg-transparent">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="max-w-4xl mx-auto flex items-end gap-2"
        >
          <div className="relative flex-1 flex items-center bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-white/20">
             <Button type="button" variant="ghost" size="icon" className="shrink-0 rounded-full text-gray-500 hover:bg-gray-200/50" disabled={disabled}>
                <Paperclip />
                <span className="sr-only">Attach file</span>
              </Button>
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-1 resize-none max-h-48 min-h-[40px] px-4 py-2 border-none focus-visible:ring-0 bg-transparent shadow-none text-card-foreground placeholder:text-gray-400"
              rows={1}
              disabled={disabled}
            />
            <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={handleMicClick} 
                className={cn(
                    "shrink-0 rounded-full text-gray-500 hover:bg-gray-200/50 transition-colors",
                    isListening && "bg-red-500 text-white hover:bg-red-600 animate-pulse"
                )} 
                disabled={disabled}
            >
                <Mic />
                <span className="sr-only">Use voice</span>
            </Button>
          </div>

          <Button type="submit" size="icon" className="shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 text-white shadow-lg hover:-translate-y-0.5 transition-transform" disabled={!inputValue.trim() || disabled}>
            <Send />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
  );
}
