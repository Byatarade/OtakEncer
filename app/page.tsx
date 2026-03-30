"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="bg-white min-h-screen text-black font-['Montserrat',sans-serif] overflow-x-hidden flex flex-col items-center">
      
      {/* Navbar Container */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 w-full max-w-[1440px] z-50 bg-white">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-semibold text-[18px] md:text-[20px] tracking-tight text-[#170a29]">
            OtakEncer
          </span>
        </div>
        
        {/* Right Nav Action */}
        <div className="flex items-center gap-3">
           <button className="hidden md:flex items-center justify-center bg-black text-white px-5 py-2.5 rounded-[12px] font-medium text-[13px] gap-2 hover:bg-gray-800 transition-colors">
             <Image src="/assets/google-icon-nav.svg" alt="G" width={16} height={16} className="invert" />
             Mulai Gratis
           </button>
           <button className="md:hidden flex items-center justify-center bg-black text-white px-4 py-2 rounded-full font-medium text-[11px] gap-2">
             <Image src="/assets/google-icon-nav.svg" alt="G" width={12} height={12} className="invert" />
             Mulai Gratis
           </button>
           <button className="p-1">
             <Image src="/assets/menu-icon.svg" alt="Menu" width={24} height={24} />
           </button>
        </div>
      </nav>

      <main className="w-full flex flex-col items-center max-w-[1440px] relative">
         
         {/* Hero Section */}
         <motion.section 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="w-full px-4 md:px-8 mt-2 md:mt-4 flex flex-col items-center relative z-20"
         >
           {/* Purple Hero Card */}
           <div className="relative w-full rounded-[24px] md:rounded-[32px] bg-[#672cb9] md:bg-gradient-to-r md:from-[#672cb9] md:to-[#8d4acf] overflow-hidden pt-12 pb-16 md:pt-[70px] md:pb-[70px] px-4 md:px-14 lg:px-20 flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-0 min-h-[540px]">
             
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
               <div className="flex flex-row items-center justify-center md:justify-start gap-3 md:gap-4 mt-8 md:mt-10 z-10 w-full px-1 md:px-0">
                 <button className="flex-1 max-w-[160px] md:w-auto bg-[#4d2691] hover:bg-[#3f1e78] text-white px-2 md:px-6 py-3.5 md:py-4 rounded-[10px] md:rounded-[12px] font-bold text-[12px] md:text-[14px] flex items-center justify-center gap-2 border border-[#5d31a8] transition-colors shadow-lg shadow-black/20">
                   <Image src="/assets/google-icon.svg" alt="G" width={14} height={14} className="md:w-[16px] md:h-[16px]" />
                   Mulai Gratis
                 </button>
                 <button className="flex-1 max-w-[160px] md:w-auto bg-transparent hover:bg-white/10 text-white border border-[#ffa515] px-2 md:px-6 py-3.5 md:py-4 rounded-[10px] md:rounded-[12px] font-bold text-[12px] md:text-[14px] transition-colors shadow-lg shadow-black/10">
                   Lihat Demo
                 </button>
               </div>
             </div>

             {/* FIXED BUG: Hero Mockup Images absolute positioning mapped neatly */}
                   <div className="w-full md:w-[55%] flex justify-center md:justify-end items-center mt-2 md:mt-0 z-20 h-auto">
               
                      {/* Proportional Container for accurate icon positioning unaffected by screen stretches */}
                      <div className="relative w-full max-w-[420px] md:max-w-[550px] aspect-[1.05/1] md:aspect-[1.15/1]">
                  
                  {/* Main Dashboard - Back layer */}
                  <div className="absolute top-[8%] right-[5%] w-[88%] h-[80%] rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.3)] bg-white z-10">
                     <Image
                        src="/assets/hero-image-main.png"
                        alt="Dashboard Main"
                        fill
                        className="object-cover object-left-top"
                     />
                  </div>

                  {/* Left Floating Menu (Funnel/Retention/Flows) */}
                  <div className="absolute top-[40%] left-[2%] w-[42%] h-[38%] rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.15)] bg-white overflow-hidden z-20 transition-transform duration-500 hover:-translate-y-2">
                     <Image src="/assets/hero-image-left.png" alt="Left Panel" fill className="object-cover" />
                  </div>

                  {/* Top Right Floating Menu (Invite Teammates) */}
                  <div className="absolute top-[2%] right-[10%] w-[40%] h-[38%] rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.2)] bg-white overflow-hidden z-30 transition-transform duration-500 hover:-translate-y-2">
                     <Image src="/assets/hero-image-top.png" alt="Top Panel" fill className="object-cover" />
                  </div>

                  {/* Bottom Right Floating Card (Darkish list) */}
                  <div className="absolute bottom-[0%] right-[5%] w-[38%] h-[35%] rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.2)] bg-white overflow-hidden z-30 transition-transform duration-500 hover:-translate-y-2">
                     <Image src="/assets/hero-image-right.png" alt="Bottom Right Panel" fill className="object-cover" />
                  </div>
               </div>
             </div>
             
           </div>
         </motion.section>

         {/* Neura Block Section */}
         <section className="relative w-full px-4 md:px-0 mt-8 md:mt-24 mb-6 h-auto md:h-[500px] flex flex-col items-center justify-center overflow-visible">
            {/* Background "NEURA" Text */}
            <div className="absolute top-[10%] md:top-[10%] left-1/2 -translate-x-1/2 w-full text-center z-0">
               <h2 className="text-[120px] md:text-[260px] lg:text-[280px] font-black tracking-[-0.02em] leading-none pointer-events-none select-none text-transparent bg-clip-text bg-gradient-to-r from-[#ffa515] via-[#c876b5] to-[#672cb9]">
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
               <div className="md:absolute md:left-[2%] lg:-left-[2%] md:bottom-[10%] bg-white rounded-[16px] md:rounded-[24px] p-6 lg:p-8 w-[240px] md:w-[280px] lg:w-[320px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] z-30 border border-gray-100 transition-transform hover:scale-105 mt-[-40px] md:mt-0 relative">
                 <p className="font-['Montserrat',sans-serif] text-[18px] md:text-[24px] lg:text-[28px] leading-[1.15] font-light md:font-normal text-[#333] text-left tracking-tight">
                   Bingung?<br/> Tanyakan<br/> tentang<br/> fitur kami<br/> pada Neura
                 </p>
               </div>

               {/* Right Pill Button */}
               <div className="md:absolute md:right-[2%] lg:right-[0%] md:bottom-[12%] z-30 mt-6 md:mt-0 transition-transform hover:scale-105">
                 <button className="bg-[#672cb9] hover:bg-[#522199] transition-colors rounded-full pl-2 pr-6 md:pr-10 py-2 md:py-2.5 flex items-center gap-3 shadow-[0_8px_24px_rgba(103,44,185,0.4)]">
                    <div className="w-[44px] h-[44px] md:w-[56px] md:h-[56px] bg-white rounded-full flex items-center justify-center overflow-hidden p-[4px] md:p-[6px]">
                       <Image src="/assets/ai-robot-svg.svg" alt="AI" width={36} height={36} className="w-full h-full object-cover scale-110 md:scale-100" />
                    </div>
                    <div className="flex flex-col items-start justify-center pr-2">
                       <span className="text-[12px] md:text-[14px] text-white/90 leading-tight font-medium mb-[2px]">Tanya Pada</span>
                       <span className="text-[20px] md:text-[28px] text-white leading-none font-bold tracking-wide">NEURA</span>
                    </div>
                 </button>
               </div>
            </div>
         </section>

         {/* FIXED BUG: Dark Features Dome uses solid padding instead of overlapping Absolute bg which causes white-text on white-bg */}
         <section className="relative w-full flex flex-col items-center pt-24 md:pt-36 bg-[#110524] rounded-t-[50px] md:rounded-t-[100px] mt-16 md:mt-24 shadow-[0_-20px_50px_rgba(17,5,36,0.3)] z-20">
            
            <div className="w-full max-w-[1100px] flex flex-col items-center justify-center z-20 px-6 md:px-12 pb-24 md:pb-32">
               
               {/* Heading Text Centered ALWAYS */}
               <div className="w-full flex flex-col items-center text-center text-white">
                  <h2 className="text-[28px] md:text-[42px] lg:text-[48px] font-bold leading-[1.2] tracking-tight">
                     Temukan Fitur <br className="md:hidden"/>
                     Yang Kamu <br className="md:hidden"/>
                     Butuhkan!
                  </h2>
                  <p className="text-[14px] md:text-[16px] lg:text-[18px] text-white/70 max-w-[340px] md:max-w-[500px] lg:max-w-[600px] mt-6 md:mt-4 leading-[1.6]">
                     Tingkatkan efisiensi belajar dengan alat yang disesuaikan untuk mengubah dokumen menjadi bahan belajar siap pakai, kapan saja.
                  </p>
               </div>

               {/* Flowchart Icons Network (Centered ALWAYS) */}
               <div className="w-full flex flex-col items-center mt-12 md:mt-16 z-20 relative">
                  
                  {/* Icons Container with Border */}
                  <div className="relative border border-[#ffa515]/80 rounded-[24px] md:rounded-[40px] px-8 py-8 md:px-16 md:py-12 flex flex-col items-center z-30 mb-[40px] md:mb-[60px] bg-[#1a0c33]/20 backdrop-blur-sm">
                     
                     {/* Top Row Icons */}
                     <div className="flex gap-4 md:gap-8 z-30">
                        <div className="w-[52px] h-[52px] md:w-[68px] md:h-[68px] bg-[#1a0c33] border border-[#ffa515]/30 rounded-[14px] flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                           <Image src="/assets/pdf-icon.svg" alt="PDF" width={28} height={28} className="md:w-[36px] md:h-[36px]" />
                        </div>
                        <div className="w-[52px] h-[52px] md:w-[68px] md:h-[68px] bg-[#1a0c33] border border-[#ffa515]/30 rounded-[14px] flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                           <Image src="/assets/excel-icon.svg" alt="Excel" width={28} height={28} className="md:w-[36px] md:h-[36px]" />
                        </div>
                        <div className="w-[52px] h-[52px] md:w-[68px] md:h-[68px] bg-[#1a0c33] border border-[#ffa515]/30 rounded-[14px] flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                           <Image src="/assets/word-icon.svg" alt="Word" width={28} height={28} className="md:w-[36px] md:h-[36px]" />
                        </div>
                     </div>

                     {/* Bottom Row Icons */}
                     <div className="flex gap-4 md:gap-8 mt-5 md:mt-8 z-30">
                        <div className="w-[52px] h-[52px] md:w-[68px] md:h-[68px] bg-[#1a0c33] border border-[#ffa515]/30 rounded-[14px] flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                           <Image src="/assets/youtube-icon.svg" alt="YouTube" width={28} height={28} className="md:w-[36px] md:h-[36px]" />
                        </div>
                        <div className="w-[52px] h-[52px] md:w-[68px] md:h-[68px] bg-[#1a0c33] border border-[#ffa515]/30 rounded-[14px] flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                           <Image src="/assets/instagram-icon.svg" alt="Instagram" width={28} height={28} className="md:w-[36px] md:h-[36px]" />
                        </div>
                     </div>

                     {/* Vertical Connecting Line to Brain */}
                     <div className="absolute -bottom-[40px] md:-bottom-[60px] left-1/2 -translate-x-1/2 w-px h-[40px] md:h-[60px] bg-[#ffa515] z-10"></div>
                  </div>

                  {/* Brain AI Core */}
                  <div className="relative z-30 w-[64px] h-[64px] md:w-[94px] md:h-[94px] flex items-center justify-center">
                     <div className="absolute inset-0 bg-transparent rounded-full border border-[#ffa515]/60 border-dashed animate-[spin_8s_linear_infinite]"></div>
                     <div className="absolute inset-2 border border-[#854acb]/80 rounded-full"></div>
                     <div className="absolute inset-4 border border-[#672cb9] rounded-full"></div>
                     <div className="w-[42px] h-[42px] md:w-[50px] md:h-[50px] bg-[#a368dd]/40 rounded-full flex items-center justify-center overflow-hidden z-20 shadow-[0_0_20px_#a368dd]">
                        <Image src="/assets/gemini-bot.png" alt="Brain AI Core" width={28} height={28} className="md:w-[32px] md:h-[32px] object-contain drop-shadow-md brightness-110" />
                     </div>
                  </div>

                  {/* Feature Actions (Visible Mobile & Desktop below brain) */}
                  <div className="flex flex-col gap-3 md:gap-4 mt-12 md:mt-20 w-full max-w-[280px] md:max-w-[340px]">
                     <button className="w-full bg-[#1a0c33] border border-[#2e1d4a] hover:bg-[#2e1d4a] text-white text-[13px] md:text-[14px] font-medium py-3.5 md:py-4 rounded-[12px] transition-colors shadow-lg">
                        Login Dan Coba Sekarang
                     </button>
                     <button className="w-full bg-[#ffa515] text-[#1a0c33] text-[13px] md:text-[14px] font-bold py-3.5 md:py-4 rounded-[12px] shadow-[0_5px_15px_rgba(255,165,21,0.3)] hover:bg-[#ffb53f] transition-colors">
                        Pelajari Dengan Neura
                     </button>
                  </div>
               </div>
            </div>

            {/* Gradients to base white underneath Dome - FIXED inside section layout */}
            <div className="w-full h-[120px] md:h-[180px] flex flex-col justify-end mt-auto z-10">
               <div className="w-full h-[30px] md:h-[50px] bg-[#3d1b6e]/80"></div>
               <div className="w-full h-[20px] md:h-[30px] bg-[#532694]/70"></div>
               <div className="w-full h-[20px] md:h-[30px] bg-[#703bba]/50"></div>
               <div className="w-full h-[15px] md:h-[25px] bg-[#8957c9]/40"></div>
               <div className="w-full h-[15px] md:h-[20px] bg-[#cca5f5]/30"></div>
            </div>
         </section>

         {/* Quote Bar-Chart Section */}
         <section className="relative w-full py-16 md:py-32 px-6 flex items-center justify-center bg-white overflow-hidden min-h-[460px] md:min-h-[580px] z-10">
            {/* The Quote text */}
            <h2 className="text-[32px] md:text-[56px] font-black text-[#170a29] z-20 max-w-[320px] md:max-w-[800px] leading-[1.1] text-left relative drop-shadow-sm font-['Montserrat',sans-serif] tracking-[-0.02em]">
               <span className="text-[#a368dd] md:absolute md:-left-12 -top-4 text-[42px] md:text-[80px] font-serif leading-none opacity-80">“</span>
               Belajarlah<br/>
               yang tinggi<br/>
               agar tidak<br/>
               mudah di<br className="md:hidden"/>
               bodoh bodoh i<span className="text-[#a368dd] font-serif text-[32px] md:text-[50px] leading-none opacity-80">”</span>
            </h2>

            {/* Confetti particles */}
            <div className="absolute top-[10%] right-[10%] w-[120px] h-[180px] opacity-60 pointer-events-none md:scale-150 origin-top-right">
               {Array.from({length: 45}).map((_, i) => (
                  <div key={i} className="absolute w-[5px] h-[5px] md:w-[8px] md:h-[8px] bg-[#672cb9] rounded-sm"
                       style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          opacity: Math.random(),
                          transform: `scale(${Math.random() * 1.5})`
                       }}>
                  </div>
               ))}
               {Array.from({length: 20}).map((_, i) => (
                  <div key={`y-${i}`} className="absolute w-[4px] h-[4px] md:w-[6px] md:h-[6px] bg-[#ffa515] rounded-sm"
                       style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          opacity: Math.random() * 0.7,
                          transform: `scale(${Math.random()})`
                       }}>
                  </div>
               ))}
            </div>

            {/* Vertical Bar Chart Background matching mobile SS perfectly */}
            <div className="absolute bottom-0 w-full left-1/2 -translate-x-1/2 h-[50%] md:h-[55%] flex items-end justify-center px-4 md:px-0 gap-[3px] md:gap-[5px] z-10 pointer-events-none opacity-90">
               {Array.from({ length: 85 }).map((_, i) => {
                  const isYellow = i % 5 === 0 || i % 8 === 0;
                  const isLightPurple = i % 3 === 0;
                  const color = isYellow ? 'bg-[#ffa515]/90' : isLightPurple ? 'bg-[#a368dd]/80' : 'bg-[#672cb9]/90';
                  // Create a wave shape
                  const wave1 = Math.sin(i * 0.15) * 30;
                  const wave2 = Math.cos(i * 0.4) * 15;
                  const height = 20 + Math.abs(wave1 + wave2) + Math.random() * 15;
                  return (
                     <div key={`bar-${i}`} className={`w-[8px] md:w-[14px] rounded-t-[3px] ${color}`} style={{ height: `${height}%` }}></div>
                  );
               })}
            </div>
         </section>

         {/* Kisah Sukses (Testimonial) */}
         <section className="w-full bg-white flex flex-col items-center pt-24 pb-16 md:py-32 px-6 md:px-12 z-20">
            <h2 className="text-[22px] md:text-[36px] font-bold text-[#672cb9] text-center leading-tight mb-10 md:mb-16 tracking-tight">
               Kisah Sukses <br className="md:hidden"/>
               Mereka
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 w-full max-w-[1100px] mt-4">
               
               {/* Fixed Card with exact dimensions and text from image */}
               <div className="w-full bg-white border border-[#eae0f5] rounded-[24px] pt-12 pb-6 px-8 md:px-10 relative shadow-[0_8px_30px_rgba(103,44,185,0.06)] flex flex-col justify-between">
                  <div className="absolute -top-3 left-6 text-[#672cb9] bg-white rounded-full p-1 border border-white">
                     <Image src="/assets/quote-avatar-left.svg" alt="" width={20} height={20} className="md:w-[28px] md:h-[28px]" />
                  </div>
                  <div className="absolute -bottom-3 right-6 text-[#672cb9] bg-white rounded-full p-1 border border-white">
                     <Image src="/assets/quote-avatar-right.svg" alt="" width={20} height={20} className="md:w-[28px] md:h-[28px]" />
                  </div>
                  
                  <p className="text-[12px] md:text-[14px] text-gray-500 text-center leading-[1.8] font-['Montserrat',sans-serif] px-1 mb-8">
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <div className="flex flex-col items-center gap-1.5 mt-auto">
                     <div className="w-[42px] h-[42px] md:w-[50px] md:h-[50px] rounded-full overflow-hidden border border-gray-100 shadow-sm relative mb-0.5">
                        <Image src="/assets/testimonial-avatar.png" alt="Hezzam" fill className="object-cover" />
                     </div>
                     <h4 className="text-[13px] md:text-[15px] font-bold text-[#672cb9] leading-none">Hezzam</h4>
                     <p className="text-[10px] md:text-[11px] text-gray-400 font-medium leading-none mt-1">Investor Videy</p>
                  </div>
               </div>

               {/* Desktop Fillers */}
               <div className="w-full bg-white border border-[#eae0f5] rounded-[24px] pt-12 pb-6 px-8 md:px-10 relative shadow-[0_8px_30px_rgba(103,44,185,0.06)] flex-col justify-between hidden md:flex">
                     <div className="absolute -top-3 left-6 text-[#672cb9] bg-white rounded-full p-1"><Image src="/assets/quote-avatar-left.svg" alt="" width={28} height={28} /></div>
                     <div className="absolute -bottom-3 right-6 text-[#672cb9] bg-white rounded-full p-1"><Image src="/assets/quote-avatar-right.svg" alt="" width={28} height={28} /></div>
                  <p className="text-[14px] text-gray-500 text-center leading-[1.8] font-['Montserrat',sans-serif] px-1 mb-8">
                     Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <div className="flex flex-col items-center gap-1.5 mt-auto">
                     <div className="w-[50px] h-[50px] rounded-full overflow-hidden bg-gray-100 border border-gray-100 shadow-sm relative mb-0.5"></div>
                     <h4 className="text-[15px] font-bold text-[#672cb9] leading-none">Sinta R.</h4>
                     <p className="text-[11px] text-gray-400 font-medium leading-none mt-1">Mahasiswi IT</p>
                  </div>
               </div>

               <div className="w-full bg-white border border-[#eae0f5] rounded-[24px] pt-12 pb-6 px-8 md:px-10 relative shadow-[0_8px_30px_rgba(103,44,185,0.06)] flex-col justify-between hidden md:flex">
                     <div className="absolute -top-3 left-6 text-[#672cb9] bg-white rounded-full p-1"><Image src="/assets/quote-avatar-left.svg" alt="" width={28} height={28} /></div>
                     <div className="absolute -bottom-3 right-6 text-[#672cb9] bg-white rounded-full p-1"><Image src="/assets/quote-avatar-right.svg" alt="" width={28} height={28} /></div>
                  <p className="text-[14px] text-gray-500 text-center leading-[1.8] font-['Montserrat',sans-serif] px-1 mb-8">
                     Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  </p>
                  <div className="flex flex-col items-center gap-1.5 mt-auto">
                     <div className="w-[50px] h-[50px] rounded-full overflow-hidden bg-gray-100 border border-gray-100 shadow-sm relative mb-0.5"></div>
                     <h4 className="text-[15px] font-bold text-[#672cb9] leading-none">Bima C.</h4>
                     <p className="text-[11px] text-gray-400 font-medium leading-none mt-1">Developer</p>
                  </div>
               </div>

            </div>

            {/* Pagination Dots (Mobile) */}
            <div className="flex md:hidden gap-1.5 mt-8 items-center justify-center">
               <div className="w-1.5 h-1.5 rounded-full bg-[#ffa515]"></div>
               <div className="w-5 h-1.5 rounded-full bg-[#672cb9]"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-[#ffa515]"></div>
            </div>
         </section>

         {/* CTA Card over Peach background */}
         <section className="w-full bg-[#fff2de] px-4 md:px-12 py-16 md:py-24 flex flex-col items-center relative z-20">
            {/* The Purple Box */}
            <div className="w-full max-w-[320px] md:max-w-[800px] bg-[#46237a] md:bg-gradient-to-tr md:from-[#401f70] md:to-[#672cb9] rounded-[24px] md:rounded-[40px] pt-8 md:pt-14 pb-10 md:pb-14 px-6 md:px-20 flex flex-col items-center text-center shadow-[0_20px_40px_rgba(70,35,122,0.25)]">
               
               {/* Happy Robot Face SVG Image */}
               <div className="w-[70px] h-[70px] md:w-[100px] md:h-[100px] mb-4 md:mb-8">
                  <Image src="/assets/ai-cta.svg" alt="Robot AI Cta" width={100} height={100} className="w-full h-full object-contain" />
               </div>

               <h3 className="text-white font-bold text-[18px] md:text-[38px] tracking-tight mb-2 md:mb-5 leading-[1.3] md:leading-[1.2]">
                  Siap Revolusi Cara<br className="md:hidden"/> Belajarmu?
               </h3>
               
               <p className="text-white/80 text-[11px] md:text-[16px] leading-[1.6] md:leading-[1.8] mb-8 md:mb-10 font-['Montserrat',sans-serif] px-1 max-w-[500px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
               </p>
               
               <button className="w-full max-w-[180px] md:max-w-[240px] h-[48px] md:h-[60px] bg-white text-[#672cb9] font-bold text-[13px] md:text-[16px] rounded-[16px] transition-transform hover:scale-105 shadow-lg">
                  Mulai Disini
               </button>
            </div>
         </section>

         {/* Footer */}
         <footer className="w-full bg-[#0d0714] text-white rounded-t-[40px] md:rounded-t-[80px] pt-12 md:pt-24 pb-8 md:pb-12 px-6 md:px-20 mt-0 flex flex-col items-start border-b-[6px] md:border-b-[8px] border-[#ffa515] relative z-20">
            <div className="max-w-[1200px] w-full mx-auto flex flex-col md:flex-row md:justify-between items-start">
               
               <div className="flex flex-col w-full md:w-auto mb-10 md:mb-0">
                  <div className="flex items-center gap-3 mb-8 md:mb-10">
                     <div className="bg-transparent w-8 h-8 md:w-12 md:h-12 flex items-center justify-center relative">
                        <Image src="/assets/logo.png" alt="Logo" fill className="object-contain invert brightness-0" />
                     </div>
                     <span className="font-semibold text-[20px] md:text-[28px] tracking-tight">OtakEncer</span>
                  </div>

                  <h4 className="font-medium text-[13px] md:text-[16px] mb-4 text-white uppercase tracking-wider">Quick Links</h4>
                  <div className="flex flex-col gap-3 font-['Montserrat',sans-serif] text-[12px] md:text-[15px] text-gray-400">
                     <Link href="#" className="w-fit hover:text-white transition-colors">Beranda</Link>
                     <Link href="#" className="w-fit hover:text-white transition-colors">Neura AI</Link>
                     <Link href="#" className="w-fit hover:text-white transition-colors">Testimoni</Link>
                     <Link href="#" className="w-fit hover:text-white transition-colors">Kontak</Link>
                  </div>
               </div>

               <div className="flex flex-col w-full md:w-auto items-start md:items-end justify-between h-full">
                  <div className="flex gap-4 md:gap-5 mb-8 md:mb-0 md:mt-16">
                     <Link href="#" className="w-6 h-6 md:w-10 md:h-10 flex items-center justify-center hover:opacity-80 bg-white/5 rounded-full p-1.5 md:p-2.5 transition-all">
                        <Image src="/assets/twitter-icon.svg" alt="X" width={24} height={24} className="brightness-0 invert" />
                     </Link>
                     <Link href="#" className="w-6 h-6 md:w-10 md:h-10 flex items-center justify-center hover:opacity-80 bg-white/5 rounded-full p-1.5 md:p-2.5 transition-all">
                        <Image src="/assets/facebook-icon.svg" alt="FB" width={24} height={24} className="brightness-0 invert" />
                     </Link>
                     <Link href="#" className="w-6 h-6 md:w-10 md:h-10 flex items-center justify-center hover:opacity-80 bg-white/5 rounded-full p-1.5 md:p-2.5 transition-all">
                        <Image src="/assets/instagram-social.svg" alt="IG" width={24} height={24} className="brightness-0 invert" />
                     </Link>
                  </div>

                  <div className="text-left md:text-right flex flex-col gap-1 md:mt-20">
                     <p className="text-[11px] md:text-[14px] font-['Montserrat',sans-serif] text-gray-500 font-medium">
                        Created By Pasti Sukses
                     </p>
                     <p className="text-[11px] md:text-[14px] font-['Montserrat',sans-serif] text-gray-500 font-medium">
                        @TechSprint Innovation Cup 2026
                     </p>
                  </div>
               </div>
            </div>
         </footer>
      </main>
    </div>
  );
}
