import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white min-h-screen text-black font-['Montserrat',sans-serif] overflow-x-hidden flex flex-col items-center">
      
      {/* Navbar Container */}
      <nav className="flex items-center justify-between px-5 py-4 w-full max-w-[430px] z-50 bg-white">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-semibold text-[18px] tracking-tight text-[#170a29]">
            OtakEncer
          </span>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center justify-center bg-black text-white px-3 py-1.5 rounded-full font-medium text-[11px] gap-2">
             <Image
               src="/assets/google-icon-nav.svg"
               alt="G"
               width={12}
               height={12}
               className="invert"
             />
             Mulai Gratis
           </button>
           <button className="p-1">
             <Image
               src="/assets/menu-icon.svg"
               alt="Menu"
               width={24}
               height={24}
             />
           </button>
        </div>
      </nav>

      <main className="w-full max-w-[430px] flex flex-col items-center">
         
         {/* Hero Section */}
         <div className="w-full px-4 pb-8 flex flex-col items-center">
           {/* Purple Hero Card */}
           <div className="relative w-full rounded-[24px] bg-gradient-to-b from-[#672cb9] via-[#854acb] to-[#a368dd] overflow-hidden pt-10 pb-[190px] px-4 shadow-[0_10px_30px_rgba(103,44,185,0.2)] flex flex-col items-center">
             
             {/* Text */}
             <h1 className="font-bold text-[32px] leading-[38px] text-center text-white z-10 tracking-tight">
               Ubah<br/>
               Dokumenmu<br/>
               Menjadi <span className="underline decoration-[#ffa515] decoration-[3px] underline-offset-4">Materi</span><br/>
               <span className="underline decoration-[#ffa515] decoration-[3px] underline-offset-4">Siap Jadi</span>
             </h1>

             <p className="font-['Montserrat',sans-serif] text-[12px] leading-[18px] text-center text-white/90 mt-5 z-10 w-full max-w-[290px] font-medium">
               Upload PDF, Audio, atau link YouTube — AI akan meringkasnya menjadi materi yang siap dipelajari lebih cepat!
             </p>

             {/* Buttons row */}
             <div className="flex flex-row items-center justify-center gap-3 mt-6 z-10 w-full px-1">
               <button className="flex-1 bg-black/20 text-white py-2.5 rounded-[12px] font-medium text-[12px] flex items-center justify-center gap-2 backdrop-blur-sm border border-transparent">
                 <Image src="/assets/google-icon.svg" alt="G" width={14} height={14} />
                 Mulai Gratis
               </button>
               <button className="flex-1 bg-black/20 text-white border border-[#ffa515] py-2.5 rounded-[12px] font-medium text-[12px] backdrop-blur-sm">
                 Lihat Demo
               </button>
             </div>

             {/* Hero Hover Images */}
             <div className="absolute -bottom-4 w-full max-w-[340px] h-[220px] z-10 flex justify-center scale-[0.85] translate-y-8">
               <Image
                 src="/assets/hero-image-main.png"
                 alt="Dashboard"
                 fill
                 className="object-contain"
               />
               <div className="absolute -left-6 top-[30%] w-[60px] aspect-[46/85] shadow-lg rounded-md overflow-hidden z-20 hover:-translate-y-1 transition-transform">
                 <Image src="/assets/hero-image-left.png" alt="Left" fill className="object-cover" />
               </div>
               <div className="absolute right-4 -top-8 w-[80px] aspect-square shadow-lg rounded-md overflow-hidden z-20 hover:-translate-y-1 transition-transform">
                 <Image src="/assets/hero-image-top.png" alt="Top right" fill className="object-cover" />
               </div>
               <div className="absolute -right-2 top-[45%] w-[130px] h-[95px] shadow-lg rounded-md overflow-hidden z-20 hover:-translate-y-1 transition-transform">
                 <Image src="/assets/hero-image-right.png" alt="Bottom right" fill className="object-cover" />
               </div>
             </div>
           </div>
         </div>

         {/* Neura Promo Banner */}
         <section className="relative w-full mt-4 px-4 h-[240px] flex flex-col items-center">
           {/* Huge NEURA text behind */}
           <h2 className="absolute top-0 right-4 text-[75px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#ffa515] via-[#ffcda5] to-[#ece1f5] opacity-50 z-0">
             NEURA
           </h2>
           
           <div className="w-full relative h-full flex mt-6">
              {/* Mascot */}
              <div className="absolute left-0 bottom-4 w-[160px] h-[180px] z-10">
                <Image src="/assets/ai-robot.png" alt="Neura" fill className="object-contain" />
              </div>

              {/* Speech bubble */}
              <div className="absolute top-6 left-[140px] bg-white rounded-2xl p-3 w-[150px] shadow-[0_5px_15px_rgba(0,0,0,0.08)] z-20 border border-gray-100 before:content-[''] before:absolute before:left-[-6px] before:top-1/2 before:-translate-y-1/2 before:border-y-8 before:border-y-transparent before:border-r-8 before:border-r-white">
                <p className="font-['Montserrat',sans-serif] text-[11px] leading-[15px] font-semibold text-gray-800">
                  Bingung? Tanyakan tentang fitur kami pada Neura
                </p>
              </div>

              {/* Tanya Pada Neura button */}
              <button className="absolute bottom-6 right-2 bg-[#672cb9] rounded-full pl-2 pr-4 py-1.5 flex items-center gap-2 shadow-[0_4px_12px_rgba(103,44,185,0.4)] z-20">
                 <div className="w-[32px] h-[32px] bg-white rounded-full flex items-center justify-center overflow-hidden p-1">
                    <Image src="/assets/ai-robot-svg.svg" alt="AI" width={24} height={24} className="scale-125 mt-1" />
                 </div>
                 <div className="flex flex-col items-start justify-center">
                    <span className="text-[9px] text-white/90 leading-tight font-medium">Tanya Pada</span>
                    <span className="text-[14px] text-white leading-tight font-bold">NEURA</span>
                 </div>
              </button>
           </div>
         </section>

         {/* Features Dark Section with Arch */}
         <section className="w-full relative mt-8 z-10 flex flex-col items-center pb-12">
            {/* Curve overlay directly in CSS */}
            <div className="absolute top-0 left-0 w-full h-full bg-[#110524] rounded-t-[50%] scale-x-[1.3] shadow-[0_-10px_40px_rgba(103,44,185,0.2)] -z-10 origin-top"></div>
            
            <div className="w-full flex flex-col items-center pt-16 px-6">
               <h2 className="text-[28px] font-bold text-center text-white leading-[34px] tracking-tight">
                  Temukan Fitur<br/>Yang Kamu<br/>Butuhkan!
               </h2>
               <p className="text-[12px] text-white/70 text-center mt-4 w-full max-w-[280px] font-['Montserrat',sans-serif] leading-[18px]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
               </p>

               {/* Icons box connection */}
               <div className="relative mt-10 z-20 w-full max-w-[280px] mx-auto flex flex-col items-center">
                  
                  {/* The Box */}
                  <div className="w-full border border-[#ffa515]/60 rounded-[20px] bg-[#1a0c33]/80 p-6 relative z-20">
                     <div className="grid grid-cols-3 gap-y-4 place-items-center mb-2">
                        <div className="w-[48px] h-[48px] bg-black/40 rounded-[14px] flex items-center justify-center">
                           <Image src="/assets/pdf-icon.svg" alt="PDF" width={24} height={24} />
                        </div>
                        <div className="w-[48px] h-[48px] bg-black/40 rounded-[14px] flex items-center justify-center">
                           <Image src="/assets/excel-icon.svg" alt="Excel" width={24} height={24} />
                        </div>
                        <div className="w-[48px] h-[48px] bg-black/40 rounded-[14px] flex items-center justify-center">
                           <Image src="/assets/word-icon.svg" alt="Word" width={24} height={24} />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4 place-items-center px-6">
                        <div className="w-[48px] h-[48px] bg-black/40 rounded-[14px] flex items-center justify-center">
                           <Image src="/assets/youtube-icon.svg" alt="YouTube" width={24} height={24} />
                        </div>
                        <div className="w-[48px] h-[48px] bg-black/40 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                           <Image src="/assets/instagram-icon.svg" alt="Instagram" width={24} height={24} className="z-10" />
                        </div>
                     </div>
                  </div>
                  
                  {/* Vertical Connection Line */}
                  <div className="w-px h-[60px] bg-gradient-to-b from-[#ffa515] to-[#ffa515]/20 -mt-2 z-10 relative">
                     <div className="absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full bg-[#1a0c33] border-2 border-[#ffa515]"></div>
                  </div>

                  {/* Brain Circle */}
                  <div className="relative mt-0 z-20 w-[90px] h-[90px] flex items-center justify-center">
                     <Image src="/assets/ellipse-dark.svg" alt="" fill className="object-cover absolute rounded-full animate-pulse opacity-40" />
                     {/* Rings */}
                     <div className="absolute inset-2 border border-[#672cb9] rounded-full"></div>
                     <div className="absolute inset-4 border border-[#854acb] rounded-full"></div>
                     <div className="bg-[#a368dd]/20 rounded-full p-3 shadow-[0_0_20px_#a368dd] backdrop-blur-sm">
                        <Image src="/assets/gemini-bot.png" alt="Brain" width={26} height={26} className="object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                     </div>
                  </div>
               </div>

               {/* Two Action Buttons */}
               <div className="w-full flex flex-col gap-3 mt-10 mb-4 px-2 tracking-wide">
                  <button className="w-full bg-[#1a0c33] border border-white/20 text-white font-medium text-[13px] h-[46px] rounded-[12px] flex items-center justify-center">
                     Login Dan Coba Sekarang
                  </button>
                  <button className="w-full bg-[#ffa515] text-black font-semibold text-[13px] h-[46px] rounded-[12px] flex items-center justify-center shadow-[0_4px_14px_rgba(255,165,21,0.3)]">
                     Pelajari Dengan Neura
                  </button>
               </div>
            </div>
         </section>

         {/* Decorative Quote Section (Bar Chart Bg) */}
         <section className="relative w-full overflow-hidden bg-white max-w-[430px] pt-16 pb-24 px-6 flex items-center justify-center min-h-[500px]">
            {/* Background pattern simulating bars */}
            <div className="absolute inset-0 flex items-end justify-center gap-[6px] opacity-80 pointer-events-none pb-0">
               {/* Left side bars (Purple dominant) */}
               {Array.from({ length: 15 }).map((_, i) => (
                  <div 
                     key={`l-${i}`} 
                     className={`w-[8px] rounded-t-sm ${i % 3 === 0 ? 'bg-[#672cb9]' : i % 2 === 0 ? 'bg-[#a368dd]' : 'bg-[#dfc8f3]'}`}
                     style={{ height: `${20 + (Math.sin(i*0.5) * 40 + 40)}%` }}
                  />
               ))}
               {/* Center/Right bars (Orange dominant occasionally) */}
               {Array.from({ length: 20 }).map((_, i) => (
                  <div 
                     key={`r-${i}`} 
                     className={`w-[8px] rounded-t-sm ${i % 4 === 0 ? 'bg-[#ffa515]' : i % 3 === 0 ? 'bg-[#672cb9]' : 'bg-[rgba(163,104,221,0.4)]'}`}
                     style={{ height: `${30 + (Math.cos(i*0.8) * 50 + 40)}%` }}
                  />
               ))}
            </div>

            {/* Quote content - Floating text style */}
            <div className="relative z-10 w-full mb-10 text-left -mt-20">
               <span className="text-[60px] font-black text-black absolute -top-8 -left-4 font-serif leading-none">“</span>
               <h2 className="text-[34px] font-bold text-black tracking-tighter leading-[36px] relative z-10 break-words pr-4 pl-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                  Belajarlah<br/>yang tinggi<br/>agar tidak<br/>mudah di<br/>bodoh bodoh i
               </h2>
               <span className="text-[60px] font-black text-black absolute bottom-0 right-4 font-serif leading-none">”</span>
            </div>
         </section>

         {/* Kisah Sukses (Testimonial) */}
         <section className="w-full px-6 pb-20 bg-white flex flex-col items-center">
            <h2 className="text-[24px] font-bold text-[#672cb9] mb-8 text-center leading-tight">
               Kisah Sukses<br/>Mereka
            </h2>
            
            <div className="w-full max-w-[320px] border border-[#d6c5eb] rounded-[20px] p-6 pt-8 pb-6 relative bg-white shadow-[0_8px_30px_rgba(103,44,185,0.06)] flex flex-col items-center mt-2">
               {/* Quote marks corner */}
               <Image src="/assets/quote-avatar-left.svg" alt="" width={24} height={24} className="absolute -top-3 left-4 text-[#672cb9]" />
               <Image src="/assets/quote-avatar-right.svg" alt="" width={24} height={24} className="absolute -bottom-3 right-4 text-[#672cb9]" />
               
               <p className="text-[12px] text-gray-700 text-center leading-[18px] mb-6 px-1 font-['Montserrat',sans-serif]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
               </p>
               
               <div className="flex flex-col items-center gap-1.5">
                  <div className="w-[48px] h-[48px] rounded-full bg-gray-200 overflow-hidden relative border-2 border-white shadow-sm">
                     <Image src="/assets/testimonial-avatar.png" alt="Hezzam" fill className="object-cover" />
                  </div>
                  <h4 className="text-[13px] font-bold text-[#672cb9]">Hezzam</h4>
                  <p className="text-[9px] text-gray-500 font-medium">Investor Videy</p>
               </div>
            </div>

            <div className="flex gap-1.5 mt-8 items-center justify-center">
               <div className="w-1.5 h-1.5 rounded-full bg-[#ffa515]"></div>
               <div className="w-6 h-1.5 rounded-full bg-[#672cb9]"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-[#ffa515]"></div>
            </div>
         </section>

         {/* Siap Revolusi CTA */}
         <section className="w-full px-5 pb-10 bg-white flex flex-col items-center">
           <div className="w-full bg-gradient-to-b from-[#672cb9] to-[#3a1d6b] rounded-[24px] pt-8 pb-8 px-6 flex flex-col items-center relative text-center shadow-xl">
              <Image src="/assets/ai-cta.svg" alt="Robot" width={80} height={80} className="mb-4" />
              <h3 className="text-white font-bold text-[22px] leading-[28px] tracking-tight mb-3 px-4">
                 Siap Revolusi Cara Belajarmu?
              </h3>
              <p className="text-white/80 text-[11px] leading-[16px] mb-6 font-['Montserrat',sans-serif] px-2">
                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <button className="w-[160px] h-[44px] bg-white text-[#672cb9] font-bold text-[13px] rounded-[12px] shadow-md transition-transform hover:scale-105">
                 Mulai Disini
              </button>
           </div>
         </section>

         {/* Footer */}
         <footer className="w-full bg-black text-white rounded-t-[40px] pt-12 pb-6 px-8 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
               <div className="bg-transparent rounded-full w-8 h-8 flex items-center justify-center relative">
                  <Image src="/assets/logo.png" alt="Logo" fill className="object-contain invert brightness-0" />
               </div>
               <span className="font-semibold text-[18px] tracking-tight">OtakEncer</span>
            </div>

            <h4 className="font-medium text-[14px] mb-4 text-white">Quick Links</h4>
            <div className="flex flex-col gap-3 font-['Montserrat',sans-serif] text-[13px] text-gray-300">
               <Link href="#" className="w-fit">Beranda</Link>
               <Link href="#" className="w-fit">Neura AI</Link>
               <Link href="#" className="w-fit">Testimoni</Link>
               <Link href="#" className="w-fit">Kontak</Link>
            </div>

            <div className="flex gap-4 mt-8 mb-6">
               <Link href="#" className="w-6 h-6 flex items-center justify-center">
                  <Image src="/assets/twitter-icon.svg" alt="X" width={18} height={18} />
               </Link>
               <Link href="#" className="w-6 h-6 flex items-center justify-center">
                  <Image src="/assets/facebook-icon.svg" alt="FB" width={22} height={22} />
               </Link>
               <Link href="#" className="w-6 h-6 flex items-center justify-center">
                  <Image src="/assets/instagram-social.svg" alt="IG" width={20} height={20} />
               </Link>
            </div>

            {/* Separator line */}
            <div className="w-full h-px bg-white/20 mb-5"></div>
            
            <p className="text-left text-[11px] font-['Montserrat',sans-serif] text-gray-400">
               Created By Pasti Sukses
            </p>
            <p className="text-left text-[11px] font-['Montserrat',sans-serif] text-gray-400 mt-1">
               @TechSprint Innovation Cup 2026
            </p>
         </footer>

      </main>
    </div>
  );
}

