import Image from "next/image";
import { forwardRef } from "react";
import { motion } from "framer-motion";


export const NeuraSection = forwardRef<HTMLElement>(function NeuraSection(_, ref) {
  return (
    <section ref={ref} id="neura" className="relative w-full px-4 md:px-0 mt-12 md:mt-24 mb-10 h-auto md:h-[480px] flex flex-col items-center justify-center overflow-visible font-['Montserrat',sans-serif]">
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
          className="md:absolute md:left-[2%] lg:left-[5%] md:top-[35%] bg-white rounded-[20px] w-[220px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 z-30 mt-[-20px] md:mt-0 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase">Neura Online</span>
          </div>

          <div>
            <h3 className="text-[16px] font-bold text-gray-800 tracking-tight">Bingung?</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
              Tanyakan tentang fitur kami pada Neura.
            </p>
          </div>

          <div 
            onClick={() => window.dispatchEvent(new Event('openNeuraChatbot'))}
            className="flex items-center text-[#672cb9] text-[12px] font-semibold mt-1 group cursor-pointer w-fit"
          >
            <span>Tanya sekarang</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1 transition-transform group-hover:translate-x-1"
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
