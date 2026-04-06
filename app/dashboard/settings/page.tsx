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
    <div className="min-h-full flex flex-col md:flex-row pt-6 md:pt-12 px-6 md:px-12 pb-24 max-w-[1240px] mx-auto w-full font-['Inter',sans-serif] gap-8">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-[280px] shrink-0">
        <div className="sticky top-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight mb-2">
              Pengaturan
            </h1>
            <p className="text-[#6b7280] text-sm font-medium">Kelola preferensi akun Anda.</p>
          </motion.div>

          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide no-scrollbar">
            <button
              onClick={() => setActiveTab('profile')}
              className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 w-full text-left shrink-0 md:shrink ${
                activeTab === 'profile' ? 'text-[#672cb9] bg-[#f5f3ff] shadow-sm shadow-[#672cb9]/10' : 'text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#374151]'
              }`}
            >
              <User size={18} className={activeTab === 'profile' ? 'text-[#672cb9]' : 'text-[#9ca3af]'} /> 
              Profil Saya
              {activeTab === 'profile' && (
                <motion.div layoutId="activeInd" className="absolute left-0 top-[15%] bottom-[15%] w-1 bg-[#672cb9] rounded-r-full hidden md:block" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('quota')}
              className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 w-full text-left shrink-0 md:shrink ${
                activeTab === 'quota' ? 'text-[#672cb9] bg-[#f5f3ff] shadow-sm shadow-[#672cb9]/10' : 'text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#374151]'
              }`}
            >
              <BatteryCharging size={18} className={activeTab === 'quota' ? 'text-[#672cb9]' : 'text-[#9ca3af]'} /> 
              Kuota AI & Paket
              {activeTab === 'quota' && (
                <motion.div layoutId="activeInd" className="absolute left-0 top-[15%] bottom-[15%] w-1 bg-[#672cb9] rounded-r-full hidden md:block" />
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0">
        <AnimatePresence mode="wait">
          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6"
            >
              {/* Header Box */}
              <div className="bg-white rounded-[28px] p-6 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-[#f3f4f6]">
                 <div className="flex gap-5 items-center">
                    <div className="relative w-[72px] h-[72px] rounded-full overflow-hidden bg-[#f3f4f6] flex items-center justify-center shrink-0 border border-[#e5e7eb]">
                      {avatar ? (
                        <Image src={avatar} alt="Avatar" fill className="object-cover" />
                      ) : (
                        <span className="font-bold text-2xl text-[#9ca3af]">{name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <h2 className="text-[#111827] font-bold text-xl mb-0.5">{name || 'Pengguna'}</h2>
                      <p className="text-[#6b7280] text-sm flex items-center gap-1.5 font-medium">
                        <Mail size={14} className="text-[#9ca3af]"/> {user?.email}
                      </p>
                    </div>
                 </div>
              </div>

              {/* Form Box */}
              <div className="bg-white rounded-[28px] p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-[#f3f4f6]">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-[#111827] mb-1">Informasi Personal</h3>
                  <p className="text-sm text-[#6b7280]">Perbarui foto dan nama yang akan ditampilkan di platform.</p>
                </div>

                {successMsg && (
                  <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="mb-6 p-4 bg-[#ecfdf5] border border-[#d1fae5] rounded-2xl flex items-start gap-3">
                    <ShieldCheck size={20} className="text-[#059669] shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-[#065f46]">{successMsg}</p>
                  </motion.div>
                )}
                {errorMsg && (
                  <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="mb-6 p-4 bg-[#fef2f2] border border-[#fee2e2] rounded-2xl flex items-start gap-3">
                    <Info size={20} className="text-[#dc2626] shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-[#991b1b]">{errorMsg}</p>
                  </motion.div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-[#4b5563] uppercase tracking-wide">Nama Lengkap</label>
                      <Input 
                        icon={<User size={18} />}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Cth: John Doe"
                        required
                        className="bg-[#f9fafb] border-[#e5e7eb] focus:bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-[#4b5563] uppercase tracking-wide">Alamat Email <span className="opacity-50 lowercase tracking-normal font-normal">(Read only)</span></label>
                      <Input 
                        icon={<Mail size={18} />}
                        value={user?.email || ''}
                        disabled
                        className="bg-[#f3f4f6] text-[#9ca3af] border-transparent cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 max-w-3xl">
                    <label className="text-[13px] font-bold text-[#4b5563] uppercase tracking-wide">URL Avatar</label>
                    <Input 
                      icon={<Camera size={18} />}
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://... image.jpg"
                      className="bg-[#f9fafb] border-[#e5e7eb] focus:bg-white"
                    />
                    <p className="text-xs text-[#9ca3af] mt-1 ml-1">Paste link gambar secara langsung. Mendukung format JPG, PNG.</p>
                  </div>
                  
                  <div className="pt-6 border-t border-[#f3f4f6] flex justify-end">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="h-12 px-8 rounded-full font-bold shadow-md shadow-[#672cb9]/20"
                      disabled={loading}
                      leftIcon={loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    >
                      {loading ? 'Menyimpan...' : 'Simpan Profil'}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* TAB: QUOTA */}
          {activeTab === 'quota' && (
            <motion.div
              key="quota"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6"
            >
              <div className="bg-white rounded-[28px] p-6 md:p-10 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-[#f3f4f6] w-full max-w-3xl relative overflow-hidden">
                {/* Decorative background shape */}
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br from-[#ffa515]/20 to-[#672cb9]/10 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <div className="flex items-center gap-2 text-[#ffa515] font-bold uppercase tracking-widest text-[11px] mb-2">
                        <Sparkles size={14} /> Plan Saat Ini
                      </div>
                      <h2 className="text-2xl font-bold text-[#111827]">Free Tier</h2>
                    </div>
                    
                    <div className="bg-[#f8fafc] px-4 py-2 rounded-2xl border border-[#e2e8f0] flex flex-col items-center">
                      <span className="text-xs text-[#64748b] font-medium">Sisa Kuota</span>
                      {usageLoading ? (
                        <Loader2 size={16} className="animate-spin mt-1 mx-2" />
                      ) : (
                        <span className="text-xl font-bold text-[#0f172a] leading-none mt-1">{remaining}<span className="text-sm font-medium text-[#94a3b8] ml-1">/{MAX_LIMIT}</span></span>
                      )}
                    </div>
                  </div>

                  {!usageLoading && (
                    <>
                      {/* Detailed Usage Bar */}
                      <div className="mb-8">
                        <div className="flex justify-between text-sm font-medium mb-2">
                          <span className="text-[#64748b]">Telah Terpakai: {usageCount}</span>
                          <span className={remaining === 0 ? "text-[#ef4444]" : "text-[#10b981]"}>
                            {remaining === 0 ? "Habis" : `${percentage.toFixed(0)}% Digunakan`}
                          </span>
                        </div>
                        <div className="h-4 w-full bg-[#f1f5f9] rounded-full overflow-hidden shadow-inner p-1">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`h-full rounded-full ${
                              remaining === 0 ? 'bg-[#ef4444]' : 
                              remaining === 1 ? 'bg-[#f59e0b]' : 'bg-gradient-to-r from-[#672cb9] to-[#8b5cf6]'
                            }`}
                          />
                        </div>
                      </div>

                      {remaining === 0 ? (
                        <div className="p-5 bg-[#fef2f2] border border-[#fee2e2] rounded-2xl flex items-start gap-4">
                           <div className="w-10 h-10 rounded-full bg-[#fee2e2] flex items-center justify-center shrink-0">
                             <Info size={20} className="text-[#ef4444]" />
                           </div>
                           <div>
                             <h4 className="text-[#991b1b] font-bold text-sm mb-1">Batas Maksimal Tercapai</h4>
                             <p className="text-sm text-[#b91c1c] leading-relaxed">
                               Kuota harian Anda telah habis untuk menghemat biaya server AI. Kuota akan otomatis di-reset pada tengah malam (00:00).
                             </p>
                           </div>
                        </div>
                      ) : (
                        <div className="p-5 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl flex items-start gap-4">
                           <div className="w-10 h-10 rounded-full bg-[#e0e7ff] flex items-center justify-center shrink-0">
                             <BatteryCharging size={20} className="text-[#6366f1]" />
                           </div>
                           <div>
                             <h4 className="text-[#1e293b] font-bold text-sm mb-1">Informasi Limit Harian</h4>
                             <p className="text-[13px] text-[#475569] leading-relaxed">
                               Setiap pengguna memiliki limit pemrosesan dokumen (PDF/Audio/Video) menggunakan AI per harinya untuk menghindari penyalahgunaan sistem.
                             </p>
                           </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}