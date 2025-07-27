
import { Message, Sender, Selection } from '@/lib/chat-data';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import InteractiveText from './interactive-text';
import InteractiveImage from './interactive-image';
import ImageTextResponse from './image-text-response';
import PptViewer from './ppt-viewer';
import FileMessage from './file-message';
import StudyBuddyResponse from './study-buddy-response';
import LessonPlannerResponse from './lesson-planner-response';
import ChapterPlannerResponse from './chapter-planner-response';
import { dummyLessonPlan } from '@/lib/lesson-plan-data';
import TimetableResponse from './timetable-response';
import { dummyTimetable } from '@/lib/timetable-data';

interface ChatMessageProps {
  message: Message;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Message;
  setIsReplying: (isReplying: boolean) => void;
  setSelection: (selection: Selection | null) => void;
  onSend: (content: string, fileData?: string) => void;
}

function RobotAvatar() {
  return (
    <div className='w-full h-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center text-white border border-white/50'>
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

function UserAvatar() {
  return (
    <div className='w-full h-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white'>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="group-hover/avatar:scale-110 transition-transform duration-300 ease-in-out"
      >
        <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 20C20 16.6863 16.4183 14 12 14C7.58172 14 4 16.6863 4 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}


function MessageAvatar({ sender }: { sender: Sender }) {
  const avatarSize = 'h-10 w-10';
  return (
    <div className={cn(
        avatarSize, 
        "rounded-full shadow-lg group/avatar overflow-hidden shrink-0"
    )}>
        {sender === 'ai' ? <RobotAvatar /> : <UserAvatar />}
    </div>
  );
}

export default function ChatMessage({ message, addMessage, setIsReplying, setSelection, onSend }: ChatMessageProps) {
  const isAi = message.sender === 'ai';

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        if (isAi && message.originalContent) {
          return <InteractiveText message={message} setSelection={setSelection} />;
        }
        return <p className={cn("leading-relaxed", !isAi && "font-semibold [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]")}>{message.content}</p>;
      case 'image':
        return <InteractiveImage imageUrl={message.content} setSelection={setSelection} />;
      case 'interactive_image':
        return <ImageTextResponse message={message} setSelection={setSelection} />;
      case 'presentation_generator':
        return <PptViewer slides={message.slides || []} fileUrl={message.fileInfo?.url} fileName={message.fileInfo?.name}/>;
      case 'file':
        return <FileMessage message={message} />;
      case 'student_performance_analyzer':
        return <StudyBuddyResponse message={message} />;
      case 'curriculum_planner':
        return <LessonPlannerResponse plan={message.lessonPlan || dummyLessonPlan} addMessage={addMessage} setIsReplying={setIsReplying} onSend={onSend} />;
      case 'lesson_designer':
        return <ChapterPlannerResponse chapter={message.chapterPlan!} />;
      case 'timetable':
        return <TimetableResponse timetable={message.timetable || dummyTimetable} />;
      default:
        return <p className={cn("leading-relaxed", !isAi && "font-semibold [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]")}>{message.content}</p>;
    }
  };

  const messageContainerStyle = isAi ? 
    'bg-gray-100 text-gray-800 rounded-bl-none' : 
    'bg-gradient-to-br from-blue-400 to-cyan-400 text-white rounded-br-none';
  
  const isPlanner = message.type === 'curriculum_planner' || message.type === 'lesson_designer' || message.type === 'presentation_generator' || message.type === 'timetable';

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
          'max-w-[75%] rounded-2xl shadow-lg transition-transform duration-200 hover:-translate-y-1',
          isPlanner ? 'p-0 bg-transparent shadow-none' : `p-3 ${messageContainerStyle}`
        )}
      >
        {renderContent()}
      </div>
      {!isAi && <MessageAvatar sender="user" />}
    </div>
  );
}
