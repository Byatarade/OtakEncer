'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Hammer, Sparkles, MessageSquareShare, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function KolaborasiPage() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 md:p-12 text-center bg-[#fafafa] font-montserrat relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#672cb9]/10 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-400/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000"></div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-[32px] shadow-2xl flex items-center justify-center border border-gray-100 mb-8"
      >
        <Users size={48} className="text-[#672cb9]" strokeWidth={1.5} />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative z-10 max-w-lg"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Ruang Kolaborasi
        </h1>
        <p className="text-base sm:text-lg text-slate-500 font-medium mb-8 leading-relaxed px-4">
          Fitur belajar kelompok dan diskusi interaktif bersama teman-teman OtakEncer sedang dalam tahap pengembangan. Kami tidak sabar menunjukkannya kepada Anda!
        </p>

        <div className="grid grid-cols-1 flex-col sm:grid-cols-2 gap-4 mb-10 w-full max-w-md mx-auto text-left">
           <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
              <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                 <MessageSquareShare size={20} className="text-blue-600" />
              </div>
              <div>
                 <h3 className="font-bold text-slate-800 text-sm mb-1">Diskusi AI</h3>
                 <p className="text-xs text-slate-500">Tanya jawab materi bersama bot pengajar grup.</p>
              </div>
           </div>
           
           <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
              <div className="bg-orange-50 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                 <Hammer size={20} className="text-orange-600" />
              </div>
              <div>
                 <h3 className="font-bold text-slate-800 text-sm mb-1">Tantangan Kuis</h3>
                 <p className="text-xs text-slate-500">Lomba skor melawan teman sekelas.</p>
              </div>
           </div>
        </div>

        <Link href="/dashboard">
          <Button className="bg-[#672cb9] hover:bg-[#522199] text-white rounded-xl h-12 px-8 font-bold shadow-lg shadow-[#672cb9]/30 transition-all hover:scale-105 active:scale-95 group">
             <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
             Kembali ke Dashboard
          </Button>
        </Link>
      </motion.div>

    </div>
  );
}