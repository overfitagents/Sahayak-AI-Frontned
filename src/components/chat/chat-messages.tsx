"use client";

import type { Message, Selection } from '@/lib/chat-data';
import React, { useEffect, useRef } from 'react';
import ChatMessage from './chat-message';
import TypingIndicator from './typing-indicator';

interface ChatMessagesProps {
  messages: Message[];
  isReplying: boolean;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Message;
  setIsReplying: (isReplying: boolean) => void;
  setSelection: (selection: Selection | null) => void;
  onSend: (content: string, file?: File) => void;
}

export default function ChatMessages({ messages, isReplying, addMessage, setIsReplying, setSelection, onSend }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isReplying]);

  return (
    <main ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} addMessage={addMessage} setIsReplying={setIsReplying} setSelection={setSelection} onSend={onSend} />
        ))}
        {isReplying && <TypingIndicator />}
        <div ref={endOfMessagesRef} />
      </div>
    </main>
  );
}
