'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { ArrowLeft, Loader2, FileText, Calendar, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';

export default function MaterialReader() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  
  const [material, setMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id && params.id) {
      fetchMaterial();
    } else if (isLoaded && user === null) {
      setLoading(false);
      setError('Sesi berakhir. Silakan login kembali.');
    }
  }, [user, params.id, isLoaded]);

  const fetchMaterial = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user?.id)
        .single();

      if (error) {
        throw error;
      }

      setMaterial(data);
    } catch (err: any) {
      console.error('Failed to load material:', err);
      setError('Materi tidak ditemukan atau Anda tidak memiliki akses.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <Loader2 size={40} className="text-[#672cb9] animate-spin" />
        <p className="text-gray-500 font-medium">Mempersiapkan materi Anda...</p>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-8 max-w-md mx-auto text-center gap-4">
        <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
          <FileText size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Oops! Terjadi Kesalahan</h2>
        <p className="text-gray-500">{error}</p>
        <Button variant="primary" onClick={() => router.push('/dashboard/library')} className="mt-4">
          Kembali ke Library
        </Button>
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
      {/* Header Sticky */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 shadow-sm flex items-center gap-4">
        <button 
          onClick={() => router.push('/dashboard/library')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          title="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 w-full truncate">
          <h1 className="font-bold text-gray-800 truncate text-lg">{material.title || 'Materi Pembelajaran'}</h1>
        </div>
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
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
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
              {material.ai_summary || "_Tidak ada rangkuman yang tersedia. Silakan upload ulang._"}
            </ReactMarkdown>
          </article>
        </div>
        
        {/* Bottom Actions (Quiz / Flashcard coming soon) */}
        <div className="mt-12 mb-20 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold opacity-60 cursor-not-allowed" disabled>
            Ikuti Quiz (Segera)
          </Button>
          <Button variant="outline" className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold opacity-60 cursor-not-allowed" disabled>
            Mode Flashcard (Segera)
          </Button>
        </div>

      </div>
    </div>
  );
}