'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Save, Mail, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Swal from 'sweetalert2';

export default function SettingsPage() {
  const { user, isLoaded } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);

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
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          avatar_url: avatar
        }
      });

      if (error) throw error;

      // Sync nama dan avatar ke tabel user_streaks untuk ditampilkan di leaderboard via API
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        try {
          await fetch('/api/sync-profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ name, avatar })
          });
        } catch (syncError) {
          console.warn('Gagal sinkronisasi data ke leaderboard via API:', syncError);
        }
      }
      
      Swal.fire({
        title: 'Berhasil!',
        text: 'Profil berhasil diperbarui!',
        icon: 'success',
        confirmButtonColor: '#672cb9'
      });
      
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memperbarui profil.';
      Swal.fire({
        title: 'Gagal',
        text: message,
        icon: 'error',
        confirmButtonColor: '#672cb9'
      });
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
                <motion.div layoutId="activeInd" className="absolute left-0 top-[15%] bottom-[15%] w-1 bg-[#FFA515] rounded-r-full hidden md:block" />
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
                    <label className="text-[13px] font-bold text-[#4b5563] uppercase tracking-wide">Avatar (URL atau Upload Image)</label>
                    <div className="flex gap-3">
                      <Input 
                        icon={<Camera size={18} />}
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        placeholder="https://... image.jpg"
                        className="bg-[#f9fafb] border-[#e5e7eb] focus:bg-white flex-1"
                      />
                      <div className="relative overflow-hidden shrink-0">
                         <input 
                           type="file" 
                           accept="image/png, image/jpeg, image/jpg, image/webp"
                           onChange={async (e) => {
                             const file = e.target.files?.[0];
                             if(!file || !user) return;
                             try {
                               // Validate size (< 2MB)
                               if(file.size > 2 * 1024 * 1024) {
                                 Swal.fire({ title: 'Terlalu Besar', text: 'Ukuran foto maksimal 2MB', icon: 'error', confirmButtonColor: '#672cb9' });
                                 return;
                               }
                               
                               setLoading(true);
                               const ext = file.name.split('.').pop();
                               const filename = `${user.id}-${Date.now()}.${ext}`;
                               const { error } = await supabase.storage.from('avatars').upload(filename, file, { upsert: true });
                               
                               if(error) throw error;
                               
                               const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filename);
                               setAvatar(publicUrl);
                             } catch(err) {
                               console.error(err);
                               Swal.fire({ title: 'Gagal Upload', text: 'Pastikan bucket storage "avatars" tersedia', icon: 'error', confirmButtonColor: '#672cb9' });
                             } finally {
                               setLoading(false);
                             }
                           }}
                           disabled={loading}
                           className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                         />
                         <Button variant="outline" type="button" className="h-full px-4" disabled={loading}>
                           Upload Foto
                         </Button>
                      </div>
                    </div>
                    <p className="text-xs text-[#9ca3af] mt-1 ml-1">Paste link url atau upload photo dari perangkat (Max 2MB, JPG/PNG).</p>
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

          {/* Tab Content Removed - Kept activeTab logic intact but unused for quota */}
        </AnimatePresence>
      </div>
    </div>
  );
}