"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import Swal from 'sweetalert2';

export default function RegisterPage() {
  const { loginWithGoogle, user, isLoaded } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'register' | 'otp' | 'success'>('register');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');

  useEffect(() => {
    if (isLoaded && user) {
      window.location.href = '/dashboard';
    }
  }, [user, isLoaded]);

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
        setStep('otp');
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

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (otpCode.length !== 6) {
      setErrorMsg('Kode OTP harus terdiri dari 6 angka.');
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'signup'
      });

      if (error) throw error;
      
      if (data.user) {
        setStep('success');
        // Let it redirect automatically using useEffect on user change or force it:
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      }
    } catch (err: unknown) {
      console.error("OTP Verification Failed:", err);
      setErrorMsg('Kode verifikasi tidak valid atau telah kadaluarsa.');
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
    <div className="min-h-[100dvh] w-full flex flex-col bg-[#f8fafc] font-['Montserrat',sans-serif] relative overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
      {/* Fix iOS Safari GPU Freeze: Mengganti blur ekstrim dengan Native Radial Gradient menghindari crash saat rendering/re-render form password */}
      <div className="fixed top-[-10%] right-[-5%] w-[300px] md:w-[40%] h-[300px] md:h-[40%] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(103,44,185,0.15) 0%, transparent 70%)' }}></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[300px] md:w-[30%] h-[300px] md:h-[40%] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(255,165,21,0.15) 0%, transparent 70%)' }}></div>

      <div className="w-full max-w-[360px] sm:max-w-[380px] p-6 sm:px-8 sm:py-7 bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-100 relative z-10 mx-auto mt-10 mb-10 sm:m-auto">
        
        <div className="flex flex-col items-center justify-center mb-4">
          <Link href="/" className="flex items-center gap-2 mb-2 sm:mb-3 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 sm:w-8 sm:h-8 relative">
              <Image src="/assets/logo.svg" alt="Logo" fill className="object-contain" />  
            </div>
            <span className="text-[18px] sm:text-[20px] font-extrabold text-slate-900 tracking-tight">OtakEncer</span>
          </Link>
        </div>

        {step === 'success' ? (
          <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500 py-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
               <svg className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h1 className="text-[18px] sm:text-[20px] font-bold text-slate-900 mb-2 tracking-tight">Pendaftaran Berhasil!</h1>
            <p className="text-[12px] sm:text-[13px] text-slate-500 font-medium mb-5 leading-relaxed">
              Anda sedang dialihkan ke Dashboard...
            </p>
          </div>
        ) : step === 'otp' ? (
          <div className="flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-2 duration-500 py-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#f5f3ff] rounded-full flex items-center justify-center mb-4">
               <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#672cb9]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <h1 className="text-[18px] sm:text-[20px] font-bold text-slate-900 mb-2 tracking-tight">Masukkan Kode OTP</h1>
            <p className="text-[12px] sm:text-[13px] text-slate-500 font-medium mb-5 leading-relaxed">
              Kode 6 digit telah dikirim ke:
              <br/><span className="text-[#672cb9] font-bold mt-1 inline-block">{email}</span>
            </p>

            {errorMsg && (
              <div className="w-full mb-4 p-2.5 bg-red-50 text-red-600 text-[11px] sm:text-[12px] font-semibold rounded-xl border border-red-100 animate-in fade-in">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-4">
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                disabled={isLoading}
                className="w-full text-center tracking-[0.5em] font-bold text-[24px] px-4 py-3 rounded-xl border border-slate-200 focus:border-[#672cb9] focus:ring-2 focus:ring-[#672cb9]/20 outline-none text-slate-900 transition-all"
                required
              />
              <button 
                type="submit" 
                disabled={isLoading || otpCode.length !== 6}
                className="w-full flex items-center justify-center bg-[#672cb9] disabled:bg-slate-300 disabled:cursor-not-allowed text-white hover:bg-[#522199] px-4 py-3 rounded-xl font-bold text-[13px] sm:text-[14px] transition-colors"
               >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : 'Verifikasi Akun'}
              </button>
            </form>
            <button 
               onClick={() => setStep('register')} 
               disabled={isLoading}
               className="mt-4 text-[#672cb9] font-semibold text-[12px] hover:underline"
            >
              Ubah Alamat Email
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-5">
              <h1 className="text-[18px] sm:text-[22px] font-bold text-[#0f172a] mb-1 tracking-tight">Daftar Akun</h1>
              <p className="text-[11px] sm:text-[12px] text-slate-500 font-medium text-center px-1">
                Bergabunglah dan tingkatkan produktivitas belajar Anda.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-2.5 bg-red-50 text-red-600 text-[11px] sm:text-[12px] font-semibold rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-1">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRegister} className="flex flex-col gap-3.5 mb-4">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] sm:text-[12px] font-bold text-slate-700 ml-1">Nama Lengkap</label>
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 rounded-[10px] sm:rounded-[12px] border border-slate-200 bg-white focus:bg-slate-50 focus:border-[#672cb9] focus:ring-2 focus:ring-[#672cb9]/20 outline-none text-[12px] sm:text-[13px] text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] sm:text-[12px] font-bold text-slate-700 ml-1">Alamat Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 rounded-[10px] sm:rounded-[12px] border border-slate-200 bg-white focus:bg-slate-50 focus:border-[#672cb9] focus:ring-2 focus:ring-[#672cb9]/20 outline-none text-[12px] sm:text-[13px] text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] sm:text-[12px] font-bold text-slate-700 ml-1">Kata Sandi</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Min 6 char"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3.5 py-2.5 rounded-[10px] sm:rounded-[12px] border border-slate-200 bg-white focus:bg-slate-50 focus:border-[#672cb9] focus:ring-2 focus:ring-[#672cb9]/20 outline-none text-[12px] sm:text-[13px] text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] sm:text-[12px] font-bold text-slate-700 ml-1 whitespace-nowrap">Konfirmasi Sandi</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3.5 py-2.5 rounded-[10px] sm:rounded-[12px] border border-slate-200 bg-white focus:bg-slate-50 focus:border-[#672cb9] focus:ring-2 focus:ring-[#672cb9]/20 outline-none text-[12px] sm:text-[13px] text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center bg-[#672cb9] text-white hover:bg-[#522199] px-4 py-2.5 rounded-[10px] sm:rounded-[12px] font-bold text-[13px] sm:text-[14px] mt-1 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
              </button>
            </form>

            <div className="relative flex items-center py-0 mb-4">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink-0 mx-3 text-slate-400 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">Atau daftar dengan</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              type="button"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-200 hover:text-slate-900 px-4 py-2.5 rounded-[10px] sm:rounded-[12px] font-bold text-[13px] sm:text-[14px] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Image src="/assets/google-icon.svg" alt="Google" width={16} height={16} className="sm:w-4 sm:h-4" />
              Google
            </button>

            <div className="mt-5 text-center">
              <p className="text-[11px] sm:text-[12px] text-slate-500 font-medium">
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
