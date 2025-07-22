"use client";

import { Message, Selection } from '@/lib/chat-data';

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
    <p onMouseUp={handleMouseUp} className="leading-relaxed cursor-text">
      {message.content}
    </p>
  );
}
