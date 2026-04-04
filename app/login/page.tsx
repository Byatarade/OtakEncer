"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await login();
      // Supabase signInWithOAuth will automatically redirect the user to Google
      // and then back to the origin (/dashboard as configured in AuthProvider)
    } catch (err) {
      console.error("Google Login Failed:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] font-['Montserrat',sans-serif] relative overflow-hidden">
      {/* Background gradient blurs, matching landing page aesthetics */}
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
            Silakan login untuk melanjutkan ke Ruang Kerja AI.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          
          {/* Main Google Login Action */}
          <div className="relative w-full flex flex-col items-center">
            {/* Badge */}
            <div className="absolute -top-3 z-20 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-emerald-200">
              Most Recommended
            </div>
            
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-[#672cb9] text-[#672cb9] hover:bg-[#672cb9] hover:text-white px-6 py-4 rounded-[16px] font-bold text-[15px] transition-all shadow-[0_4px_14px_rgba(103,44,185,0.15)] disabled:opacity-70 disabled:cursor-not-allowed group relative z-10">
               <Image src="/assets/google-icon.svg" alt="Google" width={22} height={22} className="group-hover:brightness-0 group-hover:invert transition-all" />
               {isLoading ? 'Memproses...' : 'Lanjutkan dengan Google'}
            </button>
          </div>

          <div className="relative flex items-center py-2 opacity-60">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-[11px] font-bold tracking-widest uppercase">Atau email</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Disabled Email/Password fields */}
          <div className="flex flex-col gap-3 opacity-50 relative">
             {/* Overlay to catch clicks and prevent focus cleanly */}
             <div className="absolute inset-0 z-10 cursor-not-allowed" title="Gunakan Google Login untuk kemudahan dan keamanan"></div>
             
             <input 
               type="email" 
               placeholder="Alamat Email" 
               disabled
               className="w-full px-5 py-3.5 rounded-[16px] border border-slate-200 bg-slate-50 outline-none text-[14px] font-medium"
             />
             <input 
               type="password" 
               placeholder="Kata Sandi" 
               disabled
               className="w-full px-5 py-3.5 rounded-[16px] border border-slate-200 bg-slate-50 outline-none text-[14px] font-medium"
             />
             <button disabled className="w-full flex items-center justify-center bg-slate-300 text-slate-500 px-6 py-3.5 rounded-[16px] font-bold text-[14px] mt-2">
                Masuk
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}