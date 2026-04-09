'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, FileText, Calendar, Clock, Share2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface MaterialRecord {
  id: string;
  title: string;
  source_type: string;
  ai_summary: string | null;
  created_at: string;
}

export default function SharedMaterialReader() {
  const params = useParams();
  
  const [material, setMaterial] = useState<MaterialRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSharedMaterial = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/share/${params.id}`);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal memuat materi.');
      }

      const { data } = await res.json();
      setMaterial(data as MaterialRecord);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Materi tidak ditemukan atau Anda tidak memiliki akses.';
      console.warn('Failed to load shared material:', message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchSharedMaterial();
    }
  }, [params.id, fetchSharedMaterial]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4 font-['Montserrat',sans-serif]">
        <Loader2 size={40} className="text-[#672cb9] animate-spin" />
        <p className="text-gray-500 font-medium">Mempersiapkan materi yang dibagikan...</p>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-8 max-w-md mx-auto text-center gap-4 font-['Montserrat',sans-serif]">
        <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <FileText size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Materi Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-4">{error}</p>
        <Link href="/">
          <Button variant="primary" className="mt-4 px-8 py-2.5 rounded-full shadow-md">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    );
  }

  const dateObj = new Date(material.created_at);
  const formattedDate = isNaN(dateObj.getTime()) 
    ? 'Sekarang' 
    : dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const readTime = Math.max(1, Math.ceil((material.ai_summary?.length || 0) / 1500));

  return (
    <div className="min-h-full bg-[#f8f9fc] pb-24 font-['Montserrat',sans-serif]">
      {/* Header Sticky - Public View Mode */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full truncate">
           <div className="bg-[#672cb9]/10 p-2 rounded-lg shrink-0">
             <Share2 size={18} className="text-[#672cb9]" />
           </div>
           <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Shared with you</p>
              <h1 className="font-bold text-gray-800 truncate text-sm sm:text-base">{material.title || 'Materi Pembelajaran'}</h1>
           </div>
        </div>
        
        {/* Call to Action for Public Users */}
        <Link href="/login" className="shrink-0">
          <Button className="bg-[#672cb9] hover:bg-[#5a24a3] text-white rounded-full text-xs sm:text-sm shadow-md flex items-center gap-2">
            <Sparkles size={14} className="hidden sm:inline-block" />
            Bikin milikmu sendiri
          </Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-10">
        
        {/* Title Block */}
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center justify-center gap-2 bg-[#672cb9]/10 text-[#672cb9] px-4 py-1.5 rounded-full font-bold text-xs tracking-widest uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-[#672cb9] animate-pulse"></span>
            Rangkuman Cerdas AI
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
            {material.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-500 font-medium text-sm">
            <span className="flex items-center gap-1.5"><Calendar size={16} /> {formattedDate}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            <span className="flex items-center gap-1.5"><Clock size={16} /> {readTime} Menit Baca</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-md font-bold uppercase text-[10px] tracking-wider border border-gray-200">
              {material.source_type}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative">
          
          {/* Read Only Watermark */}
          <div className="absolute top-0 right-0 p-4 opacity-50 pointer-events-none select-none">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-200 rounded px-2 py-1 bg-gray-50">Read Only</span>
          </div>

          <article className="prose md:prose-lg prose-blue max-w-none text-gray-700
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b prose-h2:pb-3 prose-h2:mt-10
            prose-h3:text-xl
            prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-[#672cb9] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-extrabold
            prose-ul:list-disc prose-ol:list-decimal prose-li:my-2
            prose-blockquote:border-l-4 prose-blockquote:border-[#672cb9] prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:italic prose-blockquote:rounded-r-lg
            prose-img:rounded-2xl prose-img:shadow-lg
            marker:text-[#672cb9]
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {material.ai_summary || "_Tidak ada rangkuman yang tersedia._"}
            </ReactMarkdown>
          </article>
        </div>
        
        {/* Footer CTA */}
        <div className="mt-16 mb-10 text-center">
           <div className="w-16 h-1 bg-gray-200 rounded-full mx-auto mb-8"></div>
           <h3 className="text-xl font-bold text-gray-800 mb-3">Suka dengan hasil OtakEncer?</h3>
           <p className="text-gray-500 mb-6 max-w-md mx-auto">Buat akun sekarang untuk mengubah semua dokumen, PDF, dan video YouTube Anda menjadi materi belajar pintar.</p>
           <Link href="/login">
             <Button variant="primary" className="px-8 py-3 rounded-full shadow-lg shadow-[#672cb9]/20 hover:shadow-[#672cb9]/40 hover:-translate-y-1 transition-all">
               Daftar Gratis Sekarang
             </Button>
           </Link>
        </div>

      </div>
    </div>
  );
}
