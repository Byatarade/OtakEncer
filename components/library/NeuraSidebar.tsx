"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Loader2, Maximize2, Minimize2 } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
};

interface NeuraSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string | null;
  materialContext?: string;
  onClearInitialQuery?: () => void;
}

export default function NeuraSidebar({ isOpen, onClose, initialQuery, onClearInitialQuery }: NeuraSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Halo! Saya Neura. Ada bagian materi yang membuatmu bingung? Tanyakan atau blok teks yang ingin dijelaskan!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);

  useEffect(() => {
    setLocalIsOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, localIsOpen]);

  useEffect(() => {
    if (localIsOpen && initialQuery) {
      handleSend(undefined, `Tolong jelaskan bagian ini:\n\n"${initialQuery}"`);
      if (onClearInitialQuery) onClearInitialQuery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localIsOpen, initialQuery]);

  const handleSend = async (e?: React.FormEvent, textOverride?: string) => {
    if (e) e.preventDefault();
    const textToUse = textOverride !== undefined ? textOverride : input;
    if (!textToUse.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), sender: "user", text: textToUse };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Mengirimkan konteks singkat jika ada (mungkin tidak perlu jika menggunakan pesan panjang, tapi bagus untuk prompt tambahan).
      // Untuk sederhananya, kita mengirimkan riwayat percakapan.
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToUse,
          history: messages,
        }),
      });

      if (!res.ok) throw new Error("Gagal mengambil respons.");

      const data = await res.json();
      const botMessage: Message = { id: (Date.now() + 1).toString(), sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const botMessage: Message = { id: (Date.now() + 1).toString(), sender: "bot", text: "Maaf, Neura sedang mengalami gangguan jaringan. Silakan coba lagi sebentar." };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {localIsOpen && (
        <>
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[998] md:hidden"
            onClick={() => {
              setLocalIsOpen(false);
              onClose();
            }}
          />
          
          <motion.div
            key="sidebar-panel"
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 250 }}
            className={`fixed top-4 right-4 bottom-4 bg-[#f8fafc] shadow-[0_0_40px_rgba(0,0,0,0.15)] z-[999] flex flex-col transition-all duration-300 ease-in-out ${isExpanded ? 'w-[600px] max-w-full' : 'w-96 max-w-[85vw]'} rounded-3xl border border-gray-100/50`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#672cb9] to-[#8042d6] text-white p-4 flex items-center justify-between shrink-0 relative overflow-hidden rounded-t-3xl shadow-sm z-10">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="flex items-center gap-3 relative z-10">
               <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                 <Image
                   alt="Neura AI"
                   src="/assets/maskot-neura.svg"
                   width={32}
                   height={32}
                   className="w-8 h-8 object-contain scale-[1.2] mt-1"
                 />
               </div>
               <div>
                 <h3 className="font-bold text-[16px] leading-tight">Tanya Neura</h3>
                 <div className="flex items-center gap-1.5 mt-0.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                   <p className="text-white/80 text-[11px] font-medium">Asisten Analisis Materi</p>
                 </div>
               </div>
             </div>
             
             <div className="flex items-center gap-1 relative z-10">
               <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors hidden md:block" title={isExpanded ? "Perkecil panel" : "Perbesar panel"}>
                  {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
               </button>
               <button onClick={() => { setLocalIsOpen(false); onClose(); }} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                 <X size={20} />
               </button>
             </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#f8fafc] flex flex-col gap-4 relative">
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03]">
              <Image priority src="/assets/logo.png" alt="" width={200} height={200} className="filter grayscale" />
            </div>

            {messages.map((msg) => (
               <div key={msg.id} className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"} relative z-10`}>
                 {msg.sender === "bot" && (
                   <div className="w-8 h-8 rounded-full bg-[#672cb9]/10 border border-[#672cb9]/20 flex items-center justify-center shrink-0 mr-3 mt-auto mb-1">
                     <Image src="/assets/maskot-neura.svg" alt="bot" width={20} height={20} className="w-5 h-5 object-contain" />
                   </div>
                 )}
                 <div className={`p-4 text-[14px] leading-[1.6] shadow-sm max-w-[85%] ${
                    msg.sender === "user"
                      ? "bg-[#672cb9] text-white rounded-[20px] rounded-br-[4px]"
                      : "bg-white text-gray-800 border border-gray-200 rounded-[20px] rounded-bl-[4px]"
                  }`}>
                    {msg.sender === "bot" ? (
                      <div className="prose prose-sm prose-p:leading-relaxed prose-a:text-[#672cb9] prose-code:text-[#672cb9] prose-code:bg-[#672cb9]/10 prose-code:px-1 prose-code:rounded">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
               </div>
            ))}
            
            {isLoading && (
              <div className="flex w-full justify-start relative z-10 mb-2">
                 <div className="w-8 h-8 rounded-full bg-[#672cb9]/10 border border-[#672cb9]/20 flex items-center justify-center shrink-0 mr-3 mt-auto">
                   <Image src="/assets/maskot-neura.svg" alt="bot" width={20} height={20} className="w-5 h-5 object-contain animate-pulse" />
                 </div>
                 <div className="bg-white px-4 py-3 border border-gray-200 shadow-sm rounded-[20px] rounded-bl-[4px] flex items-center gap-3">
                   <Loader2 className="w-4 h-4 animate-spin text-[#672cb9]" />
                   <span className="text-xs text-gray-500 font-medium">Neura sedang berpikir...</span>
                 </div>
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-2" />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white shrink-0 rounded-b-3xl relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
             <form onSubmit={handleSend} className="relative flex items-center">
                <div className="absolute left-3 md:left-4 z-10 text-[#672cb9]">
                  <Sparkles size={18} />
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tanya hal spesifik tentang materi ini..."
                  className="w-full bg-[#f8fafc] border border-gray-200 text-gray-800 text-sm md:text-[15px] rounded-full pl-10 md:pl-12 pr-12 md:pr-14 py-3 xl:py-3.5 focus:outline-none focus:border-[#672cb9]/50 focus:bg-white focus:ring-4 focus:ring-[#672cb9]/10 transition-all font-medium placeholder:text-gray-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 md:right-2 w-8 h-8 xl:w-9 xl:h-9 flex items-center justify-center bg-[#672cb9] text-white rounded-full hover:bg-[#522199] transition-colors disabled:opacity-50 disabled:hover:bg-[#672cb9]"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
             </form>
          </div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
