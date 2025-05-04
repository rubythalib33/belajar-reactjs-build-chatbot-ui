export type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  };
  
export type Session = {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
    updatedAt: number;
  };