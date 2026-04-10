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
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loginWithGoogle: async () => {},
  logout: async () => {},
  isLoaded: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Cek session saat awal dimuat
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Supabase getSession error:", error.message);
        }
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.full_name || '',
            email: session.user.email || '',
            picture: session.user.user_metadata.avatar_url || '',
          });
        }
      } catch (err) {
        console.error("Unexpected error during getSession:", err);
      } finally {
        setIsLoaded(true);
      }
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
      setIsLoaded(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
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
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, isLoaded }}>
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
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#f8fafc] space-y-4">
        <div className="w-12 h-12 border-4 border-[#672cb9]/20 border-t-[#672cb9] rounded-full animate-spin"></div>
        <div className="text-[#672cb9] font-bold uppercase tracking-widest text-xs animate-pulse">
          {!isLoaded ? "Memuat Akun..." : "Mengalihkan..."}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
