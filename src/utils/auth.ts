import { User, AuthState } from '../types';
import { readJsonFile, writeJsonFile } from './fs';

// File path
const USERS_FILE = '/db/users.json';
const AUTH_STATE_KEY = 'authState';

// In-memory cache
let usersCache: User[] | null = null;

// Get all users from JSON file
export const getUsers = async (): Promise<User[]> => {
  try {
    // Use cache if available
    if (usersCache) {
      return usersCache;
    }
    
    // Otherwise read from file
    const users = await readJsonFile<User[]>(USERS_FILE);
    usersCache = users;
    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    // Fallback to default admin user
    const defaultAdmin: User = { email: 'admin@gmail.com', password: 'admin' };
    return [defaultAdmin];
  }
};

// Login user
export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const users = await getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Store auth state in localStorage (for session persistence)
      const authState: AuthState = {
        isAuthenticated: true,
        user: { email: user.email, password: '' } // Don't store password in authState
      };
      
      localStorage.setItem(AUTH_STATE_KEY, JSON.stringify(authState));
      return user;
    }
    
    return null;
  } catch (error) {
    console.error('Error during login:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const authState = localStorage.getItem(AUTH_STATE_KEY);
  if (authState) {
    const { isAuthenticated } = JSON.parse(authState) as AuthState;
    return isAuthenticated;
  }
  return false;
};

// Get current user
export const getCurrentUser = (): User | null => {
  const authState = localStorage.getItem(AUTH_STATE_KEY);
  if (authState) {
    const { user } = JSON.parse(authState) as AuthState;
    return user;
  }
  return null;
};

// Logout user
export const logoutUser = (): void => {
  localStorage.removeItem(AUTH_STATE_KEY);
}; 