'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-['Montserrat',sans-serif]">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#7c3aed]/5 blur-[100px] rounded-full z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#ffa515]/5 blur-[120px] rounded-full z-0"></div>

      <div className="relative flex flex-col items-center text-center max-w-[700px] w-full z-10">
        
        {/* Illustration Container */}
        <div className="relative w-full flex justify-center mb-6">
          {/* Large 404 Gradient Background Text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none z-0 mt-8">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-[160px] md:text-[320px] font-bold leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#ffa515]"
            >
              404
            </motion.h1>
          </div>

          {/* Mascot Center Stage */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative z-10 w-[240px] h-[240px] md:w-[320px] md:h-[320px] filter drop-shadow-[0_15px_30px_rgba(103,44,185,0.15)] mt-4"
          >
            <Image 
              src="/assets/maskot-neura-ai-error.svg" 
              alt="Neura AI Mascot 404" 
              fill 
              className="object-contain"
              priority
            />
          </motion.div>
        </div>

        {/* Message Content */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2, duration: 0.6 }}
           className="relative z-20 flex flex-col items-center"
        >
           <h2 className="text-[22px] md:text-[28px] font-semibold text-[#1e293b] mb-2 tracking-tight">
             Waduh! Halaman Hilang...
           </h2>
           <p className="text-gray-600 text-[14px] md:text-[15px] font-medium leading-relaxed mb-8 max-w-[420px] mx-auto">
             Maaf, halaman ini tidak ditemukan. Kami akan memperbaikinya segera mungkin!
           </p>

           {/* Return Button */}
           <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
           >
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white font-semibold text-[15px] rounded-full shadow-[0_8px_20px_rgba(124,58,237,0.25)] hover:shadow-[0_12px_25px_rgba(124,58,237,0.35)] transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Kembali ke Beranda
              </Link>
           </motion.div>
        </motion.div>

      </div>

      {/* Subtle Floating Particles for Depth */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
           <motion.div
             key={i}
             animate={{ 
               y: [0, -40, 0], 
               x: [0, Math.random() * 20 - 10, 0],
               opacity: [0.3, 0.6, 0.3] 
             }}
             transition={{ 
               repeat: Infinity, 
               duration: 5 + Math.random() * 5, 
               delay: Math.random() * 5 
             }}
             className="absolute w-2 h-2 bg-[#7c3aed]/15 rounded-full"
             style={{ 
               left: `${Math.random() * 100}%`, 
               top: `${Math.random() * 100}%` 
             }}
           />
        ))}
      </div>

    </div>
  );
}
