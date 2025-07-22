import { Message, Sender, Selection } from '@/lib/chat-data';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import InteractiveText from './interactive-text';
import InteractiveImage from './interactive-image';

interface ChatMessageProps {
  message: Message;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Message;
  setIsReplying: (isReplying: boolean) => void;
  setSelection: (selection: Selection | null) => void;
}

function MessageAvatar({ sender }: { sender: Sender }) {
  return (
    <Avatar className="h-8 w-8">
      <AvatarFallback className={cn(
        sender === 'ai' ? 'bg-card' : 'bg-primary'
      )}>
        {sender === 'ai' ? <Bot className="h-5 w-5 text-primary" /> : <User className="h-5 w-5 text-primary-foreground" />}
      </AvatarFallback>
    </Avatar>
  );
}

export default function ChatMessage({ message, addMessage, setIsReplying, setSelection }: ChatMessageProps) {
  const isAi = message.sender === 'ai';

  const renderContent = () => {
    if (isAi && message.type === 'text' && message.originalContent) {
      return <InteractiveText message={message} setSelection={setSelection} />;
    }
    if (isAi && message.type === 'image') {
      return <InteractiveImage message={message} setSelection={setSelection} />;
    }
    return <p className="leading-relaxed">{message.content}</p>;
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 animate-fade-in-up',
        isAi ? 'justify-start' : 'justify-end'
      )}
    >
      {isAi && <MessageAvatar sender="ai" />}
      <div
        className={cn(
          'max-w-[75%] rounded-lg p-3 shadow-sm',
          isAi
            ? 'bg-card text-card-foreground'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {renderContent()}
         <p className={cn("text-xs mt-2 opacity-60", isAi ? "text-right" : "text-left")}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {!isAi && <MessageAvatar sender="user" />}
    </div>
  );
}
