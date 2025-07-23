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

  return (
    <div className="space-y-3">
      {message.content && <p className={cn("leading-relaxed", message.sender === 'user' && "font-semibold [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]")}>{message.content}</p>}
      <div className="p-3 rounded-lg bg-white/50 flex flex-col items-start gap-3 w-full max-w-sm border">
        <div className="flex items-center gap-3">
          <FileIcon className="h-8 w-8 text-primary-foreground" />
          <div>
            <p className="font-semibold text-primary-foreground truncate">{name}</p>
            <p className="text-sm text-primary-foreground/80">{type}</p>
          </div>
        </div>
        <a href={url} download={name} className="w-full">
          <Button className="w-full" variant="secondary">
            <Download className="mr-2" /> Download
          </Button>
        </a>
      </div>
    </div>
  );
}
