import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Message } from '../types';

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({ 
  messages, 
  onSendMessage, 
  isLoading 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-area">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <h2>How can I help you today?</h2>
          </div>
        ) : (
          messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatArea;