"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { User } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";

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
  const router = useRouter();

  return (
    <div className="w-full flex justify-center fixed top-2 md:top-6 z-[100] px-4 md:px-8 pointer-events-none font-['Montserrat',sans-serif]">
      <motion.nav
        initial="visible"
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-150%", opacity: 0 },
        }}
        animate={hidden && !isMobileMenuOpen ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`flex flex-col w-full max-w-[900px] transition-colors duration-500 backdrop-blur-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.1)] pointer-events-auto overflow-hidden rounded-[32px] md:rounded-full ${
          activeSection === "fitur" ? "bg-white border-transparent" : "bg-white/40 hover:bg-white/50 border-white/50"
        }`}
      >
        <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6 lg:gap-8 px-3 md:px-6 py-2.5 md:py-3 w-full">
          <Link href="#beranda" className="flex items-center gap-2 shrink-0">
            <div className="relative w-7 h-7 md:w-8 md:h-8 shrink-0">
              <Image src="/assets/logo.svg" alt="Logo" fill className="object-contain" />
            </div>
            <span className="font-bold text-[18px] md:text-[18px] tracking-tight text-gray-900 whitespace-nowrap">
              Otak<span className="text-[#672cb9]">Encer</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-3 lg:gap-6 font-medium text-[12.5px] lg:text-[14px] whitespace-nowrap shrink-0">
            <Link onClick={handleScroll} href="#beranda" className={`font-bold transition-colors duration-300 ${activeSection === "beranda" ? "text-[#672cb9]" : "text-gray-800 hover:text-[#672cb9]"}`}>
              Beranda
            </Link>
            <Link onClick={handleScroll} href="#tentang" className={`font-bold transition-colors duration-300 ${activeSection === "tentang" ? "text-[#672cb9]" : "text-gray-800 hover:text-[#672cb9]"}`}>
              Tentang Kami
            </Link>
            <Link onClick={handleScroll} href="#neura" className={`font-bold transition-colors duration-300 ${activeSection === "neura" ? "text-[#672cb9]" : "text-gray-800 hover:text-[#672cb9]"}`}>
              Neura AI
            </Link>
            <Link onClick={handleScroll} href="#fitur" className={`font-bold transition-colors duration-300 ${activeSection === "fitur" ? "text-[#672cb9]" : "text-gray-800 hover:text-[#672cb9]"}`}>
              Fitur
            </Link>
            <Link onClick={handleScroll} href="#testimoni" className={`font-bold transition-colors duration-300 ${activeSection === "testimoni" ? "text-[#672cb9]" : "text-gray-800 hover:text-[#672cb9]"}`}>
              Testimoni
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 shrink-0">
            {user ? (
              <div className="flex items-center gap-1.5 md:gap-4">
                <Button className="flex items-center gap-1.5 bg-[#672cb9] hover:bg-[#58249c] active:scale-95 text-white px-3.5 py-1 sm:py-1.5 rounded-full text-[13px] font-semibold transition-all shrink-0 shadow-sm" onClick={() => router.push("/dashboard")}>
                  Dashboard
                  <span className="ml-0.5 sm:ml-1 inline-flex items-center transition-transform group-hover:translate-x-1">
                    <svg width="11" height="11" className="sm:w-[13px] sm:h-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
                </Button>
                {user.picture ? (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-100 overflow-hidden relative shadow-sm shrink-0">
                    <Image src={user.picture} alt="Profile" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 text-[10px] sm:text-xs shrink-0">
                    {user.name?.[0] || user.email?.[0] || "U"}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
                <Link href="/login" className="hidden md:block text-[13px] font-bold text-gray-800 hover:text-[#672cb9] transition-colors px-2 shrink-0">
                  Log In
                </Link>
                <Button size="sm" variant="secondary" className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shrink-0 text-[12px] sm:text-[14px]" onClick={() => router.push("/login")}>
                  Sign In
                </Button>
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 sm:p-2 md:hidden bg-white/40 rounded-full border border-white/50 backdrop-blur-md transition-colors hover:bg-white/60 shrink-0 flex items-center justify-center ml-0.5"
            >
              <Image src="/assets/menu-icon.svg" alt="Menu" width={16} height={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ height: isMobileMenuOpen ? "auto" : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden md:hidden w-full"
        >
          <div className="flex flex-col items-center gap-4 px-4 pb-6 pt-2 border-t border-gray-200/50">
            {["beranda", "tentang", "neura", "fitur", "testimoni"].map((section) => (
              <Link
                key={section}
                onClick={handleScroll}
                href={`#${section}`}
                className={`font-bold text-[14px] transition-colors duration-300 ${activeSection === section ? "text-[#672cb9]" : "text-gray-800 hover:text-[#672cb9]"}`}
              >
                {section === "tentang" ? "Tentang Kami" : 
                 section === "neura" ? "Neura AI" : 
                 section.charAt(0).toUpperCase() + section.slice(1)}
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.nav>
    </div>
  );
}

