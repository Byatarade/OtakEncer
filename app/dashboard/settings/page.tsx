'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Save, Mail, Camera, Loader2, ArrowLeft, X, Crop } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Swal from 'sweetalert2';
import Link from 'next/link';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/get-cropped-img';

export default function SettingsPage() {
  const { user, isLoaded } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);

  // Cropper states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  
  // Types for react-easy-crop
  type Area = { x: number; y: number; width: number; height: number };
  
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({ title: 'Terlalu Besar', text: 'Ukuran foto maksimal 2MB', icon: 'error', confirmButtonColor: '#672cb9' });
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
      
      const ext = 'jpeg'; // converted to jpeg by getCroppedImg
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
      Swal.fire({ title: 'Gagal', text: 'Gagal mengupload foto', icon: 'error', confirmButtonColor: '#672cb9' });
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
      // Update profile di auth
      const { data: authData, error } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          avatar_url: avatar
        }
      });

      if (error) throw error;

      // Langsung update ke tabel user_streaks & quiz_scores (butuh RLS policy yang tepat)
      const userId = (authData.user || user)?.id;
      if (userId) {
        // Sync ke user_streaks
        await supabase
          .from('user_streaks')
          .update({ user_name: name, user_avatar: avatar })
          .eq('user_id', userId);

        // Sync ke quiz_scores
        await supabase
          .from('quiz_scores')
          .update({ user_name: name, user_avatar: avatar })
          .eq('user_id', userId);
      }
      
      // Jika perlu, trigger API route as fallback (optional)
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
    <div className="min-h-full flex flex-col md:flex-row pt-6 md:pt-12 px-6 md:px-12 pb-24 max-w-[1240px] mx-auto w-full font-montserrat gap-8 overflow-x-hidden">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-[280px] shrink-0">
        <div className="sticky top-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b7280] hover:text-[#672cb9] transition-colors mb-4 group">
              <div className="bg-[#f3f4f6] p-1.5 rounded-full group-hover:bg-[#f5f3ff] transition-colors">
                <ArrowLeft size={16} />
              </div>
              Kembali ke Dashboard
            </Link>
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
                    <div className="flex-1 min-w-0">
                      <h2 className="text-[#111827] font-bold text-xl mb-0.5 truncate">{name || 'Pengguna'}</h2>
                      <p className="text-[#6b7280] text-sm flex items-center gap-1.5 font-medium truncate">
                        <Mail size={14} className="text-[#9ca3af] shrink-0"/> 
                        <span className="truncate">{user?.email}</span>
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
                    <div className="space-y-2 min-w-0">
                      <label className="text-[13px] font-bold text-[#4b5563] uppercase tracking-wide block truncate">Nama Lengkap</label>
                      <Input 
                        icon={<User size={18} />}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Cth: John Doe"
                        required
                        className="bg-[#f9fafb] border-[#e5e7eb] focus:bg-white min-w-0"
                      />
                    </div>

                    <div className="space-y-2 min-w-0">
                      <label className="text-[13px] font-bold text-[#4b5563] uppercase tracking-wide block truncate">Alamat Email <span className="opacity-50 lowercase tracking-normal font-normal inline-block max-w-full truncate align-bottom">(Read only)</span></label>
                      <Input 
                        icon={<Mail size={18} />}
                        value={user?.email || ''}
                        disabled
                        className="bg-[#f3f4f6] text-[#9ca3af] border-transparent cursor-not-allowed min-w-0 truncate"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 max-w-3xl min-w-0">
                    <label className="text-[13px] font-bold text-[#4b5563] uppercase tracking-wide block truncate">Avatar (URL atau Upload Image)</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input 
                        icon={<Camera size={18} />}
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        placeholder="https://... image.jpg"
                        className="bg-[#f9fafb] border-[#e5e7eb] focus:bg-white flex-1 min-w-0 truncate"
                      />
                      <div className="relative overflow-hidden shrink-0 h-[48px] sm:h-auto">
                         <input 
                           type="file" 
                           accept="image/png, image/jpeg, image/jpg, image/webp"
                           onChange={handleFileChange}
                           ref={fileInputRef}
                           disabled={loading}
                           className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                         />
                         <Button variant="outline" type="button" className="h-full w-full sm:w-auto px-4" disabled={loading}>
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