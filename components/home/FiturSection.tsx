"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function FiturSection() {
  const router = useRouter();

  return (
    <section id="fitur" className="relative w-full flex flex-col items-center pt-24 md:pt-36 pb-12 md:pb-24 bg-[#08020d] rounded-t-[40px] md:rounded-t-[80px] mt-16 md:mt-24 z-20 border-t border-white/5 overflow-hidden font-['Montserrat',sans-serif]">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#08020d] via-[#10031c] to-[#08020d]"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(114,35,204,0.15)_0%,transparent_60%)] rounded-[100%] rotate-[-15deg] blur-[80px]"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-[80vw] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(63,16,134,0.2)_0%,transparent_60%)] rounded-[100%] rotate-[25deg] blur-[100px]"></div>
        <div className="absolute top-[30%] left-[20%] w-[50vw] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(163,104,221,0.1)_0%,transparent_70%)] rounded-[100%] blur-[90px]"></div>
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
          }}
        ></div>
      </div>

      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(45deg, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(-45deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          backgroundPosition: "center center",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 20%, transparent 70%)",
          maskImage: "radial-gradient(ellipse at 50% 40%, black 20%, transparent 70%)",
        }}
      ></div>

      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#9d4edd]/15 blur-[100px] rounded-[100%] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-[#08020d] to-transparent pointer-events-none z-10"></div>

      <div className="w-full max-w-[1240px] flex flex-col items-center justify-center z-20 px-6 md:px-12 relative flex-1">
        <div className="w-full flex flex-col items-center text-center text-white mb-16 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[34px] md:text-[48px] lg:text-[60px] font-bold leading-[1.2] tracking-tight text-white mb-4 relative font-['Montserrat',sans-serif]"
          >
            Dari Dokumen Kusut <br className="hidden md:block" />
            Jadi{" "}
            <span className="relative inline-block text-[#ffa515] italic pr-2 font-serif">
              Nilai A+
              <svg className="absolute -bottom-2 left-0 w-full h-[12px] text-[#a368dd]" viewBox="0 0 100 20" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                <path d="M5,15 Q 40,5 95,15" />
              </svg>
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[15px] md:text-[18px] text-white/70 max-w-[340px] md:max-w-[560px] leading-[1.6]"
          >
            Tinggalkan cara lama. Gabungkan semua catatan, jurnal, atau video materimu, dan biarkan AI meraciknya menjadi flashcard & ringkasan interaktif.
          </motion.p>
        </div>

        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-6 relative z-30">
          <Card
            hoverable
            variant="dark"
            padding="lg"
            className="w-full lg:w-1/3 flex flex-col relative min-h-[380px]"
          >
            <div className="w-10 h-10 rounded-full bg-[#672cb9] flex items-center justify-center mb-6 font-bold text-lg text-white shadow-lg absolute -top-5 -left-2 border-4 border-[#0d0415] rotate-[-5deg]">
              1
            </div>
            <h3 className="text-white font-bold text-[20px] mb-2 leading-tight">Tumpuk Materimu</h3>
            <p className="text-white/50 text-[13px] mb-8 leading-[1.5]">Upload PDF, Word, atau Paste Link YouTube dosenmu ke dalam satu folder belajar.</p>
            <div className="relative h-[140px] w-full flex justify-center items-center mt-auto">
              {/* Restored Animated Elements */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute w-[100px] h-[120px] bg-white rounded-lg shadow-xl border border-gray-200 rotate-[-12deg] -translate-x-6 flex flex-col p-2 gap-2"
              >
                <div className="w-[80%] h-2 bg-[#ff6b6b]/20 rounded-full"></div>
                <div className="w-full h-2 bg-gray-100 rounded-full"></div>
                <div className="w-[60%] h-2 bg-gray-100 rounded-full"></div>
                <div className="mt-auto self-end text-[#ff6b6b]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 3.5 }}
                className="absolute w-[100px] h-[120px] bg-white rounded-lg shadow-xl border border-gray-200 rotate-[8deg] translate-x-6 flex flex-col p-2 gap-2"
              >
                <div className="w-[80%] h-2 bg-[#4dabf7]/20 rounded-full"></div>
                <div className="w-full h-2 bg-gray-100 rounded-full"></div>
                <div className="mt-auto self-end text-[#4dabf7]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4.5 }}
                className="absolute w-[110px] h-[130px] bg-gradient-to-br from-[#1c0f2e] to-[#2a1744] border border-[#672cb9]/50 rounded-lg shadow-2xl z-10 flex items-center justify-center"
              >
                <div className="bg-white/10 p-3 rounded-full backdrop-blur-md text-[#ffa515]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
              </motion.div>
            </div>
          </Card>

          <Card
            hoverable
            variant="dark"
            padding="lg"
            className="w-full lg:w-1/3 flex flex-col relative min-h-[380px]"
          >
            <div className="w-10 h-10 rounded-full bg-[#672cb9] flex items-center justify-center mb-6 font-bold text-lg text-white shadow-lg absolute -top-5 -left-2 border-4 border-[#0d0415] rotate-[5deg]">
              2
            </div>
            <h3 className="text-white font-bold text-[20px] mb-2 leading-tight">Biar Neura Merangkum</h3>
            <p className="text-white/50 text-[13px] mb-8 leading-[1.5]">AI kami akan membaca ribuan kata dan menyaring poin-poin terpenting layaknya spidol ajaib.</p>
            <div className="relative h-[140px] w-full flex justify-center items-center mt-auto">
              <div className="w-[160px] h-[120px] bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
                <div className="w-[40%] h-2 bg-white/20 rounded-full"></div>
                <div className="w-full h-2 bg-white/10 rounded-full"></div>
                <div className="w-[85%] h-2 bg-white/10 rounded-full"></div>
                <div className="w-[70%] h-2 bg-white/10 rounded-full"></div>
                <motion.div
                  animate={{ y: [0, 80, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute top-0 left-0 w-full h-[20px] bg-gradient-to-b from-[#ffa515]/0 via-[#ffa515]/30 to-[#ffa515]/0 border-b border-[#ffa515]/50 flex items-center shadow-[0_0_15px_#ffa515]"
                ></motion.div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-2 -right-2 text-[#ffa515]"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" />
                </svg>
              </motion.div>
            </div>
          </Card>

          <Card
            hoverable
            variant="dark"
            padding="lg"
            className="w-full lg:w-1/3 flex flex-col relative min-h-[380px] border-[#ffa515]/30 shadow-[0_10px_30px_rgba(255,165,21,0.1)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffa515]/5 to-transparent rounded-[24px] pointer-events-none"></div>
            <div className="w-10 h-10 rounded-full bg-[#ffa515] flex items-center justify-center mb-6 font-bold text-lg text-[#0d0415] shadow-lg absolute -top-5 -left-2 border-4 border-[#0d0415] rotate-[-5deg]">
              3
            </div>
            <h3 className="text-white font-bold text-[20px] mb-2 leading-tight z-10">Materi Siap Ujian</h3>
            <p className="text-white/50 text-[13px] mb-8 leading-[1.5] z-10">Hasil akhirnya berupa Flashcard interaktif dan Rangkuman rapi yang siap kamu pelajari di mana saja.</p>
            <div className="relative h-[140px] w-full flex justify-center items-center mt-auto group">
              <motion.div className="absolute w-[120px] h-[80px] bg-white border border-gray-200 rounded-xl shadow-lg rotate-[-10deg] -translate-x-4 translate-y-4 group-hover:-translate-x-8 transition-transform duration-300 flex items-center justify-center opacity-70"></motion.div>
              <motion.div className="absolute w-[120px] h-[80px] bg-white border border-gray-200 rounded-xl shadow-xl rotate-[5deg] translate-x-4 translate-y-2 group-hover:translate-x-8 transition-transform duration-300 flex items-center justify-center opacity-90"></motion.div>
              <motion.div className="absolute w-[130px] h-[90px] bg-white border border-[#672cb9]/30 rounded-xl shadow-2xl z-10 flex flex-col px-4 py-3 justify-center items-center text-center group-hover:-translate-y-4 transition-transform duration-300">
                <span className="text-[#672cb9] font-bold text-[14px]">Flashcard</span>
                <span className="text-gray-400 text-[10px] mt-1">Tap/Flip to Reveal</span>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#51cf66] text-white rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </motion.div>
            </div>
          </Card>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16 md:mt-20 w-full"
        >
          <Button
            variant="glass"
            size="lg"
            className="w-full sm:w-auto rounded-full group px-8"
            onClick={() => {
              const elem = document.getElementById("comment");
              if (elem) elem.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Lihat kata mereka
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
