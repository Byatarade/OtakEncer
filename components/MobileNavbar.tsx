"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Library,
  Trophy,
  Users,
  Settings,
  LogOut,
  HelpCircle,
  X,
  Plus,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function MobileNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const { user, logout } = useAuth();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu & dropdown on route change without triggering useEffect cascading renders
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Cukup panggil logout() — AuthProvider handle redirect ke '/'
    logout();
  };

  // Upload button: dispatch custom event (listened by dashboard page)
  // On non-dashboard pages, navigate to dashboard and trigger upload
  const handleUpload = () => {
    if (pathname === "/dashboard") {
      window.dispatchEvent(new CustomEvent("mobile-open-upload"));
    } else {
      router.push("/dashboard?upload=true");
    }
  };

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      isActive: pathname === "/dashboard",
    },
    {
      href: "/dashboard/library",
      label: "Library",
      icon: <Library size={20} />,
      isActive: pathname.startsWith("/dashboard/library"),
    },
    {
      href: "/dashboard/leaderboard",
      label: "Leaderboard",
      icon: <Trophy size={20} />,
      isActive: pathname.startsWith("/dashboard/leaderboard"),
    },
    {
      href: "/dashboard/kolaborasi",
      label: "Ruang Kolaborasi",
      icon: <Users size={20} />,
      isActive: pathname.startsWith("/dashboard/kolaborasi"),
    },
  ];

  return (
    <>
      {/* ===== TOP NAVBAR (mobile only) ===== */}
      <header className="md:hidden sticky top-0 z-40 w-full bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 px-4 h-[60px]">

          {/* Logo */}
          <Link href="/?view=landing" className="flex items-center gap-2 shrink-0">
            <div className="relative w-7 h-7">
              <Image priority src="/assets/logo.svg" alt="OtakEncer Logo" fill className="object-contain" />
            </div>
            <span className="font-bold text-[17px] tracking-tight text-slate-900">
              Otak<span className="text-[#672cb9]">Encer</span>
            </span>
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Upload Button */}
          <button
            id="mobile-upload-btn"
            onClick={handleUpload}
            className="flex items-center gap-1.5 bg-[#672cb9] hover:bg-[#58249c] active:scale-95 text-white px-3.5 py-1 rounded-full text-[13px] font-semibold transition-all shrink-0 shadow-sm"
          >
            <Plus size={15} strokeWidth={2.5} />
            Upload
          </button>

          {/* Profile Avatar + Dropdown */}
          <div className="relative shrink-0" ref={profileRef}>
            <button
              id="mobile-profile-btn"
              aria-label="Profile menu"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-[#672cb9]/30 transition-all active:scale-95"
            >
              {user?.picture ? (
                <Image
                  src={user.picture}
                  alt={user.name}
                  width={36}
                  height={36}
                  className="rounded-full object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#ede9fe] flex items-center justify-center text-[#672cb9] font-bold text-[14px]">
                  {user?.name?.[0] || "U"}
                </div>
              )}
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2.5 w-56 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* User info */}
                <div className="px-4 py-3 border-b border-slate-100 mb-1">
                  <p className="text-[13px] font-bold text-slate-800 truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                </div>

                <div className="flex flex-col px-2">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-slate-600 hover:text-[#672cb9] hover:bg-indigo-50/60 rounded-xl transition-colors"
                  >
                    <Settings size={16} />
                    Pengaturan Akun
                  </Link>

                  <Link
                    href="mailto:cs@otakencer.me"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-slate-600 hover:text-[#672cb9] hover:bg-indigo-50/60 rounded-xl transition-colors"
                  >
                    <HelpCircle size={16} />
                    Bantuan & Support
                  </Link>

                  <div className="h-px w-full bg-slate-100 my-1" />

                  <button
                    onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors w-full text-left"
                  >
                    <LogOut size={16} />
                    Keluar / Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger Button */}
          <button
            id="mobile-hamburger-btn"
            aria-label="Open navigation menu"
            onClick={() => setIsMenuOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-slate-100 transition-colors shrink-0 group"
          >
            {/* Classic ≡ hamburger icon */}
            <Image src="/assets/menu-icon.svg" alt="Menu" width={16} height={16} />
          </button>
        </div>
      </header>

      {/* ===== NAV DRAWER ===== */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] md:hidden" aria-modal="true" role="dialog">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer Panel — slides in from right */}
          <div
            ref={menuRef}
            className="absolute right-0 top-0 h-full w-[290px] max-w-[88vw] bg-white flex flex-col shadow-2xl"
            style={{ animation: "slideInRight 0.22s cubic-bezier(0.4,0,0.2,1)" }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
              <span className="text-[15px] font-bold text-slate-700">Menu Utama</span>
              <button
                aria-label="Close menu"
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-slate-600" />
              </button>
            </div>

            {/* Navigation Links ONLY */}
            <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium text-[15px] group ${
                    item.isActive
                      ? "bg-[#672cb9] text-white shadow-md shadow-[#672cb9]/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span
                    className={`shrink-0 transition-colors ${
                      item.isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-[#672cb9]"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.isActive ? (
                    <span className="w-1.5 h-5 rounded-full bg-[#FFA515] shrink-0 " />
                  ) : (
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-400 shrink-0" />
                  )}
                </Link>
              ))}
            </nav>

          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0.5; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
