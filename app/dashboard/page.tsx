"use client";
import { supabase } from '@/lib/supabase';

import {Plus, LogOut, Settings, HelpCircle, ChevronDown, FileText, CheckCircle2, Check, X, MonitorPlay, Volume2, Link as LinkIcon, Flame, Volume, Speaker, Mic, Mic2, Voicemail, Monitor, PlaySquareIcon, PlaySquare } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { formatDistanceToNow, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { Play } from 'next/font/google';

function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

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
         text: 'Harap upload file audio (MP3, WAV, M4A, dll) pada menu Upload Audio.',
         icon: 'error',
         confirmButtonColor: '#672cb9'
       });
       return;
    }
    if (isDocInput && !isDocFile) {
       Swal.fire({
         title: 'Format Tidak Valid',
         text: 'Harap upload file dokumen (PDF, DOCX, PPTX) pada menu Upload Dokumen.',
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
         text: 'Gagal mengupload file. Periksa koneksi internet Anda dan coba lagi.',
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen for mobile navbar upload button event
  useEffect(() => {
    const handleMobileUpload = () => setIsUploadPopupOpen(true);
    window.addEventListener('mobile-open-upload', handleMobileUpload);
    return () => window.removeEventListener('mobile-open-upload', handleMobileUpload);
  }, []);

  // Open upload modal if navigated with ?upload=true
  useEffect(() => {
    if (searchParams.get('upload') === 'true') {
      setIsUploadPopupOpen(true);
    }
  }, [searchParams]);

  if (!user) return null; // Handled by AuthGuard

  return (
    <div className="flex flex-col min-h-full w-full p-4 lg:p-8 xl:p-10 max-w-[1600px] mx-auto gap-4 sm:gap-8">

      {/* Mobile Greeting (small screens only) */}
      <h1 className="md:hidden text-[28px] font-bold text-[#0f172a] tracking-tight pt-1">Halo, {user.name.split(' ')[0]}!</h1>


      {/* Desktop Header Wrapper */}
      <div className="hidden md:flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <h1 className="text-[28px] font-bold text-[#0f172a] tracking-tight whitespace-nowrap">Halo, {user.name.split(' ')[0]}!</h1>
        
        <div className="flex flex-wrap items-center gap-3 md:gap-4 justify-end">
          
          <button 
            onClick={() => setIsUploadPopupOpen(true)}
            className="flex items-center gap-2 bg-[#672cb9] text-white px-5 py-2.5 rounded-full text-[14px] font-bold shadow-md hover:bg-[#58249c] hover:shadow-lg transition-all transform hover:-translate-y-0.5 ml-2"
          >
            <Plus size={18} strokeWidth={2.5}/>
            <span className="hidden md:inline">Upload</span>
          </button>
          
          <div className="w-px h-8 bg-slate-200 mx-2 hidden md:block"></div>

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
               <ChevronDown size={16} className={`text-slate-400 transition-transform hidden md:block ${isDropdownOpen ? 'rotate-180' : ''}`} />
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
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 mt-4">
        
        {/* Daily Streak Card */}
        <DailyStreakCard userId={user.id} />

        {/* Daily Tokens Card */}
        <DailyTokensCard userId={user.id} />

        {/* Recent Activity Card */}
        <RecentActivityWidget userId={user.id} />

        {/* Leaderboard Rank Card */}
        <LeaderboardRankWidget userId={user.id} userName={user.name} />

      </div>



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
                       <Image priority src="/assets/logo.svg" alt="OtakEncer Loading" fill className="object-contain" />
                     </div>
                   </div>
                   <h3 className="text-xl font-bold text-[#672cb9] mb-2 animate-pulse">AI Sedang Membaca & Merangkum Materi...</h3>
                   <p className="text-slate-500 font-medium text-center">Proses ini mungkin memakan waktu hingga satu menit. Harap jangan tutup jendela ini.</p>
                </div>
              ) : (
                <>
                  {/* File PDF / DOCX */}
                  <div className="relative flex flex-col items-start bg-white/70 backdrop-blur hover:bg-white hover:shadow-lg p-7 rounded-[24px] border border-white transition-all text-left group overflow-hidden cursor-pointer">
                    <FileText className="text-blue-500 mb-8 mt-3" size={35} />
                    <h3 className="text-[20px] font-bold text-slate-800 mb-2.5">Upload Dokumen</h3>
                    <p className="text-[15px] text-slate-600 leading-relaxed pr-2 mb-2">Upload PDF, DOCX, atau PPT (Max 10MB).</p>
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
                    <Mic className="text-orange-500 mb-8 mt-3" size={35} />
                    <h3 className="text-[20px] font-bold text-slate-800 mb-2.5">Upload Audio</h3>
                    <p className="text-[15px] text-slate-600 leading-relaxed pr-2 mb-2">Upload rekaman suara MP3, WAV (Max 25MB).</p>
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
                      <PlaySquare className="text-red-500 mb-8 mt-3" size={35} />
                      <h3 className="text-[20px] font-bold text-slate-800 mb-2.5">Link YouTube</h3>
                      <p className="text-[15px] text-slate-600 leading-relaxed pr-2">Ambil materi dan poin penting dari URL YouTube.</p>
                    </button>
                  ) : (
                    <div className="flex flex-col items-start bg-white p-7 rounded-[24px] border border-slate-200 shadow-md transition-all text-left w-full h-full relative">
                      <button 
                         onClick={() => setShowLinkInput(false)} 
                         className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                         <X size={20} />
                      </button>
                      <PlaySquare className="text-red-500 mb-8 mt-3" size={35} />
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
  const percentage = Math.min((remaining / MAX_LIMIT) * 100, 100);

  return (
    <div className="bg-white rounded-[24px] md:rounded-3xl p-6 md:p-8 shadow-sm md:shadow-sm border border-slate-100 flex flex-col h-full col-span-1">
      <h3 className="text-[18px] md:text-[22px] font-bold text-[#672cb9] mb-6 md:mb-8">Daily Token</h3>
      
      {loading ? (
        <div className="flex items-center justify-center py-8 flex-1">
          <div className="w-6 h-6 border-2 border-[#672cb9] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          {/* Mobile Text */}
          <div className="flex md:hidden justify-between items-center mb-3">
            <p className="text-[#0f172a] text-[15px] font-medium">Token</p>
            <p className="text-[#0f172a] text-[15px] font-medium">{remaining}/{MAX_LIMIT}</p>
          </div>
          
          {/* Desktop Text */}
          <div className="hidden md:flex justify-between items-end mb-3">
            <div>
              <p className="text-[#0f172a] font-medium text-[15px]">Token Tersisa: <span className="font-bold">{remaining}/{MAX_LIMIT}</span></p>
            </div>
          </div>
          
          <div className="w-full h-3 sm:h-3.5 bg-slate-100 shadow-inner ring-1 ring-inset ring-slate-200 rounded-full overflow-hidden mb-4 md:mb-5">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                percentage > 60 ? 'bg-emerald-500' : percentage > 25 ? 'bg-amber-400' : 'bg-red-500'
              }`} 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          
          <p className={`text-[13px] font-medium leading-[1.4] block decoration-[1.5px] mb-5 ${remaining === 0 ? 'text-red-500' : 'text-[#8a8a8e]'}`}>
            {remaining === 0 
              ? 'Yahh, token harian kamu sudah habis! 😢 Tunggu direset besok ya buat pakai AI lagi.' 
              : 'Periksa Pengaturan Akun untuk selengkapnya'}
          </p>
          
          <div className="mt-auto">
            {/* Mobile Pill */}
            <div className={`md:hidden flex w-full justify-center items-center py-2.5 px-4 rounded-xl text-[11px] text-center font-semibold ${
              remaining === 0 
                ? 'bg-red-50 text-red-700' 
                : 'bg-[#fff4e6] text-[#0f172a]'
            }`}>
              {remaining === 0 
                ? 'Kuota harian habis' 
                : `${remaining} Token Tersisa`}
            </div>
            
            {/* Desktop Pill */}
            <div className={`hidden md:inline-flex py-2.5 px-5 rounded-[14px] text-[14px] font-semibold ${
              remaining === 0 
                ? 'bg-red-50 text-red-700' 
                : 'bg-[#fff4e6] text-[#0f172a]'
            }`}>
              {remaining === 0 
                ? 'Kuota harian habis, reset tengah malam' 
                : `${remaining} token tersisa untuk hari ini`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DailyStreakCard({ userId }: { userId: string }) {
  const [streak, setStreak] = useState<number>(0);
  const [lastQuizDate, setLastQuizDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // States for quiz modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [materials, setMaterials] = useState<{ id: string, title: string }[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const { data, error } = await supabase
          .from('user_streaks')
          .select('current_streak, last_quiz_date')
          .eq('user_id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching streak:', error);
        }

        if (data) {
          setStreak(data.current_streak);
          setLastQuizDate(data.last_quiz_date);
        } else {
          setStreak(0);
          setLastQuizDate(null);
        }
      } catch (err) {
        console.error('Failed to fetch streak', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStreak();
  }, [userId]);

  const handleOpenModal = async () => {
    setIsModalOpen(true);
    // Selalu fetch ulang data terbaru saat modal dibuka untuk mencegah data basi (materi yang sudah dihapus)
    setLoadingMaterials(true);
    const { data, error } = await supabase
      .from('materials')
      .select('id, title')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10); // Ambil 10 materi terbaru
      
    if (data) setMaterials(data);
    setLoadingMaterials(false);
  };

  // Tentukan apakah user sudah menyelesaikan quiz hari ini
  const todayStr = format(toZonedTime(new Date(), 'Asia/Jakarta'), 'yyyy-MM-dd');
  const hasCompletedToday = lastQuizDate === todayStr;
  
  // Deteksi apakah user sama sekali belum pernah mengerjakan quiz (user baru)
  const isNewUser = lastQuizDate === null && streak === 0;

  return (
    <>
    <div className={`rounded-[24px] md:rounded-3xl p-5 md:p-8 shadow-sm md:shadow-sm shadow-slate-200/50 border-[3px] md:border flex flex-col justify-between col-span-1 relative overflow-hidden group transition-all duration-300 ${hasCompletedToday ? 'bg-white md:bg-gradient-to-br md:from-white md:to-orange-50/40 border-[#FFA515] md:border-orange-100' : 'bg-slate-50 md:bg-slate-50 border-slate-200 grayscale-[0.2] opacity-90'}`}>
      {/* Background Decor (Desktop Only) */}
      <div className="hidden md:block absolute -top-12 -right-12 w-40 h-40 bg-orange-200/50 rounded-full blur-3xl opacity-60 pointer-events-none group-hover:bg-orange-300/50 transition-colors duration-500"></div>
      
      {/* MOBILE DESAIN */}
      <div className="flex md:hidden flex-col h-full justify-between relative z-10">
        <div className="flex gap-2.5 mb-5 items-center">
          <div className={`${hasCompletedToday ? 'bg-[#feebd6]' : 'bg-slate-200'} w-[48px] h-[48px] rounded-[14px] flex items-center justify-center shrink-0`}>
            <Flame size={26} className={`${hasCompletedToday ? 'text-[#fb6f08]' : 'text-slate-400'}`} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h3 className={`text-[17px] font-semibold leading-[1.1] tracking-tight ${hasCompletedToday ? 'text-black' : 'text-slate-600'}`}>Streak</h3>
            <h3 className={`text-[17px] font-semibold leading-[1.1] tracking-tight ${hasCompletedToday ? 'text-black' : 'text-slate-600'}`}>Harian</h3>
          </div>
        </div>

        <div className="mb-4">
          <h2 className={`text-[64px] font-extrabold leading-none tracking-tighter ${hasCompletedToday ? 'text-black' : 'text-slate-400'}`}>
            {loading || streak === 0 ? '-' : streak}
          </h2>
        </div>

        <div className="mt-auto pt-2">
          {(!hasCompletedToday && !isNewUser) ? (
             <button onClick={handleOpenModal} className="w-full bg-orange-100 hover:bg-orange-200 text-orange-600 px-4 py-2 rounded-xl text-[13px] font-bold flex items-center justify-center transition-colors text-center leading-snug">
               Ayo Selesaikan Quiz! 🔥
             </button>
          ) : (
            <Link href="/dashboard" className="text-[#8a8a8e] text-[13px] font-medium leading-[1.4] block decoration-[1.5px]">
              {loading ? 'Memuat...' : isNewUser ? 'Ayo mulai kerjakan quiz hari ini untuk streak pertamamu' : 'Luar biasa! Pertahankan streak belajarmu hari ini'}
            </Link>
          )}
        </div>
      </div>

      {/* DESKTOP DESAIN */}
      <div className="hidden md:flex relative z-10 flex-col sm:items-start justify-between gap-4 h-full">
        <div className="flex items-center gap-3 md:gap-4">
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${hasCompletedToday ? 'bg-gradient-to-br from-orange-100 to-orange-200 border-orange-50' : 'bg-slate-200 border-slate-300'}`}>
            <Flame size={28} className={`${hasCompletedToday ? 'text-orange-500' : 'text-slate-400'} md:w-8 md:h-8`} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <p className={`${hasCompletedToday ? 'text-slate-500' : 'text-slate-400'} font-medium text-[14px] md:text-[15px]`}>Streak Harian</p>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className={`text-4xl md:text-5xl font-extrabold tracking-tight leading-none ${hasCompletedToday ? 'text-slate-800' : 'text-slate-600'}`}>
                {loading || streak === 0 ? '-' : streak}
              </h2>
            </div>
          </div>
        </div>
      
        <div className="mt-6 md:mt-8 w-full">
          {(!hasCompletedToday && !isNewUser) ? (
             <div className="mb-5">
               <p className="text-[13px] md:text-[14px] text-slate-500 font-medium mb-3">
                 Ayo mulai kerjakan quiz hari ini untuk mempertahankan streak-mu!
               </p>
               <button onClick={handleOpenModal} className="inline-flex max-w-fit items-center justify-center bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-200 ring-2 ring-orange-100 ring-offset-1 px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all">
                 Ayo Selesaikan Quiz! 🔥
               </button>
             </div>
          ) : (
            <p className="text-[13px] md:text-[14px] text-slate-500 font-medium mb-4">
              {loading ? 'Memuat...' : isNewUser ? 'Generate Materi Dan Selesaikan Quiznya!' : `Luar biasa! Pertahankan streak belajarmu.`}
            </p>
          )}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, idx) => {
               const currentDayOfWeek = new Date().getDay(); 
               const targetIndex = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; 
               const isToday = targetIndex === idx;
               const isChecked = streak > 0 && targetIndex >= idx && (targetIndex - idx) < streak && (!isToday || hasCompletedToday);

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

    {/* MODAL PILIH MATERI QUIZ */}
    {isModalOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl relative transform transition-all scale-100 opacity-100 border border-slate-100">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="mb-6 pr-8">
            <h3 className="text-xl font-bold text-slate-800">Selesaikan Quiz! 🎯</h3>
            <p className="text-slate-500 text-sm mt-1">Pilih materi yang ingin kamu kerjakan untuk mempertahankan streak belajarmu hari ini.</p>
          </div>

          {loadingMaterials ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 text-sm mt-3 font-medium">Memuat materi...</p>
            </div>
          ) : materials.length > 0 ? (
            <div className="flex flex-col gap-3 max-h-[55vh] md:max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {materials.map((m) => (
                <Link
                  key={m.id}
                  href={`/dashboard/library/${m.id}?tab=quiz`}
                  className="flex items-center justify-between p-4 border-2 border-slate-100 rounded-2xl hover:border-orange-400 hover:bg-orange-50/50 transition-all group"
                  onClick={() => setIsModalOpen(false)}
                >
                  <div className="flex items-start gap-4 overflow-hidden">
                    <div className="bg-orange-100 text-orange-600 p-2.5 rounded-xl shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <FileText size={20} />
                    </div>
                    <div className="flex flex-col items-start pt-0.5 overflow-hidden">
                      <span className="font-semibold text-slate-700 group-hover:text-slate-900 line-clamp-2 leading-tight text-left">
                        {m.title}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 ml-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <ChevronDown size={18} className="-rotate-90" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <FileText size={48} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium mb-4">Kamu belum memiliki materi apapun.</p>
              <Link 
                href="/dashboard"
                onClick={() => setIsModalOpen(false)}
                className="inline-flex items-center justify-center bg-black hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all w-fit"
              >
                <Plus size={16} className="mr-1.5" /> Buat Materi Baru
              </Link>
            </div>
          )}
        </div>
      </div>
    )}
    </>
  );
}

interface ActivityItem {
  id: string;
  type: 'viewed' | 'upload' | 'quiz';
  title: string;
  date: Date;
}

function RecentActivityWidget({ userId }: { userId: string }) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data: materialsData, error: errMat } = await supabase
          .from('materials')
          .select('id, title, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

        const { data: quizData, error: errQuiz } = await supabase
          .from('quiz_scores')
          .select('material_id, created_at, materials(title)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

        const formattedActivities: ActivityItem[] = [];

        if (materialsData && !errMat) {
          materialsData.forEach((m) => {
            formattedActivities.push({
              id: `mat-${m.id}`,
              type: 'upload',
              title: m.title || 'Unknown Material',
              date: new Date(m.created_at)
            });
          });
        }

        if (quizData && !errQuiz) {
           (quizData as unknown as { material_id: string; created_at: string; materials: { title: string } | { title: string }[] | null }[]).forEach((q) => {
             const mat = q.materials;
             const title = Array.isArray(mat) ? mat[0]?.title : mat?.title;
             formattedActivities.push({
               id: `quiz-${q.material_id}-${q.created_at}`,
               type: 'quiz',
               title: title || 'Unknown Material',
               date: new Date(q.created_at)
             });
           });
        }

        formattedActivities.sort((a, b) => b.date.getTime() - a.date.getTime());
        setActivities(formattedActivities.slice(0, 4));
      } catch (error) {
        console.error('Error fetching recent activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [userId]);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 relative col-span-2 lg:col-span-1">
      <h3 className="text-[20px] font-bold text-[#672cb9] mb-6">Recent Activity</h3>
      
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <div className="w-6 h-6 border-2 border-[#672cb9] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : activities.length === 0 ? (
        <p className="text-slate-500 font-medium z-10 relative">Belum ada aktivitas.</p>
      ) : (
        <div className="space-y-6 relative z-10">
          {activities.map((act) => (
            <div key={act.id} className="flex gap-4 items-start">
              {act.type === 'upload' || act.type === 'viewed' ? (
                <div className="bg-[#f4effa] p-2.5 rounded-full shrink-0">
                  <FileText size={20} className="text-[#672cb9]" />
                </div>
              ) : (
                <div className="bg-[#672cb9] p-2.5 rounded-full shrink-0">
                  <CheckCircle2 size={20} className="text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 font-medium line-clamp-2 break-all">
                  {act.type === 'upload' ? 'Uploaded' : act.type === 'quiz' ? 'Completed quiz' : 'Viewed'} &quot;{act.title}&quot;
                </p>
                <p className="text-slate-400 text-[13px] mt-0.5">
                  {formatDistanceToNow(act.date, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface LeaderboardItem {
  user_id: string;
  user_name: string;
  current_streak: number;
  rank: number;
}

function LeaderboardRankWidget({ userId, userName }: { userId: string, userName: string }) {
  const [data, setData] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState<number | string>('-');
  const [currentUserStreak, setCurrentUserStreak] = useState<number>(0);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data: streakData, error: dbError } = await supabase
          .from('user_streaks')
          .select('user_id, current_streak, user_name, user_avatar')
          .order('current_streak', { ascending: false });

        if (dbError) throw dbError;

        const results = (streakData || []).map((row, index) => ({
           user_id: row.user_id,
           user_name: row.user_name || 'Pelajar',
           current_streak: row.current_streak || 0,
           rank: index + 1
        }));

        const top3 = results.slice(0, 3);
        const currentUserIndex = results.findIndex(r => r.user_id === userId);
        const currentUser = results[currentUserIndex];
        
        setCurrentUserRank(currentUser ? currentUser.rank : '-');
        setCurrentUserStreak(currentUser ? currentUser.current_streak : 0);

        // Show top 3. If current user is not in top 3, append them at the end.
        const displayList = [...top3];
        if (currentUser && currentUserIndex >= 3) {
          displayList.push(currentUser);
        } else if (!currentUser) {
          displayList.push({
            user_id: userId,
            user_name: userName,
            current_streak: 0,
            rank: 0 // Gunakan angka 0 sebagai indikator 'belum ada ranking' agar tidak error type
          });
        }
        setData(displayList);
      } catch (error) {
        console.error('Error fetching leaderboard widget data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [userId, userName]);

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 col-span-2 lg:col-span-1 h-full flex flex-col">
      <h3 className="text-[20px] font-bold text-[#672cb9] mb-4">Leaderboard Rank</h3>
      
      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="w-6 h-6 border-2 border-[#672cb9] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="mb-6 space-y-1">
            <p className="text-slate-800 font-medium">Current Rank: <span className="font-bold">#{currentUserRank}</span></p>
            <p className="text-slate-800 font-medium">Points: <span className="font-bold">{currentUserStreak}</span></p>
          </div>
          
          <div className="space-y-1 flex-1">
            {data.map((item, index) => {
              const isCurrentUser = item.user_id === userId;
              
              let bg = 'bg-[#1e1e1e]';
              if (item.rank === 1) bg = 'bg-yellow-400';
              else if (item.rank === 2) bg = 'bg-slate-300';
              else if (item.rank === 3) bg = 'bg-orange-600';
              
              const initial = item.user_name ? item.user_name.charAt(0).toUpperCase() : 'U';

              return (
                <div key={item.user_id || index} className={`flex items-center justify-between p-3 rounded-xl ${isCurrentUser ? 'bg-[#f4effa]' : 'hover:bg-slate-50 transition-colors'}`}>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 font-medium w-4">{item.rank > 0 ? `${item.rank}.` : '-'}</span>
                    <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center text-white text-[13px] font-bold`}>
                      {initial}
                    </div>
                    <span className={`font-medium ${isCurrentUser ? 'text-[#0f172a]' : 'text-slate-700'}`}>{item.user_name}</span>
                  </div>
                  <span className={`font-bold ${isCurrentUser ? 'text-[#0f172a]' : 'text-slate-800'}`}>{item.current_streak}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <Dashboard />
    </Suspense>
  );
}