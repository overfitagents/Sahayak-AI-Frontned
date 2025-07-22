"use client";

import { askFollowUpQuestion } from '@/ai/flows/follow-up-questions-on-text';
import { Message } from '@/lib/chat-data';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface InteractiveTextProps {
  message: Message;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Message;
  setIsReplying: (isReplying: boolean) => void;
}

export default function InteractiveText({ message, addMessage, setIsReplying }: InteractiveTextProps) {
  const [selection, setSelection] = useState<string>('');
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleMouseUp = () => {
    const currentSelection = window.getSelection()?.toString().trim() ?? '';
    if (currentSelection) {
      setSelection(currentSelection);
      setPopoverOpen(true);
    } else {
      setPopoverOpen(false);
    }
  };

  const handleAskFollowUp = async () => {
    if (!followUpQuestion.trim()) return;

    setIsSubmitting(true);
    setDialogOpen(false);
    addMessage({
        sender: 'user',
        type: 'text',
        content: `Follow-up on "${selection}": ${followUpQuestion}`,
    });
    setIsReplying(true);

    try {
      const result = await askFollowUpQuestion({
        originalText: message.originalContent || message.content,
        selectedText: selection,
        followUpQuestion: followUpQuestion,
      });

      addMessage({
        sender: 'ai',
        type: 'text',
        content: result.answer,
        originalContent: result.answer,
      });

    } catch (error) {
      console.error('Error asking follow-up question:', error);
      toast({
        title: 'Error',
        description: 'Could not get an answer. Please try again.',
        variant: 'destructive',
      });
       addMessage({
        sender: 'ai',
        type: 'text',
        content: "I'm sorry, I couldn't process that request.",
      });
    } finally {
      setIsSubmitting(false);
      setIsReplying(false);
      setFollowUpQuestion('');
      setSelection('');
    }
  };
  
  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <p onMouseUp={handleMouseUp} className="leading-relaxed cursor-text">
            {message.content}
          </p>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPopoverOpen(false);
              setDialogOpen(true);
            }}
          >
            Ask follow-up question
          </Button>
        </PopoverContent>
      </Popover>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ask a follow-up about</DialogTitle>
            <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md italic">
              "{selection}"
            </p>
          </DialogHeader>
          <Textarea
            placeholder="Type your question here..."
            value={followUpQuestion}
            onChange={(e) => setFollowUpQuestion(e.target.value)}
          />
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAskFollowUp} disabled={isSubmitting || !followUpQuestion.trim()}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ask
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
