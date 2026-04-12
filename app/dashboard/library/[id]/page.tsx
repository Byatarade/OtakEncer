'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { ArrowLeft, Loader2, FileText, Calendar, Clock, Download, BookOpen, Layers, ListTodo, ChevronLeft, ChevronRight, RefreshCcw, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { jsPDF } from 'jspdf';
import NeuraSidebar from '@/components/library/NeuraSidebar';

export interface QuizItem {
  question: string;
  options: string[];
  answer: string;
}

export interface FlashcardItem {
  front: string;
  back: string;
}

interface Material {
  id: string;
  title: string;
  source_type: string;
  ai_summary: string | null;
  ai_quiz: QuizItem[] | null;
  ai_flashcard: FlashcardItem[] | null;
  created_at: string;
  user_id: string;
}

export default function MaterialReader() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useAuth();
  
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'materi' | 'quiz' | 'flashcard'>('materi');
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // States for Quiz & Flashcards
  const [activeQuizQuestion, setActiveQuizQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeCardData, setActiveCardData] = useState(0);
  const [generatingInteractive, setGeneratingInteractive] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  // States for Ask Neura
  const [isNeuraSidebarOpen, setIsNeuraSidebarOpen] = useState(false);
  const [initialNeuraQuery, setInitialNeuraQuery] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [askNeuraPos, setAskNeuraPos] = useState<{ x: number, y: number } | null>(null);

  const fetchInteractiveMedia = useCallback(async (type: 'quiz' | 'flashcard') => {
    if (!material) return;

    // Cek apakah database Supabase sudah menyimpan JSON sebelumnya. Jika sudah, langsung pakai state lokal (tidak usah panggil API!).
    if (type === 'quiz' && material.ai_quiz && material.ai_quiz.length > 0) return;
    if (type === 'flashcard' && material.ai_flashcard && material.ai_flashcard.length > 0) return;

    setGeneratingInteractive(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/generate-interactive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ material_id: material.id, type })
      });

      const body = await response.json();
      
      if (!response.ok) throw new Error(body.error || 'Server error');
      
      // Update state data jika generate sukses agar JSON-nya tidak null
      if (type === 'quiz') {
         setMaterial(prev => prev ? { ...prev, ai_quiz: body.data } : prev);
      } else {
         setMaterial(prev => prev ? { ...prev, ai_flashcard: body.data } : prev);
      }

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn("Gagal membuat aset interaktif", message);
      alert(`Oops, kami gagal meracik ${type}.. AI mungkin sedang sangat sibuk. Silakan coba sebentar lagi.`);
      setActiveTab('materi');
    } finally {
      setGeneratingInteractive(false);
    }
  }, [material]);

  const submitQuizResult = async (score: number) => {
    if (!material || !user) return;
    setSubmitMessage(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/submit-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          material_id: material.id,
          score: score,
          user_id: user.id,
          user_name: user.name || 'Pemain',
          user_avatar: user.picture || ''
        })
      });
      const data = await res.json();
      if (!res.ok) {
         setSubmitMessage(`Database Error: ${data.error || 'Server menolak request'}`);
      } else {
         setSubmitMessage(data.message);
      }
    } catch (err: unknown) {
      console.error('Submit Quiz Result Error:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      setSubmitMessage(`Koneksi Gagal: ${message}`);
    }
  };

  useEffect(() => {
     if (activeTab === 'quiz') fetchInteractiveMedia('quiz');
     else if (activeTab === 'flashcard') fetchInteractiveMedia('flashcard');
  }, [activeTab, fetchInteractiveMedia]);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('materials')
          .select('*')
          .eq('id', params.id)
          .eq('user_id', user?.id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          setError('Materi tidak ditemukan atau Anda tidak memiliki akses.');
          return;
        }

        setMaterial(data as Material);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn('Failed to load material:', message);
        setError('Materi tidak ditemukan atau Anda tidak memiliki akses.');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && params.id) {
      fetchMaterial();
    } else if (isLoaded && user === null) {
      setLoading(false);
      setError('Sesi berakhir. Silakan login kembali.');
    }
  }, [user, params.id, isLoaded]);

  const handleTextSelection = () => {
    if (activeTab !== 'materi') return;
    
    // Tunggu event sinkron selesai
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim().length > 0) {
        const text = selection.toString().trim();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Cek apakah posisi masuk akal (tidak di luar view)
        if (rect.width > 0 && rect.height > 0) {
          setSelectedText(text);
          setAskNeuraPos({
            x: rect.left + rect.width / 2,
            y: rect.top - 10
          });
        }
      } else {
        setSelectedText(null);
        setAskNeuraPos(null);
      }
    }, 10);
  };

  const handleAskNeura = () => {
    if (selectedText) {
      setInitialNeuraQuery(selectedText);
      setIsNeuraSidebarOpen(true);
      setSelectedText(null);
      setAskNeuraPos(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleDownloadPDF = async () => {
    if (!material) return;
    try {
      setIsDownloading(true);
      
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let cursorY = margin;

      // Titile
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      const titleLines = doc.splitTextToSize(material.title || 'Materi Belajar', pageWidth - 2 * margin);
      doc.text(titleLines, margin, cursorY);
      cursorY += (titleLines.length * 8) + 10;

      // Content
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      
      const blocks = (material.ai_summary || '').split('\n').filter(Boolean);
      
      for (let i = 0; i < blocks.length; i++) {
        let text = blocks[i].replace(/[\*\_]+/g, ''); // Simple strip Markdown
        let isHeading = false;
        
        if (text.startsWith('# ')) {
          isHeading = true;
          text = text.substring(2);
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          cursorY += 5; // Extra spacing before heading
        } else if (text.startsWith('## ')) {
          isHeading = true;
          text = text.substring(3);
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          cursorY += 5;
        } else {
          doc.setFontSize(12);
          doc.setFont("helvetica", "normal");
        }
        
        const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
        
        // Loop through lines to check page breaks
        for (let j = 0; j < lines.length; j++) {
           if (cursorY + 10 > pageHeight - margin) {
             doc.addPage();
             cursorY = margin;
           }
           doc.text(lines[j], margin, cursorY);
           cursorY += isHeading ? 8 : 7;
        }
        
        cursorY += 3; // Space between paragraphs
      }

      doc.save(`${material.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'Materi_Belajar'}.pdf`);
      setIsDownloadModalOpen(false);
    } catch (error) {
      console.error('Gagal mendownload PDF:', error);
      alert('Terjadi kesalahan saat mendownload PDF.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadDOCX = async () => {
    if (!material) return;
    setIsDownloading(true);
    try {
      // Dynamic import docx to prevent excessive bundle size
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');

      const blocks = (material.ai_summary || '').split('\n').filter(Boolean);
      
      const paragraphs = blocks.map(block => {
        const text = block.replace(/[\*\_]+/g, ''); // Simple strip markdown
        let isHeading = false;
        let pText = text;
        if (block.startsWith('# ')) {
          isHeading = true;
          pText = text.substring(2);
        } else if (block.startsWith('## ')) {
          isHeading = true;
          pText = text.substring(3);
        }

        return new Paragraph({
          children: [
            new TextRun({
              text: pText,
              bold: isHeading || block.includes('**'),
              size: isHeading ? 32 : 24
            })
          ],
          heading: isHeading ? HeadingLevel.HEADING_2 : undefined,
          spacing: { after: 200 }
        });
      });

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: material.title || 'Materi Belajar',
                  bold: true,
                  size: 48
                })
              ],
              heading: HeadingLevel.TITLE,
              spacing: { after: 400 }
            }),
            ...paragraphs
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${material.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'Materi_Belajar'}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setIsDownloadModalOpen(false);
    } catch (error) {
      console.error('Gagal mendownload DOCX:', error);
      alert('Terjadi kesalahan saat mendownload DOCX.');
    } finally {
      setIsDownloading(false);
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
        <Button onClick={() => router.push('/dashboard/library')} className="mt-4 bg-[#672cb9] hover:bg-[#56219c]">
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
    <div className="flex h-full w-full font-montserrat bg-white overflow-hidden relative">
      
      {/* Kolom Kiri: Sidebar Khusus Materi (Collapsible, Rounded, Hover to expand) */}
      <aside className="bg-[#672cb9] text-white my-4 mx-4 rounded-[30px] hidden md:flex flex-col relative z-20 shrink-0 py-6 transition-all duration-300 ease-in-out overflow-hidden hover:w-[280px] w-[88px] group shadow-xl hover:shadow-2xl">
        
        {/* Header Tombol Kembali */}
        <div className="px-4 mb-8">
          <button 
            onClick={() => router.push('/dashboard/library')}
            className="flex items-center text-white/80 hover:text-white hover:bg-white/10 transition-colors font-semibold text-sm group/back h-12 w-full rounded-2xl overflow-hidden"
            title="Kembali ke Library"
          >
            <span className="w-14 flex items-center justify-center shrink-0">
              <ArrowLeft size={20} />
            </span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Kembali ke Library</span>
          </button>
        </div>

        {/* Info Materi Singkat */}
        <div className="px-6 mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          <h2 className="font-bold text-white text-lg leading-tight truncate" title={material.title}>
            {material.title || 'Materi Tanpa Judul'}
          </h2>
          <div className="flex items-center gap-2 mt-2 text-xs text-white/60 font-medium">
             <span>{readTime} Min</span>
             <span className="w-1 h-1 rounded-full bg-white/30"></span>
             <span className="uppercase">{material.source_type}</span>
          </div>
        </div>

        {/* Navigasi Sub-Tab */}
        <nav className="flex-1 flex flex-col px-3 space-y-2">
          <TabButton 
            active={activeTab === 'materi'} 
            onClick={() => setActiveTab('materi')} 
            icon={<BookOpen size={22} />} 
          >
            Materi
          </TabButton>
          <TabButton
            active={activeTab === 'quiz'}
            onClick={() => setActiveTab('quiz')}
            icon={<ListTodo size={22} />}
          >
            <span className="flex-1">Quiz</span>
          </TabButton>
          <TabButton
            active={activeTab === 'flashcard'}
            onClick={() => setActiveTab('flashcard')}
            icon={<Layers size={22} />}
          >
            <span className="flex-1">Flashcard</span>
          </TabButton>
        </nav>

        {/* Action Bottom */}
        <div className="px-3 mt-auto">
           <button 
             onClick={() => setIsDownloadModalOpen(true)}
             disabled={isDownloading || activeTab !== 'materi'}
             className="w-full flex items-center hover:bg-white text-white hover:text-[#672cb9] disabled:opacity-50 disabled:cursor-not-allowed group/btn rounded-2xl p-3 font-bold transition-all overflow-hidden"
             title="Download Materi"
           >
             <span className="w-10 flex items-center justify-center shrink-0">
               {isDownloading ? <Loader2 size={24} className="animate-spin" /> : <Download size={24} />}
             </span>
             <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Download Materi</span>
           </button>
        </div>
      </aside>

      {/* Mobile Floating Bottom Navbar */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-sm bg-[#672cb9] rounded-[28px] z-40 p-2 flex items-center justify-between shadow-[0_8px_30px_rgb(103,44,185,0.4)]">
        <button 
          onClick={() => router.push('/dashboard/library')}
          className="p-3 text-white hover:text-gray-200 transition-colors ml-1"
        >
          <ArrowLeft size={22} />
        </button>
        
        <div className="flex items-center gap-1 px-2">
          <button
            onClick={() => setActiveTab('materi')}
            className={`flex items-center justify-center transition-all duration-300 ${activeTab === 'materi' ? 'bg-white text-[#672cb9] shadow-sm rounded-[20px] w-16 h-12' : 'text-white/70 hover:text-white w-12 h-12 rounded-[20px]'}`}
          >
            <BookOpen size={22} />
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center justify-center transition-all duration-300 ${activeTab === 'quiz' ? 'bg-white text-[#672cb9] shadow-sm rounded-[20px] w-16 h-12' : 'text-white/70 hover:text-white w-12 h-12 rounded-[20px]'}`}
          >
            <ListTodo size={22} />
          </button>

          <button
            onClick={() => setActiveTab('flashcard')}
            className={`flex items-center justify-center transition-all duration-300 ${activeTab === 'flashcard' ? 'bg-white text-[#672cb9] shadow-sm rounded-[20px] w-16 h-12' : 'text-white/70 hover:text-white w-12 h-12 rounded-[20px]'}`}
          >
            <Layers size={22} />
          </button>
        </div>

        <button 
          onClick={() => setIsDownloadModalOpen(true)}
          disabled={isDownloading || activeTab !== 'materi'}
          className="p-3 text-white hover:text-gray-200 disabled:opacity-50 transition-colors mr-1"
        >
          {isDownloading ? <Loader2 size={22} className="animate-spin" /> : <Download size={22} />}
        </button>
      </div>

      {/* Kolom Kanan: Area Baca Ergonomis */}
      <main 
        className="flex-1 min-w-0 h-full overflow-y-auto overflow-x-hidden content-area-scroll pb-24 md:pb-0 relative bg-white md:ml-2 md:scroll-smooth w-full"
        onMouseUp={handleTextSelection}
        onTouchEnd={handleTextSelection}
      >
        
        {/* Floating Ask Neura Button */}
        {selectedText && askNeuraPos && (
          <div 
            className="fixed z-50 transform -translate-x-1/2 -translate-y-full pb-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
            style={{ left: askNeuraPos.x, top: askNeuraPos.y }}
            onMouseDown={(e) => e.preventDefault()} // Mencegah klik menghilangkan seleksi teks
          >
            <button
              onClick={handleAskNeura}
              className="bg-[#672cb9] text-white shadow-xl hover:bg-[#522199] transition-all duration-300 rounded-full px-4 py-2.5 flex items-center gap-2 font-bold text-sm border-2 border-white cursor-pointer"
            >
              <Sparkles size={16} className="text-yellow-300 mr-1" />
              Ask to Neura
            </button>
            {/* Arrow/Triangle pointing down */}
            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-[#672cb9] border-r-2 border-b-2 border-white"></div>
          </div>
        )}

        {activeTab === 'materi' && (
          <div className="max-w-[760px] mx-auto px-6 md:px-12 py-10 md:py-16">
            <div ref={contentRef} className="bg-white pdf-content-wrapper">
              {/* Header Materi Bacaan */}
              <div className="mb-12 border-b border-gray-100 pb-8">
                <div className="flex items-center gap-2 text-[#672cb9] font-bold text-xs uppercase tracking-widest mb-4">
                  <BookOpen size={16} /> Rangkuman Cerdas
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6 break-words hyphens-auto">
                  {material.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-500 font-medium text-sm">
                  <span className="flex items-center gap-1.5"><Calendar size={16} /> {formattedDate}</span>
                  <span className="flex items-center gap-1.5"><Clock size={16} /> {readTime} Menit Aktual Baca</span>
                </div>
              </div>

              {/* Konten Ergonomis, menghilangkan kesan "kertas statis ditengah" */}
              <article className="prose md:prose-lg prose-gray max-w-none w-full text-gray-800 break-words overflow-hidden
                prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight prose-headings:break-words
                prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-2 prose-h2:mt-12
                prose-h3:text-xl
                prose-p:leading-[1.9] prose-p:mb-6 prose-p:text-[17px] prose-p:break-words
                prose-a:text-[#672cb9] prose-a:font-semibold prose-a:underline-offset-4 hover:prose-a:text-[#56219c] prose-a:break-all
                prose-strong:text-gray-900 prose-strong:font-bold
                prose-ul:list-disc prose-ol:list-decimal prose-li:my-2 prose-li:leading-[1.9] prose-li:break-words
                prose-blockquote:border-l-4 prose-blockquote:border-[#672cb9] prose-blockquote:bg-[#672cb9]/5 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:italic prose-blockquote:rounded-r-xl prose-blockquote:text-gray-700
                prose-img:rounded-3xl prose-img:shadow-sm prose-img:border prose-img:border-gray-100 prose-img:max-w-full
                prose-pre:max-w-full prose-pre:overflow-x-auto
                prose-table:overflow-x-auto prose-table:block prose-table:max-w-full
                marker:text-[#672cb9]
              ">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {material.ai_summary || "_Tidak ada rangkuman yang tersedia. Silakan upload ulang._"}
                </ReactMarkdown>
              </article>
            </div>
          </div>
        )}

        {/* UI untuk Quiz */}
        {activeTab === 'quiz' && (
          <div className="flex flex-col items-center justify-start h-full text-center pt-6 pb-[140px] px-4 sm:px-12 overflow-y-auto overflow-x-hidden min-w-0 w-full page-scroll">
            {generatingInteractive ? (
              <div className="flex flex-col items-center justify-center mt-32 gap-6">
                 <Loader2 size={48} className="text-[#672cb9] animate-spin mb-4" />
                 <h2 className="text-2xl font-bold animate-pulse text-gray-800">Menyusun Soal Ujian...</h2>
                 <p className="text-gray-500">Membaca materi Anda dan mengekstrak pertanyaan pintar...</p>
                 <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden mt-4">
                     <div className="h-full bg-gradient-to-r from-[#672cb9] to-[#8c4ae1] animate-pulse rounded-full w-full"></div>
                 </div>
              </div>
            ) : material?.ai_quiz && material.ai_quiz.length > 0 ? (
              <div className="w-full max-w-3xl mx-auto mt-8 relative">
                 {quizScore !== null ? (
                   <div className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center animate-in fade-in zoom-in duration-500">
                     <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                       <span className="text-4xl font-bold text-green-600">
                         {Math.round((quizScore / material.ai_quiz.length) * 100)}
                       </span>
                     </div>
                     <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Quiz Selesai!</h2>
                     <p className="text-gray-600 text-lg mb-8">
                       Anda berhasil menjawab {quizScore} dari {material.ai_quiz.length} pertanyaan dengan benar. ({(quizScore / material.ai_quiz.length) * 100} Poin)
                     </p>

                     {submitMessage && (
                       <div className="bg-blue-50 text-blue-600 rounded-lg p-3 text-sm font-medium mb-6 mx-4">
                         {submitMessage}
                       </div>
                     )}
                     
                     <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 px-2">
                       <Button 
                         onClick={() => { setQuizScore(null); setActiveQuizQuestion(0); setQuizAnswers({}); setSubmitMessage(null); }}
                         className="w-full sm:w-auto bg-[#672cb9] hover:bg-[#56219c] text-white font-semibold flex items-center justify-center gap-2 rounded-xl py-6 px-6 sm:px-8 border shadow-sm"
                       >
                         <ListTodo size={20} /> Coba Ulang
                       </Button>
                       <Button 
                         variant="outline" 
                         className="w-full sm:w-auto border-gray-200 hover:bg-gray-50 font-semibold flex items-center justify-center rounded-xl py-6 px-6 sm:px-8 text-gray-700 shadow-sm"
                         onClick={() => setActiveTab('materi')}
                       >
                         Kembali Baca
                       </Button>
                     </div>
                   </div>
                 ) : (
                   <div className="text-left w-full h-full flex flex-col justify-center min-h-[400px] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     
                     {/* Progress Bar & Header */}
                     <div className="flex items-center justify-between mb-6">
                       <h3 className="text-xl font-bold text-gray-800">
                         Pertanyaan {activeQuizQuestion + 1} <span className="text-gray-400 text-base font-medium">/ {material.ai_quiz.length}</span>
                       </h3>
                       <div className="flex space-x-1 border border-gray-100 px-3 py-2 rounded-xl bg-gray-50/50">
                         {material.ai_quiz.map((_, i) => (
                           <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === activeQuizQuestion ? 'w-6 bg-[#672cb9]' : i < activeQuizQuestion ? 'w-2 bg-[#672cb9]/40' : 'w-2 bg-gray-200'}`} />
                         ))}
                       </div>
                     </div>

                     <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex-1">
                       <h2 className="text-xl font-bold text-gray-900 leading-snug mb-5 w-full p-2 py-3 sm:py-4 bg-gray-50/50 rounded-2xl px-5 border-l-4 border-[#672cb9]">
                         {material.ai_quiz[activeQuizQuestion]?.question}
                       </h2>
                       
                       <div className="space-y-3">
                         {material.ai_quiz[activeQuizQuestion]?.options?.map((option: string, i: number) => {
                           const isSelected = quizAnswers[activeQuizQuestion] === option;
                           return (
                             <button
                               key={i}
                               onClick={() => setQuizAnswers(prev => ({ ...prev, [activeQuizQuestion]: option }))}
                               className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 font-medium text-[14px] sm:text-[15px] leading-relaxed flex items-center justify-between group ${
                                 isSelected 
                                   ? 'border-[#672cb9] bg-[#672cb9]/5 text-[#672cb9] shadow-sm transform scale-[1.01]' 
                                   : 'border-gray-100 hover:border-[#672cb9]/30 hover:bg-gray-50 text-gray-700'
                               }`}
                             >
                                <div className="flex items-center gap-3 md:gap-4">
                                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                    isSelected ? 'border-[#672cb9] bg-[#672cb9] text-white' : 'border-gray-200 text-gray-400 group-hover:border-[#672cb9]/30 group-hover:text-[#672cb9]/50'
                                  }`}>
                                    {String.fromCharCode(65 + i)}
                                  </div>
                                  <span className="leading-snug">{option}</span>
                                </div>
                                {isSelected && (
                                  <div className="w-5 h-5 bg-[#672cb9] rounded-full flex items-center justify-center shrink-0">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                )}
                             </button>
                           );
                         })}
                       </div>
                     </div>

                     <div className={`flex flex-col-reverse sm:flex-row items-center w-full mt-6 gap-3 sm:gap-0 ${activeQuizQuestion > 0 ? 'sm:justify-between' : 'sm:justify-end'}`}>
                       {activeQuizQuestion > 0 && (
                         <Button 
                           variant="ghost" 
                           className="w-full sm:w-auto text-gray-500 hover:bg-gray-100 rounded-xl px-6 h-12"
                           onClick={() => setActiveQuizQuestion(i => Math.max(0, i - 1))}
                         >
                           <ChevronLeft size={18} className="mr-2" /> Sebelumnya
                         </Button>
                       )}

                       {activeQuizQuestion === material.ai_quiz.length - 1 ? (
                         <Button
                           disabled={!quizAnswers[activeQuizQuestion]}
                           onClick={() => {
                             // Hitung Nilai Akhir
                             let score = 0;
                              material.ai_quiz?.forEach((q: QuizItem, i: number) => {
                               if (quizAnswers[i] === q.answer) score++;
                             });
                             setQuizScore(score);
                             submitQuizResult(score);
                           }}
                           className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl px-8 shadow-sm flex items-center justify-center min-w-[200px] h-12"
                         >
                           Selesai & Lihat Hasil <ChevronRight size={18} className="ml-2" />
                         </Button>
                       ) : (
                         <Button
                           disabled={!quizAnswers[activeQuizQuestion]}
                           onClick={() => setActiveQuizQuestion(i => i + 1)}
                           className="w-full sm:w-auto bg-[#672cb9] hover:bg-[#56219c] font-semibold rounded-xl px-8 shadow-sm flex items-center justify-center min-w-[160px] h-12 text-white"
                         >
                           Selanjutnya <ChevronRight size={18} className="ml-2" />
                         </Button>
                       )}
                     </div>
                   </div>
                 )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full"> {/* Trigger Fallback jika error */}
                <Button onClick={() => fetchInteractiveMedia('quiz')} className="mt-4 bg-[#672cb9]">Coba Buat Soal Kembali</Button>
              </div>
            )}
          </div>
        )}

        {/* UI untuk Flashcard */}
        {activeTab === 'flashcard' && (
          <div className="flex flex-col items-center justify-start h-full pt-6 pb-[140px] px-4 md:px-12 overflow-y-auto overflow-x-hidden min-w-0 w-full page-scroll">
             {generatingInteractive ? (
              <div className="flex flex-col items-center justify-center mt-32 gap-6">
                 <Loader2 size={48} className="text-[#672cb9] animate-spin mb-4" />
                 <h2 className="text-2xl font-bold animate-pulse text-gray-800">Menyusun Flashcard Pintar...</h2>
                 <p className="text-gray-500 max-w-sm">AI sedang mengurai poin-poin utama materi menjadi kartu hafalan interaktif...</p>
                 <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden mt-4">
                     <div className="h-full bg-gradient-to-r from-[#672cb9] to-[#8c4ae1] animate-pulse rounded-full w-full"></div>
                 </div>
              </div>
             ) : material?.ai_flashcard && material.ai_flashcard.length > 0 ? (
               <div className="w-full max-w-2xl mx-auto mt-12 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                 
                 {/* Flashcard Header Controls */}
                 <div className="w-full flex justify-between items-center mb-10 px-4">
                    <h3 className="font-bold text-gray-500 flex items-center gap-2">
                       <Layers size={20} className="text-[#672cb9]" />
                       Kartu {activeCardData + 1} dari {material.ai_flashcard.length}
                    </h3>
                    <div className="flex gap-2">
                      <Button variant="outline" className="border-gray-200 py-1 h-9 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-50" onClick={() => {
                        // Shuffle flashcards
                        if (!material.ai_flashcard) return;
                        const shuffled = [...material.ai_flashcard].sort(() => Math.random() - 0.5);
                        setMaterial({ ...material, ai_flashcard: shuffled });
                        setActiveCardData(0);
                        setIsFlipped(false);
                      }}>Ajak Acak</Button>
                    </div>
                 </div>

                 {/* Flip Card Container */}
                 <div 
                   className="relative w-full h-[360px] cursor-pointer [perspective:1000px] mb-8 group"
                   onClick={() => setIsFlipped(!isFlipped)}
                 >
                   <div className={`w-full h-full relative [transform-style:preserve-3d] transition-transform duration-700 ease-out border-gray-100/50 ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                      
                      {/* Kartu Depan (Istilah) */}
                      <div className={`absolute inset-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] bg-white border-2 border-gray-100 shadow-[0_20px_50px_rgb(0,0,0,0.06)] rounded-[32px] flex flex-col items-center justify-center p-8 sm:p-12 transition-all group-hover:shadow-[0_20px_50px_rgb(103,44,185,0.08)] group-hover:border-[#672cb9]/10 ${isFlipped ? 'z-0 opacity-0 pointer-events-none delay-300' : 'z-10 opacity-100'}`}>
                        <span className="absolute top-4 sm:top-6 left-4 sm:left-8 text-[#672cb9] font-bold text-[10px] sm:text-xs uppercase tracking-wider bg-[#672cb9]/10 px-3 py-1 rounded-full z-10">Sisi Depan</span>
                        <div className="w-full h-[calc(100%-80px)] overflow-y-auto custom-scrollbar flex flex-col justify-center mt-12 sm:mt-14 mb-4">
                          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight px-1 sm:px-2 py-4">
                            {material.ai_flashcard[activeCardData]?.front}
                          </h2>
                        </div>
                        <div className="absolute bottom-4 flex justify-center w-full bg-transparent">
                           <span className="text-gray-400 font-medium flex items-center gap-2 opacity-80 text-sm">
                             Klik kartu untuk membalik <RefreshCcw size={16} />
                           </span>
                        </div>
                      </div>

                      {/* Kartu Belakang (Definisi) */}
                      <div className={`absolute inset-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] bg-gradient-to-br from-[#672cb9] to-[#8c4ae1] [transform:rotateY(180deg)] border border-transparent shadow-[0_20px_50px_rgb(103,44,185,0.2)] rounded-[32px] flex flex-col items-center justify-center p-6 sm:p-10 transition-all ${isFlipped ? 'z-10 opacity-100 pointer-events-auto' : 'z-0 opacity-0 pointer-events-none delay-300'}`}>
                        <span className="absolute top-4 sm:top-6 left-4 sm:left-8 text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full z-10">Sisi Belakang</span>
                        <div className="text-white w-full h-[calc(100%-80px)] overflow-y-auto custom-scrollbar flex flex-col justify-center mt-12 sm:mt-14 mb-4">
                          <p className="text-lg sm:text-xl font-semibold leading-relaxed w-full max-w-lg mx-auto text-center px-1 sm:px-2 py-4">
                             {material.ai_flashcard[activeCardData]?.back}
                          </p>
                        </div>
                        <div className="absolute bottom-4 flex justify-center w-full bg-transparent">
                           <span className="text-white/60 font-medium flex items-center gap-2 text-sm">
                             Kembali <RefreshCcw size={16} />
                           </span>
                        </div>
                      </div>

                   </div>
                 </div>

                 {/* Kartu Navigasi Controls */}
                 <div className="flex items-center justify-between mt-4 mb-4 w-full max-w-sm mx-auto">
                    <button 
                      disabled={activeCardData <= 0}
                      onClick={() => { setIsFlipped(false); setTimeout(() => setActiveCardData(i => Math.max(0, i - 1)), 150); }}
                      className={`w-14 h-14 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 hover:bg-gray-100 hover:border-gray-200 transition-all text-gray-600 disabled:opacity-30 disabled:hover:bg-white ${activeCardData <= 0 ? 'invisible' : ''}`}
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <div className="flex space-x-2">
                       {/* Mini dots progress */}
                       {material.ai_flashcard.map((_, i) => {
                          // Hide some dots if too many, just show surrounding dots
                          if (material.ai_flashcard!.length > 10 && Math.abs(i - activeCardData) > 2 && i !== 0 && i !== material.ai_flashcard!.length - 1) {
                            if (i === 1 || i === material.ai_flashcard!.length - 2) return <span key={i} className="text-gray-300">.</span>;
                            return null;
                          }
                          return (
                            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === activeCardData ? 'bg-[#672cb9] w-4' : 'bg-gray-200'}`} />
                          )
                       })}
                    </div>
                    <button 
                      disabled={activeCardData >= material.ai_flashcard.length - 1}
                      onClick={() => { setIsFlipped(false); setTimeout(() => setActiveCardData(i => Math.min(material.ai_flashcard!.length - 1, i + 1)), 150); }}
                      className={`w-14 h-14 rounded-full flex items-center justify-center bg-[#672cb9] text-white hover:bg-[#56219c] hover:scale-105 transition-all shadow-md shadow-[#672cb9]/20 disabled:opacity-30 disabled:scale-100 ${activeCardData >= material.ai_flashcard.length - 1 ? 'invisible' : ''}`}
                    >
                      <ChevronRight size={24} />
                    </button>
                 </div>

               </div>
             ) : (
                <div className="flex flex-col items-center justify-center h-full"> 
                  <Button onClick={() => fetchInteractiveMedia('flashcard')} className="bg-[#672cb9]">Coba Buat Flashcard Kembali</Button>
                </div>
             )}
           </div>
        )}

      </main>

      {/* Neura Right Sidebar for Material Context */}
      <NeuraSidebar
        isOpen={isNeuraSidebarOpen}
        onClose={() => setIsNeuraSidebarOpen(false)}
        initialQuery={initialNeuraQuery}
        onClearInitialQuery={() => setInitialNeuraQuery(null)}
        materialContext={material.ai_summary || material.title}
      />

      {/* Download Option Modal */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm relative animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 p-6 flex flex-col gap-6 animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Download Materi</h3>
                <p className="text-sm text-gray-500 font-medium pb-2 select-none">Pilih format file untuk mengunduh bacaan ini.</p>
              </div>
              <button 
                onClick={() => setIsDownloadModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-[#672cb9] hover:bg-[#672cb9]/5 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 outline outline-1 outline-red-200 flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-[#672cb9] transition-colors">Format PDF</h4>
                    <p className="text-xs text-gray-500">Standar tinggi & mudah dibaca</p>
                  </div>
                </div>
                {isDownloading ? <Loader2 size={18} className="animate-spin text-[#672cb9]" /> : <Download size={18} className="text-gray-400 group-hover:text-[#672cb9] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />}
              </button>

              <button 
                onClick={handleDownloadDOCX}
                disabled={isDownloading}
                className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-[#2b579a] hover:bg-[#2b579a]/5 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 outline outline-1 outline-blue-200 flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-[#2b579a] transition-colors">Format DOCX (Word)</h4>
                    <p className="text-xs text-gray-500">Bisa diedit kembali (MS Word)</p>
                  </div>
                </div>
                {isDownloading ? <Loader2 size={18} className="animate-spin text-[#2b579a]" /> : <Download size={18} className="text-gray-400 group-hover:text-[#2b579a] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />}
              </button>
            </div>

            <div className="pt-2">
               <Button 
                variant="outline" 
                className="w-full h-12 text-gray-600 font-bold hover:bg-gray-100"
                onClick={() => setIsDownloadModalOpen(false)}
                disabled={isDownloading}
              >
                Batal
              </Button>
            </div>
            
          </div>
          {/* Overlay Click-to-close */}
          <div className="absolute inset-0 z-0 bg-transparent" onClick={() => setIsDownloadModalOpen(false)}></div>
        </div>
      )}

    </div>
  );
}

// Komponen Tab Sub-Menu (versi Dark/Purple Sidebar)
function TabButton({ active, onClick, icon, children }: { active: boolean, onClick: () => void, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center p-3 rounded-2xl font-bold transition-all text-sm group/tab overflow-hidden ${
        active 
          ? 'bg-white text-[#672cb9] shadow-md' 
          : 'text-white/60 hover:bg-white/10 hover:text-white'
      }`}
    >
      <span className={`w-10 flex items-center justify-center shrink-0 ${active ? 'text-[#672cb9]' : 'text-white/60 group-hover/tab:text-white transition-colors'}`}>{icon}</span>
      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-[180px] text-left flex items-center whitespace-nowrap">{children}</span>
    </button>
  );
}