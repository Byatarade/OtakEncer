"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";

export function HomeCtaSection() {
  const router = useRouter();

  return (
    <section className="w-full bg-white px-4 md:px-12 py-8 md:py-12 flex flex-col items-center relative z-20 font-['Montserrat',sans-serif]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-[860px] rounded-[28px] md:rounded-[36px] overflow-hidden shadow-[0_16px_48px_rgba(103,44,185,0.15)] relative"
      >
        <AuroraBackground className="w-full py-8 md:py-10 px-6 md:px-10 flex flex-col items-center text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[360px] h-[160px] bg-[radial-gradient(ellipse_at_center,rgba(255,165,21,0.25)_0%,transparent_70%)] rounded-full pointer-events-none mix-blend-screen"></div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-[110px] h-[110px] md:w-[180px] md:h-[180px] mb-2 md:mb-3 relative z-10"
          >
            <Image src="/assets/wajahneuraai.svg" alt="Robot AI Cta" width={120} height={120} className="w-full h-full object-contain" />
          </motion.div>

          <h3 className="text-white font-bold text-[20px] md:text-[30px] lg:text-[36px] tracking-tight mb-3 md:mb-4 leading-[1.2] relative z-10 drop-shadow-md">
            Siap Perbarui Cara
            <br className="md:hidden" /> Belajarmu?
          </h3>

          <p className="text-white/90 text-[13px] md:text-[15px] leading-[1.6] mb-5 md:mb-7 font-['Montserrat',sans-serif] px-2 max-w-[480px] relative z-10 font-medium">
            Bergabung dengan mereka yang telah merasakan kemudahan memahami dokumen kompleks bersama OtakEncer.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10 w-full sm:w-auto px-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push("/login")}
              className="w-full sm:w-auto px-7 md:px-9 h-[44px] md:h-[50px] shadow-[0_8px_25px_rgba(255,255,255,0.2)] hover:shadow-[0_12px_35px_rgba(255,255,255,0.3)] group mt-2"
            >
              Mulai Sekarang Gratis
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Button>
          </div>
        </AuroraBackground>
      </motion.div>
    </section>
  );
}
