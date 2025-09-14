
import { useState, useCallback } from 'react';
import type { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(() => {
    // In a real application, this would involve an OAuth flow.
    // Here, we're simulating a successful login.
    const mockUser: User = {
      name: 'Alex Rider',
      email: 'alex.rider@example.com',
      picture: 'https://picsum.photos/seed/user/100/100',
    };
    setUser(mockUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return { user, login, logout };
};
