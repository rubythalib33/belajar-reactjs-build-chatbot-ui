import React from 'react';
import SessionList from './SessionList';
import { Session } from '../types';

interface SidebarProps {
  sessions: Session[];
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, 
  activeSessionId, 
  onSelectSession,
  onNewSession 
}) => {
  return (
    <div className="sidebar">
      <div className="new-chat-button">
        <button onClick={onNewSession}>New Chat</button>
      </div>
      <SessionList 
        sessions={sessions} 
        activeSessionId={activeSessionId}
        onSelectSession={onSelectSession} 
      />
    </div>
  );
};

export default Sidebar;