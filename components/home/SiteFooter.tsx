"use client";

import Image from "next/image";
import Link from "next/link";
import { forwardRef } from "react";


export type SiteFooterProps = {
  handleScroll?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
};

export const SiteFooter = forwardRef<HTMLElement, SiteFooterProps>(function SiteFooter({ handleScroll }, ref) {
  return (
    <footer ref={ref} className="w-full bg-[#08020d] rounded-t-[40px] md:rounded-t-[80px] border-t border-white/10 text-white pt-16 md:pt-24 pb-8 md:pb-10 relative z-20 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(103,44,185,0.15)_0%,transparent_60%)] rounded-[100%] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,165,21,0.1)_0%,transparent_60%)] rounded-[100%] pointer-events-none"></div>
      <div className="absolute top-[20%] right-10 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(200,118,181,0.1)_0%,transparent_60%)] rounded-[100%] pointer-events-none"></div>

      <div className="max-w-[1240px] w-full mx-auto px-6 md:px-12 flex flex-col relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16 lg:mb-20">
          <div className="col-span-1 lg:col-span-5 flex flex-col items-start">
            <Link href="#beranda" onClick={handleScroll} className="flex items-center gap-3 mb-6 group">
              <div className="bg-white/10 border border-white/20 w-12 h-12 flex items-center justify-center rounded-2xl group-hover:bg-white/20 transition-all shadow-lg backdrop-blur-sm">
                <Image priority src="/assets/logo.avif" alt="Logo" width={28} height={28} className="object-contain invert brightness-0 group-hover:scale-110 transition-transform" />
              </div>
              <span className="font-bold text-[24px] md:text-[28px] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">OtakEncer</span>
            </Link>
            <p className="text-white/60 text-[14px] md:text-[15px] leading-[1.7] max-w-[380px] font-['Montserrat',sans-serif]">
              Platform AI pintar yang mengubah dokumen kompleks menjadi materi interaktif siap pelajari. Belajar lebih cerdas, tingkatkan produktivitasmu.
            </p>
          </div>

          <div className="col-span-1 lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-8">
            <div className="flex flex-col">
              <h4 className="font-bold text-[16px] md:text-[18px] mb-6 text-white">Quick Links</h4>
              <div className="flex flex-col gap-4 font-['Montserrat',sans-serif] text-[14px] md:text-[15px] text-white/60">
                <Link onClick={handleScroll} href="#beranda" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Beranda
                </Link>
                <Link onClick={handleScroll} href="#tentang" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Tentang Kami
                </Link>
                <Link onClick={handleScroll} href="#neura" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Neura AI
                </Link>
                <Link onClick={handleScroll} href="#fitur" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Fitur
                </Link>
                <Link onClick={handleScroll} href="#testimoni" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Testimoni
                </Link>
              </div>
            </div>
            <div className="flex flex-col">
              <h4 className="font-bold text-[16px] md:text-[18px] mb-6 text-white">Eksplorasi</h4>
              <div className="flex flex-col gap-4 font-['Montserrat',sans-serif] text-[14px] md:text-[15px] text-white/60">
                <Link href="#tentang" onClick={handleScroll} className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Tentang OtakEncer
                </Link>
                <Link href="#testimoni" onClick={handleScroll} className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Cerita Pengguna
                </Link>
                <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Tips & Trik Belajar
                </Link>
                <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Komunitas Kita
                </Link>
                <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Artikel Edukasi
                </Link>
              </div>
            </div>
            <div className="flex flex-col col-span-2 md:col-span-1">
              <h4 className="font-bold text-[16px] md:text-[18px] mb-6 text-white">Bantuan & Legal</h4>
              <div className="flex flex-col gap-4 font-['Montserrat',sans-serif] text-[14px] md:text-[15px] text-white/60">
                <Link href="/documentation" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Dokumentasi
                </Link>
                <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Panduan Penggunaan
                </Link>
                <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Pusat Bantuan (FAQ)
                </Link>
                <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Syarat & Ketentuan
                </Link>
                <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">
                  Kebijakan Privasi
                </Link>
                <div className="mt-4 flex flex-col gap-2">
                  <span className="text-[13px] text-white/40 italic">Ada kritik dan saran?</span>
                  <a href="mailto:cs@otakencer.me" className="flex items-center gap-2 hover:text-[#ffa515] transition-colors w-fit group">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 group-hover:opacity-100 transition-opacity"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                     cs@otakencer.me
                  </a>
                </div>
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
