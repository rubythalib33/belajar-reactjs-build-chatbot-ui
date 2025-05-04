import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { Session, Message } from './types';
import { getSessions, saveSession, addMessage } from './utils/storage';
import { sendChatMessage } from './utils/api';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load sessions from storage on initial render
  useEffect(() => {
    const storedSessions = getSessions();
    setSessions(storedSessions);
    
    // If there are sessions, set the first one as active
    if (storedSessions.length > 0) {
      setActiveSessionId(storedSessions[0].id);
    } else {
      // If no sessions exist, create a new one
      createNewSession();
    }
  }, []);

  // Create a new chat session
  const createNewSession = () => {
    const newSession: Session = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    setSessions(prevSessions => [newSession, ...prevSessions]);
    saveSession(newSession);
    setActiveSessionId(newSession.id);
  };

  // Get active session messages
  const getActiveSessionMessages = (): Message[] => {
    const activeSession = sessions.find(s => s.id === activeSessionId);
    return activeSession ? activeSession.messages : [];
  };

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !activeSessionId) return;
    
    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: Date.now()
    };
    
    // Update UI immediately with user message
    const updatedSessions = sessions.map(session => {
      if (session.id === activeSessionId) {
        return {
          ...session,
          messages: [...session.messages, userMessage],
          updatedAt: Date.now(),
          title: session.title === 'New Chat' ? content.slice(0, 30) + (content.length > 30 ? '...' : '') : session.title
        };
      }
      return session;
    });
    
    setSessions(updatedSessions);
    addMessage(activeSessionId, userMessage);
    
    // Prepare messages for API - include only the last 5 messages for context
    const activeSession = updatedSessions.find(s => s.id === activeSessionId);
    const contextMessages = activeSession ? 
      [...activeSession.messages].slice(-5).map(msg => ({
        role: msg.role,
        content: msg.content
      })) : [];
    
    setIsLoading(true);
    
    try {
      // Send to ChatGPT API
      const response = await sendChatMessage(contextMessages);
      
      // Create assistant message
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };
      
      // Update UI with assistant response
      setSessions(prevSessions => 
        prevSessions.map(session => {
          if (session.id === activeSessionId) {
            return {
              ...session,
              messages: [...session.messages, assistantMessage],
              updatedAt: Date.now()
            };
          }
          return session;
        })
      );
      
      // Save assistant message to storage
      addMessage(activeSessionId, assistantMessage);
      
    } catch (error) {
      console.error('Error getting response:', error);
      // Add an error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now()
      };
      
      setSessions(prevSessions => 
        prevSessions.map(session => {
          if (session.id === activeSessionId) {
            return {
              ...session,
              messages: [...session.messages, errorMessage],
              updatedAt: Date.now()
            };
          }
          return session;
        })
      );
      
      addMessage(activeSessionId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <Sidebar 
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewSession={createNewSession}
      />
      <main className="main-content">
        <ChatArea 
          messages={getActiveSessionMessages()}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default App;