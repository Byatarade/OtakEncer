"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  MoreVertical, Clock, Search, Video, FileType2, Music, FileText, 
  Share2, Download, Trash2, X, Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { showSuccess, showError, showConfirm, showSuccessToast } from '@/lib/swal';
import { supabase } from "@/lib/supabase";

export interface Material {
  id: string | number;
  title: string;
  type: string;
  date: string;
  readTime: string;
  source: string;
  coverColor: string;
}

interface LibraryCardProps {
  material: Material;
  onDeleteSuccess?: () => void;
}

export const LibraryCard = ({ material, onDeleteSuccess }: LibraryCardProps) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "youtube": return <Video size={14} />;
      case "pdf": case "docx": case "ppt": return <FileType2 size={14} />;
      case "audio": return <Music size={14} />;
      default: return <FileText size={14} />;
    }
  };

  const getCardOverlayIcon = (type: string) => {
    switch (type) {
      case "youtube": return <Video size={24} />;
      case "pdf": case "docx": case "ppt": return <FileText size={24} />;
      case "audio": return <Music size={24} />;
      default: return <FileText size={24} />;
    }
  };

  const handleCardClick = () => {
    // Navigasi programmatically
    router.push(`/dashboard/library/${material.id}`);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  // --- ACTIONS ---

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setShowShareModal(true);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setShowDownloadModal(true);
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);

    const result = await showConfirm(
      'Hapus Materi ini?',
      'Materi dan hasil rangkuman AI Anda akan dihapus permanen.',
      {
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
      }
    );

    if (result.isConfirmed) {
      setIsProcessing(true);
      try {
        const { error } = await supabase.from('materials').delete().eq('id', material.id);
        if (error) throw error;
        
        showSuccess('Terhapus!', 'Materi Anda telah dihapus.');
        
        if (onDeleteSuccess) onDeleteSuccess();
      } catch (err: unknown) {
        console.error("Delete error:", err);
        const errMessage = err instanceof Error ? err.message : 'Gagal menghapus materi.';
        showError('Gagal Menghapus', errMessage);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Caching summary inside the component scope during generation to avoid re-fetching
  const fetchSummary = async () => {
    const { data, error } = await supabase.from('materials').select('ai_summary').eq('id', material.id).single();
    if (error || !data) throw new Error("Gagal mengambil teks rangkuman");
    return data.ai_summary || "_Tidak ada rangkuman yang tersedia._";
  };

  const downloadPDF = async () => {
    try {
      setIsProcessing(true);
      const text = await fetchSummary();
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(material.title || "Materi AI OtakEncer", 15, 20);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Tipe: ${material.type.toUpperCase()}`, 15, 28);
      doc.text("Dibuat oleh: OtakEncer AI", 15, 33);
      
      doc.line(15, 38, 195, 38);

      doc.setFontSize(12);
      // Clean markdown basically just by using raw text for PDF
      const cleanText = text.replace(/[*#_`~>]/g, "");
      const lines = doc.splitTextToSize(cleanText, 180);
      
      let cursorY = 48;
      for (const line of lines) {
        if (cursorY > 280) {
          doc.addPage();
          cursorY = 20;
        }
        doc.text(line, 15, cursorY);
        cursorY += 6;
      }

      doc.save(`OtakEncer_${material.title.replace(/\s+/g, '_')}.pdf`);
      setShowDownloadModal(false);
    } catch (err: unknown) {
      console.error(err);
      showError('Gagal', 'Terjadi kesalahan saat memproses Export PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadDOCX = async () => {
    try {
      setIsProcessing(true);
      const text = await fetchSummary();
      
      // Sangat sederhana (split paragraph)
      const cleanTextContent = text.replace(/[*#_`~>]/g, "");
      const paragraphs = cleanTextContent.split('\n').map((p: string) => new Paragraph({
        children: [new TextRun(p)],
        spacing: { after: 120 }
      }));

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: material.title, bold: true, size: 36 })],
              spacing: { after: 300 }
            }),
            new Paragraph({
              children: [new TextRun({ text: "Dibuat via OtakEncer AI" })],
              spacing: { after: 300 }
            }),
            ...paragraphs
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `OtakEncer_${material.title.replace(/\s+/g, '_')}.docx`);
      setShowDownloadModal(false);
    } catch (err: unknown) {
      console.error(err);
      showError('Gagal', 'Terjadi kesalahan saat memproses Export DOCX.');
    } finally {
      setIsProcessing(false);
    }
  };

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/share/${material.id}` : "";

  return (
    <>
      <Card 
        onClick={handleCardClick}
        hoverable padding="none" variant="white" className="flex flex-col cursor-pointer bg-white group h-full relative"
      >
        {isProcessing && (
           <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-[32px]">
              <Loader2 className="animate-spin text-[#672cb9]" size={32} />
           </div>
        )}

        <div className={`relative h-44 w-full bg-gradient-to-br ${material.coverColor} p-5 flex flex-col justify-between overflow-visible shrink-0 rounded-t-[32px]`}>
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 rounded-t-[32px] overflow-hidden"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay rounded-t-[32px] overflow-hidden"></div>
          
          {/* Top bar inside thumbnail */}
          <div className="relative z-10 flex justify-between items-start w-full" ref={menuRef}>
            <Badge variant="secondary" size="sm" icon={getIcon(material.type)} className="uppercase tracking-wider shadow-sm">
              {material.type}
            </Badge>
            
            <div className="relative">
              <button 
                onClick={handleMenuClick}
                className="text-white hover:text-white transition-colors bg-white/10 hover:bg-white/30 p-2 rounded-full backdrop-blur-md border border-white/10"
              >
                <MoreVertical size={16} />
              </button>

              {/* Custom Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-41 bg-white rounded-xl shadow-xl overflow-hidden z-50 border border-gray-100 font-medium text-sm animate-in fade-in zoom-in-95 duration-200">
                  <button 
                    onClick={handleShareClick}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
                  >
                    <Share2 size={16} className="text-[#672cb9]" /> Bagikan
                  </button>
                  <button 
                    onClick={handleDownloadClick}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors border-t border-gray-50"
                  >
                    <Download size={16} className="text-blue-500" /> Unduh
                  </button>
                  <button 
                    onClick={handleDeleteClick}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors border-t border-gray-50"
                  >
                    <Trash2 size={16} /> Hapus
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-md p-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 shadow-xl border border-white/10 text-white">
            {getCardOverlayIcon(material.type)}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex-1 flex flex-col pt-5">
          <h3 className="font-bold text-gray-800 text-[16px] mb-3 line-clamp-2 leading-relaxed">
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
            <div className="text-gray-400 text-[11px] font-bold tracking-wide uppercase">{material.date}</div>
          </div>
        </div>
      </Card>

      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowShareModal(false)}></div>
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden animate-in fade-in zoom-in-95 font-['Montserrat',sans-serif]">
              <div className="bg-[#672cb9]/5 px-6 py-4 flex items-center justify-between border-b border-gray-100">
                 <h3 className="font-bold text-gray-800 flex items-center gap-2">
                   <Share2 size={18} className="text-[#672cb9]" /> Bagikan Materi
                 </h3>
                 <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600 p-1 bg-white rounded-full"><X size={18} /></button>
              </div>
              <div className="p-6 flex flex-col items-center">
                 <div className="bg-white p-3 rounded-2xl shadow-md border border-gray-100 mb-6 group hover:shadow-lg transition-all">
                   <QRCodeSVG 
                      value={shareUrl} 
                      size={180}
                      bgColor={"#ffffff"}
                      fgColor={"#1e293b"}
                      level={"H"}
                      includeMargin={false}
                   />
                 </div>
                 <p className="text-sm text-gray-500 text-center font-medium mb-4">
                   Scan QR atau salin tautan di bawah agar siapa saja bebas membaca materi rangkuman Anda!
                 </p>
                 <div className="w-full flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1.5 pl-4">
                    <input type="text" readOnly value={shareUrl} className="bg-transparent text-sm w-full outline-none text-gray-600 font-medium truncate" />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        showSuccessToast('Tersalin!');
                      }}
                      className="bg-[#672cb9] hover:bg-[#5a24a3] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shrink-0 shadow-sm"
                    >
                      Salin
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* DOWNLOAD MODAL */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isProcessing && setShowDownloadModal(false)}></div>
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden animate-in fade-in zoom-in-95 font-['Montserrat',sans-serif]">
              <div className="bg-[#672cb9]/5 px-6 py-4 flex items-center justify-between border-b border-gray-100">
                 <h3 className="font-bold text-gray-800 flex items-center gap-2">
                   <Download size={18} className="text-[#672cb9]" /> Unduh Materi
                 </h3>
                 <button onClick={() => !isProcessing && setShowDownloadModal(false)} disabled={isProcessing} className="text-gray-400 hover:text-gray-600 p-1 bg-white rounded-full disabled:opacity-50"><X size={18} /></button>
              </div>
              <div className="p-6 flex flex-col gap-4">
                 <p className="text-sm text-gray-600 font-medium mb-2 text-center">Pilih format unduhan hasil teks AI:</p>
                 
                 <Button 
                   onClick={downloadPDF} 
                   disabled={isProcessing}
                   className="w-full h-14 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 shadow-none justify-start px-5 font-bold text-[15px]"
                 >
                   {isProcessing ? <Loader2 size={20} className="mr-3 animate-spin" /> : <FileType2 size={20} className="mr-3" />}
                   Export ke PDF Document
                 </Button>
                 
                 <Button 
                   onClick={downloadDOCX} 
                   disabled={isProcessing}
                   className="w-full h-14 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 shadow-none justify-start px-5 font-bold text-[15px]"
                 >
                   {isProcessing ? <Loader2 size={20} className="mr-3 animate-spin" /> : <FileText size={20} className="mr-3" />}
                   Export ke Microsoft Word
                 </Button>
              </div>
           </div>
        </div>
      )}
    </>
  );
};
