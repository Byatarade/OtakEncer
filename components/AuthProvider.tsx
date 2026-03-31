"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = "1085863512132-jmcloruml9vdu46qpomo6fqntcfr7a1m.apps.googleusercontent.com";

export interface User {
  name: string;
  email: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoaded: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('otak_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to parse user session", e);
    }
    setIsLoaded(true);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('otak_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('otak_user');
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <AuthContext.Provider value={{ user, login, logout, isLoaded }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export const useAuth = () => useContext(AuthContext);
