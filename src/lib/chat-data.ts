
import type { StudyBuddyPair } from "./study-buddy-data";
import type { LessonPlan, Chapter } from "./lesson-plan-data";
import type { Timetable } from "./timetable-data";

export type Sender = 'user' | 'ai';

export type MessageType = 'text' | 'image' | 'pdf' | 'video' | 'audio' | 'gif' | 'interactive_image' | 'presentation_generator' | 'file' | 'student_performance_analyzer' | 'curriculum_planner' | 'lesson_designer' | 'timetable';

export interface Slide {
    heading: string;
    image: any;
    points: string[];
    image_version?: number; // Optional version for the image
    image_filename?: string; // Optional filename for the image
    image_description?: string; // Optional description for the image
}

export interface Message {
  id: string;
  sender: Sender;
  type: MessageType;
  content: string; // For text, image URL, file URL, or text content in interactive_image
  imageUrl?: string; // For interactive_image messages
  originalContent?: string;
  timestamp: string;
  fileInfo?: {
    name: string;
    url: string;
    type: string;
  }
  studyBuddyPairs?: StudyBuddyPair[];
  lessonPlan?: LessonPlan;
  chapterPlan?: Chapter;
  slides?: Slide[];
  timetable?: Timetable;
  addMessage?: (message: Omit<Message, 'id' | 'timestamp'> & { chapter?: Chapter }) => Message;
  setIsReplying?: (isReplying: boolean) => void;
  text?: string;
  fileData?: string;
}

export type Selection = {
  type: 'text';
  content: string;
  context?: string;
} | {
  type: 'image';
  content: string; // data URI
};

export const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'ai',
    type: 'text',
    content: "Hello! I'm Sahayak, your smart assistant. How can I help you today?",
    originalContent: "Hello! I'm Sahayak, your smart assistant. How can I help you today?",
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
  // {
  //   id: '4',
  //   sender: 'ai',
  //   type: 'interactive_image',
  //   content: 'Here is a diagram explaining photosynthesis. You can draw on it if you have any specific questions!',
  //   imageUrl: 'https://placehold.co/600x400.png',
  //   originalContent: 'Here is a diagram explaining photosynthesis. You can draw on it if you have any specific questions!',
  //   timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  // },
];
