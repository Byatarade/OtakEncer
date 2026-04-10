"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import Swal from 'sweetalert2';

export default function RegisterPage() {
  const { loginWithGoogle } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Validasi
    if (password.length < 6) {
      setErrorMsg('Tanda sandi minimal 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Kata sandi tidak cocok.');
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) throw error;
      
      if (data.user) {
        setIsSuccess(true);
      }
    } catch (err: unknown) {
      console.error("Register Failed:", err);
      let errMsg = 'Gagal mendaftarkan akun. Silakan coba lagi.';
      if ((err instanceof Error ? err.message : String(err)).includes('User already registered')) {
        errMsg = 'Email ini sudah terdaftar. Silakan menuju halaman Login.';
      } else if ((err instanceof Error ? err.message : String(err)).includes('rate limit')) {
        errMsg = 'Terlalu banyak percobaan. Silakan tunggu beberapa saat.';
      }
      setErrorMsg(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
    } catch (err) {
      console.error("Google Login Failed:", err);
      Swal.fire({
        title: 'Daftar Gagal',
        text: 'Terjadi kesalahan saat masuk dengan Google.',    
        icon: 'error',
        confirmButtonColor: '#672cb9'
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] font-['Montserrat',sans-serif] relative overflow-hidden py-10">
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#672cb9]/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[40%] bg-[#ffa515]/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="w-full max-w-[420px] p-8 sm:p-10 bg-white rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-slate-100 relative z-10 mx-4">
        
        <div className="flex flex-col items-center justify-center mb-8">
          <Link href="/" className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 relative">
              <Image src="/assets/logo.svg" alt="Logo" fill className="object-contain" />  
            </div>
            <span className="text-[24px] font-extrabold text-slate-900 tracking-tight">OtakEncer</span>
          </Link>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500 py-4">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
               <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h1 className="text-[22px] font-bold text-slate-900 mb-3 tracking-tight">Cek Kotak Masuk Anda</h1>
            <p className="text-[14px] text-slate-500 font-medium mb-8 leading-relaxed">
              Kami telah mengirimkan tautan verifikasi ke: 
              <br/><span className="text-[#672cb9] font-bold mt-1 inline-block">{email}</span>
              <br/><br/>Silakan klik tautan tersebut untuk mengaktifkan akun Anda.
            </p>
            <Link href="/login" className="w-full flex items-center justify-center bg-[#672cb9] text-white hover:bg-[#522199] px-6 py-4 rounded-[16px] font-bold text-[15px] transition-colors">
              Kembali ke Login
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-8">
              <h1 className="text-[24px] font-bold text-[#0f172a] mb-2 tracking-tight">Daftar Akun</h1>
              <p className="text-[13px] text-slate-500 font-medium text-center px-2">
                Bergabunglah dan tingkatkan produktivitas belajar Anda.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3 bg-red-50 text-red-600 text-[13px] font-semibold rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRegister} className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-slate-700 ml-1">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-5 py-3.5 rounded-[16px] border border-slate-200 bg-white focus:bg-slate-50 focus:border-[#672cb9] focus:ring-2 focus:ring-[#672cb9]/20 outline-none text-[14px] font-medium transition-all"
                  required
                />
              </div>

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
                <label className="text-[13px] font-bold text-slate-700 ml-1">Kata Sandi</label>
                <input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-5 py-3.5 rounded-[16px] border border-slate-200 bg-white focus:bg-slate-50 focus:border-[#672cb9] focus:ring-2 focus:ring-[#672cb9]/20 outline-none text-[14px] font-medium transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-slate-700 ml-1">Konfirmasi Kata Sandi</label>
                <input
                  type="password"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
              </button>
            </form>

            <div className="relative flex items-center py-2 mb-6">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-[11px] font-bold tracking-widest uppercase">Atau daftar dengan</span>
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
                Sudah punya akun?{' '}
                <Link href="/login" className="text-[#672cb9] font-bold hover:underline">
                  Masuk
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
