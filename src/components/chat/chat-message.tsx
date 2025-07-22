import { Message, Sender, Selection } from '@/lib/chat-data';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import InteractiveText from './interactive-text';
import InteractiveImage from './interactive-image';

interface ChatMessageProps {
  message: Message;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Message;
  setIsReplying: (isReplying: boolean) => void;
  setSelection: (selection: Selection | null) => void;
}

function RobotAvatar() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="group-hover/avatar:scale-110 group-hover/avatar:-rotate-12 transition-transform duration-300 ease-in-out"
    >
      <circle cx="20" cy="20" r="20" fill="#E0F7FA" />
      <path
        d="M29.5 20C29.5 23.59 26.59 26.5 23 26.5H17C13.41 26.5 10.5 23.59 10.5 20V16C10.5 12.41 13.41 9.5 17 9.5H23C26.59 9.5 29.5 12.41 29.5 16V20Z"
        fill="#00BCD4"
      />
      <rect x="16" y="26" width="8" height="2" rx="1" fill="#00BCD4" />
      <path d="M19 8.5L19 7.5C19 7.22386 19.2239 7 19.5 7L20.5 7C20.7761 7 21 7.22386 21 7.5L21 8.5" stroke="#00BCD4" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16.5" cy="18.5" r="1.5" fill="white" />
      <circle cx="23.5" cy="18.5" r="1.5" fill="white" />
      <path d="M17 22C17 22 18 24 20 24C22 24 23 22 23 22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function UserAvatar() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary group-hover/avatar:scale-110 transition-transform duration-300 ease-in-out"
    >
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path
        d="M12 14C8.68629 14 6 16.6863 6 20H18C18 16.6863 15.3137 14 12 14Z"
        fill="currentColor"
      />
    </svg>
  );
}


function MessageAvatar({ sender }: { sender: Sender }) {
  const avatarSize = sender === 'ai' ? 'h-10 w-10' : 'h-8 w-8';
  const border = sender === 'ai' ? 'border-2 border-primary/50' : 'border-2 border-primary/80';
  return (
    <Avatar className={cn(avatarSize, border, "shadow-md group/avatar")}>
      <AvatarFallback className={cn(
        sender === 'ai' ? 'bg-card' : 'bg-background text-primary'
      )}>
        {sender === 'ai' ? <RobotAvatar /> : <UserAvatar />}
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
    const textClass = "font-semibold";
    return <p className={cn("leading-relaxed", textClass)}>{message.content}</p>;
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
          'max-w-[75%] rounded-2xl p-3 shadow-lg border transition-transform duration-200 hover:-translate-y-1',
          isAi
            ? 'bg-card text-card-foreground'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {renderContent()}
      </div>
      {!isAi && <MessageAvatar sender="user" />}
    </div>
  );
}
