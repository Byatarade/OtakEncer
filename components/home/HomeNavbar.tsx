"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { User } from "@/components/AuthProvider";

export type HomeNavbarProps = {
  hidden: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeSection: string;
  handleScroll: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  user: User | null;
};

export function HomeNavbar({
  hidden,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeSection,
  handleScroll,
  user,
}: HomeNavbarProps) {
  return (
    <div className="w-full flex justify-center fixed top-2 md:top-6 z-[100] px-4 md:px-8 pointer-events-none">
      <motion.nav
        initial="visible"
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-150%", opacity: 0 },
        }}
        animate={hidden && !isMobileMenuOpen ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-col w-full max-w-[900px] bg-white/40 hover:bg-white/50 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)] pointer-events-auto overflow-hidden rounded-[32px] md:rounded-full"
      >
        <div className="flex items-center justify-between px-4 md:px-6 py-3 w-full">
          <Link href="#beranda" className="flex items-center gap-2">
            <div className="relative w-7 h-7 md:w-8 md:h-8">
              <Image src="/assets/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="font-bold text-[16px] md:text-[18px] tracking-tight text-gray-900">
              Otak<span className="text-[#672cb9]">Encer</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-[13px] md:text-[14px]">
            <Link
              onClick={handleScroll}
              href="#beranda"
              className={`font-bold transition-colors duration-300 ${activeSection === "beranda" ? "text-[#672cb9]" : "text-gray-800 hover:text-[#672cb9]"}`}
            >
              Beranda
            </Link>
            <Link
              onClick={handleScroll}
              href="#tentang"
              className={`font-bold transition-colors duration-300 ${activeSection === "tentang" ? "text-[#672cb9]" : "text-gray-800 hover:text-[#672cb9]"}`}
            >
              Tentang Kami
            </Link>
            <Link
              onClick={handleScroll}
              href="#neura"
              className={`font-bold transition-colors duration-300 ${activeSection === "neura" ? "text-[#672cb9]" : "text-gray-800 hover:text-[#672cb9]"}`}
            >
              Neura AI
            </Link>
            <Link
              onClick={handleScroll}
              href="#fitur"
              className={`font-bold transition-colors duration-300 ${activeSection === "fitur" ? "text-[#672cb9]" : "text-gray-800 hover:text-[#672cb9]"}`}
            >
              Fitur
            </Link>
            <Link
              onClick={handleScroll}
              href="#comment"
              className={`font-bold transition-colors duration-300 ${activeSection === "comment" ? "text-[#672cb9]" : "text-gray-800 hover:text-[#672cb9]"}`}
            >
              Comment
            </Link>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {user ? (
              <div className="flex items-center gap-3 md:gap-4">
                <Link
                  href="/dashboard"
                  className="hidden md:flex items-center justify-center bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-full font-medium text-[12px] md:text-[13px] transition-transform hover:scale-105 shadow-md group"
                >
                  Go to Dashboard
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">👉</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="md:hidden flex items-center justify-center bg-gray-900 text-white px-4 py-2 rounded-full font-medium text-[11px] shadow-md group"
                >
                  Dashboard <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">👉</span>
                </Link>
                {user.picture ? (
                  <Image
                    src={user.picture}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="rounded-full border border-gray-200"
                  />
                ) : (
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                    {user.name?.[0] || user.email?.[0] || "U"}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-4 mr-1">
                  <Link href="/login" className="text-[13px] font-bold text-gray-800 hover:text-black transition-colors">
                    Log In
                  </Link>
                </div>

                <Link
                  href="/login"
                  className="hidden md:flex items-center justify-center bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-full font-medium text-[12px] md:text-[13px] transition-transform hover:scale-105 shadow-md"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="md:hidden flex items-center justify-center bg-gray-900 text-white px-4 py-2 rounded-full font-medium text-[11px] shadow-md"
                >
                  Sign In
                </Link>
              </>
            )}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden bg-white/40 rounded-full border border-white/50 backdrop-blur-md transition-colors hover:bg-white/60 focus:outline-none"
            >
              <Image src="/assets/menu-icon.svg" alt="Menu" width={18} height={18} />
            </button>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ height: isMobileMenuOpen ? "auto" : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden md:hidden w-full"
        >
          <div className="flex flex-col items-center gap-4 px-4 pb-6 pt-2 border-t border-gray-200/50">
            <Link
              onClick={handleScroll}
              href="#beranda"
              className={`font-bold text-[14px] transition-colors duration-300 ${activeSection === "beranda" ? "text-[#672cb9]" : "text-gray-800 hover:text-[#672cb9]"}`}
            >
              Beranda
            </Link>
            <Link
              onClick={handleScroll}
              href="#tentang"
              className={`font-bold text-[14px] transition-colors duration-300 ${activeSection === "tentang" ? "text-[#672cb9]" : "text-gray-800 hover:text-[#672cb9]"}`}
            >
              Tentang Kami
            </Link>
            <Link
              onClick={handleScroll}
              href="#neura"
              className={`font-bold text-[14px] transition-colors duration-300 ${activeSection === "neura" ? "text-[#672cb9]" : "text-gray-800 hover:text-[#672cb9]"}`}
            >
              Neura AI
            </Link>
            <Link
              onClick={handleScroll}
              href="#fitur"
              className={`font-bold text-[14px] transition-colors duration-300 ${activeSection === "fitur" ? "text-[#672cb9]" : "text-gray-800 hover:text-[#672cb9]"}`}
            >
              Fitur
            </Link>
            <Link
              onClick={handleScroll}
              href="#comment"
              className={`font-bold text-[14px] transition-colors duration-300 ${activeSection === "comment" ? "text-[#672cb9]" : "text-gray-800 hover:text-[#672cb9]"}`}
            >
              Comment
            </Link>
            <div className="w-full h-px bg-gray-200/50 my-1"></div>
            {user ? (
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/dashboard" className="text-gray-900 font-bold text-[14px]">
                Dashboard
              </Link>
            ) : (
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/login" className="text-gray-900 font-bold text-[14px]">
                Log In
              </Link>
            )}
          </div>
        </motion.div>
      </motion.nav>
    </div>
  );
}
