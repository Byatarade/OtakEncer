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
    let mounted = true;

    // Cek session saat awal dimuat
    const getSession = async () => {
      try {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Supabase timeout")), 1500)
        );

        const result = await Promise.race([sessionPromise, timeoutPromise]) as { data?: { session?: { user?: { id: string; email?: string; user_metadata: { full_name?: string; avatar_url?: string } } } } };
        const session = result?.data?.session;
        
        if (session?.user && mounted) {
          setUser({
            id: session.user.id,
            name: session.user.user_metadata.full_name || '',
            email: session.user.email || '',
            picture: session.user.user_metadata.avatar_url || '',
          });
        }
      } catch (err) {
        console.warn("Auth getSession timeout or error:", err);
      } finally {
        if (mounted) {
          setIsLoaded(true);
        }
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
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
        // Kita hanya assign isLoaded(true) pada event SIGN_IN / INITIAL_SESSION yg sukses,
        // namun hindari me-resetnya jika sudah true, agar tidak clash dengan finally getSession.
        setIsLoaded(true);
      }
    });

    return () => {
      mounted = false;
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
    // Reset user state SEGERA agar tidak ada race condition
    // di mana AuthGuard masih melihat `user` sebelum signOut selesai
    setUser(null);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Logout error (non-fatal):', err);
    }
    // Force hard redirect ke landing page agar cookies benar-benar bersih
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

  // Middleware sekarang yg menghandle proteksi rute, 
  // tapi guard client side tetap kita taruh sebagai safety-net fallback jika token kedaluwarsa dsb.
  useEffect(() => {
    if (isLoaded && !user) {
      // Redirect ke '/' (landing) bukan '/login' agar tidak loop
      // dengan middleware yang juga redirect unauthenticated → '/login'
      router.replace('/');
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#f8fafc] space-y-4">
        <div className="w-12 h-12 border-4 border-[#672cb9]/20 border-t-[#672cb9] rounded-full animate-spin"></div>
        <div className="text-[#672cb9] font-bold uppercase tracking-widest text-xs animate-pulse">
          Memuat Akun...
        </div>
      </div>
    );
  }

  // Jika tetap kosong (sudah diload tapi error/tidak ada), render null sebentar sblm dialihkan
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
