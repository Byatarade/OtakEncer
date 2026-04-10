"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
    } catch (err) {
      console.error("Google Login Failed:", err);
      Swal.fire({
        title: 'Login Gagal',
        text: 'Terjadi kesalahan saat mencoba masuk dengan Google.',    
        icon: 'error',
        confirmButtonColor: '#672cb9'
      });
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        window.location.href = '/dashboard';
      }
    } catch (err: unknown) {
      console.error("Email Login Failed:", err);
      let errMsg = 'Terjadi kesalahan saat login.';
      if ((err instanceof Error ? err.message : String(err)).includes('Invalid login credentials')) {
        errMsg = 'Email atau password salah.';
      } else if ((err instanceof Error ? err.message : String(err)).includes('Email not confirmed')) {
        errMsg = 'Email belum diverifikasi. Silakan cek kotak masuk Anda.';
      }
      setErrorMsg(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] font-['Montserrat',sans-serif] relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#672cb9]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[40%] bg-[#ffa515]/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="w-full max-w-[420px] p-8 sm:p-10 bg-white rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-slate-100 relative z-10 mx-4">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 relative">
              <Image src="/assets/logo.svg" alt="Logo" fill className="object-contain" />  
            </div>
            <span className="text-[24px] font-extrabold text-slate-900 tracking-tight">OtakEncer</span>
          </Link>

          <h1 className="text-[24px] font-bold text-[#0f172a] mb-2 tracking-tight">Selamat Datang</h1>
          <p className="text-[13px] text-slate-500 font-medium text-center px-4">
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-[13px] font-semibold rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-slate-700 ml-1">Alamat Email</label>
            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-5 py-3.5 rounded-[16px] border border-slate-200 bg-white focus:bg-slate-50 focus:border-[#672cb9] focus:ring-2 focus:ring-[#672cb9]/20 outline-none text-[14px] font-medium transition-all"
              required
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[13px] font-bold text-slate-700">Kata Sandi</label>
            </div>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full px-5 py-3.5 rounded-[16px] border border-slate-200 bg-white focus:bg-slate-50 focus:border-[#672cb9] focus:ring-2 focus:ring-[#672cb9]/20 outline-none text-[14px] font-medium transition-all"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-[#672cb9] text-white hover:bg-[#522199] px-6 py-3.5 rounded-[16px] font-bold text-[15px] mt-2 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
             {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="relative flex items-center py-2 mb-6">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-[11px] font-bold tracking-widest uppercase">Atau masuk dengan</span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-200 hover:text-slate-900 px-6 py-3.5 rounded-[16px] font-bold text-[14px] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Image src="/assets/google-icon.svg" alt="Google" width={20} height={20} />
          Google
        </button>

        <div className="mt-8 text-center">
          <p className="text-[13px] text-slate-500 font-medium">
            Belum punya akun?{' '}
            <Link href="/register" className="text-[#672cb9] font-bold hover:underline">
              Daftar Gratis
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
