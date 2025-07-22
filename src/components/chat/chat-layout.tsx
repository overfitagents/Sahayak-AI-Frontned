"use client";

import type { Message, Selection } from '@/lib/chat-data';
import { initialMessages } from '@/lib/chat-data';
import React, { useState } from 'react';
import ChatHeader from './chat-header';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import { v4 as uuidv4 } from 'uuid';
import SelectionBar from './selection-bar';
import { askPredefinedQuestion } from '@/ai/flows/predefined-questions-on-selection';
import { useToast } from '@/hooks/use-toast';
import { predefinedActions, PredefinedAction } from '@/lib/actions';

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isReplying, setIsReplying] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const { toast } = useToast();

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
    if (selection) {
      // Handle as a follow-up question
      addMessage({
        sender: 'user',
        type: 'text',
        content: `Follow-up on "${selection.type === 'text' ? selection.content : 'image'}": ${content}`,
      });
      // Here you would call your follow-up AI flow
      setSelection(null);
    } else {
      // Handle as a regular message
      addMessage({
        sender: 'user',
        type: 'text',
        content: content,
      });
    }
    // Here you would typically call your main AI flow
  };

  const handleAction = async (action: PredefinedAction) => {
    if (!selection) return;

    setIsReplying(true);
    const currentSelection = selection;
    setSelection(null);

    addMessage({
      sender: 'user',
      type: 'text',
      content: `${action} the selected ${currentSelection.type}.`,
    });

    try {
      const result = await askPredefinedQuestion({
        action,
        selectedText: currentSelection.type === 'text' ? currentSelection.content : undefined,
        contextText: currentSelection.type === 'text' ? currentSelection.context : undefined,
        imageDataUri: currentSelection.type === 'image' ? currentSelection.content : undefined,
      });
      
      addMessage({
        sender: 'ai',
        type: 'text',
        content: result.answer,
        originalContent: result.answer,
      });

    } catch (error) {
      console.error(`Error during action "${action}":`, error);
      toast({
        title: 'Error',
        description: `Could not perform the action "${action}". Please try again.`,
        variant: 'destructive',
      });
      addMessage({
        sender: 'ai',
        type: 'text',
        content: "I'm sorry, I couldn't process that request.",
      });
    } finally {
      setIsReplying(false);
    }
  };

  const clearSelection = () => {
    setSelection(null);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader />
      <ChatMessages messages={messages} isReplying={isReplying} addMessage={addMessage} setIsReplying={setIsReplying} setSelection={setSelection} />
      <div className="border-t bg-card">
        {selection && (
          <SelectionBar 
            selection={selection} 
            onClear={clearSelection} 
            onAction={handleAction} 
            actions={predefinedActions}
          />
        )}
        <ChatInput onSend={handleSendMessage} disabled={isReplying} />
      </div>
    </div>
  );
}
