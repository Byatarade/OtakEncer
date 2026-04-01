"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent, useTransform, useSpring } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { useAuth } from "@/components/AuthProvider";

export default function Home() {
  const { user } = useAuth();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [showNeuraFab, setShowNeuraFab] = useState(false);
  const neuraRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  // Parallax Setup for the Quotes Section
  const quotesRef = useRef<HTMLElement>(null);
  const { scrollYProgress: quotesScrollProgress } = useScroll({
    target: quotesRef,
    offset: ["start end", "end start"]
  });

  // Create depth layers for boxes and text giving true Mobbin parallax effect
  // Extreme smooth spring physics for buttery scroll lag
  const springConfig = { stiffness: 50, damping: 20, mass: 1.2 };

  // Text anchor: mostly solid base, we will rely on a staggered entry trigger for the text reveal
  const quotesTextYRaw = useTransform(quotesScrollProgress, [0, 1], [30, -30]);
  const quotesTextY = useSpring(quotesTextYRaw, springConfig);

  // Line-by-Line Scrubbable Text Transforms
  // We map tight 8% scroll windows to make it 'pop' (trigger-like) while remaining fully bound to bidirectional scroll progress
  const ts = { stiffness: 120, damping: 20, mass: 0.8 }; // Snappy spring config
  
  const textOp1Raw = useTransform(quotesScrollProgress, [0.35, 0.43], [0, 1]);
  const textY1Raw = useTransform(quotesScrollProgress, [0.35, 0.43], [60, 0]);
  const textOp1 = useSpring(textOp1Raw, ts);
  const textY1 = useSpring(textY1Raw, ts);

  const textOp2Raw = useTransform(quotesScrollProgress, [0.40, 0.48], [0, 1]);
  const textY2Raw = useTransform(quotesScrollProgress, [0.40, 0.48], [60, 0]);
  const textOp2 = useSpring(textOp2Raw, ts);
  const textY2 = useSpring(textY2Raw, ts);

  const textOp3Raw = useTransform(quotesScrollProgress, [0.45, 0.53], [0, 1]);
  const textY3Raw = useTransform(quotesScrollProgress, [0.45, 0.53], [60, 0]);
  const textOp3 = useSpring(textOp3Raw, ts);
  const textY3 = useSpring(textY3Raw, ts);

  const textOp4Raw = useTransform(quotesScrollProgress, [0.50, 0.58], [0, 1]);
  const textY4Raw = useTransform(quotesScrollProgress, [0.50, 0.58], [60, 0]);
  const textOp4 = useSpring(textOp4Raw, ts);
  const textY4 = useSpring(textY4Raw, ts);

  const textOp5Raw = useTransform(quotesScrollProgress, [0.55, 0.63], [0, 1]);
  const textY5Raw = useTransform(quotesScrollProgress, [0.55, 0.63], [60, 0]);
  const textOp5 = useSpring(textOp5Raw, ts);
  const textY5 = useSpring(textY5Raw, ts);

  // 5 Background lag layers mapping foreground vs background (bigger numbers = more movement)
  // Layer 1: Very small distant objects
  const layer1YRaw = useTransform(quotesScrollProgress, [0, 1], [-80, 80]);
  const layer1Y = useSpring(layer1YRaw, springConfig);
  // Layer 2: Mid-background
  const layer2YRaw = useTransform(quotesScrollProgress, [0, 1], [150, -150]);
  const layer2Y = useSpring(layer2YRaw, springConfig);
  // Layer 3: Standard focal point
  const layer3YRaw = useTransform(quotesScrollProgress, [0, 1], [300, -300]);
  const layer3Y = useSpring(layer3YRaw, springConfig);
  // Layer 4: Close foreground
  const layer4YRaw = useTransform(quotesScrollProgress, [0, 1], [550, -550]);
  const layer4Y = useSpring(layer4YRaw, springConfig);
  // Layer 5: Extreme foreground
  const layer5YRaw = useTransform(quotesScrollProgress, [0, 1], [850, -850]);
  const layer5Y = useSpring(layer5YRaw, springConfig);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    // Don't hide navbar if mobile menu is open
    if (latest > previous && latest > 150) {
      if (!isMobileMenuOpen) setHidden(true); 
    } else {
      setHidden(false); 
    }

    // Check Neura FAB visibility safely
    if (neuraRef.current && footerRef.current) {
      const neuraRect = neuraRef.current.getBoundingClientRect();
      const footerRect = footerRef.current.getBoundingClientRect();
      
      // Start showing when NEURA is visible (top < viewport height)
      // Stop showing when Footer comes into view (top <= viewport height)
      const shouldShow = neuraRect.top < window.innerHeight && footerRect.top > window.innerHeight;
      
      setShowNeuraFab((prev) => (prev !== shouldShow ? shouldShow : prev));
    }
  });

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.href;
    const targetId = href.replace(/.*\#/, "");
    const elem = document.getElementById(targetId);
    if (elem) {
      // Get the element's position relative to the viewport
      const targetPosition = elem.getBoundingClientRect().top + window.scrollY;
      // Subtract navbar height (approx 80px) and some padding
      const offsetPosition = targetPosition - 100;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsMobileMenuOpen(false);
  };

  const testimonials = [
    {
      name: "Hezzam",
      role: "Investor Videy",
      text: "OtakEncer benar-benar mengubah cara saya mempelajari dokumen puluhan halaman menjadi ringkasan yang to the point.",
      avatar: "/assets/testimonial-avatar.svg"
    },
    {
      name: "Sinta R.",
      role: "Mahasiswi IT",
      text: "Materi ujian dari jurnal PDF sekarang bisa saya pelajari 3x lebih cepat. Sangat membantu untuk yang sering begadang!",
      avatar: "/assets/testimonial-avatar.svg" // placeholder
    },
    {
      name: "Bima C.",
      role: "Developer",
      text: "Fitur tanya jawab dengan Neura AI sangat interaktif. Saya bisa bertanya langsung ke dalam dokumen teknis saya.",
      avatar: "/assets/testimonial-avatar.svg" // placeholder
    },
    {
      name: "Aulia K.",
      role: "Content Creator",
      text: "Rangkuman dari audio dan YouTube sangat menghemat waktu riset bahan konten saya. Terbaik!",
      avatar: "/assets/testimonial-avatar.svg" // placeholder
    }
  ];

  return (
    <div className="bg-white min-h-screen text-black font-['Montserrat',sans-serif] overflow-x-hidden flex flex-col items-center">

      {/* Navbar Container */}
      <div className="w-full flex justify-center fixed top-2 md:top-6 z-[100] px-4 md:px-8 pointer-events-none">
        <motion.nav
          initial="visible"
          variants={{
            visible: { y: 0, opacity: 1 },
            hidden: { y: "-150%", opacity: 0 }
          }}
          animate={hidden && !isMobileMenuOpen ? "hidden" : "visible"}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex flex-col w-full max-w-[900px] bg-white/40 hover:bg-white/50 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)] pointer-events-auto overflow-hidden rounded-[32px] md:rounded-full"
        >
          <div className="flex items-center justify-between px-4 md:px-6 py-3 w-full">
            {/* Logo */}
            <Link href="#beranda" className="flex items-center gap-2">
            <div className="relative w-7 h-7 md:w-8 md:h-8">
              <Image
                src="/assets/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-[16px] md:text-[18px] tracking-tight text-gray-900">
              OtakEncer
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-[13px] md:text-[14px]">
            <Link onClick={handleScroll} href="#beranda" className="text-gray-900 font-bold transition-colors">Beranda</Link>
            <Link onClick={handleScroll} href="#neura" className="text-gray-700 hover:text-black transition-colors">Neura AI</Link>
            <Link onClick={handleScroll} href="#fitur" className="text-gray-700 hover:text-black transition-colors">Fitur</Link>
            <Link onClick={handleScroll} href="#comment" className="text-gray-700 hover:text-black transition-colors">Comment</Link>
          </div>

          {/* Right Nav Action */}
          <div className="flex items-center gap-3 md:gap-4">
             {user ? (
               <div className="flex items-center gap-3 md:gap-4">
                 <Link href="/dashboard" className="hidden md:flex items-center justify-center bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-full font-medium text-[12px] md:text-[13px] transition-transform hover:scale-105 shadow-md group">
                   Go to Dashboard
                   <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">👉</span>
                 </Link>
                 <Link href="/dashboard" className="md:hidden flex items-center justify-center bg-gray-900 text-white px-4 py-2 rounded-full font-medium text-[11px] shadow-md group">
                   Dashboard <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">👉</span>
                 </Link>
                 {user.picture ? (
                   <Image src={user.picture} alt="Profile" width={36} height={36} className="rounded-full border border-gray-200" />
                 ) : (
                   <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                     {user.name?.[0] || user.email?.[0] || 'U'}
                   </div>
                 )}
               </div>
             ) : (
               <>
                 {/* Desktop Login & Signup */}
                 <div className="hidden md:flex items-center gap-4 mr-1">
                   <Link href="/login" className="text-[13px] font-bold text-gray-800 hover:text-black transition-colors">Log In</Link>
                 </div>

                 <Link href="/login" className="hidden md:flex items-center justify-center bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-full font-medium text-[12px] md:text-[13px] transition-transform hover:scale-105 shadow-md">   
                   Sign In
                 </Link>
                 <Link href="/login" className="md:hidden flex items-center justify-center bg-gray-900 text-white px-4 py-2 rounded-full font-medium text-[11px] shadow-md">
                   Sign In
                 </Link>
               </>
             )}
             {/* Mobile Hamburger Menu Icon */}
             <button 
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="p-2 md:hidden bg-white/40 rounded-full border border-white/50 backdrop-blur-md transition-colors hover:bg-white/60 focus:outline-none"
             >
               <Image src="/assets/menu-icon.svg" alt="Menu" width={18} height={18} />
             </button>
          </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          <motion.div 
            initial={false}
            animate={{ height: isMobileMenuOpen ? "auto" : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden md:hidden w-full"
          >
            <div className="flex flex-col items-center gap-4 px-4 pb-6 pt-2 border-t border-gray-200/50">
              <Link onClick={handleScroll} href="#beranda" className="text-gray-900 font-bold text-[14px]">Beranda</Link>
              <Link onClick={handleScroll} href="#neura" className="text-gray-700 font-medium hover:text-gray-900 text-[14px]">Neura AI</Link>
              <Link onClick={handleScroll} href="#fitur" className="text-gray-700 font-medium hover:text-gray-900 text-[14px]">Fitur</Link>
              <Link onClick={handleScroll} href="#comment" className="text-gray-700 font-medium hover:text-gray-900 text-[14px]">Comment</Link>
              <div className="w-full h-px bg-gray-200/50 my-1"></div>
              {user ? (
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/dashboard" className="text-gray-900 font-bold text-[14px]">Dashboard</Link>
              ) : (
                <Link onClick={() => setIsMobileMenuOpen(false)} href="/login" className="text-gray-900 font-bold text-[14px]">Log In</Link>
              )}
            </div>
          </motion.div>
        </motion.nav>
      </div>

      <main id="beranda" className="w-full flex flex-col items-center max-w-[1440px] relative mt-20">

         {/* Hero Section */}
         <motion.section
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="w-full px-4 md:px-8 mt-2 md:mt-4 flex flex-col items-center relative z-20"
         >
           <AuroraBackground className="w-full rounded-[24px] md:rounded-[32px] overflow-hidden pt-12 pb-16 md:pt-[70px] md:pb-[70px] px-4 md:px-14 lg:px-20 flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-0 min-h-[540px]">
             
             {/* Text Content */}
             <div className="flex flex-col items-center md:items-start z-30 w-full md:w-[45%] text-center md:text-left">
               <h1 className="font-bold text-[32px] md:text-[50px] lg:text-[58px] leading-[1.2] md:leading-[1.1] text-white tracking-[-0.01em]">
                 Ubah Dokumenmu <br className="hidden md:block"/>
                 Menjadi Materi <br className="md:hidden"/>
                 <span className="relative inline-block mt-0 md:mt-2">
                    Siap Jadi
                    <div className="absolute -bottom-[2px] left-0 w-full h-[3px] md:h-[5px] bg-[#ffa515] rounded-full"></div>
                 </span>
               </h1>

               <p className="font-['Montserrat',sans-serif] text-[13px] md:text-[15px] lg:text-[16px] leading-[1.6] text-white/95 mt-6 md:mt-8 z-10 w-full max-w-[310px] md:max-w-[440px] font-medium">
                 Upload PDF, Audio, atau link YouTube — AI akan meringkasnya menjadi materi yang siap dipelajari lebih cepat.
               </p>

               {/* Buttons row - Matches Screenshot exactly */}
               <div className="flex flex-row flex-wrap items-center justify-center md:justify-start gap-3 md:gap-5 mt-8 md:mt-10 z-10 w-full px-1 md:px-0">
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="whitespace-nowrap bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-[16px] md:rounded-[20px] font-bold text-[13px] md:text-[15px] flex items-center justify-center gap-2 md:gap-3 transition-all shadow-[0_8px_32px_rgba(255,255,255,0.1)]">
                   <Image src="/assets/google-icon.svg" alt="G" width={16} height={16} className="md:w-[18px] md:h-[18px]" />
                   Mulai Gratis
                 </motion.button>
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="whitespace-nowrap bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/20 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-[16px] md:rounded-[20px] font-bold text-[13px] md:text-[15px] flex items-center justify-center transition-all shadow-[0_8px_32px_rgba(255,255,255,0.05)]">
                   Lihat Demo
                 </motion.button>
               </div>
             </div>

             {/* FIXED BUG: Hero Mockup Images absolute positioning mapped neatly */}
                   <div className="w-full md:w-[55%] flex justify-center md:justify-end items-center mt-2 md:mt-0 z-20 h-auto perspective-[1000px]">
               
                      {/* Proportional Container for accurate icon positioning unaffected by screen stretches */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative w-full max-w-[420px] md:max-w-[550px] aspect-[1.05/1] md:aspect-[1.15/1] shadow-2xl rounded-xl transform-style-3d"
                      >
                  
                  {/* Main Dashboard - Back layer */}
                  <motion.div 
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="absolute top-[8%] right-[5%] w-[88%] h-[80%] rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.3)] bg-white z-10"
                  >
                     <Image
                        src="/assets/hero-image-main.svg"
                        alt="Dashboard Main"
                        fill
                        className="object-cover object-left-top"
                     />
                  </motion.div>

                  {/* Left Floating Menu (Funnel/Retention/Flows) */}
                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className="absolute top-[40%] left-[2%] w-[42%] h-[38%] rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.15)] bg-white overflow-hidden z-20 cursor-pointer"
                  >
                     <Image src="/assets/hero-image-left.svg" alt="Left Panel" fill className="object-cover" />
                  </motion.div>

                  {/* Top Right Floating Menu (Invite Teammates) */}
                  <motion.div 
                    animate={{ y: [0, -12, 0] }}
                    transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    className="absolute top-[2%] right-[10%] w-[40%] h-[38%] rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.2)] bg-white overflow-hidden z-30 cursor-pointer"
                  >
                     <Image src="/assets/hero-image-top.svg" alt="Top Panel" fill className="object-cover" />
                  </motion.div>

                  {/* Bottom Right Floating Card (Darkish list) */}
                  <motion.div 
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1.5 }}
                    whileHover={{ scale: 1.05 }}
                    className="absolute bottom-[0%] right-[5%] w-[38%] h-[35%] rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.2)] bg-white overflow-hidden z-30 cursor-pointer"
                  >
                     <Image src="/assets/hero-image-right.svg" alt="Bottom Right Panel" fill className="object-cover" />
                  </motion.div>
               </motion.div>
             </div>
             
           </AuroraBackground>
         </motion.section>

         {/* Neura Block Section */}
         <section ref={neuraRef} id="neura" className="relative w-full px-4 md:px-0 mt-8 md:mt-24 mb-6 h-auto md:h-[500px] flex flex-col items-center justify-center overflow-visible">
            {/* Background "NEURA" Text */}
            <div className="absolute top-[10%] md:top-[10%] left-1/2 -translate-x-1/2 w-full text-center z-0">
               <h2 className="text-[120px] md:text-[260px] lg:text-[280px] font-black tracking-[-0.02em] leading-none pointer-events-none select-none text-transparent bg-clip-text bg-gradient-to-r from-[#ffa515] via-[#c876b5] to-[#672cb9] animate-gradient-x bg-[length:200%_auto]">
                 NEURA
               </h2>
            </div>
            
            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-[1040px] h-full mt-10 md:mt-16">
               
               {/* Center Mascot */}
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                 className="relative w-[300px] h-[360px] md:w-[400px] md:h-[500px] z-20"
               >
                 <Image src="/assets/ai-robot.png" alt="Neura Mascot" fill className="object-contain" />
               </motion.div>

               {/* Left Card */}
               <motion.div 
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.6 }}
                 className="md:absolute md:left-[2%] lg:-left-[2%] md:bottom-[10%] bg-white rounded-[16px] md:rounded-[24px] p-6 lg:p-8 w-[240px] md:w-[280px] lg:w-[320px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] z-30 border border-gray-100 hover:scale-105 transition-transform mt-[-40px] md:mt-0 relative"
               >
                 <p className="font-['Montserrat',sans-serif] text-[18px] md:text-[24px] lg:text-[28px] leading-[1.15] font-light md:font-normal text-[#333] text-left tracking-tight">
                   Bingung?<br/> Tanyakan<br/> tentang<br/> fitur kami<br/> pada Neura
                 </p>
               </motion.div>

