import { Session, Message } from '../types';
import { readJsonFile, writeJsonFile } from './fs';

// File paths
const SESSIONS_FILE = '/db/sessions.json';

// In-memory cache
let sessionsCache: Session[] | null = null;

// Save sessions to JSON file
export const saveSessions = async (sessions: Session[]): Promise<void> => {
  try {
    sessionsCache = sessions;
    await writeJsonFile(SESSIONS_FILE, sessions);
  } catch (error) {
    console.error('Error saving sessions:', error);
    // Fallback to localStorage if file save fails
    localStorage.setItem('chat-sessions', JSON.stringify(sessions));
  }
};

// Get sessions from JSON file
export const getSessions = async (): Promise<Session[]> => {
  try {
    // Use cache if available
    if (sessionsCache) {
      return sessionsCache;
    }
    
    // Otherwise read from file
    const sessions = await readJsonFile<Session[]>(SESSIONS_FILE);
    sessionsCache = sessions;
    return sessions;
  } catch (error) {
    console.error('Error getting sessions:', error);
    // Fallback to localStorage if file read fails
    const sessions = localStorage.getItem('chat-sessions');
    const parsedSessions = sessions ? JSON.parse(sessions) : [];
    sessionsCache = parsedSessions;
    return parsedSessions;
  }
};

// Save a new session
export const saveSession = async (session: Session): Promise<void> => {
  try {
    const sessions = await getSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.push(session);
    }
    
    await saveSessions(sessions);
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

// Get a session by ID
export const getSession = async (id: string): Promise<Session | undefined> => {
  try {
    const sessions = await getSessions();
    return sessions.find(session => session.id === id);
  } catch (error) {
    console.error('Error getting session:', error);
    return undefined;
  }
};

// Get messages for a session
export const getMessages = async (sessionId: string): Promise<Message[]> => {
  try {
    const session = await getSession(sessionId);
    return session ? session.messages : [];
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};

// Add a message to a session
export const addMessage = async (sessionId: string, message: Message): Promise<void> => {
  try {
    const sessions = await getSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex >= 0) {
      sessions[sessionIndex].messages.push(message);
      sessions[sessionIndex].updatedAt = Date.now();
      
      // Update session title if it's the first user message
      if (sessions[sessionIndex].title === 'New Chat' && message.role === 'user') {
        sessions[sessionIndex].title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
      }
      
      await saveSessions(sessions);
    }
  } catch (error) {
    console.error('Error adding message:', error);
  }
};