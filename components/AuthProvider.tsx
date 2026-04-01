"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

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
        document.cookie = "otak_auth=true; path=/; max-age=31536000; SameSite=Lax";
      } else {
        document.cookie = "otak_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
      }
    } catch (e) {
      console.error("Failed to parse user session", e);
    }
    setIsLoaded(true);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('otak_user', JSON.stringify(userData));
    document.cookie = "otak_auth=true; path=/; max-age=31536000; SameSite=Lax";
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('otak_user');
    document.cookie = "otak_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
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

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace('/login');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || !user) {
    return <div className="h-screen w-screen flex items-center justify-center bg-[#f8fafc] text-indigo-900 font-bold uppercase tracking-wider text-sm animate-pulse">Memuat...</div>;
  }

  return <>{children}</>;
}
