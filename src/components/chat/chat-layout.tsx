"use client";

import type { Message } from '@/lib/chat-data';
import { initialMessages } from '@/lib/chat-data';
import React, { useState } from 'react';
import ChatHeader from './chat-header';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import { v4 as uuidv4 } from 'uuid';

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isReplying, setIsReplying] = useState(false);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const handleSendMessage = (content: string) => {
    addMessage({
      sender: 'user',
      type: 'text',
      content: content,
    });
    // Here you would typically call your main AI flow
    // For now, we just simulate a reply for demonstration
    // setIsReplying(true);
    // setTimeout(() => {
    //   addMessage({
    //     sender: 'ai',
    //     type: 'text',
    //     content: "This is a simulated response.",
    //   });
    //   setIsReplying(false);
    // }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader />
      <ChatMessages messages={messages} isReplying={isReplying} addMessage={addMessage} setIsReplying={setIsReplying} />
      <ChatInput onSend={handleSendMessage} disabled={isReplying} />
    </div>
  );
}
