
"use client";

import type { Message, Selection } from '@/lib/chat-data';
import { initialMessages } from '@/lib/chat-data';
import React, { useState } from 'react';
import ChatHeader from './chat-header';
import ChatMessages from './chat-messages';
import ChatInput from './chat-input';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';
import SelectionBar from './selection-bar';
import { askPredefinedQuestion } from '@/ai/flows/predefined-questions-on-selection';
import { useToast } from '@/hooks/use-toast';
import { predefinedActions, PredefinedAction } from '@/lib/actions';
import { askFollowUpQuestion } from '@/ai/flows/follow-up-questions-on-text';
import { generateImage } from '@/ai/flows/generate-image';
import { dummyLessonPlan, type Chapter } from '@/lib/lesson-plan-data';

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

  const handleSendMessage = async (content: string, file?: File, chapter?: Chapter) => {
    if (isReplying && !file) return;

    if (chapter) {
      addMessage({
        sender: 'ai',
        type: 'chapter-plan',
        content: `Here is a detailed lesson plan for ${chapter.name}.`,
        chapterPlan: chapter
      });
      return;
    }

    if (file) {
      // Handle file message
      const fileUrl = URL.createObjectURL(file); // Create a temporary URL for preview
      addMessage({
        sender: 'user',
        type: 'file',
        content: content,
        fileInfo: {
          name: file.name,
          url: fileUrl,
          type: file.type,
        }
      });
      // Dummy AI response for file upload
      setIsReplying(true);

      // Simulate processing and show lesson plan
      setTimeout(() => {
        addMessage({
          sender: 'ai',
          type: 'lesson-plan',
          content: "Here is the generated lesson plan based on your file.",
          lessonPlan: dummyLessonPlan,
          addMessage: addMessage,
          setIsReplying: setIsReplying,
        });
        setIsReplying(false);
      }, 1500);
      return;
    }

    setIsReplying(true);

    if (selection) {
      const currentSelection = selection;
      setSelection(null);

      addMessage({
        sender: 'user',
        type: 'text',
        content: content,
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
      if (content.toLowerCase().includes('generate image') || content.toLowerCase().includes('what is photosynthesis')) {
        addMessage({
          sender: 'ai',
          type: 'text',
          content: "Here's an image explaining photosynthesis.",
        });
        try {
          const result = await generateImage({ prompt: 'A simple diagram explaining photosynthesis with labels for sunlight, water, carbon dioxide, oxygen, and glucose.' });
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
      } else if (content.toLowerCase().includes('lesson plan')) {
        addMessage({
          sender: 'ai',
          type: 'lesson-plan',
          content: "Here is the generated lesson plan.",
          lessonPlan: dummyLessonPlan,
          addMessage: addMessage,
          setIsReplying: setIsReplying,
        });
      }
      else {
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

  const handleAction = async (action: PredefinedAction, context?: Selection) => {
    const currentSelection = context || selection;
    if (!currentSelection) {
      // Handle case where suggestion chip is clicked without a selection
       addMessage({ sender: 'user', type: 'text', content: action });
       addMessage({ sender: 'ai', type: 'text', content: `You clicked on "${action}". How can I help you with that?` });
      return;
    }

    setIsReplying(true);
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
    <div className="flex flex-col h-screen bg-transparent">
      <ChatHeader />
      <ChatMessages messages={messages} isReplying={isReplying} addMessage={addMessage} setIsReplying={setIsReplying} setSelection={setSelection} />
      <div className="bg-transparent">
        {selection && (
          <SelectionBar 
            selection={selection} 
            onClear={clearSelection} 
            onAction={(action) => handleAction(action, selection)} 
            actions={predefinedActions}
          />
        )}
        {!selection && (
          <div className="max-w-4xl mx-auto pb-3">
              <div className="flex justify-center gap-2 flex-wrap">
              {predefinedActions.map((action) => (
                  <Button
                  key={action}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction(action)}
                  className="h-8 bg-white/10 border-white/20 text-white backdrop-blur-md hover:bg-white/20 hover:text-white transition-all duration-200"
                  disabled={isReplying}
                  >
                  {action}
                  </Button>
              ))}
              </div>
          </div>
        )}
        <ChatInput 
          onSend={handleSendMessage} 
          disabled={isReplying} 
        />
      </div>
    </div>
  );
}
