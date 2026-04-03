'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, FolderPlus, FileText, Video, 
  Link as LinkIcon, Clock, Filter, Sparkles, 
  MoreVertical, FileType2, Headphones, Layers, LayoutGrid
} from 'lucide-react';

const dummyMaterials = [
  { 
    id: 1, 
    title: 'Sejarah Kemerdekaan Indonesia - Penjajahan Belanda hingga Proklamasi', 
    type: 'youtube', 
    date: '24 Mar 2026', 
    readTime: '12 min baca', 
    source: 'Channel SejarahKita',
    coverColor: 'from-[#ff7e5f] to-[#feb47b]' // Warm sunset
  },
  { 
    id: 2, 
    title: 'Sistem Pencernaan Manusia Lengkap beserta Fungsinya', 
    type: 'pdf', 
    date: '21 Mar 2026', 
    readTime: '8 min baca', 
    source: 'Buku_Biologi_SMA_Bab_4.pdf',
    coverColor: 'from-[#654ea3] to-[#eaafc8]' // Purple to pink (Matches theme well)
  },
  { 
    id: 3, 
    title: 'Memahami Hukum Newton 1, 2, dan 3 dengan Contoh Sehari-hari', 
    type: 'youtube', 
    date: '18 Mar 2026', 
    readTime: '15 min baca', 
    source: 'Fisika Asik',
    coverColor: 'from-[#00c6ff] to-[#0072ff]' // Bright blue
  },
  { 
    id: 4, 
    title: 'Rangkuman Web Artikel: Pengantar Artificial Intelligence untuk Pemula', 
    type: 'link', 
    date: '10 Mar 2026', 
    readTime: '5 min baca', 
    source: 'Medium - TechBlog',
    coverColor: 'from-[#11998e] to-[#38ef7d]' // Fresh green
  },
  { 
    id: 5, 
    title: 'Modul Bahasa Indonesia: Teks Eksposisi dan Teks Anekdot', 
    type: 'pdf', 
    date: '05 Mar 2026', 
    readTime: '20 min baca', 
    source: 'Modul_Bahasa_Indonesia_XII.pdf',
    coverColor: 'from-[#8A2387] to-[#E94057]' // Vibrant magenta to orange
  },
  { 
    id: 6, 
    title: 'Podcast: Apa itu Generative AI dan Bagaimana Ia Bekerja', 
    type: 'youtube', 
    date: '28 Feb 2026', 
    readTime: '10 min baca', 
    source: 'Tech Talk Daily',
    coverColor: 'from-[#f12711] to-[#f5af19]' // Fire gradient
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'all', label: 'Semua Materi', icon: <Layers size={16} /> },
    { id: 'youtube', label: 'Video', icon: <Video size={16} /> },
    { id: 'pdf', label: 'Dokumen', icon: <FileText size={16} /> },
    { id: 'link', label: 'Artikel Web', icon: <LinkIcon size={16} /> },
  ];

  const filteredMaterials = dummyMaterials.filter(m => {
    const matchesTab = activeTab === 'all' || m.type === activeTab;
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'youtube': return <Video size={14} className="text-white" />;
      case 'pdf': return <FileType2 size={14} className="text-white" />;
      case 'link': return <LinkIcon size={14} className="text-white" />;
      default: return <FileText size={14} className="text-white" />;
    }
  };

  const getCardOverlayIcon = (type: string) => {
    switch(type) {
      case 'youtube': return <Video size={24} className="text-white/80" />;
      case 'pdf': return <FileText size={24} className="text-white/80" />;
      case 'link': return <LayoutGrid size={24} className="text-white/80" />;
      default: return <FileText size={24} className="text-white/80" />;
    }
  };

  return (
    <div className="min-h-full flex flex-col pt-6 md:pt-8 px-6 md:px-12 pb-24 max-w-[1600px] mx-auto w-full">
      
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
            <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#672cb9] rounded-2xl hover:bg-gray-50 font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)] group">
              <FolderPlus size={22} className="group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-[16px]">Tambah Materi Baru</span>
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Controls: Search and Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        
        {/* Animated Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0 flex-nowrap shrink-0">
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
          <div className="relative group flex-1 lg:w-80">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400 group-focus-within:text-[#672cb9] transition-colors" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#672cb9]/10 focus:border-[#672cb9]/30 shadow-sm transition-all text-gray-700 placeholder:text-gray-400 font-medium text-sm"
            />
          </div>
          <button className="flex items-center justify-center p-3 bg-white border border-gray-100 text-gray-600 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm shrink-0 hover:text-[#672cb9]">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Dynamic Grid of Materials */}
      <AnimatePresence mode="popLayout">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((material) => (
              <motion.div 
                layout
                variants={itemVariants}
                key={material.id} 
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-[24px] overflow-hidden border border-gray-100/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_-15px_rgba(103,44,185,0.15)] transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Premium Thumbnail Header */}
                <div className={`relative h-44 w-full bg-gradient-to-br ${material.coverColor} p-5 flex flex-col justify-between overflow-hidden`}>
                  
                  {/* Glass overlays and animated blobs */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  {/* Top bar inside thumbnail */}
                  <div className="relative z-10 flex justify-between items-start w-full">
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-white shadow-sm border border-white/20">
                      {getIcon(material.type)}
                      <span className="text-[10px] font-bold uppercase tracking-wider">{material.type}</span>
                    </div>
                    <button className="text-white hover:text-white transition-colors bg-white/10 hover:bg-white/30 p-2 rounded-full backdrop-blur-md border border-white/10">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  
                  {/* Center Icon Decoration */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-md p-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 shadow-xl border border-white/10">
                     {getCardOverlayIcon(material.type)}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col bg-white">
                  <h3 className="font-bold text-gray-800 text-[16px] mb-3 line-clamp-2 leading-relaxed group-hover:text-[#672cb9] transition-colors">
                    {material.title}
                  </h3>
                  
                  <div className="text-gray-500 text-sm mb-6 flex items-center gap-2 pb-5 border-b border-gray-50/80 mt-auto">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <Search size={12} className="text-gray-400" />
                    </div>
                    <span className="font-medium text-gray-600 truncate">{material.source}</span>
                  </div>
                  
                  {/* Footer data */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold">
                      <Clock size={14} className="text-[#672cb9]/60" />
                      <span>{material.readTime}</span>
                    </div>
                    <div className="text-gray-400 text-[11px] font-bold tracking-wide uppercase">
                      {material.date}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center"
            >
              <div className="w-24 h-24 mb-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <Search size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Materi tidak ditemukan</h3>
              <p className="text-gray-500 max-w-md">Tidak ada materi yang cocok dengan pencarian atau filter yang Anda pilih. Coba gunakan kata kunci lain.</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Load More Button */}
      {filteredMaterials.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex justify-center"
        >
          <button className="group flex items-center gap-2 px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md">
            <span>Muat Lebih Banyak</span>
            <Search size={16} className="text-gray-400 group-hover:text-[#672cb9] transition-colors" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
