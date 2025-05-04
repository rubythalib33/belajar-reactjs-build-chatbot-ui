import { Session, Message } from '../types';

// Save sessions to localStorage
export const saveSessions = (sessions: Session[]): void => {
  localStorage.setItem('chat-sessions', JSON.stringify(sessions));
};

// Get sessions from localStorage
export const getSessions = (): Session[] => {
  const sessions = localStorage.getItem('chat-sessions');
  return sessions ? JSON.parse(sessions) : [];
};

// Save a new session
export const saveSession = (session: Session): void => {
  const sessions = getSessions();
  const existingIndex = sessions.findIndex(s => s.id === session.id);
  
  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.push(session);
  }
  
  saveSessions(sessions);
};

// Get a session by ID
export const getSession = (id: string): Session | undefined => {
  const sessions = getSessions();
  return sessions.find(session => session.id === id);
};

// Get messages for a session
export const getMessages = (sessionId: string): Message[] => {
  const session = getSession(sessionId);
  return session ? session.messages : [];
};

// Add a message to a session
export const addMessage = (sessionId: string, message: Message): void => {
  const sessions = getSessions();
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);
  
  if (sessionIndex >= 0) {
    sessions[sessionIndex].messages.push(message);
    sessions[sessionIndex].updatedAt = Date.now();
    
    // Update session title if it's the first user message
    if (sessions[sessionIndex].title === 'New Chat' && message.role === 'user') {
      sessions[sessionIndex].title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
    }
    
    saveSessions(sessions);
  }
};