export type Sender = 'user' | 'ai';

export type MessageType = 'text' | 'image' | 'pdf' | 'video' | 'audio' | 'gif' | 'image-text';

export interface Message {
  id: string;
  sender: Sender;
  type: MessageType;
  content: string; // For text, image URL, or text content in image-text
  imageUrl?: string; // For image-text messages
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
    type: 'image-text',
    content: 'Here is a diagram explaining photosynthesis. You can draw on it if you have any specific questions!',
    imageUrl: 'https://placehold.co/600x400.png',
    originalContent: 'Here is a diagram explaining photosynthesis. You can draw on it if you have any specific questions!',
    timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  },
];
