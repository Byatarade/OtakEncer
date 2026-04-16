"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Tipe untuk pesan
type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
};

// Data FAQ (Keyword Matching)
const faqs = [
  {
    keywords: ["tujuan", "buat apa", "fungsi utama", "masalah", "mengapa"],
    answer: "Tujuan utama Neura dibuat adalah untuk membantu mendemokratisasi akses ke alat-alat AI cerdas bagi individu dan bisnis skala kecil maupun menengah secara gratis, sehingga mereka lebih mudah mengotomatisasi pekerjaan berulang dan lebih produktif.",
  },
  {
    keywords: ["cara pakai", "cara pemakaian", "pemakaian", "bagaimana cara pemakaian", "mulai", "menggunakan", "langkah pertama","cara"],
    answer: "Cara menggunakan OtakEncer sangatlah mudah! Pertama, pilih tombol upload pada dashboard kemudian unggah materi sesuai format yang diterima.  AI akan secara otomatis merangkum materi, membuat glosarium, serta menyusun flashcards untuk Anda. Jangan lupa, Anda juga bisa langsung mengikuti simulasi ujian setelah generate materi untuk menguji pemahaman Anda. Jika masih ada yang bingung, silakan berdiskusi langsung dengan saya!",
  },
  {
    keywords: ["fitur", "kemampuan", "bisa apa", "keunggulan"],
    answer: "Neura dilengkapi dengan berbagai fitur AI canggih seperti memproses data otomatis, pembuatan laporan cerdas, asisten virtual 24/7, dan integrasi yang mulus.",
  },
  {
    keywords: ["kontak", "hubungi", "bantuan", "support", "cs", "nomor"],
    answer: "Anda dapat menghubungi tim support kami melalui email di support@otakencer.com atau melalui WhatsApp di nomor +6281234567890.",
  },
  {
    keywords: ["hai", "apa itu", "neura", "profil", "tentang", "about"],
    answer: "Halo! Saya Neura, asisten virtual cerdas dari OtakEncer yang siap membantu Anda menjawab berbagai pertanyaan seputar layanan kami.",
  },
];

interface NeuraChatbotProps {
  showTrigger?: boolean;
}

