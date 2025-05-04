import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`chat-message ${message.role}`}>
      <div className="message-avatar">
        {message.role === 'user' ? '👤' : '🤖'}
      </div>
      <div className="message-content">
        {message.role === 'user' ? (
          message.content
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Customize components as needed
              p: ({ node, ...props }) => <p className="markdown-p" {...props} />,
              h1: ({ node, ...props }) => <h1 className="markdown-h1" {...props} />,
              h2: ({ node, ...props }) => <h2 className="markdown-h2" {...props} />,
              h3: ({ node, ...props }) => <h3 className="markdown-h3" {...props} />,
              ul: ({ node, ...props }) => <ul className="markdown-ul" {...props} />,
              ol: ({ node, ...props }) => <ol className="markdown-ol" {...props} />,
              li: ({ node, ...props }) => <li className="markdown-li" {...props} />,
              code: (props: any) => {
                const { className, children } = props;
                const match = /language-(\w+)/.exec(className || '');
                const isInline = props.inline === true;
                
                if (!isInline && match) {
                  return (
                    <div className="code-block">
                      <div className="code-header">
                        <span>{match[1]}</span>
                      </div>
                      <pre className={className}>
                        <code className={className}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  );
                }
                
                return (
                  <code className={isInline ? 'inline-code' : className}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;