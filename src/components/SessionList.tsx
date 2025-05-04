import React from 'react';
import { Session } from '../types';

interface SessionListProps {
  sessions: Session[];
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
}

const SessionList: React.FC<SessionListProps> = ({ 
  sessions, 
  activeSessionId, 
  onSelectSession 
}) => {
  return (
    <div className="session-list">
      {sessions.map(session => (
        <div 
          key={session.id}
          className={`session-item ${session.id === activeSessionId ? 'active' : ''}`}
          onClick={() => onSelectSession(session.id)}
        >
          <span className="session-title">{session.title}</span>
          <span className="session-date">
            {new Date(session.updatedAt).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SessionList;