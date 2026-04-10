"use client";
import { supabase } from '@/lib/supabase';

import {Plus, LogOut, Settings, HelpCircle, ChevronDown, FileText, Check, X, MonitorPlay, Volume2, Link as LinkIcon, LayoutDashboard, Trophy, Users, Library, Flame, Lightbulb } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Reset input value so same file can be selected again if needed
    event.target.value = '';

    const isAudioInput = event.target.accept.includes('audio');
    const isDocInput = event.target.accept.includes('.pdf');

    const isAudioFile = file.type.startsWith('audio/') || !!file.name.match(/\.(mp3|mp4|mpeg|mpga|m4a|wav|webm)$/i);
    const isDocFile = !!file.name.match(/\.(pdf|docx|pptx)$/i);

    // Cross-validation
    if (isAudioInput && !isAudioFile) {
       Swal.fire({
         title: 'Format Tidak Valid',
         text: 'Harap unggah file audio (MP3, WAV, M4A, dll) pada menu Upload Audio.',
         icon: 'error',
         confirmButtonColor: '#672cb9'
       });
       return;
    }
    if (isDocInput && !isDocFile) {
       Swal.fire({
         title: 'Format Tidak Valid',
         text: 'Harap unggah file dokumen (PDF, DOCX, PPTX) pada menu Upload Dokumen.',
         icon: 'error',
         confirmButtonColor: '#672cb9'
       });
       return;
    }

    const isAudio = isAudioFile;
    const maxSize = isAudio ? 25 * 1024 * 1024 : 10 * 1024 * 1024; // 25MB audio, 10MB doc

    if (file.size > maxSize) {
      Swal.fire({
        title: 'File Terlalu Besar',
        text: `Ukuran file melebihi batas maksimal (${isAudio ? '25MB' : '10MB'})!`,
        icon: 'error',
        confirmButtonColor: '#672cb9'
      });
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', user.id);

      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/generate-materi', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
         Swal.fire({
           title: 'Gagal Memproses',
           text: result.error || 'Terjadi kesalahan saat memproses materi.',
           icon: 'error',
           confirmButtonColor: '#672cb9'
         });
      } else {
         // Sukses
         setIsUploadPopupOpen(false);
         Swal.fire({
           title: 'Berhasil!',
           text: 'Materi berhasil dibuat.',
           icon: 'success',
           timer: 1500,
           showConfirmButton: false,
           timerProgressBar: true
         });
         setTimeout(() => {
           router.push('/dashboard/library');
         }, 1500);
      }
    } catch (err: unknown) {
       Swal.fire({
         title: 'Terjadi Kesalahan',
         text: 'Gagal mengunggah file. Periksa koneksi internet Anda dan coba lagi.',
         icon: 'error',
         confirmButtonColor: '#672cb9'
       });
       console.error("Upload error:", err);
    } finally {
       setIsUploading(false);
    }
  };

  const handleLinkSubmit = async () => {
    if (!linkUrl || !user) return;

    if (!linkUrl.includes('youtube.com') && !linkUrl.includes('youtu.be')) {
      Swal.fire({
         title: 'Link Tidak Valid',
         text: 'Harap masukkan link URL dari YouTube yang benar (contoh: https://youtu.be/xxx).',
         icon: 'error',
         confirmButtonColor: '#672cb9'
      });
      return;
    }

    try {
      setIsUploading(true);
      setShowLinkInput(false);
      
      const formData = new FormData();
      formData.append('link', linkUrl);
      formData.append('user_id', user.id);

      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/generate-materi', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
         Swal.fire({
           title: 'Gagal Memproses Video',
           text: result.error || 'Terjadi kesalahan saat memproses video YouTube.',
           icon: 'error',
           confirmButtonColor: '#672cb9'
         });
      } else {
         setLinkUrl('');
         setIsUploadPopupOpen(false);
         Swal.fire({
           title: 'Berhasil!',
           text: 'Materi dari YouTube berhasil dibuat.',
           icon: 'success',
           timer: 1500,
           showConfirmButton: false,
           timerProgressBar: true
         });
         setTimeout(() => {
           router.push('/dashboard/library');
         }, 1500);
      }
    } catch (err: unknown) {
       Swal.fire({
         title: 'Terjadi Kesalahan',
         text: 'Gagal memproses link YouTube. Periksa koneksi internet Anda.',
         icon: 'error',
         confirmButtonColor: '#672cb9'
       });
       console.error("Youtube error:", err);
    } finally {
       setIsUploading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideDesktop = dropdownRef.current && !dropdownRef.current.contains(event.target as Node);
      const isOutsideMobile = mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node);
      
      // If both elements exist and click is outside both, or one exists and click is outside it
      if (
        (!dropdownRef.current || isOutsideDesktop) && 
        (!mobileDropdownRef.current || isOutsideMobile)
      ) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null; // Handled by AuthGuard

  return (
    <div className="flex flex-col h-full w-full p-4 lg:p-6 xl:p-8 max-w-[1600px] mx-auto gap-4 sm:gap-6">

      {/* Mobile Header (Only visible on small screens) */}
      <div className="flex sm:hidden items-center justify-between mb-2 gap-1">
        <Link href="/?view=landing" className="flex items-center gap-1 sm:gap-2 shrink-0 min-w-0">
          <div className="relative w-7 h-7 sm:w-7 sm:h-7 flex items-center justify-center shrink-0">
            <Image src="/assets/logo.svg" alt="OtakEncer Logo" fill className="object-contain" />
          </div>
          <span className="font-bold text-[20px] sm:text-[20px] md:text-[18px] tracking-tight text-gray-900 truncate shrink-0">
            Otak<span className="text-[#672cb9]">Encer</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button 
            onClick={() => setIsUploadPopupOpen(true)}
            className="flex items-center gap-1 bg-[#672cb9] text-white px-3 sm:px-4 py-1.5 rounded-full text-[12px] sm:text-[13px] font-semibold tracking-wide"
          >
            <Plus size={18} strokeWidth={2.5}/>
            Upload
          </button>
          
          <div className="sm:w-[10px] sm:h-7 bg-slate-200 mx-0.5"></div>

          <div className="relative flex shrink-0 items-center" ref={mobileDropdownRef}>
             <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="focus:outline-none group">
             {user.picture ? (
               <Image src={user.picture} alt={user.name} width={34} height={34} className="rounded-full ring-2 ring-white shadow-sm" />
             ) : (
               <div className="w-[34px] h-[34px] rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[14px] ring-2 ring-white shadow-sm">
                 {user.name?.[0] || 'U'}
               </div>
             )}
             </button>
             {/* Dropdown Menu Mobile */}
             {isDropdownOpen && (
               <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                 <div className="px-4 py-3 border-b border-slate-100 mb-1">
                   <p className="text-[14px] font-bold text-slate-800">{user.name}</p>
                   <p className="text-[12px] text-slate-500 truncate">{user.email}</p>
                 </div>
                 
                 <div className="flex flex-col px-2">
                   <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-slate-600 hover:text-[#672cb9] hover:bg-indigo-50/50 rounded-xl transition-colors">
                     <Settings size={18} />
                     Pengaturan Akun
                   </Link>
                   
                   <Link href="mailto:support@otakencer.com" className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-slate-600 hover:text-[#672cb9] hover:bg-indigo-50/50 rounded-xl transition-colors">
                     <HelpCircle size={18} />
                     Bantuan & Support
                   </Link>
                   
                   <div className="h-px w-full bg-slate-100 my-1"></div>
                   
                   <button 
                     onClick={handleLogout}
                     className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors w-full text-left"
                   >
                     <LogOut size={18} />
                     Keluar / Logout
                   </button>
                 </div>
               </div>
             )}
          </div>
          
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 md:hidden bg-white/40 rounded-full border border-white/50 backdrop-blur-md transition-colors hover:bg-white/60">
              <Image src="/assets/menu-icon.svg" alt="Menu" width={18} height={18} />
            </button>
        </div>
      </div>

      {/* Mobile Greeting */}
      <h1 className="sm:hidden ml-2 mt-7 text-[34px] font-bold text-[#0f172a] tracking-tight">Halo, {user.name.split(' ')[0]}!</h1>

      {/* Desktop Header Wrapper */}
      <div className="hidden sm:flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <h1 className="text-[28px] font-bold text-[#0f172a] tracking-tight whitespace-nowrap">Halo, {user.name.split(' ')[0]}!</h1>
        
        <div className="flex flex-wrap items-center gap-3 md:gap-4 justify-end">
          
          <button 
            onClick={() => setIsUploadPopupOpen(true)}
            className="flex items-center gap-2 bg-[#672cb9] text-white px-5 py-2.5 rounded-full text-[14px] font-bold shadow-md hover:bg-[#58249c] hover:shadow-lg transition-all transform hover:-translate-y-0.5 ml-2"
          >
            <Plus size={18} strokeWidth={2.5}/>
            <span className="hidden sm:inline">Upload</span>
          </button>
          
          <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block"></div>

          {/* Profile Dropdown */}
          <div className="relative flex items-center" ref={dropdownRef}>
             <button 
               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
               className="flex items-center gap-2 focus:outline-none group"
             >
               {user.picture ? (
                 <Image src={user.picture} alt={user.name} width={42} height={42} className="rounded-full shadow-sm border-2 border-white ring-2 ring-transparent group-hover:ring-[#672cb9]/20 transition-all hover:scale-105" />
               ) : (
                 <div className="w-[42px] h-[42px] rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm ring-2 ring-transparent group-hover:ring-[#672cb9]/20 transition-all hover:scale-105">
                   {user.name?.[0] || 'U'}
                 </div>
               )}
               <ChevronDown size={16} className={`text-slate-400 transition-transform hidden sm:block ${isDropdownOpen ? 'rotate-180' : ''}`} />
             </button>

             {/* Dropdown Menu */}
             {isDropdownOpen && (
               <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                 <div className="px-4 py-3 border-b border-slate-100 mb-1">
                   <p className="text-[14px] font-bold text-slate-800">{user.name}</p>
                   <p className="text-[12px] text-slate-500 truncate">{user.email}</p>
                 </div>
                 
                 <div className="flex flex-col px-2">
                   <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-slate-600 hover:text-[#672cb9] hover:bg-indigo-50/50 rounded-xl transition-colors">
                     <Settings size={18} />
                     Pengaturan Akun
                   </Link>
                   
                   <Link href="mailto:support@otakencer.com" className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-slate-600 hover:text-[#672cb9] hover:bg-indigo-50/50 rounded-xl transition-colors">
                     <HelpCircle size={18} />
                     Bantuan & Support
                   </Link>
                   
                   <div className="h-px w-full bg-slate-100 my-1"></div>
                   
                   <button 
                     onClick={handleLogout}
                     className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors w-full text-left"
                   >
                     <LogOut size={18} />
                     Keluar / Logout
                   </button>
                 </div>
               </div>
             )}
          </div>

        </div>
      </div>

      {/* Konten Dashboard Grid - REFACTORED HIERARCHY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 mt-2 flex-1 min-h-0 pb-4 lg:pb-0">
        
        {/* Left Column: Quick Upload / Main CTA (col-span-8) */}
        <div className="lg:col-span-8 order-2 lg:order-1 flex flex-col gap-4 lg:gap-5 h-full min-h-0">
          <div className="bg-white rounded-3xl p-5 md:p-6 lg:p-8 shadow-sm border border-slate-100 relative flex flex-col h-full min-h-0 overflow-hidden">
            
            {/* Dekorasi Background Halus */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#672cb9]/5 to-transparent rounded-bl-full pointer-events-none"></div>

            <div className="flex justify-between items-center mb-6 lg:mb-8 relative z-10">
              <div>
                <h3 className="text-[20px] md:text-[24px] font-bold text-slate-800 tracking-tight">Buat Materi Baru</h3>
                <p className="text-[14px] md:text-[15px] text-slate-500 mt-1">Pilih metode jalan pintas untuk mulai belajar</p>
              </div>
              {isUploading && (
                <div className="flex items-center gap-2 text-sm font-semibold text-[#672cb9] bg-[#672cb9]/10 px-4 py-2 rounded-full animate-pulse backdrop-blur-sm shadow-sm">
                  <div className="w-4 h-4 border-2 border-[#672cb9] border-t-transparent rounded-full animate-spin"></div>
                  Memproses...
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 relative z-10 flex-1 min-h-0 pb-2">
               {/* File PDF / DOCX */}
               <div className={`relative flex sm:flex-col items-center sm:items-start flex-row bg-slate-50 hover:bg-white hover:shadow-md p-4 sm:p-5 lg:p-6 rounded-[20px] border border-slate-200 transition-all text-left group cursor-pointer h-full ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}>
                 <div className="w-[42px] h-[42px] sm:w-[48px] sm:h-[48px] shrink-0 rounded-2xl bg-gradient-to-br from-[#ed2d07] to-[#871c07] flex items-center justify-center sm:mb-4 mr-4 sm:mr-0 shadow-sm group-hover:scale-105 transition-transform relative">
                   <FileText className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                   <span className="absolute text-[7px] sm:text-[8px] font-bold text-[#672cb9] bg-white px-1 leading-none rounded-sm mt-3.5 sm:mt-4">DOC</span>
                 </div>
                 <div>
                   <h3 className="text-[16px] sm:text-[18px] font-bold text-slate-800 mb-1 sm:mb-2">Gunakan Dokumen</h3>
                   <p className="text-[13px] sm:text-[14px] text-slate-600 leading-relaxed hidden sm:block">Unggah file teks PDF, DOCX, atau PPT (Max 10MB).</p>
                   <p className="text-[13px] text-slate-500 leading-relaxed sm:hidden">PDF, DOCX, PPT (Maks 10MB)</p>
                 </div>
                 <input 
                   type="file" 
                   accept=".pdf, .docx, .pptx"
                   onChange={handleFileUpload}
                   disabled={isUploading}
                   className="absolute inset-0 w-full h-full opacity-0 outline-none cursor-pointer z-10"
                   title="Pilih File"
                 />
               </div>

               {/* Audio File */}
               <div className={`relative flex sm:flex-col items-center sm:items-start flex-row bg-slate-50 hover:bg-white hover:shadow-md p-4 sm:p-5 lg:p-6 rounded-[20px] border border-slate-200 transition-all text-left group cursor-pointer h-full ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}>
                 <div className="w-[42px] h-[42px] sm:w-[48px] sm:h-[48px] shrink-0 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#047857] flex items-center justify-center sm:mb-4 mr-4 sm:mr-0 shadow-sm group-hover:scale-105 transition-transform relative">
                   <Volume2 className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                   <span className="absolute text-[7px] sm:text-[8px] font-bold text-[#672cb9] bg-white px-1 leading-none rounded-sm mt-3.5 sm:mt-4">MP3</span>
                 </div>
                 <div>
                   <h3 className="text-[16px] sm:text-[18px] font-bold text-slate-800 mb-1 sm:mb-2">Gunakan Audio</h3>
                   <p className="text-[13px] sm:text-[14px] text-slate-600 leading-relaxed hidden sm:block">Unggah rekaman suara mp3/wav (Max 10/25MB).</p>
                   <p className="text-[13px] text-slate-500 leading-relaxed sm:hidden">MP3/WAV (Maks 10/25MB)</p>
                 </div>
                 <input 
                   type="file" 
                   accept="audio/*, .mp3, .wav, .m4a, .mp4, .mpeg, .mpga, .webm"
                   onChange={handleFileUpload}
                   disabled={isUploading}
                   className="absolute inset-0 w-full h-full opacity-0 outline-none cursor-pointer z-10"
                   title="Pilih File Audio"
                 />
               </div>

               {/* Link YouTube */}
               {!showLinkInput ? (
                 <button onClick={() => setShowLinkInput(true)} disabled={isUploading} className={`flex sm:flex-col items-center sm:items-start flex-row bg-slate-50 hover:bg-white hover:shadow-md p-4 sm:p-5 lg:p-6 rounded-[20px] border border-slate-200 transition-all text-left outline-none group h-full ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}>
                   <div className="w-[42px] h-[42px] sm:w-[48px] sm:h-[48px] shrink-0 rounded-2xl bg-gradient-to-br from-[#ef4444] to-[#991b1b] flex items-center justify-center sm:mb-4 mr-4 sm:mr-0 shadow-sm group-hover:scale-105 transition-transform relative">
                     <MonitorPlay className="text-white w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                   </div>
                   <div>
                     <h3 className="text-[16px] sm:text-[18px] font-bold text-slate-800 mb-1 sm:mb-2">Link YouTube</h3>
                     <p className="text-[13px] sm:text-[14px] text-slate-600 leading-relaxed hidden sm:block">Ambil materi dari video publik YouTube lewat URL.</p>
                     <p className="text-[13px] text-slate-500 leading-relaxed sm:hidden">Konversi URL Video YouTube</p>
                   </div>
                 </button>
               ) : (
                 <div className="flex flex-col items-start bg-white p-4 sm:p-5 lg:p-6 rounded-[20px] border border-slate-200 shadow-md transition-all text-left w-full relative sm:h-full justify-between h-full">
                   <div className="w-full">
                     <div className="flex justify-between items-center mb-3">
                       <h3 className="text-[15px] sm:text-[16px] font-bold text-slate-800">Paste Link Youtube</h3>
                       <button onClick={() => setShowLinkInput(false)} className="text-slate-400 hover:text-rose-500 transition-colors p-1">
                          <X size={18} />
                       </button>
                     </div>
                     <div className="relative w-full mb-3">
                       <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                       <input 
                         disabled={isUploading}
                         type="url" 
                         placeholder="https://youtu.be/..." 
                         value={linkUrl}
                         onChange={(e) => setLinkUrl(e.target.value)}
                         onKeyDown={(e) => { if(e.key==='Enter') handleLinkSubmit(); }}
                         className="w-full bg-slate-50 border border-slate-200 text-[13px] rounded-xl py-2 pl-9 pr-3 outline-none focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444]/30 transition-all font-medium text-slate-700"
                       />
                     </div>
                   </div>
                   <button 
                     onClick={handleLinkSubmit}
                     disabled={isUploading || linkUrl.trim().length < 10}
                     className="w-full py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-xl font-bold text-[14px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-transparent shadow-[#ef4444]/20"
                   >
                     {isUploading ? 'Memproses...' : 'Proses'}
                   </button>
                 </div>
               )}
            </div>

            {/* Tambahan / Footer Card biar terkesan padat */}
            <div className="mt-auto relative z-10 bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                 <Flame className="text-[#672cb9] w-5 h-5" />
              </div>
              <div className="flex-1">
                 <h4 className="text-[14px] font-bold text-slate-800">Tips OtakEncer</h4>
                 <p className="text-[13px] text-slate-600 mt-1 leading-relaxed">
                   Unggah materi kuliah atau video referensi kamu. AI kami akan otomatis menyusun Ringkasan, Kuis, & Flashcard interaktif hanya dalam hitungan detik!
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key Metrics (col-span-4) */}
        <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col gap-4 md:gap-5 w-full h-full lg:overflow-hidden">
           <div className="flex-[1.5] lg:flex-[1.3] w-full min-h-0">
             <DailyStreakCard userId={user.id} />
           </div>
           
           {/* Insight / Daily Motivation Card */}
           <div className="flex-1 w-full min-h-0 bg-gradient-to-br from-[#672cb9] to-[#8c4ae1] rounded-[24px] md:rounded-3xl p-5 md:p-6 shadow-md shadow-[#672cb9]/20 relative overflow-hidden group flex flex-col justify-center">
              <div className="absolute -right-4 -bottom-6 opacity-[0.07] rotate-12 group-hover:rotate-0 transition-transform duration-500 pointer-events-none">
                <Lightbulb size={120} />
              </div>
              <div className="relative z-10">
                <h3 className="text-white/80 font-bold text-[12px] md:text-[13px] uppercase tracking-wider mb-2 md:mb-3 flex items-center gap-1.5">
                  <Lightbulb size={16} className="text-yellow-300" /> Insight Hari Ini
                </h3>
                <p className="text-white font-medium text-[13px] md:text-[15px] leading-relaxed italic line-clamp-4">
                  &quot;Pendidikan adalah senjata paling mematikan di dunia, karena dengan pendidikan, Anda dapat mengubah dunia.&quot;
                </p>
                <div className="mt-3 md:mt-4 text-white/70 text-[12px] md:text-[13px] font-bold">
                  — Nelson Mandela
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[150] md:hidden flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-64 max-w-[80vw] h-full bg-[#672cb9] flex flex-col pt-6 shadow-2xl animate-in slide-in-from-left duration-200">
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 text-white/70 hover:text-white p-2">
              <X size={24} />
            </button>
            <div className="px-6 mb-8 pt-2">
              <Link href="/?view=landing" className="flex items-center gap-3">
                <div className="w-8 h-8 relative flex items-center justify-center p-0.5">
                  <Image src="/assets/logo.svg" alt="Logo" fill className="object-contain brightness-0 invert" />
                </div>
                <div className="text-[20px] font-bold text-white tracking-tight">OtakEncer</div>
              </Link>
            </div>
            <nav className="flex flex-col space-y-2 px-3">
              <Link href="/dashboard" className="relative flex items-center gap-4 px-4 py-3 cursor-pointer text-[#672cb9]">
                <div className="absolute left-0 right-0 top-0 bottom-0 bg-[#f8fafc] rounded-xl shadow-sm"></div>
                <div className="relative z-10 flex items-center gap-4 text-[#672cb9] font-bold w-full">
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </div>
              </Link>
              <Link href="/dashboard/library" className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-colors font-medium">
                <Library size={20} />
                <span>Library</span>
              </Link>
              <Link href="/dashboard/leaderboard" className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-colors font-medium">
                <Trophy size={20} />
                <span>Leaderboard</span>
              </Link>
              <Link href="/dashboard/kolaborasi" className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white transition-colors font-medium">
                <Users size={20} />
                <span>Ruang Kolaborasi</span>
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Modal Upload Popup */}
      {isUploadPopupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => { if(!isUploading) setIsUploadPopupOpen(false); }}
          />
          <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#f3f4f6] to-[#e5e7eb] rounded-[24px] md:rounded-[32px] shadow-2xl p-6 md:p-10 max-h-[95vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start md:items-center justify-between mb-6 md:mb-8">
              <h2 className="text-[22px] md:text-[26px] font-bold text-slate-800 flex-1 text-center pl-8 md:pl-10">Pilih Tipe Upload</h2>
              <button 
                onClick={() => setIsUploadPopupOpen(false)}
                disabled={isUploading}
                className="text-slate-500 hover:text-slate-800 bg-white/50 hover:bg-white rounded-full p-2 transition-colors ml-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <X size={24} className="md:w-7 md:h-7" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {isUploading ? (
                <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center p-12 bg-white/70 backdrop-blur rounded-[24px] border border-white">
                   <div className="relative flex items-center justify-center mb-8 w-24 h-24">
                     {/* Lingkaran Loading Ungu */}
                     <div className="absolute inset-0 rounded-full border-4 border-[#672cb9]/20 border-t-[#672cb9] animate-spin"></div>
                     <div className="absolute inset-[6px] rounded-full border-4 border-[#672cb9]/20 border-b-[#672cb9] animate-[spin_2s_linear_infinite_reverse]"></div>
                     
                     {/* Logo Otak Encer */}
                     <div className="relative w-10 h-10 flex items-center justify-center animate-pulse">
                       <Image src="/assets/logo.svg" alt="OtakEncer Loading" fill className="object-contain" />
                     </div>
                   </div>
                   <h3 className="text-xl font-bold text-[#672cb9] mb-2 animate-pulse">AI Sedang Membaca & Merangkum Materi...</h3>
                   <p className="text-slate-500 font-medium text-center">Proses ini mungkin memakan waktu hingga satu menit. Harap jangan tutup jendela ini.</p>
                </div>
              ) : (
                <>
                  {/* File PDF / DOCX */}
                  <div className="relative flex flex-col items-start bg-white/70 backdrop-blur hover:bg-white hover:shadow-lg p-7 rounded-[24px] border border-white transition-all text-left group overflow-hidden cursor-pointer">
                    <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-[#ed2d07] to-[#871c07] flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-transform relative">
                      <FileText className="text-white" size={26} />
                      <span className="absolute text-[8px] font-bold text-[#672cb9] bg-white px-1 leading-none rounded-sm mt-3.5">DOC</span>
                    </div>
                    <h3 className="text-[20px] font-bold text-slate-800 mb-2.5">Upload Dokumen</h3>
                    <p className="text-[15px] text-slate-600 leading-relaxed pr-2 mb-2">Unggah PDF, DOCX, atau PPT (Max 10MB).</p>
                    <input 
                      type="file" 
                      accept=".pdf, .docx, .pptx"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 outline-none cursor-pointer z-10"
                      title="Pilih File"
                    />
                  </div>

                  {/* Audio File */}
                  <div className="relative flex flex-col items-start bg-white/70 backdrop-blur hover:bg-white hover:shadow-lg p-7 rounded-[24px] border border-white transition-all text-left group overflow-hidden cursor-pointer">
                    <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-[#10b981] to-[#047857] flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-transform relative">
                      <Volume2 className="text-white" size={26} />
                      <span className="absolute text-[8px] font-bold text-[#672cb9] bg-white px-1 leading-none rounded-sm mt-3.5">MP3</span>
                    </div>
                    <h3 className="text-[20px] font-bold text-slate-800 mb-2.5">Upload Audio</h3>
                    <p className="text-[15px] text-slate-600 leading-relaxed pr-2 mb-2">Unggah rekaman suara MP3, WAV (Max 10MB/25MB).</p>
                    <input 
                      type="file" 
                      accept="audio/*, .mp3, .wav, .m4a, .mp4, .mpeg, .mpga, .webm"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="absolute inset-0 w-full h-full opacity-0 outline-none cursor-pointer z-10"
                      title="Pilih File Audio"
                    />
                  </div>

                  {/* Link YouTube */}
                  {!showLinkInput ? (
                    <button onClick={() => setShowLinkInput(true)} className="flex flex-col items-start bg-white/70 backdrop-blur hover:bg-white hover:shadow-lg p-7 rounded-[24px] border border-white transition-all text-left outline-none">
                      <div className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-[#ef4444] to-[#991b1b] flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-transform relative">
                        <MonitorPlay className="text-white" size={26} strokeWidth={2} />
                      </div>
                      <h3 className="text-[20px] font-bold text-slate-800 mb-2.5">Link YouTube</h3>
                      <p className="text-[15px] text-slate-600 leading-relaxed pr-2">Ambil materi dan poin penting dari video YouTube lewat URL.</p>
                    </button>
                  ) : (
                    <div className="flex flex-col items-start bg-white p-7 rounded-[24px] border border-slate-200 shadow-md transition-all text-left w-full h-full relative">
                      <button 
                         onClick={() => setShowLinkInput(false)} 
                         className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                         <X size={20} />
                      </button>
                      <div className="w-[42px] h-[42px] rounded-xl bg-gradient-to-br from-[#ef4444] to-[#991b1b] flex items-center justify-center mb-5 shadow-sm">
                        <MonitorPlay className="text-white" size={22} />
                      </div>
                      <h3 className="text-[20px] font-bold text-slate-800 mb-2">Paste Link Youtube</h3>
                      <p className="text-[13px] text-slate-500 mb-4">Pastikan video YouTube publik & punya teks subtitle (CC).</p>
                      
                      <div className="relative w-full mb-3 flex gap-2">
                        <div className="relative flex-1">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            disabled={isUploading}
                            type="url" 
                            placeholder="https://youtu.be/..." 
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            onKeyDown={(e) => { if(e.key==='Enter') handleLinkSubmit(); }}
                            className="w-full bg-slate-50 border border-slate-200 text-[14px] rounded-xl py-2.5 pl-9 pr-3 outline-none focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444]/30 transition-all font-medium text-slate-700"
                          />
                        </div>
                      </div>
                      
                      <button 
                        onClick={handleLinkSubmit}
                        disabled={isUploading || linkUrl.trim().length < 10}
                        className="w-full py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-xl font-bold text-[14px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-transparent shadow-[#ef4444]/20"
                      >
                        {isUploading ? 'Memproses...' : 'Proses Materi Video'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM ALERT POPUP REMOVED IN FAVOR OF SWEETALERT2 */}
    </div>
  );
}

function DailyStreakCard({ userId }: { userId: string }) {
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const { data, error } = await supabase
          .from('user_streaks')
          .select('current_streak')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching streak:', error);
        }

        if (data) {
          setStreak(data.current_streak);
        } else {
          setStreak(0);
        }
      } catch (err) {
        console.error('Failed to fetch streak', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStreak();
  }, [userId]);

  return (
    <div className="bg-white md:bg-gradient-to-br md:from-white md:to-orange-50/40 rounded-[24px] md:rounded-3xl p-5 md:p-6 lg:p-6 shadow-sm md:shadow-sm shadow-slate-200/50 border-[2px] border-[#FFA515] md:border md:border-orange-100 flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Background Decor (Desktop Only) */}
      <div className="hidden md:block absolute -top-12 -right-12 w-40 h-40 bg-orange-200/50 rounded-full blur-3xl opacity-60 pointer-events-none group-hover:bg-orange-300/50 transition-colors duration-500"></div>
      
      {/* MOBILE DESAIN */}
      <div className="flex sm:hidden flex-col h-full justify-between relative z-10">
        <div className="flex gap-2.5 mb-5 items-center">
          <div className="bg-[#feebd6] w-[48px] h-[48px] rounded-[14px] flex items-center justify-center shrink-0">
            <Flame size={26} className="text-[#fb6f08]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[17px] font-semibold text-black leading-[1.1] tracking-tight">Streak</h3>
            <h3 className="text-[17px] font-semibold text-black leading-[1.1] tracking-tight">Harian</h3>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-[64px] font-extrabold text-black leading-none tracking-tighter">
            {loading ? '-' : streak}
          </h2>
        </div>

        <div className="mt-auto pt-2">
          <Link href="/dashboard" className="text-[#8a8a8e] text-[13px] font-medium leading-[1.4] block decoration-[1.5px]">
            {loading ? 'Memuat...' : streak === 0 ? 'Ayo mulai kerjakan quiz hari ini untuk streak pertamamu' : 'Luar biasa! Pertahankan streak belajarmu hari ini'}
          </Link>
        </div>
      </div>

      {/* DESKTOP DESAIN */}
      <div className="hidden sm:flex relative z-10 flex-col sm:items-start justify-between gap-4 h-full">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-orange-50">
            <Flame size={28} className="text-orange-500 md:w-8 md:h-8" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <p className="text-slate-500 font-medium text-[14px] md:text-[15px]">Streak Harian</p>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-none">
                {loading ? '...' : streak}
              </h2>
            </div>
          </div>
        </div>
      
        <div className="mt-6 md:mt-8 w-full">
          <p className="text-[13px] md:text-[14px] text-slate-500 font-medium mb-4">
            {loading ? 'Memuat...' : streak === 0 ? 'Ayo mulai kerjakan quiz hari ini untuk streak pertamamu!' : `Luar biasa! Pertahankan streak belajarmu.`}
          </p>
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, idx) => {
               const currentDayOfWeek = new Date().getDay(); 
               const targetIndex = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; 
               const isChecked = streak > 0 && targetIndex >= idx && (targetIndex - idx) < streak;
               const isToday = targetIndex === idx;

               return (
                 <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                   <div className={`w-full max-w-[44px] aspect-square rounded-[14px] flex items-center justify-center text-[13px] font-bold transition-all duration-300
                     ${isChecked
                       ? 'bg-gradient-to-b from-orange-400 to-orange-500 text-white shadow-md shadow-orange-200 ring-2 ring-orange-100 ring-offset-2' 
                       : isToday
                         ? 'bg-white border-2 border-[#FFA515] text-black shadow-sm'
                         : 'bg-slate-50 border border-slate-100 text-slate-400'}`}>
                     {isChecked ? <Check size={20} strokeWidth={3} className="text-white" /> : day[0]}
                   </div>
                   <span className={`text-[11px] font-semibold ${isToday ? 'text-black' : 'text-slate-400'}`}>
                     {day}
                   </span>
                 </div>
               );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