{/* naruh chatbot jadi di lapisan paling atas */}


            </div>
         </section>

         {/* Feature Section - Natural Student-Centric Style */}
         <section id="fitur" className="relative w-full flex flex-col items-center pt-24 md:pt-36 pb-12 md:pb-24 bg-[#08020d] rounded-t-[40px] md:rounded-t-[80px] mt-16 md:mt-24 z-20 border-t border-white/5 overflow-hidden">
            
            {/* Elegant Aurora Purple Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
               {/* Base Dark Deep Purple */}
               <div className="absolute inset-0 bg-gradient-to-b from-[#08020d] via-[#10031c] to-[#08020d]"></div>
               
               {/* Sweeping Aurora Waves */}
               <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(114,35,204,0.15)_0%,transparent_60%)] rounded-[100%] rotate-[-15deg] blur-[80px]"></div>
               <div className="absolute bottom-[-10%] left-[-20%] w-[80vw] h-[700px] bg-[radial-gradient(ellipse_at_center,rgba(63,16,134,0.2)_0%,transparent_60%)] rounded-[100%] rotate-[25deg] blur-[100px]"></div>
               <div className="absolute top-[30%] left-[20%] w-[50vw] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(163,104,221,0.1)_0%,transparent_70%)] rounded-[100%] blur-[90px]"></div>
               
               {/* Noise Texture layer for organic feel */}
               <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')"}}></div>
            </div>

            {/* Diamond Ambient Grid with Radial Mask */}
            <div className="absolute inset-0 pointer-events-none z-0" 
                 style={{ 
                    backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(-45deg, rgba(255,255,255,0.02) 1px, transparent 1px)', 
                    backgroundSize: '80px 80px', 
                    backgroundPosition: 'center center',
                    WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, black 20%, transparent 70%)',
                    maskImage: 'radial-gradient(ellipse at 50% 40%, black 20%, transparent 70%)'
                 }}>
            </div>

            {/* Subdued Central Highlighting over Aurora */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#9d4edd]/15 blur-[100px] rounded-[100%] pointer-events-none z-0"></div>
            
            {/* Subtle base fade out at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-[#08020d] to-transparent pointer-events-none z-10"></div>

            <div className="w-full max-w-[1240px] flex flex-col items-center justify-center z-20 px-6 md:px-12 relative flex-1">
               
               {/* Heading Text dengan sentuhan "Scribble" Ala Pelajar */}
               <div className="w-full flex flex-col items-center text-center text-white mb-16 md:mb-20">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-[34px] md:text-[48px] lg:text-[60px] font-bold leading-[1.2] tracking-tight text-white mb-4 relative"
                  >
                     Dari Dokumen Kusut <br className="hidden md:block"/> 
                     Jadi <span className="relative inline-block text-[#ffa515] italic pr-2 font-serif">Nilai A+
                        {/* Hand-drawn underline SVG */}
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

               {/* Natural 3-Step Study Flow */}
               <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-6 relative z-30">
                  
                  {/* Step 1: Kumpulkan Bahan */}
                  <motion.div 
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     whileHover={{ y: -5 }}
                     transition={{ duration: 0.5 }}
                     className="w-full lg:w-1/3 flex flex-col bg-[#1c0f2e]/80 border border-white/10 rounded-[24px] p-8 backdrop-blur-sm relative"
                  >
                     <div className="w-10 h-10 rounded-full bg-[#672cb9] flex items-center justify-center mb-6 font-bold text-lg text-white shadow-lg absolute -top-5 -left-2 border-4 border-[#0d0415] rotate-[-5deg]">1</div>
                     
                     <h3 className="text-white font-bold text-[20px] mb-2">Tumpuk Materimu</h3>
                     <p className="text-white/50 text-[13px] mb-8 leading-[1.5]">
                        Upload PDF, Word, atau Paste Link YouTube dosenmu ke dalam satu folder belajar.
                     </p>
                     
                     {/* Visual: Stack of floating papers */}
                     <div className="relative h-[140px] w-full flex justify-center items-center mt-auto">
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute w-[100px] h-[120px] bg-white rounded-lg shadow-xl border border-gray-200 rotate-[-12deg] -translate-x-6 flex flex-col p-2 gap-2">
                           <div className="w-[80%] h-2 bg-[#ff6b6b]/20 rounded-full"></div>
                           <div className="w-full h-2 bg-gray-100 rounded-full"></div>
                           <div className="w-[60%] h-2 bg-gray-100 rounded-full"></div>
                           <div className="mt-auto self-end text-[#ff6b6b]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                        </motion.div>
                        <motion.div animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 3.5 }} className="absolute w-[100px] h-[120px] bg-white rounded-lg shadow-xl border border-gray-200 rotate-[8deg] translate-x-6 flex flex-col p-2 gap-2">
                           <div className="w-[80%] h-2 bg-[#4dabf7]/20 rounded-full"></div>
                           <div className="w-full h-2 bg-gray-100 rounded-full"></div>
                           <div className="w-[90%] h-2 bg-gray-100 rounded-full"></div>
                           <div className="mt-auto self-end text-[#4dabf7]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/></svg></div>
                        </motion.div>
                        <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 4.5 }} className="absolute w-[110px] h-[130px] bg-gradient-to-br from-[#1c0f2e] to-[#2a1744] border border-[#672cb9]/50 rounded-lg shadow-2xl z-10 flex items-center justify-center">
                           <div className="bg-white/10 p-3 rounded-full backdrop-blur-md">
                              <svg className="text-[#ffa515]" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                           </div>
                        </motion.div>
                     </div>
                  </motion.div>

                  {/* Hand-drawn Arrow (Desktop only) */}
                  <div className="hidden lg:block w-[40px] text-white/30">
                     <svg viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="5,5">
                        <path d="M0,10 Q50,0 90,10" />
                        <polyline points="80,0 95,12 75,20" />
                     </svg>
                  </div>

                  {/* Step 2: Neura AI Memproses */}
                   <motion.div 
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     whileHover={{ y: -5 }}
                     transition={{ duration: 0.5, delay: 0.2 }}
                     className="w-full lg:w-1/3 flex flex-col bg-[#1c0f2e]/80 border border-white/10 rounded-[24px] p-8 backdrop-blur-sm relative"
                  >
                     <div className="w-10 h-10 rounded-full bg-[#672cb9] flex items-center justify-center mb-6 font-bold text-lg text-white shadow-lg absolute -top-5 -left-2 border-4 border-[#0d0415] rotate-[5deg]">2</div>
                     
                     <h3 className="text-white font-bold text-[20px] mb-2">Biar Neura Merangkum</h3>
                     <p className="text-white/50 text-[13px] mb-8 leading-[1.5]">
                        AI kami akan membaca ribuan kata dan menyaring poin-poin terpenting layaknya spidol ajaib.
                     </p>

                     {/* Visual: Book/Text with Highlighter Scanner */}
                     <div className="relative h-[140px] w-full flex justify-center items-center mt-auto">
                        <div className="w-[160px] h-[120px] bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
                           <div className="w-[40%] h-2 bg-white/20 rounded-full"></div>
                           <div className="w-full h-2 bg-white/10 rounded-full"></div>
                           <div className="w-[85%] h-2 bg-white/10 rounded-full"></div>
                           <div className="w-[70%] h-2 bg-white/10 rounded-full"></div>
                           <div className="w-full h-2 bg-white/10 rounded-full"></div>
                           
                           {/* Highlighter Scanner Effect */}
                           <motion.div 
                              animate={{ y: [0, 80, 0] }}
                              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                              className="absolute top-0 left-0 w-full h-[20px] bg-gradient-to-b from-[#ffa515]/0 via-[#ffa515]/30 to-[#ffa515]/0 border-b border-[#ffa515]/50 flex items-center shadow-[0_0_15px_#ffa515]"
                           >
                           </motion.div>
                        </div>
                        {/* Little sparkle */}
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-2 -right-2 text-[#ffa515]">
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z"/></svg>
                        </motion.div>
                     </div>
                  </motion.div>

                  {/* Hand-drawn Arrow (Desktop only) */}
                  <div className="hidden lg:block w-[40px] text-white/30">
                     <svg viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="5,5">
                        <path d="M0,10 Q50,20 90,10" />
                        <polyline points="80,0 95,8 85,20" />
                     </svg>
                  </div>

                  {/* Step 3: Siap Dipelajari */}
                  <motion.div 
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     whileHover={{ y: -5 }}
                     transition={{ duration: 0.5, delay: 0.4 }}
                     className="w-full lg:w-1/3 flex flex-col bg-[#1c0f2e]/80 border border-[#ffa515]/30 rounded-[24px] p-8 backdrop-blur-sm relative shadow-[0_10px_30px_rgba(255,165,21,0.1)]"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-[#ffa515]/5 to-transparent rounded-[24px] pointer-events-none"></div>

                     <div className="w-10 h-10 rounded-full bg-[#ffa515] flex items-center justify-center mb-6 font-bold text-lg text-[#0d0415] shadow-lg absolute -top-5 -left-2 border-4 border-[#0d0415] rotate-[-5deg]">3</div>
                     
                     <h3 className="text-white font-bold text-[20px] mb-2 z-10">Materi Siap Ujian</h3>
                     <p className="text-white/50 text-[13px] mb-8 leading-[1.5] z-10">
                        Hasil akhirnya berupa Flashcard interaktif dan Rangkuman rapi yang siap kamu pelajari di mana saja.
                     </p>

                     {/* Visual: Flashcards with checkmark */}
                     <div className="relative h-[140px] w-full flex justify-center items-center mt-auto group">
                        <motion.div className="absolute w-[120px] h-[80px] bg-white border border-gray-200 rounded-xl shadow-lg rotate-[-10deg] -translate-x-4 translate-y-4 group-hover:-translate-x-8 transition-transform duration-300 flex items-center justify-center opacity-70">
                        </motion.div>
                        <motion.div className="absolute w-[120px] h-[80px] bg-white border border-gray-200 rounded-xl shadow-xl rotate-[5deg] translate-x-4 translate-y-2 group-hover:translate-x-8 transition-transform duration-300 flex items-center justify-center opacity-90">
                        </motion.div>
                        <motion.div className="absolute w-[130px] h-[90px] bg-white border border-[#672cb9]/30 rounded-xl shadow-2xl z-10 flex flex-col px-4 py-3 justify-center items-center text-center group-hover:-translate-y-4 transition-transform duration-300">
                           <span className="text-[#672cb9] font-bold text-[14px]">Flashcard</span>
                           <span className="text-gray-400 text-[10px] mt-1">Tap/Flip to Reveal</span>
                           <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#51cf66] text-white rounded-full flex items-center justify-center border-2 border-white shadow-md">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                           </div>
                        </motion.div>
                     </div>
                  </motion.div>

               </div>

               {/* Bottom CTA Actions */}
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16 md:mt-20 w-full"
               >
                  <Link href="#comment" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/10 text-white text-[15px] font-medium py-4 px-8 rounded-full transition-all flex items-center justify-center gap-3 backdrop-blur-md">
                     Lihat kata mereka
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </Link>
               </motion.div>

            </div>
         </section>

         {/* Modern Professional Quote Section - Redesigned to match image layered transition and Mobbin animated text trigger */}
         <section ref={quotesRef} className="relative w-full min-h-screen pt-40 pb-36 md:pt-[300px] md:pb-48 flex flex-col justify-center items-start bg-[#fcfcfc] overflow-visible z-10 font-['Montserrat',sans-serif]">
            
            {/* Top Layered Paper Transition */}
            <div className="absolute top-[-1px] left-0 w-full flex flex-col z-30 pointer-events-none">
               {/* Layer 1 - Deep Purple matching bottom of previous section */}
               <div className="h-[20px] md:h-[32px] w-full bg-[#1b0a33] shadow-[0_12px_15px_-3px_rgba(0,0,0,0.6)] z-50 relative"></div>
               {/* Layer 2 - Deep Violet */}
               <div className="h-[16px] md:h-[28px] w-full bg-[#3d245c] shadow-[0_12px_15px_-3px_rgba(0,0,0,0.4)] z-40 relative"></div>
               {/* Layer 3 - Metallic Purple */}
               <div className="h-[16px] md:h-[28px] w-full bg-[#6a4299] shadow-[0_12px_15px_-3px_rgba(0,0,0,0.25)] z-30 relative"></div>
               {/* Layer 4 - Lilac */}
               <div className="h-[16px] md:h-[28px] w-full bg-[#9f88bd] shadow-[0_12px_15px_-3px_rgba(0,0,0,0.15)] z-20 relative"></div>
               {/* Layer 5 - Very Light Lilac */}
               <div className="h-[16px] md:h-[28px] w-full bg-[#dacfec] shadow-[0_12px_15px_-3px_rgba(0,0,0,0.08)] z-10 relative"></div>
               {/* Layer 6 - Off White */}
               <div className="h-[16px] md:h-[28px] w-full bg-[#f6effb] shadow-[0_12px_15px_-3px_rgba(0,0,0,0.03)] z-0 relative"></div>
            </div>

            {/* Floating Purple Parallax Rectangles */}
            <div className="absolute inset-x-0 bottom-[140px] top-[140px] pointer-events-none z-0 overflow-hidden">
               {Array.from({ length: 60 }).map((_, i) => {
                  const pseudoRandom = (seed: number) => {
                     const x = Math.sin(seed) * 10000;
                     return x - Math.floor(x);
                  };
                  
                  // Distribute uniformly around the screen
                  const randVal = pseudoRandom(i + 10);
                  // Bias distribution towards the right side
                  const left = Math.pow(randVal, 0.4) * 100; 
                  const top = pseudoRandom(i + 20) * 100;
                  
                  // Boxes sizes (Squares & Rectangles) - Reduced size for smaller 'pixels'
                  const w = 8 + pseudoRandom(i + 30) * 28;
                  const h = w * (0.8 + pseudoRandom(i + 40) * 1.5); // Range from squarish to taller vertically
                  
                  // Assign layer based on size: Bigger elements simulate closer proximity, hence move faster!
                  let yTransform;
                  if (w > 32) yTransform = layer5Y;
                  else if (w > 26) yTransform = layer4Y;
                  else if (w > 18) yTransform = layer3Y;
                  else if (w > 12) yTransform = layer2Y;
                  else yTransform = layer1Y;
                  
                  const delay = pseudoRandom(i + 70) * 0.4;
                  
                  // Solid Purple colors as requested
                  const palettes = [
                     '#9b59b6', '#8e44ad', '#a29bfe', '#6c5ce7', 
                     '#7d5fff', '#cd84f1', '#c56cf0',
                  ];
                  const bg = palettes[Math.floor(pseudoRandom(i + 80) * palettes.length)];
                  
                  return (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 0.8, scale: 1 }}
                        viewport={{ once: true, margin: "50px" }}
                        transition={{ 
                           opacity: { duration: 0.5, delay },
                           scale: { duration: 0.6, delay, type: "spring", bounce: 0.4 }
                        }}
                        className="absolute mix-blend-multiply"
                        style={{
                           left: `${left}%`,
                           top: `${top}%`,
                           width: `${w}px`,
                           height: `${h}px`,
                           background: bg,
                           borderRadius: '0px', 
                           y: yTransform, // Pure scroll parallax
                        }}
                     />
                  );
               })}
               
               {/* Center white radial glow to ensure typography remains highly readable */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[70%] h-[90%] bg-[radial-gradient(circle_at_center,rgba(252,252,252,0.95)_0%,rgba(252,252,252,0.6)_50%,transparent_100%)] pointer-events-none z-0"></div>
            </div>

            <div className="relative z-10 w-full flex-1 max-w-[1240px] mx-auto flex flex-col justify-center items-start text-left px-8 md:px-20 pointer-events-none mt-[-20px] md:mt-[-40px]">
               <motion.div style={{ y: quotesTextY }} className="w-full">
                  <h2 className="flex flex-col items-start justify-center text-[32px] sm:text-[40px] md:text-[56px] lg:text-[64px] font-medium text-[#1f1f1f] leading-[1.2] tracking-tight relative z-20 w-full">
                     <motion.span 
                        style={{ opacity: textOp1, y: textY1, textShadow: "0 0 30px rgba(252,252,252,1), 0 0 10px rgba(252,252,252,0.9)" }}
                     >“Belajarlah</motion.span>
                     <motion.span 
                        style={{ opacity: textOp2, y: textY2, textShadow: "0 0 30px rgba(252,252,252,1), 0 0 10px rgba(252,252,252,0.9)" }}
                     >yang tinggi</motion.span>
                     <motion.span 
                        style={{ opacity: textOp3, y: textY3, textShadow: "0 0 30px rgba(252,252,252,1), 0 0 10px rgba(252,252,252,0.9)" }}
                     >agar tidak</motion.span>
                     <motion.span 
                        style={{ opacity: textOp4, y: textY4, textShadow: "0 0 30px rgba(252,252,252,1), 0 0 10px rgba(252,252,252,0.9)" }}
                     >mudah di</motion.span>
                     <motion.span 
                        style={{ opacity: textOp5, y: textY5, textShadow: "0 0 30px rgba(252,252,252,1), 0 0 10px rgba(252,252,252,0.9)" }}
                     >bodoh bodoh i”</motion.span>
                  </h2>
               </motion.div>
            </div>

            {/* Elegant & Clean Seamless Transition to Testimonials */}
            <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-b from-transparent to-[#fcf9fc] pointer-events-none z-40 flex flex-col justify-end">
               {/* Razor-thin, ultra-subtle separator line (Premium SaaS Aesthetic) */}
               <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#672cb9]/15 to-transparent"></div>
            </div>
         </section>

         {/* Kisah Sukses (Testimonial - Infinite Marquee) */}
         <section id="comment" className="w-full bg-[#fcf9fc] flex flex-col items-center pt-24 pb-16 md:pt-28 md:pb-28 overflow-hidden z-20 relative">
            <h2 className="text-[28px] md:text-[42px] font-black text-[#170a29] text-center leading-tight mb-4 tracking-[-0.02em]">
               Kisah Sukses Mereka
            </h2>
            <p className="text-[14px] md:text-[16px] text-gray-500 mb-10 md:mb-16 text-center px-4 max-w-[500px]">
               Ribuan pelajar dan profesional telah membuktikan bagaimana OtakEncer meningkatkan produktivitas mereka.
            </p>
            
            <div className="relative flex w-full max-w-[100vw] overflow-hidden group">
               {/* Fade Gradients for edge masking */}
               <div className="absolute top-0 left-0 w-[100px] md:w-[250px] h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
               <div className="absolute top-0 right-0 w-[100px] md:w-[250px] h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

               {/* Scrolling Marquee Container */}
               <motion.div 
                  className="flex gap-6 md:gap-8 min-w-max px-4 py-12 items-center"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ ease: "linear", duration: 35, repeat: Infinity }}
               >
                  {/* Duplicate array to ensure seamless infinite looping */}
                  {[...testimonials, ...testimonials].map((testimonial, idx) => (
                     <motion.div 
                        key={idx}
                        whileHover={{ y: -6, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-[280px] md:w-[360px] h-[280px] md:h-[320px] bg-white border-[2.5px] border-[#672cb9] rounded-[24px] md:rounded-[28px] pt-10 pb-8 px-6 md:px-10 relative flex flex-col justify-between shrink-0 cursor-pointer shadow-[0_12px_24px_rgba(103,44,185,0.05)] hover:shadow-[0_20px_40px_rgba(103,44,185,0.12)]"
                     >
                        {/* Top Left Quote */}
                        <div className="absolute -top-6 md:-top-7 left-6 md:left-8 bg-white px-2 md:px-4 text-[#672cb9] text-[48px] md:text-[60px] font-black leading-none font-serif select-none flex items-center justify-center">
                           “
                        </div>
                        
                        {/* Bottom Right Quote */}
                        <div className="absolute -bottom-8 md:-bottom-9 right-6 md:right-8 bg-white px-2 md:px-4 text-[#672cb9] text-[48px] md:text-[60px] font-black leading-none font-serif select-none flex items-center justify-center">
                           ”
                        </div>
                        
                        <div className="flex-1 flex items-center justify-center pt-2">
                           <p className="text-[14px] md:text-[16px] text-[#2c1d42] text-center leading-[1.6] md:leading-[1.7] font-bold md:font-medium italic">
                              "{testimonial.text}"
                           </p>
                        </div>
                        
                        <div className="flex items-center justify-center gap-4 mt-auto border-t border-gray-100 pt-5">
                           <div className="w-[48px] h-[48px] md:w-[60px] md:h-[60px] rounded-full overflow-hidden relative shadow-sm border-[2.5px] border-[#ffa515] shrink-0">
                              <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" />
                           </div>
                           <div className="flex flex-col text-left">
                              <h4 className="text-[16px] md:text-[18px] font-bold text-[#672cb9] leading-tight capitalize tracking-tight">{testimonial.name}</h4>
                              <p className="text-[11px] md:text-[13px] text-[#ffa515] font-bold leading-none mt-1 uppercase tracking-wider">{testimonial.role}</p>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </motion.div>
            </div>

            {/* Pagination Decoration */}
            <div className="flex justify-center items-center gap-3 mt-8 md:mt-12">
               <div className="w-3 h-3 md:w-4 md:h-4 bg-[#ffa515] rounded-full"></div>
               <div className="w-10 h-3 md:w-14 md:h-4 bg-[#672cb9] rounded-full"></div>
               <div className="w-3 h-3 md:w-4 md:h-4 bg-[#ffa515] rounded-full"></div>
            </div>
         </section>

         {/* CTA Card with Aurora */}
         <section className="w-full bg-white px-4 md:px-12 py-12 md:py-20 flex flex-col items-center relative z-20">
            <motion.div 
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.7, ease: "easeOut" }}
               className="w-full max-w-[900px] rounded-[32px] md:rounded-[48px] overflow-hidden shadow-[0_20px_60px_rgba(103,44,185,0.15)] relative"
            >
               <AuroraBackground className="w-full py-12 md:py-16 px-6 md:px-12 flex flex-col items-center text-center !min-h-[400px]">
                  {/* Glowing decoration */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] h-[200px] bg-[#ffa515]/20 blur-[80px] rounded-full pointer-events-none mix-blend-screen"></div>

                  <motion.div 
                     animate={{ y: [0, -10, 0] }}
                     transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                     className="w-[220px] h-[220px] md:w-[320px] md:h-[320px] mb-0 md:mb-0 relative z-10"
                  >
                     <Image src="/assets/ai-cta.svg" alt="Robot AI Cta" width={120} height={120} className="w-full h-full object-contain" />
                  </motion.div>

                  <h3 className="text-white font-bold text-[24px] md:text-[38px] lg:text-[44px] tracking-tight mb-4 md:mb-6 leading-[1.2] relative z-10 drop-shadow-md">
                     Siap Revolusi Cara<br className="md:hidden"/> Belajarmu?
                  </h3>
                  
                  <p className="text-white/90 text-[14px] md:text-[16px] leading-[1.6] md:leading-[1.8] mb-8 md:mb-10 font-['Montserrat',sans-serif] px-2 max-w-[540px] relative z-10 font-medium">
                     Bergabung dengan puluhan ribu pelajar dan profesional yang telah merasakan kemudahan memahami dokumen kompleks bersama OtakEncer.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full sm:w-auto px-4">
                     <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto px-8 md:px-10 h-[48px] md:h-[56px] bg-white text-[#672cb9] font-bold text-[15px] md:text-[16px] rounded-full transition-all shadow-[0_8px_25px_rgba(255,255,255,0.2)] hover:shadow-[0_12px_35px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2"
                     >
                        Mulai Sekarang Gratis
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                     </motion.button>
                     <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full sm:w-auto px-8 md:px-10 h-[48px] md:h-[56px] bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-[15px] md:text-[16px] rounded-full transition-all flex items-center justify-center"
                     >
                        Hubungi Sales
                     </motion.button>
                  </div>
               </AuroraBackground>
            </motion.div>
         </section>

         {/* Modern Footer */}
         <footer ref={footerRef} className="w-full bg-[#08020d] rounded-t-[40px] md:rounded-t-[80px] border-t border-white/10 text-white pt-16 md:pt-24 pb-8 md:pb-10 relative z-20 overflow-hidden">
            {/* Ambient glows for the footer */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#672cb9]/15 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-100px] right-1/4 w-[400px] h-[400px] bg-[#ffa515]/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute top-[20%] right-10 w-[300px] h-[300px] bg-[#c876b5]/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-[1240px] w-full mx-auto px-6 md:px-12 flex flex-col relative z-10">
               {/* Main Footer Content */}
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16 lg:mb-20">
                  
                  {/* Brand Column */}
                  <div className="col-span-1 lg:col-span-5 flex flex-col items-start">
                     <Link href="#beranda" className="flex items-center gap-3 mb-6 group">
                        <div className="bg-white/10 border border-white/20 w-12 h-12 flex items-center justify-center rounded-2xl group-hover:bg-white/20 transition-all shadow-lg backdrop-blur-sm">
                           <Image src="/assets/logo.png" alt="Logo" width={28} height={28} className="object-contain invert brightness-0 group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="font-bold text-[24px] md:text-[28px] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">OtakEncer</span>
                     </Link>
                     <p className="text-white/60 text-[14px] md:text-[15px] leading-[1.7] max-w-[380px] mb-8 font-['Montserrat',sans-serif]">
                        Platform AI pintar yang mengubah dokumen kompleks menjadi materi interaktif siap pelajari. Belajar lebih cerdas, tingkatkan produktivitasmu.
                     </p>
                     
                     <div className="flex gap-4">
                        <Link href="#" className="w-11 h-11 flex items-center justify-center hover:-translate-y-1 bg-white/5 hover:bg-[#672cb9] border border-white/10 rounded-full transition-all group shadow-sm hover:shadow-[0_10px_20px_rgba(103,44,185,0.4)]">
                           <Image src="/assets/twitter-icon.svg" alt="X" width={18} height={18} className="brightness-0 invert group-hover:scale-110 transition-transform" />
                        </Link>
                        <Link href="#" className="w-11 h-11 flex items-center justify-center hover:-translate-y-1 bg-white/5 hover:bg-[#672cb9] border border-white/10 rounded-full transition-all group shadow-sm hover:shadow-[0_10px_20px_rgba(103,44,185,0.4)]">
                           <Image src="/assets/facebook-icon.svg" alt="FB" width={18} height={18} className="brightness-0 invert group-hover:scale-110 transition-transform" />
                        </Link>
                        <Link href="#" className="w-11 h-11 flex items-center justify-center hover:-translate-y-1 bg-white/5 hover:bg-[#672cb9] border border-white/10 rounded-full transition-all group shadow-sm hover:shadow-[0_10px_20px_rgba(103,44,185,0.4)]">
                           <Image src="/assets/instagram-social.svg" alt="IG" width={18} height={18} className="brightness-0 invert group-hover:scale-110 transition-transform" />
                        </Link>
                     </div>
                  </div>

                  {/* Links Columns */}
                  <div className="col-span-1 lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-8">
                     <div className="flex flex-col">
                        <h4 className="font-bold text-[16px] md:text-[18px] mb-6 text-white">Produk</h4>
                        <div className="flex flex-col gap-4 font-['Montserrat',sans-serif] text-[14px] md:text-[15px] text-white/60">
                           <Link href="#neura" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">Neura AI</Link>
                           <Link href="#fitur" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">Fitur Flashcard</Link>
                           <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">Ringkasan Dokumen</Link>
                           <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">Integrasi YouTube</Link>
                        </div>
                     </div>
                     <div className="flex flex-col">
                        <h4 className="font-bold text-[16px] md:text-[18px] mb-6 text-white">Perusahaan</h4>
                        <div className="flex flex-col gap-4 font-['Montserrat',sans-serif] text-[14px] md:text-[15px] text-white/60">
                           <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">Tentang Kami</Link>
                           <Link href="#comment" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">Testimoni</Link>
                           <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">Blog</Link>
                           <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">Karir</Link>
                        </div>
                     </div>
                     <div className="flex flex-col col-span-2 md:col-span-1">
                        <h4 className="font-bold text-[16px] md:text-[18px] mb-6 text-white">Dukungan</h4>
                        <div className="flex flex-col gap-4 font-['Montserrat',sans-serif] text-[14px] md:text-[15px] text-white/60">
                           <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">Pusat Bantuan</Link>
                           <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">Syarat & Ketentuan</Link>
                           <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">Kebijakan Privasi</Link>
                           <Link href="#" className="hover:text-[#ffa515] hover:translate-x-1 transition-all w-fit">Kontak</Link>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Bottom Bar */}
               <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4">
                  <p className="text-[13px] md:text-[14px] font-['Montserrat',sans-serif] text-white/50 text-center md:text-left">
                     &copy; 2026 OtakEncer. All rights reserved.
                  </p>
                  <p className="text-[13px] md:text-[14px] font-['Montserrat',sans-serif] text-white/50 flex items-center justify-center md:justify-end gap-1 flex-wrap">
                     Created by <span className="font-semibold text-white/80">Pasti Sukses</span> @TechSprint Innovation Cup 2026
                  </p>
               </div>
            </div>
         </footer>
      </main>

      {/* Right Pill Button (Fixed FAB) Moved to top-level to avoid clipping/z-index issues */}
      <motion.div 
         initial={{ x: "150%" }}
         animate={{ x: showNeuraFab ? 0 : "150%" }}
         transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
         className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-[9999]"
      >
         <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#672cb9] hover:bg-[#522199] transition-all duration-300 rounded-full pl-2 pr-6 md:pr-10 py-2 md:py-2.5 flex items-center gap-3 shadow-[0_8px_24px_rgba(103,44,185,0.4)] hover:shadow-[0_12px_32px_rgba(103,44,185,0.6)]"
         >
            <div className="w-[44px] h-[44px] md:w-[56px] md:h-[56px] bg-white rounded-full flex items-center justify-center overflow-hidden p-[4px] md:p-[6px]">
               <Image src="/assets/ai-robot-svg.svg" alt="AI" width={36} height={36} className="w-full h-full object-cover scale-110 md:scale-100" />
            </div>
            <div className="flex flex-col items-start justify-center pr-2">
               <span className="text-[12px] md:text-[14px] text-white/90 leading-tight font-medium mb-[2px]">Tanya Pada</span>
               <span className="text-[20px] md:text-[28px] text-white leading-none font-bold tracking-wide">NEURA</span>
            </div>
         </motion.button>
      </motion.div>

    </div>
  );
}
