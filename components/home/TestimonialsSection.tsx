"use client";

import { motion } from "framer-motion";
import { testimonials } from "./home-data";
import { TestimonialCard } from "@/components/ui/TestimonialCard";

export function TestimonialsSection() {
  const triple = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section id="testimoni" className="w-full bg-[#fdfaff] flex flex-col items-center pt-14 pb-10 md:pt-16 md:pb-16 overflow-hidden z-20 relative">
      <div className="text-center mb-8 md:mb-12 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-block px-3 py-1 bg-[#7c3aed]/5 text-[#7c3aed] rounded-full text-[9px] font-bold uppercase tracking-[0.2em] mb-3 border border-[#7c3aed]/10"
        >
          Testimoni
        </motion.div>
        <h2 className="text-[24px] md:text-[30px] font-bold text-[#1e293b] leading-tight tracking-tight">Dipercaya oleh Pelajar di Indonesia</h2>
      </div>

      <div className="relative flex w-full max-w-[100vw] overflow-hidden group">
        <div className="absolute top-0 left-0 w-[100px] md:w-[320px] h-full bg-gradient-to-r from-[#fdfaff] via-[#fdfaff]/50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[100px] md:w-[320px] h-full bg-gradient-to-l from-[#fdfaff] via-[#fdfaff]/50 to-transparent z-10 pointer-events-none"></div>

        <motion.div
          className="flex gap-6 md:gap-10 min-w-max px-4 py-8 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 50, repeat: Infinity }}
        >
          {triple.map((t, idx) => (
            <TestimonialCard key={idx} t={t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
