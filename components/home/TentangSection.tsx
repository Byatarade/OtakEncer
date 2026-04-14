"use client";

import { motion } from "framer-motion";
// tess
export function TentangSection() {
  return (
    <section id="tentang" className="relative w-full px-6 md:px-12 lg:px-24 py-24 md:py-32 bg-[#fcfcfc] flex flex-col items-center overflow-hidden">
      <div className="absolute top-0 right-[10%] w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(103,44,185,0.02)_0%,transparent_60%)] pointer-events-none"></div>
      <div className="absolute bottom-0 left-[5%] w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(255,165,21,0.02)_0%,transparent_60%)] pointer-events-none"></div>

      <div className="flex flex-col items-center text-center mb-16 md:mb-24 z-10 w-full max-w-[800px]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200/80 mb-6 shadow-sm"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#672cb9]"></div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-gray-700">Filosofi & Keunggulan</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[36px] md:text-[48px] lg:text-[54px] font-bold text-gray-900 leading-[1.1] tracking-[-0.03em]"
        >
          Era Baru Belajar Cerdas dengan{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#672cb9] to-[#8c46d4]">Kekuatan AI Multimodal.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-[15px] md:text-[17px] leading-[1.6] text-gray-500 font-medium max-w-[620px]"
        >
          OtakEncer hadir sebagai asisten edukasi yang tidak hanya merangkum, tapi membantu Anda menguasai materi tersulit dalam hitungan detik!
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full max-w-[1240px] z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 lg:col-span-2 bg-[#ffffff] rounded-[24px] p-8 md:p-10 border border-gray-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-start relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_top_right,rgba(103,44,185,0.02)_0%,transparent_70%)] pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>

          <div className="w-12 h-12 rounded-[14px] bg-white border border-gray-100 flex items-center justify-center mb-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] text-[#672cb9]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>

          <div className="relative z-10 w-full lg:w-[85%]">
            <h3 className="text-[20px] md:text-[22px] font-bold text-gray-900 mb-3 tracking-tight">Evolusi Belajar Digital</h3>
            <p className="text-[14px] md:text-[15px] leading-[1.7] text-gray-500 font-medium">
              OtakEncer memberikan pengalaman belajar yang mudah dipahami dengan memadukan mesin AI terbaru yang mampu memproses rangkuman dan quiz secara bersamaan. Kami memungkinkan Anda beralih dari sekadar membaca menjadi benar-benar memahami.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="md:col-span-1 lg:col-span-1 bg-white rounded-[24px] p-8 border border-gray-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-start relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all duration-500"
        >
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-6 text-[#ffa515] border border-orange-100/50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>

          <div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-[44px] font-bold text-gray-900 leading-none tracking-tighter">99.9</span>
              <span className="text-[24px] font-bold text-[#ffa515]">%</span>
            </div>
            <h4 className="text-[15px] font-bold text-gray-900 mb-1">Akurasi Jawaban</h4>
            <p className="text-[13px] text-gray-500 font-medium leading-[1.6]">Algoritma kami memastikan intisari materi tetap akurat dan bebas dari informasi palsu.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="md:col-span-1 lg:col-span-1 bg-white rounded-[24px] p-8 border border-gray-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-start relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all duration-500"
        >
          <div className="w-10 h-10 rounded-full bg-[#f8f5fc] flex items-center justify-center mb-6 text-[#672cb9] border border-[#f0e7f7]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>

          <div>
            <div className="w-10 h-[2px] bg-gray-200 mb-4 group-hover:bg-[#672cb9] group-hover:w-16 transition-all duration-300"></div>
            <h4 className="text-[15px] font-bold text-gray-900 mb-1.5">Efisiensi Waktu</h4>
            <p className="text-[13px] text-gray-500 font-medium leading-[1.6]">Proses ekstraksi yang jauh lebih cepat dibandinkan dengan metode lainnya.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="md:col-span-2 lg:col-span-2 bg-[#ffffff] rounded-[24px] p-8 md:p-10 border border-gray-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 group hover:shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-all duration-500"
        >
          <div className="w-16 h-16 shrink-0 rounded-[18px] bg-[#fafafa] border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-center text-gray-700">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-gray-900 mb-2 tracking-tight">Teknologi yang Teruji</h3>
            <p className="text-[14px] leading-[1.6] text-gray-500 font-medium">
              Keunggulan utama OtakEncer terletak pada arsitektur AI-nya yang mampu mengenali struktur logika dalam teks dan audio secara presisi, menjadikannya standar baru dalam alat bantu belajar akademik.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="md:col-span-3 lg:col-span-2 bg-[#0a0a0a] rounded-[24px] overflow-hidden border border-gray-800 shadow-[0_8px_32px_rgba(0,0,0,0.15)] relative group min-h-[200px]"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          ></div>

          <div className="absolute -top-10 -right-10 w-[300px] h-[300px] bg-[radial-gradient(circle_at_center,rgba(103,44,185,0.15)_0%,transparent_60%)] pointer-events-none transition-transform duration-700 group-hover:translate-x-4"></div>

          <div className="relative h-full p-8 md:p-10 flex flex-col justify-center z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                <span className="text-[#10b981] text-[10px] font-bold uppercase tracking-widest leading-none">Keamanan: Terjamin</span>
              </div>
            </div>

            <div className="w-full lg:w-[85%]">
              <h3 className="text-[18px] font-bold text-white mb-2 tracking-tight">Privasi & Mobilitas</h3>
              <p className="text-[14px] leading-[1.6] text-white/50 font-medium">
                Bekerja kapan saja untuk memastikan data dan proses riset Anda aman, sinkron, dan selalu dapat diakses kapan pun.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
