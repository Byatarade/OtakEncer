'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Search, FolderPlus, FileText, Video, Link as LinkIcon, Layers, Sparkles, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LibraryCard, Material } from '@/components/library/LibraryCard';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useAuth();

  useEffect(() => {
    if (user?.id) {
      fetchMaterials();
    } else if (isLoaded && user === null) {
      setLoading(false);
    }
  }, [user, isLoaded]);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching materials:', error);
        return;
      }

      const colors = [
        'from-[#ff7e5f] to-[#feb47b]',
        'from-[#654ea3] to-[#eaafc8]',
        'from-[#00c6ff] to-[#0072ff]',
        'from-[#11998e] to-[#38ef7d]',
        'from-[#8A2387] to-[#E94057]',
        'from-[#f12711] to-[#f5af19]',
      ];

      const mappedMaterials: Material[] = (data || []).map((item, index) => {
        const coverColor = colors[index % colors.length];
        const dateObj = new Date(item.created_at);
        const formattedDate = isNaN(dateObj.getTime()) 
          ? 'Sekarang' 
          : dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

        return {
          id: item.id,
          title: item.title || 'Materi Tanpa Judul',
          type: item.source_type || 'other',
          date: formattedDate,
          readTime: item.ai_summary ? `${Math.max(1, Math.ceil(item.ai_summary.length / 1500))} min baca` : '3 min baca',
          source: item.source_type?.toUpperCase() || 'Sistem',
          coverColor: coverColor
        };
      });

      setMaterials(mappedMaterials);
    } catch (err) {
      console.error('Failed to load materials', err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'all', label: 'Semua Materi', icon: <Layers size={16} /> },
    { id: 'youtube', label: 'Video', icon: <Video size={16} /> },
    { id: 'pdf', label: 'Dokumen', icon: <FileText size={16} /> },
    { id: 'link', label: 'Artikel Web', icon: <LinkIcon size={16} /> },
  ];

  const filteredMaterials = materials.filter(m => {
    const matchesTab = activeTab === 'all' || m.type.toLowerCase().includes(activeTab);
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-full flex flex-col pt-6 md:pt-8 px-6 md:px-12 pb-24 w-full font-['Montserrat',sans-serif] overflow-x-hidden">
      
      {/* Hero Header Selection - Premium Redesign */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-[#672cb9] rounded-[32px] p-8 md:p-12 overflow-hidden mb-10 shadow-2xl shadow-[#672cb9]/20"
      >
        {/* Decorative Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none rounded-[32px]">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-400 opacity-20 rounded-full blur-[100px] mix-blend-screen"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-400 opacity-30 rounded-full blur-[100px] mix-blend-screen"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex-1 max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl text-white shadow-inner border border-white/10">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <span className="text-yellow-500 font-bold tracking-widest text-sm uppercase letter-spacing-2">
                library
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 leading-[1.15]"
            >
              Perpustakaan <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-400">Pintar</span> Anda
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-lg leading-relaxed max-w-xl font-medium"
            >
              Akses kembali semua modul pembelajaran, rangkuman, dan materi yang telah disusun oleh Neura AI dari berbagai sumber digital.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="shrink-0 flex items-center"
          >
            <Button 
              variant="primary" 
              size="lg" 
              leftIcon={<FolderPlus size={22} />}
              className="px-8 py-4 shadow-[0_0_40px_rgba(255,255,255,0.3)] group h-auto"
            >
              <span>Tambah Materi Baru</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Controls: Search and Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        
        {/* Animated Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar flex-nowrap shrink-0">
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap z-10 ${
                  activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-[#672cb9] rounded-xl -z-10 shadow-md shadow-[#672cb9]/30"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Input 
            icon={<Search size={18} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi..."
            className="lg:w-80"
          />
          <button className="flex items-center justify-center p-3 bg-white border border-gray-100 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm shrink-0 hover:text-[#672cb9]">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Dynamic Grid of Materials */}
      {loading ? (
        <div className="flex justify-center items-center py-20 flex-col gap-4">
          <Loader2 size={40} className="text-[#672cb9] animate-spin" />
          <p className="text-gray-500 font-medium">Memuat materi Anda...</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((material) => (
                <Link key={material.id} href={`/dashboard/library/${material.id}`} className="block">
                  <LibraryCard material={material} />
                </Link>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center"
              >
                <div className="w-24 h-24 mb-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <FolderPlus size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Belum ada materi</h3>
                <p className="text-gray-500 max-w-md">Klik "Tambah Materi Baru" untuk mulai menghasilkan rangkuman cerdas Anda.</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
      
      {/* Load More Button */}
      {filteredMaterials.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex justify-center"
        >
          <Button variant="outline" size="lg" className="group">
            <span>Muat Lebih Banyak</span>
            <Search size={16} className="text-gray-400 group-hover:text-[#672cb9] transition-colors" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
