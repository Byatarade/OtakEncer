"use client";

import { useState, useRef, useEffect } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import NeuraChatbot from "@/components/NeuraChatbot";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import { HomeHeroSection } from "@/components/home/HomeHeroSection";
import { TentangSection } from "@/components/home/TentangSection";
import { NeuraSection } from "@/components/home/NeuraSection";
import { FiturSection } from "@/components/home/FiturSection";
import { QuotesSection } from "@/components/home/QuotesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { HomeCtaSection } from "@/components/home/HomeCtaSection";
import { SiteFooter } from "@/components/home/SiteFooter";

export default function Home() {
  const { user } = useAuth();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");
  const [showNeuraFab, setShowNeuraFab] = useState(false);
  const neuraRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  const layoutCache = useRef({ neuraTop: 9999, footerTop: 99999 });

  useEffect(() => {
    const updateLayout = () => {
      if (neuraRef.current && footerRef.current) {
        layoutCache.current = {
          neuraTop: neuraRef.current.getBoundingClientRect().top + window.scrollY,
          footerTop: footerRef.current.getBoundingClientRect().top + window.scrollY,
        };
      }
    };
    
    updateLayout();
    setTimeout(updateLayout, 1000);
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px" },
    );

    const sections = ["beranda", "tentang", "neura", "fitur", "comment"].map((id) => document.getElementById(id));
    sections.forEach((s) => s && observer.observe(s));

    return () => sections.forEach((s) => s && observer.unobserve(s));
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      if (!isMobileMenuOpen) setHidden(true);
    } else {
      setHidden(false);
    }

    const scrollBottom = latest + window.innerHeight;
    const shouldShow = scrollBottom > layoutCache.current.neuraTop && scrollBottom < layoutCache.current.footerTop;
    setShowNeuraFab((prev) => (prev !== shouldShow ? shouldShow : prev));

    if (latest < 100) {
      setActiveSection("beranda");
    }
  });

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.href;
    const targetId = href.replace(/.*#/, "");
    const elem = document.getElementById(targetId);
    if (elem) {
      const targetPosition = elem.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = targetPosition - 100;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="bg-white min-h-screen text-black font-['Montserrat',sans-serif] overflow-x-hidden flex flex-col items-center">
      <HomeNavbar
        hidden={hidden}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeSection={activeSection}
        handleScroll={handleScroll}
        user={user}
      />

      <main className="w-full flex flex-col items-center max-w-[1440px] relative mt-20 md:mt-22">
        <HomeHeroSection />
        <TentangSection />
        <NeuraSection ref={neuraRef} />
        <FiturSection />
        <QuotesSection />
        <TestimonialsSection />
        <HomeCtaSection />
        <SiteFooter ref={footerRef} />
      </main>

      <NeuraChatbot showTrigger={showNeuraFab} />
    </div>
  );
}
