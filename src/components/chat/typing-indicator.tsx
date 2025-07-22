import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '@/lib/utils';

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 animate-fade-in-up justify-start">
      <Avatar className="h-8 w-8">
        <AvatarFallback>
          <Bot className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-card text-card-foreground p-3 rounded-lg shadow-sm flex items-center space-x-1.5 rounded-tl-none">
        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
      </div>
    </div>
  );
}
