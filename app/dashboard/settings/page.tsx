'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings as SettingsIcon, BatteryCharging, Save, ShieldCheck, Mail, Camera, Loader2, Info, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export default function SettingsPage() {
  const { user, isLoaded } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [usageCount, setUsageCount] = useState(0);
  const [usageLoading, setUsageLoading] = useState(true);
  
  // Batas 3 kali sehari per akun
  const MAX_LIMIT = 3;

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.picture || '');
      fetchUsageCount();
    }
  }, [user]);

  const fetchUsageCount = async () => {
    try {
      if (!user?.id) return;
      
      setUsageLoading(true);
      // Ambil tanggal hari ini saja 
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { count, error } = await supabase
        .from('materials')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfDay.toISOString());

      if (error) throw error;
      setUsageCount(count || 0);

    } catch (err) {
      console.error('Error fetching usage:', err);
    } finally {
      setUsageLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          avatar_url: avatar
        }
      });

      if (error) throw error;
      
      setSuccessMsg('Profil berhasil diperbarui! Silakan refresh halaman untuk melihat efeknya jika belum terganti.');
      
      // Clear success msg after 3 detik
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memperbarui profil.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-[#672cb9]" />
      </div>
    );
  }

  const percentage = Math.min((usageCount / MAX_LIMIT) * 100, 100);
  const remaining = Math.max(MAX_LIMIT - usageCount, 0);

  return (
    <div className="min-h-full flex flex-col pt-6 md:pt-8 px-6 md:px-12 pb-24 max-w-[1200px] mx-auto w-full font-['Montserrat',sans-serif]">
      
      {/* Header Premium */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-white rounded-[32px] p-8 md:p-10 mb-8 shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none rounded-[32px]">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#672cb9] opacity-[0.03] rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#ffa515] opacity-[0.03] rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#672cb9] to-[#9254e8] shadow-lg flex items-center justify-center text-white shrink-0">
            <SettingsIcon size={36} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              Pengaturan Akun
            </h1>
            <p className="text-gray-500 font-medium">Kelola informasi profil dan pantau penggunaan kuota AI Anda.</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar flex-nowrap shrink-0 mb-6">
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab('profile')}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap z-10 ${
              activeTab === 'profile' ? 'text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {activeTab === 'profile' && (
              <motion.div layoutId="settingTab" className="absolute inset-0 bg-[#672cb9] rounded-xl -z-10 shadow-md shadow-[#672cb9]/30" />
            )}
            <User size={18} /> Profil
          </button>
          <button
            onClick={() => setActiveTab('quota')}
            className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap z-10 ${
              activeTab === 'quota' ? 'text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {activeTab === 'quota' && (
              <motion.div layoutId="settingTab" className="absolute inset-0 bg-[#672cb9] rounded-xl -z-10 shadow-md shadow-[#672cb9]/30" />
            )}
            <BatteryCharging size={18} /> Kuota AI (Token)
          </button>
        </div>
      </div>

      {/* Konten */}
      <div className="grid grid-cols-1 gap-8">
        
        <AnimatePresence mode="wait">
          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-gray-200/40 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <ShieldCheck className="text-[#672cb9]" size={24} /> Informasi Personal
              </h2>

              {successMsg && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-start gap-3">
                  <Info size={20} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{successMsg}</p>
                </div>
              )}
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
                  <Info size={20} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{errorMsg}</p>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="max-w-2xl">
                {/* Avatar Preview */}
                <div className="mb-8 flex items-center gap-6">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-xl flex items-center justify-center shrink-0">
                    {avatar ? (
                      <Image src={avatar} alt="Avatar" fill className="object-cover" />
                    ) : (
                      <User size={40} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">Foto Profil</h3>
                    <p className="text-sm text-gray-500 mb-3">Tautan URL foto profil Anda saat ini.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                    <Input 
                      icon={<User size={18} />}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama lengkap Anda"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Email <span className="text-gray-400 font-normal">(Tidak dapat diubah)</span></label>
                    <Input 
                      icon={<Mail size={18} />}
                      value={user?.email || ''}
                      disabled
                      className="bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">URL Foto Profil (Avatar)</label>
                    <Input 
                      icon={<Camera size={18} />}
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://contoh.com/foto-saya.jpg"
                    />
                  </div>
                  
                  <div className="pt-6 border-t border-gray-100">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-full sm:w-auto h-12 px-8"
                      disabled={loading}
                      leftIcon={loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    >
                      {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {/* TAB: QUOTA */}
          {activeTab === 'quota' && (
            <motion.div
              key="quota"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-gray-200/40 border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <Sparkles className="text-[#ffa515]" size={24} /> Penggunaan Kuota Harian (Gemini AI)
              </h2>

              {usageLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={32} className="animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="max-w-2xl bg-gradient-to-br from-[#672cb9]/5 to-[#672cb9]/10 border border-[#672cb9]/20 rounded-3xl p-8 relative overflow-hidden">
                  
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <h3 className="font-bold text-gray-800 text-lg">Sisa Ekstraksi Pintar Hari ini</h3>
                    <div className="bg-white px-4 py-1.5 rounded-full font-bold text-[#672cb9] shadow-sm tracking-wide text-sm border border-[#672cb9]/10">
                      {remaining} dari {MAX_LIMIT} tersisa
                    </div>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="h-4 w-full bg-white/60 rounded-full overflow-hidden mt-6 mb-6 shadow-inner relative z-10 p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        remaining === 0 ? 'bg-red-500' : 
                        remaining === 1 ? 'bg-orange-400' : 'bg-gradient-to-r from-[#672cb9] to-[#9254e8]'
                      }`}
                    />
                  </div>

                  <p className="text-sm text-gray-600 font-medium leading-relaxed relative z-10">
                    Kamu telah menggunakan <strong className="text-gray-900">{usageCount}</strong> dari <strong className="text-gray-900">{MAX_LIMIT}</strong> kuota ekstraksi dokumen (PDF/PPTX/Video) hari ini.
                  </p>

                  {remaining === 0 && (
                    <div className="mt-6 p-4 bg-red-100 border border-red-200 rounded-xl flex items-start gap-3 relative z-10">
                       <Info size={20} className="text-red-600 shrink-0 mt-0.5" />
                       <p className="text-sm font-semibold text-red-800">
                         Kuota harian Anda telah habis. Limit ini berguna agar kami dapat mempertahankan ketersediaan server AI (Gemini Free Tier). Kuota akan di-reset besok tengah malam secara otomatis.
                       </p>
                    </div>
                  )}
                  {remaining > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 relative z-10">
                       <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
                       <p className="text-sm font-semibold text-blue-800">
                         Limit ini di-reset setiap pergantian hari. Pastikan Anda mengunggah dokumen yang valid agar kuota tidak terbuang sia-sia.
                       </p>
                    </div>
                  )}

                  {/* Aesthetic BG ring */}
                  <div className="absolute -right-20 -bottom-20 w-64 h-64 border-[40px] border-[#672cb9]/5 rounded-full z-0"></div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}