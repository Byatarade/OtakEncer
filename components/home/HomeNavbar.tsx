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
        <div className="flex items-center justify-between px-4 md:px-6 py-3 w-full">
          <Link href="#beranda" className="flex items-center gap-2">
            <div className="relative w-7 h-7 md:w-8 md:h-8">
              <Image src="/assets/logo.svg" alt="Logo" fill className="object-contain" />
            </div>
            <span className="font-bold text-[18px] md:text-[18px] tracking-tight text-gray-900">
              Otak<span className="text-[#672cb9]">Encer</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-4 lg:gap-6 font-medium text-[13px] md:text-[14px]">
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
            <Link onClick={handleScroll} href="#comment" className={`font-bold transition-colors duration-300 ${activeSection === "comment" ? "text-[#672cb9]" : "text-gray-800 hover:text-[#672cb9]"}`}>
              Comment
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <div className="flex items-center gap-2 md:gap-4">
                <Button size="sm" variant="secondary" className="hidden md:flex px-5 py-2.5 rounded-full group h-auto" onClick={() => router.push("/dashboard")}>
                  Dashboard
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">👉</span>
                </Button>
                <Button size="sm" variant="secondary" className="md:hidden flex px-3 py-2 rounded-full group" onClick={() => router.push("/dashboard")}>
                  Dashboard
                </Button>
                {user.picture ? (
                  <div className="w-8 h-8 rounded-full border border-gray-100 overflow-hidden relative shadow-sm">
                    <Image src={user.picture} alt="Profile" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 text-xs">
                    {user.name?.[0] || user.email?.[0] || "U"}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-4">
                <Link href="/login" className="hidden md:block text-[13px] font-bold text-gray-800 hover:text-[#672cb9] transition-colors px-2">
                  Log In
                </Link>
                <Button size="sm" variant="secondary" className="px-5 py-2.5 rounded-full" onClick={() => router.push("/login")}>
                  Sign In
                </Button>
              </div>
            )}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden bg-white/40 rounded-full border border-white/50 backdrop-blur-md transition-colors hover:bg-white/60"
            >
              <Image src="/assets/menu-icon.svg" alt="Menu" width={18} height={18} />
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
            {["beranda", "tentang", "neura", "fitur", "comment"].map((section) => (
              <Link
                key={section}
                onClick={handleScroll}
                href={`#${section}`}
                className={`font-bold text-[14px] transition-colors duration-300 ${activeSection === section ? "text-[#672cb9]" : "text-gray-800 hover:text-[#672cb9]"}`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1).replace("tentang", "Tentang Kami").replace("neura", "Neura AI")}
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.nav>
    </div>
  );
}

