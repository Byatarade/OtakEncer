'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Save, Mail, Camera, Loader2, ArrowLeft, X, Crop, Activity, FileText, Layers, ListTodo, Calendar, Clock, BarChart2, PieChart, CheckCircle2, GraduationCap } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { showSuccess, showError } from '@/lib/swal';
import Link from 'next/link';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/get-cropped-img';

export default function SettingsPage() {
  const { user, isLoaded } = useAuth();

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);

  // Cropper states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);

  type Area = { x: number; y: number; width: number; height: number };
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  // Activity & Log states
  const [stats, setStats] = useState({ materials: 0, quizzes: 0, flashcards: 0, exams: 0, files: 0 });
  const [activities, setActivities] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState('all');
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      setLoadingStats(true);
      try {
        const { data: materials } = await supabase
          .from('materials')
          .select('id, created_at, source_type, ai_quiz, ai_flashcard, ai_exam, title')
          .eq('user_id', user.id);

        const { data: quizzes } = await supabase
          .from('quiz_scores')
          .select('id, created_at, materials(title)')
          .eq('user_id', user.id);

        let matCount = 0;
        let quizCount = 0;
        let flashcardCount = 0;
        let examCount = 0;
        let fileCount = 0;
        const heatMap: Record<string, number> = {};
        const logs: any[] = [];

        if (materials) {
          matCount = materials.length;
          materials.forEach(m => {
            if (m.ai_quiz && Array.isArray(m.ai_quiz) && m.ai_quiz.length > 0) quizCount++;
            if (m.ai_flashcard && Array.isArray(m.ai_flashcard) && m.ai_flashcard.length > 0) flashcardCount++;
            if (m.ai_exam && typeof m.ai_exam === 'object' && m.ai_exam.mcq && Array.isArray(m.ai_exam.mcq) && m.ai_exam.mcq.length > 0) examCount++;
            if (['document', 'pdf', 'docx'].includes(m.source_type?.toLowerCase() || '')) fileCount++;

            const dateObj = new Date(m.created_at);
            const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
            heatMap[dateStr] = (heatMap[dateStr] || 0) + 1;

            logs.push({
              id: `mat-${m.id}`,
              type: 'material',
              title: `Upload Materi: ${m.title || 'Materi Belajar'}`,
              created_at: new Date(m.created_at)
            });
          });
        }

        if (quizzes) {
          quizzes.forEach(q => {
            const dateObj = new Date(q.created_at);
            const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
            heatMap[dateStr] = (heatMap[dateStr] || 0) + 1;

            // @ts-ignore
            const t = q.materials?.title || 'Quiz/Ujian';
            logs.push({
              id: `quiz-${q.id}`,
              type: 'quiz',
              title: `Menyelesaikan Quiz/Ujian: ${t}`,
              created_at: new Date(q.created_at)
            });
          });
        }

        logs.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

        setStats({ materials: matCount, quizzes: quizCount, flashcards: flashcardCount, exams: examCount, files: fileCount });
        setHeatmapData(heatMap);
        setActivities(logs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [user]);




  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        showError('Ukuran File Terlalu Besar', 'Ukuran foto maksimal 2MB. Silakan upload foto dengan ukuran yang lebih kecil.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageSrc(reader.result?.toString() || null));
      reader.readAsDataURL(file);
      setIsCropping(true);
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      if (!imageSrc || !croppedAreaPixels || !user) return;
      setLoading(true);
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedImageBlob) throw new Error('Gagal crop foto');

      const ext = 'jpeg';
      const filename = `${user.id}-${Date.now()}.${ext}`;

      const { error } = await supabase.storage.from('avatars').upload(filename, croppedImageBlob, { upsert: true });
      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filename);
      setAvatar(publicUrl);
      setIsCropping(false);
      setImageSrc(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e) {
      console.error(e);
      showError('Gagal Upload', 'Gagal mengupload foto. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, [imageSrc, croppedAreaPixels, user]);

  const cancelCrop = () => {
    setIsCropping(false);
    setImageSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.picture || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error } = await supabase.auth.updateUser({
        data: { full_name: name, avatar_url: avatar }
      });
      if (error) throw error;

      const userId = (authData.user || user)?.id;
      if (userId) {
        await supabase.from('user_streaks').update({ user_name: name, user_avatar: avatar }).eq('user_id', userId);
        await supabase.from('quiz_scores').update({ user_name: name, user_avatar: avatar }).eq('user_id', userId);
      }

      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (accessToken) {
        try {
          await fetch('/api/sync-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
            body: JSON.stringify({ name, avatar })
          });
        } catch (syncError) {
          console.warn('Gagal sinkronisasi data ke leaderboard via API:', syncError);
        }
      }

      showSuccess('Berhasil!', 'Profil berhasil diperbarui!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memperbarui profil.';
      showError('Gagal', message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 size={40} className="animate-spin text-[#672cb9]" />
      </div>
    );
  }

  return (
    <div className="min-h-0 h-auto xl:h-full w-full max-w-[1600px] mx-auto pt-6 xl:pt-[38px] px-4 md:px-6 xl:px-10 pb-20 md:pb-6 font-montserrat tracking-tight flex flex-col gap-4 overflow-x-hidden">

      {/* Header Page & Back Button */}
      <div className="flex items-center gap-3 shrink-0">
        <Link href="/dashboard" className="bg-[#f3f4f6] p-2 rounded-full hover:bg-[#e5e7eb] hover:shadow-sm transition-all text-gray-500 hover:text-[#672cb9]">
          <ArrowLeft size={16} strokeWidth={2.5} />
        </Link>
        <h1 className="text-xl font-bold text-[#111827] leading-tight">Pengaturan Akun</h1>
      </div>

      {loadingStats ? (
        <div className="flex items-center justify-center flex-1 h-full min-h-[400px]">
          <Loader2 size={40} className="animate-spin text-[#672cb9]" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1 min-h-0"
        >
          {/* -------------------- LEFT COLUMN (PROFILE) -------------------- */}
          <div className="xl:col-span-4 flex flex-col gap-4 w-full h-full xl:max-w-md xl:mx-auto">

            {/* Profile Overview Box */}
            <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-[#f3f4f6] shrink-0">
              <div className="flex gap-4 items-center">
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[#f5f3ff] flex items-center justify-center shrink-0 border-2 border-white shadow-sm ring-1 ring-gray-100">
                  {avatar ? (
                    <Image src={avatar} alt="Avatar" fill className="object-cover" />
                  ) : (
                    <span className="font-bold text-xl text-[#672cb9]">{name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[#111827] font-bold text-lg mb-0.5 truncate">{name || 'Pengguna'}</h2>
                  <p className="text-[#6b7280] text-[12px] flex items-center gap-1.5 font-medium truncate">
                    <Mail size={13} className="text-[#9ca3af] shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Informational Editing Form Box */}
            <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-[#f3f4f6] flex-1 flex flex-col">
              <div className="mb-4 shrink-0">
                <h3 className="text-[16px] font-bold text-[#111827] mb-1">Informasi Personal</h3>
                <p className="text-[#6b7280] text-[12px] font-medium leading-relaxed">Perbarui data nama pengguna dan pasang foto profil platform.</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="space-y-1.5 mb-4">
                    <label className="text-[11px] font-bold text-gray-500 tracking-wider">NAMA LENGKAP</label>
                    <Input
                      icon={<User size={16} />}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="bg-gray-50/50 border-[#e5e7eb] focus:ring-2 focus:ring-[#7a5af8]/20 rounded-xl shadow-sm text-[14px] h-[42px]"
                    />
                  </div>

                  <div className="space-y-1.5 mb-4">
                    <label className="text-[11px] font-bold text-gray-500 tracking-wider">EMAIL<span className="opacity-60 ml-1 normal-case">(Read-only)</span></label>
                    <Input
                      icon={<Mail size={16} />}
                      value={user?.email || ''}
                      disabled
                      className="bg-gray-100/50 text-gray-400 border-transparent cursor-not-allowed rounded-xl text-[14px] h-[42px]"
                    />
                  </div>

                  <div className="space-y-1.5 mb-2">
                    <label className="text-[11px] font-bold text-gray-500 tracking-wider">FOTO AVATAR URL</label>
                    <div className="flex gap-2">
                      <Input
                        icon={<Camera size={16} />}
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        placeholder="https://..."
                        className="bg-gray-50/50 border-[#e5e7eb] focus:ring-2 focus:ring-[#7a5af8]/20 flex-1 truncate rounded-xl shadow-sm text-[14px] h-[42px]"
                      />
                      <div className="relative overflow-hidden shrink-0">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                          disabled={loading}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                        />
                        <Button variant="outline" type="button" className="h-[42px] px-3.5 font-bold text-[13px] text-gray-700 rounded-xl border-gray-200 hover:bg-gray-100 shadow-sm" disabled={loading}>
                          Upload
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 mt-auto shrink-0 w-full">
                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl font-bold text-[14px] bg-gradient-to-r from-[#672cb9] to-[#8c4ae1] hover:shadow-lg hover:shadow-[#672cb9]/30 text-white flex items-center justify-center gap-2 transform transition-all active:scale-[0.98]"
                    disabled={loading}
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </div>
              </form>
            </div>
          </div>


          {/* -------------------- RIGHT COLUMN (STATS & LOGS) -------------------- */}
          <div className="xl:col-span-8 flex flex-col gap-4 xl:h-full min-h-0 w-full">

            {/* 3 Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
              <div className="bg-white p-4 rounded-[20px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col group">
                <FileText size={22} strokeWidth={2.5} className='text-blue-500 mb-3 mt-1' />
                <p className="text-gray-500 text-[11px] font-bold tracking-tight mb-0.5">TOTAL MATERI</p>
                <h4 className="text-2xl font-extrabold text-gray-900 leading-none">{stats.materials}</h4>
              </div>
              <div className="bg-white p-4 rounded-[20px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col group">
                <ListTodo size={22} strokeWidth={2.5} className='text-green-500 mb-3 mt-1' />
                <p className="text-gray-500 text-[11px] font-bold tracking-tight mb-0.5">QUIZ DIBUAT</p>
                <h4 className="text-2xl font-extrabold text-gray-900 leading-none">{stats.quizzes}</h4>
              </div>
              <div className="bg-white p-4 rounded-[20px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col group">
               <Layers size={22} strokeWidth={2.5} className='text-yellow-500 mb-3 mt-1' />
                <p className="text-gray-500 text-[11px] font-bold tracking-tight mb-0.5">FLASHCARD DIBUAT</p>
                <h4 className="text-2xl font-extrabold text-gray-900 leading-none">{stats.flashcards}</h4>
              </div>
              <div className="bg-white p-4 rounded-[20px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col group col-span-2 lg:col-span-1">
               <GraduationCap size={22} strokeWidth={2.5} className='text-purple-500 mb-3 mt-1' />
                <p className="text-gray-500 text-[11px] font-bold tracking-tight mb-0.5">UJIAN DISELESAIKAN</p>
                <h4 className="text-2xl font-extrabold text-gray-900 leading-none">{stats.exams}</h4>
              </div>
            </div>

            {/* Middle Bottom Grid: Calendar & Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 xl:min-h-0 h-full">

              {/* Analisis Tipe Belajar (Replaces Heatmap) */}
              <div className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex flex-col relative overflow-hidden group justify-between h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f5f3ff] rounded-full blur-[40px] opacity-60 z-0 pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>

                <div className="flex flex-col mb-4 relative z-10 shrink-0">
                  <h3 className="text-[16px] md:text-[17px] font-bold text-gray-900 flex items-center gap-2 mb-1.5"><PieChart size={18} className="text-[#672cb9]" /> Distribusi Belajar</h3>
                  <p className="text-gray-400 text-[11px] md:text-[12px] font-medium leading-relaxed">Analisis gaya dan fokus pembelajaranmu bersama AI.</p>
                </div>

                <div className="w-full relative z-10 flex-1 flex flex-col justify-center gap-5 mt-2">
                  {(() => {
                    const total = stats.materials + stats.quizzes + stats.flashcards;
                    const showZero = total === 0;
                    const divisor = showZero ? 1 : total;

                    const pMat = showZero ? 0 : Math.round((stats.materials / divisor) * 100);
                    const pQuiz = showZero ? 0 : Math.round((stats.quizzes / divisor) * 100);
                    const pFlash = showZero ? 0 : Math.round((stats.flashcards / divisor) * 100);

                    return (
                      <>
                        {/* Materi */}
                        <div className="flex flex-col gap-2 relative z-10">
                          <div className="flex justify-between items-center text-[12px] md:text-[13px] font-bold">
                            <span className="text-gray-700 flex items-center gap-1.5"><FileText size={14} className="text-blue-500" /> Analisis Materi</span>
                            <span className="text-gray-900">{pMat}%</span>
                          </div>
                          <div className="h-2.5 md:h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pMat}%` }} transition={{ duration: 1, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></motion.div>
                          </div>
                        </div>
                        {/* Quiz */}
                        <div className="flex flex-col gap-2 relative z-10">
                          <div className="flex justify-between items-center text-[12px] md:text-[13px] font-bold">
                            <span className="text-gray-700 flex items-center gap-1.5"><ListTodo size={14} className="text-emerald-500" /> Evaluasi Quiz</span>
                            <span className="text-gray-900">{pQuiz}%</span>
                          </div>
                          <div className="h-2.5 md:h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pQuiz}%` }} transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></motion.div>
                          </div>
                        </div>
                        {/* Flashcard */}
                        <div className="flex flex-col gap-2 relative z-10">
                          <div className="flex justify-between items-center text-[12px] md:text-[13px] font-bold">
                            <span className="text-gray-700 flex items-center gap-1.5"><Layers size={14} className="text-amber-500" /> Hafalan Flashcard</span>
                            <span className="text-gray-900">{pFlash}%</span>
                          </div>
                          <div className="h-2.5 md:h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pFlash}%` }} transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"></motion.div>
                          </div>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>

              {/* Logs Section */}
              <div className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex flex-col h-full xl:min-h-0 max-h-[400px] lg:max-h-full">
                <div className="flex items-center justify-between mb-4 shrink-0">
                  <h3 className="text-[16px] font-bold text-gray-900 flex items-center gap-1.5"><Clock size={18} className="text-[#672cb9]" /> Activities</h3>

                  {/* Select Filter */}
                  <div className="relative w-28">
                    <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-600 text-[11px] font-bold rounded-[8px] px-2.5 py-1.5 pr-6 focus:outline-none focus:ring-1 focus:ring-[#672cb9]/30 cursor-pointer"
                    >
                      <option value="all">S. Waktu</option>
                      <option value="today">Hari Ini</option>
                      <option value="7days">7 Hari</option>
                      <option value="30days">30 Hari</option>
                    </select>
                    <BarChart2 size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0 space-y-1.5">
                  {(() => {
                    const filteredLogs = activities.filter(log => {
                      if (timeFilter === 'all') return true;
                      const diffMs = new Date().getTime() - log.created_at.getTime();
                      if (timeFilter === 'hour') return diffMs <= 3600000;
                      if (timeFilter === 'today') return diffMs <= 86400000;
                      if (timeFilter === '7days') return diffMs <= 7 * 86400000;
                      if (timeFilter === '30days') return diffMs <= 30 * 86400000;
                      return true;
                    });

                    if (filteredLogs.length === 0) {
                      return (
                        <div className="flex flex-col items-center justify-center py-10 bg-gray-50/50 rounded-xl h-full border border-dashed border-gray-200">
                          <Clock size={24} className="text-gray-300 mb-2" />
                          <p className="text-gray-400 font-semibold text-[12px] text-center">Rekam jejak kosong.</p>
                        </div>
                      )
                    }

                    return filteredLogs.slice(0, 50).map((log, idx) => (
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02, duration: 0.2 }}
                        key={`${log.id}-${idx}`}
                        className="flex items-center gap-3 p-2.5 rounded-[12px] hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                      >
                        {log.type === 'quiz' ? (
                          <div className="bg-[#672cb9] w-8 h-8 rounded-full shrink-0 flex items-center justify-center">
                            <CheckCircle2 size={16} className="text-white" />
                          </div>
                        ) : (
                          <div className="bg-[#f4effa] w-8 h-8 rounded-full shrink-0 flex items-center justify-center">
                            <FileText size={16} className="text-[#672cb9]" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 font-medium text-[13px] truncate" title={log.title}>{log.title}</p>
                          <p className="text-[10px] font-normal text-gray-400 mt-0.5 truncate">
                            {log.created_at.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} • {log.created_at.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    ));
                  })()}
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      )}

      {/* Cropper Modal */}
      <AnimatePresence>
        {isCropping && imageSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-[24px] p-6 w-full max-w-md shadow-2xl relative"
            >
              <button
                onClick={cancelCrop}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors z-20"
              >
                <X size={20} />
              </button>

              <h3 className="text-xl font-bold text-gray-900 mb-4">Sesuaikan Foto</h3>

              <div className="relative w-full h-[300px] mb-6 rounded-xl overflow-hidden border border-gray-200">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  classes={{ containerClassName: 'bg-gray-50' }}
                />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium text-gray-600">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-gray-100">
                <Button variant="outline" onClick={cancelCrop} disabled={loading}>
                  Batal
                </Button>
                <Button
                  onClick={showCroppedImage}
                  disabled={loading}
                  className="bg-[#672cb9] hover:bg-[#5a26a3] text-white flex items-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Crop size={16} />}
                  Potong & Simpan
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}