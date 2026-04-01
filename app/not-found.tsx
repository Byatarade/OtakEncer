'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#7c3aed]/5 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#ffa515]/5 blur-[120px] rounded-full"></div>

      <div className="relative flex flex-col items-center text-center max-w-[600px] w-full z-10">
        
        {/* Large 404 Gradient Background Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none z-0">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-[140px] md:text-[280px] font-black leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#7c3aed] to-[#ffa515]"
          >
            404
          </motion.h1>
        </div>

        {/* Mascot Center Stage */}
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="relative z-10 mb-8 w-[200px] h-[200px] md:w-[300px] md:h-[300px] filter drop-shadow-[0_20px_40px_rgba(103,44,185,0.25)]"
        >
          <Image 
            src="/assets/MASKOT NEURA AI EROR.svg" 
            alt="Neura AI Mascot 404" 
            fill 
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Message Content */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2, duration: 0.6 }}
           className="relative z-20"
        >
           <h2 className="text-[24px] md:text-[32px] font-extrabold text-[#1e293b] mb-4 tracking-tight">
             Waduh! Halaman Hilang...
           </h2>
           <p className="text-gray-500 text-[15px] md:text-[17px] font-medium leading-relaxed mb-10 max-w-[420px] mx-auto font-['Montserrat',sans-serif]">
             Maaf, halaman ini tidak ditemukan. Mungkin Neura melompat terlalu jauh dan tersesat di dimensi lain!
           </p>

           {/* Return Button */}
           <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
           >
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white font-bold rounded-full shadow-[0_10px_25px_rgba(124,58,237,0.3)] hover:shadow-[0_15px_35px_rgba(124,58,237,0.4)] transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Kembali ke Beranda
              </Link>
           </motion.div>
        </motion.div>

      </div>

      {/* Subtle Floating Particles for Depth */}
      <div className="absolute inset-0 pointer-events-none">
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
             className="absolute w-2 h-2 bg-[#7c3aed]/20 rounded-full"
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
