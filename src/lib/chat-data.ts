export type Sender = 'user' | 'ai';

export type MessageType = 'text' | 'image' | 'pdf' | 'video' | 'audio' | 'gif';

export interface Message {
  id: string;
  sender: Sender;
  type: MessageType;
  content: string;
  originalContent?: string;
  timestamp: string;
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
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    sender: 'ai',
    type: 'text',
    content: 'You can ask me questions, or interact with text and images. For example, you can select any part of this text to ask a follow-up question.',
    originalContent: 'You can ask me questions, or interact with text and images. For example, you can select any part of this text to ask a follow-up question.',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
    {
    id: '3',
    sender: 'user',
    type: 'text',
    content: 'Generate image explaining photosynthesis',
    timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    sender: 'ai',
    type: 'image',
    content: 'https://placehold.co/600x400.png',
    timestamp: new Date().toISOString(),
  },
];
