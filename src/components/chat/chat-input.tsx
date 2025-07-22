"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mic, Paperclip, Send } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSend(inputValue.trim());
      setInputValue('');
    }
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
    <footer className="p-3 border-t bg-card">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-end gap-2"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="shrink-0 hover:bg-accent/50" disabled={disabled}>
                  <Paperclip />
                  <span className="sr-only">Attach file</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach file</TooltipContent>
            </Tooltip>
             <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="shrink-0 hover:bg-accent/50" disabled={disabled}>
                  <Mic />
                  <span className="sr-only">Use voice</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Use voice</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 resize-none max-h-48 min-h-[40px] rounded-full px-4 py-2 border-input focus-visible:ring-primary"
            rows={1}
            disabled={disabled}
          />

          <Button type="submit" size="icon" className="shrink-0 bg-primary hover:bg-primary/90" disabled={!inputValue.trim() || disabled}>
            <Send />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </footer>
  );
}