export default function NeuraChatbot({ showTrigger = true }: NeuraChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Halo! Saya Neura 👋. Ada yang bingung dengan fungsionalitas dan fitur asisten kami? Beritahu saya!",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const msgIdCounter = useRef(0);

  // Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Logika Keyword Matching
  const getBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    // Cek setiap FAQ
    for (const faq of faqs) {
      if (faq.keywords.some((kw) => lowerInput.includes(kw))) {
        return faq.answer;
      }
    }
    
    // Fallback jika keyword tidak dikenali
    return "Maaf, saya tidak mengerti pertanyaan tersebut. Coba tanyakan seputar 'tujuan', 'fitur', 'cara pemakaian', atau 'kontak'.";
  };

  const handleSend = (e?: React.FormEvent, textOverride?: string) => {
    if (e) e.preventDefault();
    const textToUse = textOverride !== undefined ? textOverride : input;
    if (!textToUse.trim()) return;

    const userMessage: Message = { id: String(++msgIdCounter.current), sender: "user", text: textToUse };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponseText = getBotResponse(userMessage.text);
      const botMessage: Message = { id: String(++msgIdCounter.current), sender: "bot", text: botResponseText };
      setMessages((prev) => [...prev, botMessage]);
    }, 600);
  };

  const submitQuickAction = (suggestion: string) => {
    handleSend(undefined, suggestion);
  };

  return (
    <>
      {/* Tombol Trigger */}
      <motion.div 
         initial={{ x: "150%" }}
         animate={{ x: showTrigger && !isOpen ? 0 : "150%" }}
         transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
         className="fixed right-0 z-[9990] bottom-6 md:bottom-12"
      >
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsOpen(true)}
          className="bg-[#672cb9] hover:bg-[#522199] transition-all duration-300 rounded-l-[30px] md:rounded-l-[40px] rounded-r-none pl-3 pr-5 md:pl-4 md:pr-6 py-2 md:py-2.5 flex items-center gap-2.5 md:gap-3 shadow-[-8px_4px_24px_rgba(103,44,185,0.35)] hover:shadow-[-12px_6px_32px_rgba(103,44,185,0.5)] group border-y border-l border-white/10"
        >
          <div className="w-[36px] h-[36px] md:w-[44px] md:h-[44px] flex items-center justify-center overflow-visible z-10 relative">
            <Image
              alt="AI"
              src="/assets/maskot-neura.svg"
              width={44}
              height={44}
              className="w-full h-full object-contain scale-[1.1] md:scale-[1.15] group-hover:scale-[1.25] transition-transform duration-300 origin-bottom"
            />
          </div>
          <div className="flex flex-col items-start justify-center pr-1">
            <span className="text-[10px] md:text-[12px] text-white/90 leading-none font-semibold mb-0.5 tracking-wide uppercase">Tanya Pada</span>
            <span className="text-[18px] md:text-[22px] text-white leading-none font-black tracking-tight">NEURA</span>
          </div>
        </motion.button>
      </motion.div>

      {/* Pop-up Chat Window */}
      {/* Background overlay on mobile only */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] md:hidden transition-opacity" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Responsive Chat Card Container */}
      <div
        className={`fixed z-[10000] bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-[380px] h-[85vh] md:h-[600px] md:max-h-[85vh] transition-all duration-300 ease-out origin-bottom-right flex flex-col ${
          isOpen ? "scale-100 translate-y-0 opacity-100 pointer-events-auto" : "scale-95 md:translate-y-8 translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-full h-full bg-white md:rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.2)] md:border md:border-gray-100 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#672cb9] to-[#8042d6] md:rounded-t-2xl p-4 flex items-center justify-between shadow-md shrink-0 relative overflow-hidden">
            {/* Subtle header pattern/glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-white/20 shadow-inner">
                <Image
                  alt="AI"
                  src="/assets/maskot-neura.svg"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain scale-[1.2] mt-1"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="text-white font-bold text-[16px] leading-tight tracking-tight">Neura AI</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                  <p className="text-white/80 text-[11px] font-medium">Selalu online</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white bg-black/10 hover:bg-black/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors relative z-10"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          {/* Area Pesan Chat */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#f8fafc] flex flex-col gap-4 relative">
            {/* Background Logo Watermark (Subtle) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03]">
               <Image priority src="/assets/logo.png" alt="" width={160} height={160} className="w-40 h-40 filter grayscale" />
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"} relative z-10`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-[#672cb9]/10 border border-[#672cb9]/20 flex items-center justify-center shrink-0 mr-2 mt-auto">
                    <Image src="/assets/maskot-neura.svg" alt="bot" width={20} height={20} className="w-5 h-5 object-contain" />
                  </div>
                )}
                
                <div
                  className={`p-3 text-[14px] leading-[1.5] shadow-sm max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-[#672cb9] text-white rounded-[20px] rounded-br-[4px]"
                      : "bg-white text-gray-800 border border-gray-100 rounded-[20px] rounded-bl-[4px]"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white md:rounded-b-2xl border-t border-gray-100 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
            <form
              onSubmit={handleSend}
              className="flex flex-col gap-3"
            >
              {/* Quick Actions */}
              {messages.length === 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar pt-1 w-full" style={{scrollbarWidth: 'none'}}>
                  {["Tujuan Aplikasi", "Fitur Utama", "Cara Pemakaian"].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => submitQuickAction(suggestion)}
                      className="whitespace-nowrap text-[12px] text-[#672cb9] bg-[#f4effa] hover:bg-[#eae0f5] font-semibold px-3.5 py-1.5 rounded-full transition-colors border border-[#672cb9]/10"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-2 bg-[#f8fafc] border border-gray-200 rounded-full p-1 pl-4 focus-within:ring-2 focus-within:ring-[#672cb9]/30 focus-within:border-[#672cb9] transition-all group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pesan Anda..."
                  className="flex-1 bg-transparent border-none outline-none text-[14px] font-medium text-gray-700 placeholder-gray-400 py-2 w-full focus:ring-0"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-[#672cb9] disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#522199] text-white rounded-full w-9 h-9 flex items-center justify-center shrink-0 transition-colors shadow-sm disabled:shadow-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] ml-[2px]">
                    <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
