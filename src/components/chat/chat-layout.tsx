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
import { askFollowUpQuestion } from '@/ai/flows/follow-up-questions-on-text';
import { generateImage } from '@/ai/flows/generate-image';

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

  const handleSendMessage = async (content: string) => {
    if (isReplying) return;

    setIsReplying(true);

    if (selection) {
      const currentSelection = selection;
      setSelection(null);

      const userMessage = addMessage({
        sender: 'user',
        type: 'text',
        content: `Follow-up on "${
          currentSelection.type === 'text' ? currentSelection.content : 'image'
        }": ${content}`,
      });

      try {
        const result = await askFollowUpQuestion({
          originalText:
            currentSelection.type === 'text' ? currentSelection.context || '' : '',
          selectedText:
            currentSelection.type === 'text' ? currentSelection.content : '',
          followUpQuestion: content,
        });
        addMessage({
          sender: 'ai',
          type: 'text',
          content: result.answer,
          originalContent: result.answer,
        });
      } catch (error) {
        console.error('Error during follow-up question:', error);
        addMessage({
          sender: 'ai',
          type: 'text',
          content: "I'm sorry, I couldn't process that follow-up.",
        });
      }
    } else {
      addMessage({
        sender: 'user',
        type: 'text',
        content: content,
      });

      // Simple keyword detection to trigger image generation
      if (content.toLowerCase().includes('generate image')) {
        try {
          const result = await generateImage({ prompt: content });
          addMessage({
            sender: 'ai',
            type: 'image',
            content: result.imageDataUri,
          });
        } catch (error) {
          console.error('Error generating image:', error);
          addMessage({
            sender: 'ai',
            type: 'text',
            content: "I'm sorry, I couldn't generate an image for that.",
          });
        }
      } else {
        // Generic response for other queries
        addMessage({
          sender: 'ai',
          type: 'text',
          content: "I can help with that. What would you like to know?",
          originalContent: "I can help with that. What would you like to know?",
        });
      }
    }

    setIsReplying(false);
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
      <div className="border-t bg-background">
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
