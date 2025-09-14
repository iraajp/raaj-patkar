import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { jwtDecode } from 'jwt-decode';
import { GOOGLE_CLIENT_ID } from '../config';

declare global {
  interface Window {
    google: any;
  }
}

interface DecodedJwt {
    name: string;
    email: string;
    picture: string;
    sub: string;
}

// --- LocalStorage Simulation ---
// In a real application, this would be handled by a backend server.
// For this frontend-only project, we simulate a user database in localStorage.

const getUsersFromStorage = (): Record<string, Omit<User, 'email'> & { password?: string }> => {
    try {
        const users = localStorage.getItem('users_db');
        return users ? JSON.parse(users) : {};
    } catch (e) {
        return {};
    }
};

const saveUsersToStorage = (users: Record<string, Omit<User, 'email'> & { password?: string }>) => {
    localStorage.setItem('users_db', JSON.stringify(users));
};

const getCurrentUserFromStorage = (): User | null => {
    try {
        const user = localStorage.getItem('current_user');
        return user ? JSON.parse(user) : null;
    } catch (e) {
        return null;
    }
}

const saveCurrentUserToStorage = (user: User) => {
    localStorage.setItem('current_user', JSON.stringify(user));
}

const clearCurrentUserFromStorage = () => {
    localStorage.removeItem('current_user');
}


export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => getCurrentUserFromStorage());
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    saveCurrentUserToStorage(loggedInUser);
    setError(null);
  };

  const signup = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    return new Promise(resolve => {
        setTimeout(() => { // Simulate network delay
            const users = getUsersFromStorage();
            if (users[email]) {
                setError("An account with this email already exists.");
                setLoading(false);
                resolve(false);
                return;
            }
            users[email] = { name, picture: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name)}`, password };
            saveUsersToStorage(users);
            const newUser: User = { name, email, picture: users[email].picture };
            handleAuthSuccess(newUser);
            setLoading(false);
            resolve(true);
        }, 1000);
    });
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    return new Promise(resolve => {
        setTimeout(() => { // Simulate network delay
            const users = getUsersFromStorage();
            const existingUser = users[email];
            if (existingUser && existingUser.password === password) {
                const loggedInUser: User = { name: existingUser.name, email, picture: existingUser.picture };
                handleAuthSuccess(loggedInUser);
                setLoading(false);
                resolve(true);
            } else {
                setError("Invalid email or password.");
                setLoading(false);
                resolve(false);
            }
        }, 1000);
    });
  }, []);

  const handleGoogleLogin = useCallback((response: any) => {
    try {
      const decoded: DecodedJwt = jwtDecode(response.credential);
      const googleUser: User = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      };
      
      // Sync with our local storage "DB"
      const users = getUsersFromStorage();
      if (!users[googleUser.email]) {
          users[googleUser.email] = {
              name: googleUser.name,
              picture: googleUser.picture,
              // No password for Google accounts
          };
          saveUsersToStorage(users);
      }
      
      handleAuthSuccess(googleUser);

    } catch (error) {
      console.error('Error decoding JWT:', error);
      setError("Failed to sign in with Google.");
    }
  }, []);

  const logout = useCallback(() => {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    setUser(null);
    clearCurrentUserFromStorage();
  }, []);

  useEffect(() => {
    if (GOOGLE_CLIENT_ID.startsWith("YOUR_GOOGLE_CLIENT_ID")) {
        console.error("Please replace the placeholder GOOGLE_CLIENT_ID in config.ts with your actual Google Client ID.");
        return;
    }

    const checkGoogleReady = () => {
      if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
              client_id: GOOGLE_CLIENT_ID,
              callback: handleGoogleLogin,
          });
          setIsGoogleReady(true);
      } else {
          setTimeout(checkGoogleReady, 100);
      }
    };
    
    checkGoogleReady();

  }, [handleGoogleLogin]);

  return { user, logout, login, signup, isGoogleReady, error, loading };
};