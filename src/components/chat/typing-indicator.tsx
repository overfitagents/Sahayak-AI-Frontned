import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

function RobotAvatar() {
  return (
    <div className='w-full h-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center text-white'>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="group-hover/avatar:scale-110 group-hover/avatar:-rotate-12 transition-transform duration-300 ease-in-out"
      >
        <path d="M12 1.5C10.283 1.5 8.762 2.212 7.788 3.32C6.814 4.428 6.167 5.892 6.167 7.5C6.167 9.108 6.814 10.572 7.788 11.68C8.762 12.788 10.283 13.5 12 13.5C13.717 13.5 15.238 12.788 16.212 11.68C17.186 10.572 17.833 9.108 17.833 7.5C17.833 5.892 17.186 4.428 16.212 3.32C15.238 2.212 13.717 1.5 12 1.5Z" stroke="white" strokeWidth="1.5"/>
        <path d="M18.889 16.6C18.889 16.6 21.083 16.6 21.083 18.25C21.083 19.9 18.889 22.5 18.889 22.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M5.111 16.6C5.111 16.6 2.917 16.6 2.917 18.25C2.917 19.9 5.111 22.5 5.111 22.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14.5 17.25H9.5C8.948 17.25 8.5 17.698 8.5 18.25V18.25C8.5 18.802 8.948 19.25 9.5 19.25H14.5C15.052 19.25 15.5 18.802 15.5 18.25V18.25C15.5 17.698 15.052 17.25 14.5 17.25Z" fill="white"/>
        <path d="M10 8.5C10 9.05228 9.55228 9.5 9 9.5C8.44772 9.5 8 9.05228 8 8.5C8 7.94772 8.44772 7.5 9 7.5C9.55228 7.5 10 7.94772 10 8.5Z" fill="white"/>
        <path d="M16 8.5C16 9.05228 15.5523 9.5 15 9.5C14.4477 9.5 14 9.05228 14 8.5C14 7.94772 14.4477 7.5 15 7.5C15.5523 7.5 16 7.94772 16 8.5Z" fill="white"/>
      </svg>
    </div>
  );
}

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in-up justify-start">
      <div className={cn("h-10 w-10", "rounded-full shadow-lg group/avatar overflow-hidden shrink-0 animate-pulse")}>
        <RobotAvatar />
      </div>
      <div className="bg-white/20 backdrop-blur-md text-white p-3 rounded-2xl shadow-lg flex items-center space-x-1.5 rounded-bl-none">
        <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce" />
      </div>
    </div>
  );
}
