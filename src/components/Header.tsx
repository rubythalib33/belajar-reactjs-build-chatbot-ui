import React from 'react';
import { getCurrentUser, logoutUser } from '../utils/auth';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const user = getCurrentUser();
  
  const handleLogout = () => {
    logoutUser();
    onLogout();
  };
  
  return (
    <header className="app-header">
      <div className="header-logo">
        <h1>ChatGPT Clone</h1>
      </div>
      
      <div className="header-user">
        {user && (
          <>
            <span className="user-email">{user.email}</span>
            <button 
              className="logout-button" 
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header; 