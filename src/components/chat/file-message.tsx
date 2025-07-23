
"use client";

import { Message } from '@/lib/chat-data';
import { getFileIcon } from '@/lib/utils';
import { Download } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface FileMessageProps {
  message: Message;
}

export default function FileMessage({ message }: FileMessageProps) {
  if (!message.fileInfo) {
    return null;
  }

  const { name, url, type } = message.fileInfo;
  const FileIcon = getFileIcon(type);
  const isAi = message.sender === 'ai';

  return (
    <div className="space-y-3">
      {message.content && <p className={cn("leading-relaxed", message.sender === 'user' && "font-semibold [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]")}>{message.content}</p>}
      <div className={cn(
        "p-3 rounded-lg flex flex-col items-start gap-3 w-full max-w-sm border",
        isAi ? "bg-white/50 border-gray-300" : "bg-black/20 border-white/30"
      )}>
        <div className="flex items-center gap-3">
          <FileIcon className={cn("h-8 w-8", isAi ? "text-gray-700" : "text-white")} />
          <div>
            <p className={cn("font-semibold truncate", isAi ? "text-gray-800" : "text-white")}>{name}</p>
            <p className={cn("text-sm", isAi ? "text-gray-600" : "text-white/80")}>{type}</p>
          </div>
        </div>
        <a href={url} download={name} className="w-full">
          <Button className="w-full" variant={isAi ? "secondary" : "secondary"}>
            <Download className="mr-2" /> Download
          </Button>
        </a>
      </div>
    </div>
  );
}
