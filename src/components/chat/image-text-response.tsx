
"use client";

import { Message, Selection } from '@/lib/chat-data';
import InteractiveImage from './interactive-image';
import InteractiveText from './interactive-text';

interface ImageTextResponseProps {
  message: Message;
  setSelection: (selection: Selection | null) => void;
}

export default function ImageTextResponse({ message, setSelection }: ImageTextResponseProps) {
  if (!message.imageUrl) {
    return null; // Should not happen for interactive_image type
  }
  return (
    <div className="space-y-3">
      <InteractiveText message={message} setSelection={setSelection} />
      <InteractiveImage imageUrl={message.imageUrl} setSelection={setSelection} />
    </div>
  );
}
