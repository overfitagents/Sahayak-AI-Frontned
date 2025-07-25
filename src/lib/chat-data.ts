
import type { StudyBuddyPair } from "./study-buddy-data";
import type { LessonPlan, Chapter } from "./lesson-plan-data";

export type Sender = 'user' | 'ai';

export type MessageType = 'text' | 'image' | 'pdf' | 'video' | 'audio' | 'gif' | 'interactive_image' | 'content_creator' | 'file' | 'study_buddy' | 'curriculum_planner' | 'lesson_designer';

export interface Slide {
    title: string;
    image: string;
    points: string[];
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
  addMessage?: (message: Omit<Message, 'id' | 'timestamp'> & { chapter?: Chapter }) => Message;
  setIsReplying?: (isReplying: boolean) => void;
}

export type Selection = {
  type: 'text';
  content: string;
  context?: string;
} | {
  type: 'image';
  content: string; // data URI
};

const dummySlides: Slide[] = [
    { title: 'Market Analysis', image: 'https://placehold.co/800x600.png', points: ['Market size growing at 15% annually', 'Key demographics shifting toward digital solutions', 'Competitive landscape analysis completed', 'Identified market gaps and opportunities', 'Strategic positioning for maximum impact'] },
    { title: 'Product Strategy', image: 'https://placehold.co/800x600.png', points: ['Develop core features for MVP', 'Prioritize user experience and intuitive design', 'Implement scalable architecture', 'Integrate with existing platforms', 'Launch beta testing phase'] },
    { title: 'Financial Projections', image: 'https://placehold.co/800x600.png', points: ['Projected revenue growth of 25% YoY', 'Secure seed funding for initial development', 'Allocate budget for marketing and sales', 'Monitor burn rate and optimize spending', 'Achieve profitability within 3 years'] },
    { title: 'Marketing Plan', image: 'https://placehold.co/800x600.png', points: ['Target audience: small to medium businesses', 'Utilize content marketing and SEO', 'Launch social media campaigns', 'Engage with industry influencers', 'Track metrics and ROI'] },
    { title: 'Team Introduction', image: 'https://placehold.co/800x600.png', points: ['Experienced leadership team', 'Skilled developers and designers', 'Dedicated marketing and sales professionals', 'Strong advisory board', 'Fostering a culture of innovation'] },
];

export const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'ai',
    type: 'text',
    content: "Hello! I'm Sahayak, your smart assistant. How can I help you today?",
    originalContent: "Hello! I'm Sahayak, your smart assistant. How can I help you today?",
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    sender: 'user',
    type: 'text',
    content: 'what is photosynthesis?',
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
    {
    id: '3',
    sender: 'ai',
    type: 'text',
    content: 'Photosynthesis is the process by which plants convert light energy into chemical energy. Plants use sunlight, carbon dioxide, and water to produce glucose and oxygen. This fundamental biological process powers most life on Earth!',
    originalContent: 'Photosynthesis is the process by which plants convert light energy into chemical energy. Plants use sunlight, carbon dioxide, and water to produce glucose and oxygen. This fundamental biological process powers most life on Earth!',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    sender: 'ai',
    type: 'interactive_image',
    content: 'Here is a diagram explaining photosynthesis. You can draw on it if you have any specific questions!',
    imageUrl: 'https://placehold.co/600x400.png',
    originalContent: 'Here is a diagram explaining photosynthesis. You can draw on it if you have any specific questions!',
    timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    sender: 'ai',
    type: 'content_creator',
    content: 'Here is the presentation file you requested.',
    slides: dummySlides,
    fileInfo: {
        name: 'Presentation.pptx',
        url: '#', // a dummy url
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    },
    timestamp: new Date().toISOString(),
  },
  {
    id: '6',
    sender: 'ai',
    type: 'study_buddy',
    content: '🚀 Here are the study buddy pairings! I\'ve matched students based on their strengths and areas where they can help each other grow.',
    studyBuddyPairs: [
      {
        student1: { name: 'Alice', avatar: 'https://placehold.co/100x100.png', strengths: ['📐 Math'], weaknesses: ['📖 History'] },
        student2: { name: 'Bob', avatar: 'https://placehold.co/100x100.png', strengths: ['📖 History'], weaknesses: ['📐 Math'] },
        reason: '🤝 Alice can help Bob with Math, and Bob can help Alice with History, creating a mutually beneficial partnership.',
      },
      {
        student1: { name: 'Charlie', avatar: 'https://placehold.co/100x100.png', strengths: ['🧪 Science'], weaknesses: ['🎨 Art'] },
        student2: { name: 'Diana', avatar: 'https://placehold.co/100x100.png', strengths: ['🎨 Art'], weaknesses: ['🧪 Science'] },
        reason: '🤝 Charlie excels in scientific concepts, while Diana has a creative flair. They can learn a lot from each other.',
      },
    ],
    timestamp: new Date().toISOString(),
  }
];
