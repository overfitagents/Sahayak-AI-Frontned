"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mic, Paperclip, Send } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { PredefinedAction } from '@/lib/actions';

interface ChatInputProps {
  onSend: (message: string) => void;
  onAction: (action: PredefinedAction) => void;
  disabled: boolean;
  suggestionActions: readonly PredefinedAction[];
}

export default function ChatInput({ onSend, onAction, disabled, suggestionActions }: ChatInputProps) {
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
  
  const handleSuggestionClick = (action: PredefinedAction) => {
    onAction(action);
  }

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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center gap-2 mb-3 flex-wrap">
          {suggestionActions.map((action) => (
            <Button
              key={action}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick(action)}
              className="h-8 bg-white/10 border-white/20 text-white backdrop-blur-md hover:bg-white/20 hover:text-white transition-all duration-200"
              disabled={disabled}
            >
              {action}
            </Button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-end gap-2 p-1 bg-white/10 border border-white/20 rounded-2xl shadow-lg backdrop-blur-md"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="shrink-0 rounded-full text-white hover:bg-white/10 hover:text-white" disabled={disabled}>
                  <Paperclip />
                  <span className="sr-only">Attach file</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className='bg-background/80 backdrop-blur-md border-white/20 text-white'>Attach file</TooltipContent>
            </Tooltip>
             <Tooltip>
              <TooltipTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="shrink-0 rounded-full text-white hover:bg-white/10 hover:text-white" disabled={disabled}>
                  <Mic />
                  <span className="sr-only">Use voice</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className='bg-background/80 backdrop-blur-md border-white/20 text-white'>Use voice</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 resize-none max-h-48 min-h-[40px] px-4 py-2 border-none focus-visible:ring-0 bg-transparent shadow-none text-white placeholder:text-gray-300"
            rows={1}
            disabled={disabled}
          />

          <Button type="submit" size="icon" className="shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 text-white shadow-lg hover:-translate-y-0.5 transition-transform" disabled={!inputValue.trim() || disabled}>
            <Send />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
