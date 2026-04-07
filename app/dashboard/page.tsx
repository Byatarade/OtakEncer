"use client";
import { supabase } from '@/lib/supabase';

import { Search, Bell, Plus, Filter, LogOut, Settings, HelpCircle, ChevronDown, Calendar, Eye, FileText, CheckCircle2, CheckCircle2Icon, LucideCheckCircle, LucideCheckCircle2, CheckCircle, X, Link as LinkIcon, MonitorPlay, Volume2, Sparkles } from 'lucide-react';
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
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    } catch (err: any) {
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
    } catch (err: any) {
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    <div className="flex flex-col min-h-full w-full p-4 lg:p-8 xl:p-10 max-w-[1600px] mx-auto gap-6 sm:gap-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <h1 className="text-[28px] font-bold text-[#0f172a] tracking-tight whitespace-nowrap">Halo, {user.name.split(' ')[0]}!</h1>
        
        <div className="flex flex-wrap items-center gap-3 md:gap-4 justify-end">
          
          {/* Search Box */}
          <div className="relative group hidden sm:flex">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#672cb9] transition-colors" size={18} />
             <input 
               type="text" 
               placeholder="Cari..." 
               className="text-black w-full sm:w-[240px] bg-white border border-slate-200 text-[14px] font-medium rounded-full py-2.5 pl-11 pr-4 outline-none focus:border-[#672cb9] focus:ring-1 focus:ring-[#672cb9]/30 transition-all shadow-sm"
             />
          </div>

          <button className="sm:hidden p-2.5 text-slate-500 hover:text-[#672cb9] bg-white rounded-full border border-slate-200 shadow-sm transition-colors">
            <Search size={18} />
          </button>
          
          <button className="p-2.5 text-slate-500 hover:text-[#672cb9] bg-white rounded-full border border-slate-200 shadow-sm transition-colors relative">
            <Filter size={18} />
          </button>
          
          <button className="p-2.5 text-slate-500 hover:text-[#672cb9] bg-white rounded-full border border-slate-200 shadow-sm transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-rose-500 rounded-full outline outline-2 outline-white"></span>
          </button>

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

      {/* Konten Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        
        {/* Total Visits Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-[#f8f5fd] p-3 rounded-2xl">
              <Calendar size={40} className="text-[#672cb9]" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-slate-500 font-medium text-[15px]">Total Visits</p>
              <h2 className="text-4xl font-bold text-slate-800 mt-1">145 Visits</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-3 mt-8">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[14px] transition-colors
                  ${['M', 'T', 'W', 'F', 'S'].includes(day) && (idx !== 3 && idx !== 6) 
                    ? 'bg-[#672cb9] text-white' 
                    : 'border border-slate-200 text-slate-400'}`}>
                  {day}
                </div>
                {['M', 'T', 'W', 'F', 'S'].includes(day) && (idx !== 3 && idx !== 6) && (
                  <CheckCircle size={20} className="text-[#FFA515]" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Daily Tokens Card */}
        <DailyTokensCard userId={user.id} />

        {/* Recent Activity Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 relative">
          <h3 className="text-[20px] font-bold text-[#672cb9] mb-6">Recent Activity</h3>
          
          <div className="space-y-6 relative z-10">
            <div className="flex gap-4 items-start">
              <div className="bg-[#f4effa] p-2.5 rounded-full shrink-0">
                <Eye size={20} className="text-[#672cb9]" />
              </div>
              <div className="flex-1">
                <p className="text-slate-800 font-medium">Viewed "Introduction to Python"</p>
                <p className="text-slate-400 text-[13px] mt-0.5">2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-[#f4effa] p-2.5 rounded-full shrink-0">
                <FileText size={20} className="text-[#672cb9]" />
              </div>
              <div className="flex-1">
                <p className="text-slate-800 font-medium">Uploaded "Project Proposal.pdf"</p>
                <p className="text-slate-400 text-[13px] mt-0.5">3 minutes ago</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-[#672cb9] p-2.5 rounded-full shrink-0">
                <CheckCircle2 size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-slate-800 font-medium">Completed quiz "Math 101"</p>
                <p className="text-slate-400 text-[13px] mt-0.5">3 minutes ago</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="bg-[#672cb9] p-2.5 rounded-full shrink-0">
                <CheckCircle2 size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-slate-800 font-medium">Completed quiz "Project Proposal.pdf"</p>
                <p className="text-slate-400 text-[13px] mt-0.5">3 minutes ago</p>
              </div>
            </div>
          </div>
          
          {/* Vertical line indicator */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 w-1 h-32 bg-slate-200 rounded-full"></div>
        </div>

        {/* Leaderboard Rank Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
          <h3 className="text-[20px] font-bold text-[#672cb9] mb-4">Leaderboard Rank</h3>
          
          <div className="mb-6 space-y-1">
            <p className="text-slate-800 font-medium">Current Rank: <span className="font-bold">#12</span></p>
            <p className="text-slate-800 font-medium">Points: <span className="font-bold">4500</span></p>
          </div>
          
          <div className="space-y-1">
            {[
              { rank: 1, name: 'User A', points: 5200, isCurrentUser: false, initial: 'A', bg: 'bg-yellow-400' },
              { rank: 2, name: 'User B', points: 4900, isCurrentUser: false, initial: 'B', bg: 'bg-slate-300' },
              { rank: 3, name: 'User C', points: 4700, isCurrentUser: false, initial: 'C', bg: 'bg-orange-600' },
              { rank: 4, name: 'Hilmi', points: 4500, isCurrentUser: true, initial: 'H', bg: 'bg-[#1e1e1e]' },
            ].map((item) => (
              <div key={item.rank} className={`flex items-center justify-between p-3 rounded-xl ${item.isCurrentUser ? 'bg-[#f4effa]' : 'hover:bg-slate-50 transition-colors'}`}>
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 font-medium w-4">{item.rank}.</span>
                  <div className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center text-white text-[13px] font-bold`}>
                    {item.initial}
                  </div>
                  <span className={`font-medium ${item.isCurrentUser ? 'text-[#0f172a]' : 'text-slate-700'}`}>{item.name}</span>
                </div>
                <span className={`font-bold ${item.isCurrentUser ? 'text-[#0f172a]' : 'text-slate-800'}`}>{item.points}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

            {/* Modal Upload Popup */}
      {isUploadPopupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => { if(!isUploading) setIsUploadPopupOpen(false); }}
          />
          <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#f3f4f6] to-[#e5e7eb] rounded-[32px] shadow-2xl p-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[26px] font-bold text-slate-800 flex-1 text-center pl-10">Pilih Tipe Upload</h2>
              <button 
                onClick={() => setIsUploadPopupOpen(false)}
                disabled={isUploading}
                className="text-slate-500 hover:text-slate-800 bg-transparent rounded-full p-2 transition-colors ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={28} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {isUploading ? (
                <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center p-12 bg-white/70 backdrop-blur rounded-[24px] border border-white">
                   <div className="flex gap-3 mb-6">
                     <Sparkles className="text-[#672cb9] animate-bounce" size={32} />
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

function DailyTokensCard({ userId }: { userId: string }) {
  const [usageCount, setUsageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const MAX_LIMIT = 3;

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const { count, error } = await supabase
          .from('materials')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('created_at', startOfDay.toISOString());

        if (error) throw error;
        setUsageCount(count || 0);
      } catch (err) {
        console.error('Error fetching usage:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, [userId]);

  const remaining = Math.max(MAX_LIMIT - usageCount, 0);
  const percentage = Math.min((usageCount / MAX_LIMIT) * 100, 100);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
      <h3 className="text-[20px] font-bold text-[#672cb9] mb-6">Daily Tokens</h3>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-[#672cb9] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-slate-800 font-medium">Token Tersisa: <span className="font-bold">{remaining}/{MAX_LIMIT}</span></p>
            </div>
            <p className="text-slate-800 font-bold text-[15px]">{usageCount} token <span className="font-normal">digunakan</span></p>
          </div>
          
          <div className="w-full h-3.5 bg-indigo-50 rounded-full overflow-hidden mb-6">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                remaining === 0 ? 'bg-red-500' : remaining === 1 ? 'bg-orange-400' : 'bg-[#FFA515]'
              }`} 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          
          <div className={`inline-flex py-2 px-4 rounded-xl text-[14px] font-medium ${
            remaining === 0 
              ? 'bg-red-50 text-red-700' 
              : 'bg-orange-50 text-[#000000]'
          }`}>
            {remaining === 0 
              ? 'Kuota harian habis, reset tengah malam' 
              : `${remaining} token tersisa untuk hari ini`}
          </div>
        </>
      )}
    </div>
  );
}
