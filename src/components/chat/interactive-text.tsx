
"use client";

import { Message, Selection } from '@/lib/chat-data';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface InteractiveTextProps {
  message: Message;
  setSelection: (selection: Selection | null) => void;
}

export default function InteractiveText({ message, setSelection }: InteractiveTextProps) {
  const handleMouseUp = () => {
    const currentSelection = window.getSelection()?.toString().trim() ?? '';
    if (currentSelection) {
      setSelection({
        type: 'text',
        content: currentSelection,
        context: message.originalContent
      });
    }
  };
  
  return (
    <div onMouseUp={handleMouseUp} className={cn("leading-relaxed cursor-text", "font-semibold")}> 
      <ReactMarkdown>{message.content}</ReactMarkdown>
    </div>
  );
}
