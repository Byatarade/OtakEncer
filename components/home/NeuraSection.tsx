"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { motion } from "framer-motion";

export const NeuraSection = forwardRef<HTMLElement>(function NeuraSection(_, ref) {
  return (
    <section ref={ref} id="neura" className="relative w-full px-4 md:px-0 mt-12 md:mt-24 mb-10 h-auto md:h-[480px] flex flex-col items-center justify-center overflow-visible">
      <div className="absolute top-[5%] md:top-[12%] left-1/2 -translate-x-1/2 w-full text-center z-0">
        <h2 className="text-[90px] md:text-[180px] lg:text-[220px] font-black tracking-[-0.03em] leading-none pointer-events-none select-none text-transparent bg-clip-text bg-gradient-to-r from-[#ffa515] via-[#c876b5] to-[#672cb9] animate-gradient-x bg-[length:200%_auto] opacity-90 drop-shadow-sm">
          NEURA
        </h2>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-[900px] h-full mt-6 md:mt-10">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="relative w-[280px] h-[340px] md:w-[380px] md:h-[440px] lg:w-[420px] lg:h-[480px] z-20 mt-[20px] md:mt-[10px]"
          style={{
            filter: "drop-shadow(-10px 18px 22px rgba(0,0,0,0.15)) drop-shadow(0px 6px 10px rgba(0,0,0,0.08))",
          }}
        >
          <Image src="/assets/maskot-neura.svg" alt="Neura Mascot" fill className="object-contain object-bottom" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="md:absolute md:left-[0%] lg:left-[4%] md:top-[30%] bg-white/80 backdrop-blur-xl rounded-[18px] p-5 lg:p-6 w-[230px] md:w-[240px] shadow-[0_8px_32px_rgba(0,0,0,0.06)] z-30 border border-white/50 hover:shadow-[0_16px_48px_rgba(103,44,185,0.12)] transition-all duration-500 mt-[-20px] md:mt-0 relative overflow-hidden group"
        >
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#672cb9]/10 rounded-full blur-2xl group-hover:bg-[#672cb9]/20 transition-all duration-700"></div>

          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#672cb9] to-transparent opacity-70"></div>

          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-2 w-2 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-0.5">Neura is Online</span>
          </div>

          <div className="relative z-10 flex flex-col items-start text-left">
            <h3 className="font-['Montserrat',sans-serif] text-[18px] md:text-[20px] font-bold text-gray-900 tracking-tight leading-tight">Bingung?</h3>
            <p className="font-['Montserrat',sans-serif] mt-1.5 text-[13px] md:text-[14px] leading-[1.5] font-medium text-gray-500">
              Tanyakan tentang fitur kami pada Neura.
            </p>
          </div>

          <div className="mt-4 w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50 group-hover:bg-[#672cb9] transition-colors duration-300">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400 group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-0.5"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
