"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  isLoaded: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Cek session saat awal dimuat
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.full_name || '',
          email: session.user.email || '',
          picture: session.user.user_metadata.avatar_url || '',
        });
      }
      setIsLoaded(true);
    };

    getSession();

    // Dengarkan perubahan login/logout dari Supabase (misal saat redirect balik dari Google)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.full_name || '',
          email: session.user.email || '',
          picture: session.user.user_metadata.avatar_url || '',
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace('/');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || !user) {
    return <div className="h-screen w-screen flex items-center justify-center bg-[#f8fafc] text-indigo-900 font-bold uppercase tracking-wider text-sm animate-pulse">Memuat...</div>;
  }

  return <>{children}</>;
}
