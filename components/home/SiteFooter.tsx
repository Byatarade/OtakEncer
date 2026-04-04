"use client";

import Image from "next/image";
import Link from "next/link";
import { forwardRef } from "react";

export const SiteFooter = forwardRef<HTMLElement>(function SiteFooter(_, ref) {
  return (
    <footer ref={ref} className="w-full bg-[#08020d] rounded-t-[40px] md:rounded-t-[80px] border-t border-white/10 text-white pt-16 md:pt-24 pb-8 md:pb-10 relative z-20 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(103,44,185,0.15)_0%,transparent_60%)] rounded-[100%] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,165,21,0.1)_0%,transparent_60%)] rounded-[100%] pointer-events-none"></div>
      <div className="absolute top-[20%] right-10 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(200,118,181,0.1)_0%,transparent_60%)] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-[1240px] w-full mx-auto px-6 md:px-12 flex flex-col relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16 lg:mb-20">
          <div className="col-span-1 lg:col-span-5 flex flex-col items-start">
            <Link href="#beranda" className="flex items-center gap-3 mb-6 group">
              <div className="bg-white/10 border border-white/20 w-12 h-12 flex items-center justify-center rounded-2xl group-hover:bg-white/20 transition-all shadow-lg backdrop-blur-sm">
                <Image src="/assets/logo.svg" alt="Logo" width={28} height={28} className="object-contain invert brightness-0 group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-bold text-[24px] md:text-[28px] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">OtakEncer</span>
            </Link>
            <p className="text-white/60 text-[14px] md:text-[15px] leading-[1.7] max-w-[380px] mb-8 font-['Montserrat',sans-serif]">
              Platform AI pintar yang mengubah dokumen kompleks menjadi materi interaktif siap pelajari. Belajar lebih cerdas, tingkatkan produktivitasmu.
            </p>

            <div className="flex gap-4">
              <Link
                href="#"
                className="w-11 h-11 flex items-center justify-center hover:-translate-y-1 bg-white/5 hover:bg-[#672cb9] border border-white/10 rounded-full transition-all group shadow-sm hover:shadow-[0_10px_20px_rgba(103,44,185,0.4)]"
              >
                <Image src="/assets/twitter-icon.svg" alt="X" width={18} height={18} className="brightness-0 invert group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="#"
                className="w-11 h-11 flex items-center justify-center hover:-translate-y-1 bg-white/5 hover:bg-[#672cb9] border border-white/10 rounded-full transition-all group shadow-sm hover:shadow-[0_10px_20px_rgba(103,44,185,0.4)]"
              >
                <Image src="/assets/facebook-icon.svg" alt="FB" width={18} height={18} className="brightness-0 invert group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="#"
                className="w-11 h-11 flex items-center justify-center hover:-translate-y-1 bg-white/5 hover:bg-[#672cb9] border border-white/10 rounded-full transition-all group shadow-sm hover:shadow-[0_10px_20px_rgba(103,44,185,0.4)]"
              >
                <Image src="/assets/instagram-social.svg" alt="IG" width={18} height={18} className="brightness-0 invert group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-8">
            <div className="flex flex-col">
              <h4 className="font-bold text-[16px] md:text-[18px] mb-6 text-white">Produk</h4>
              <div className="flex flex-col gap-4 font-['Montserrat',sans-serif] text-[14px] md:text-[15px] text-white/60">
                <Link href="#neura" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Neura AI
                </Link>
                <Link href="#fitur" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Fitur Flashcard
                </Link>
                <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Ringkasan Dokumen
                </Link>
                <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Integrasi YouTube
                </Link>
              </div>
            </div>
            <div className="flex flex-col">
              <h4 className="font-bold text-[16px] md:text-[18px] mb-6 text-white">Perusahaan</h4>
              <div className="flex flex-col gap-4 font-['Montserrat',sans-serif] text-[14px] md:text-[15px] text-white/60">
                <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Tentang Kami
                </Link>
                <Link href="#comment" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Testimoni
                </Link>
                <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Blog
                </Link>
                <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Karir
                </Link>
              </div>
            </div>
            <div className="flex flex-col col-span-2 md:col-span-1">
              <h4 className="font-bold text-[16px] md:text-[18px] mb-6 text-white">Dukungan</h4>
              <div className="flex flex-col gap-4 font-['Montserrat',sans-serif] text-[14px] md:text-[15px] text-white/60">
                <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Pusat Bantuan
                </Link>
                <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Syarat & Ketentuan
                </Link>
                <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Kebijakan Privasi
                </Link>
                <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Kontak
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4">
          <p className="text-[13px] md:text-[14px] font-['Montserrat',sans-serif] text-white/50 text-center md:text-left">&copy; 2026 OtakEncer. All rights reserved.</p>
          <p className="text-[13px] md:text-[14px] font-['Montserrat',sans-serif] text-white/50 flex items-center justify-center md:justify-end gap-1 flex-wrap">
            Created by <span className="font-semibold text-white/80">Pasti Sukses</span> @TechSprint Innovation Cup 2026
          </p>
        </div>
      </div>
    </footer>
  );
});
