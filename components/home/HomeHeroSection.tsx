"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";

export function HomeHeroSection() {
  const router = useRouter();
  const { user, isLoaded } = useAuth();

  return (
    <motion.section
      id="beranda"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-[1280px] px-4 md:px-8 mt-4 md:mt-8 flex flex-col items-center relative z-20"
    >
      <AuroraBackground className="w-full rounded-[24px] md:rounded-[36px] overflow-hidden pt-10 pb-12 md:pt-[54px] md:pb-[54px] px-6 md:px-12 lg:px-16 flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-0 min-h-[460px] md:min-h-[480px]">
        <div className="flex flex-col items-center md:items-start z-30 w-full md:w-[45%] text-center md:text-left mt-0 md:mt-2">
          <h1 className="font-bold text-[32px] md:text-[50px] lg:text-[58px] leading-[1.2] md:leading-[1.1] text-white tracking-[-0.01em]">
            Ubah Dokumenmu <br className="hidden md:block" />
            Menjadi Materi <br className="md:hidden" />
            <span className="relative inline-block mt-0 md:mt-2">
              Siap Jadi
              <div className="absolute -bottom-[2px] left-0 w-full h-[3px] md:h-[5px] bg-[#ffa515] rounded-full"></div>
            </span>
          </h1>

          <p className="font-['Montserrat',sans-serif] text-[13px] md:text-[15px] lg:text-[16px] leading-[1.6] text-white/95 mt-6 md:mt-8 z-10 w-full max-w-[310px] md:max-w-[440px] font-medium">
            Upload PDF, Audio, atau link YouTube — AI akan meringkasnya menjadi materi yang siap dipelajari lebih cepat.
          </p>

          <div className="flex flex-row flex-wrap items-center justify-center md:justify-start gap-3 md:gap-5 mt-8 md:mt-10 z-10 w-full px-1 md:px-0">
            {isLoaded && user ? (
              <Button
                variant="glass"
                size="lg"
                onClick={() => router.push("/dashboard")}
                className="px-6 md:px-8 py-3.5 md:py-4 rounded-[16px] md:rounded-[20px]"
              >
                Buka Dashboard
              </Button>
            ) : (
              <Button
                variant="glass"
                size="lg"
                onClick={() => router.push("/login")}
                className="px-6 md:px-8 py-3.5 md:py-4 rounded-[16px] md:rounded-[20px]"
              >
                Mulai Gratis
              </Button>
            )}
          </div>
        </div>

        <div className="w-full md:w-[65%] flex justify-center md:justify-end items-center mt-6 md:mt-0 z-20 h-auto perspective-[1000px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full max-w-[500px] md:max-w-[700px] aspect-[1.3/1] md:aspect-[1.5/1] shadow-2xl rounded-xl transform-style-3d mr-0 md:-mr-10"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-[10%] xl:top-[5%] right-[5%] w-[85%] h-[80%] rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.3)] bg-white z-10"
            >
              <Image priority src="/assets/herogambar1.avif" alt="Dashboard Main" fill className="object-contain md:object-cover object-left-top" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              whileHover={{ scale: 1.05 }}
              className="absolute top-[45%] left-[-2%] w-[45%] h-[40%] rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.15)] bg-white overflow-hidden z-20 cursor-pointer"
            >
              <Image priority src="/assets/herogambardat.avif" alt="Left Panel" fill className="object-contain md:object-cover" />
            </motion.div>

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="absolute top-[-2%] right-[15%] w-[35%] h-[35%] rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.2)] bg-white overflow-hidden z-30 cursor-pointer"
            >
              <Image priority src="/assets/herogambar4.avif" alt="Top Panel" fill className="object-contain md:object-cover" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1.5 }}
              whileHover={{ scale: 1.05 }}
              className="absolute bottom-[-5%] right-[2%] w-[42%] h-[38%] rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.2)] bg-white overflow-hidden z-30 cursor-pointer"
            >
              <Image priority src="/assets/herogambar3.avif" alt="Bottom Right Panel" fill className="object-contain md:object-cover object-center" />
            </motion.div>
          </motion.div>
        </div>
      </AuroraBackground>
    </motion.section>
  );
}
