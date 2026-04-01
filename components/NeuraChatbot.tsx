"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

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
    keywords: ["cara pakai", "mulai", "menggunakan", "langkah pertama", "intinya"],
    answer: "Intinya, proses ini sangat praktis! Cukup unggah dokumen atau ketik pertanyaan yang ada di kepala Anda, lalu asisten cerdas kami akan menganalisis informasi dan memberikan insight, rangkuman, atau format data sesuai kebutuhan Anda.",
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
    keywords: ["apa itu", "neura", "profil", "tentang", "about"],
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
    return "Maaf, saya tidak mengerti pertanyaan tersebut. Coba tanyakan seputar 'tujuan', 'fitur', atau 'kontak'.";
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponseText = getBotResponse(userMessage.text);
      const botMessage: Message = { id: (Date.now() + 1).toString(), sender: "bot", text: botResponseText };
      setMessages((prev) => [...prev, botMessage]);
    }, 600);
  };

  const submitQuickAction = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => {
      handleSend({
        preventDefault: () => {},
      } as React.FormEvent);
    }, 100);
  };

  return (
    <>
      {/* Tombol Trigger */}
      <motion.div 
         initial={{ x: "150%" }}
         animate={{ x: showTrigger && !isOpen ? 0 : "150%" }}
         transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
         className="fixed right-0 z-[9999] bottom-12 md:bottom-20"
      >
        <motion.button
          whileHover={{ x: -8 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="bg-[#672cb9] hover:bg-[#522199] transition-all duration-300 rounded-l-[40px] rounded-r-none pl-4 pr-10 md:pl-5 md:pr-14 py-2 md:py-2.5 flex items-center gap-3 md:gap-4 shadow-[-10px_4px_28px_rgba(103,44,185,0.4)] hover:shadow-[-14px_6px_36px_rgba(103,44,185,0.6)]"
        >
          <div className="w-[42px] h-[42px] md:w-[56px] md:h-[56px] flex items-center justify-center overflow-visible z-10">
            <img
              alt="AI"
              src="/assets/MASKOT NEURA AI FULL.svg"
              className="w-full h-full object-contain scale-125 md:scale-135"
            />
          </div>
          <div className="flex flex-col items-start justify-center pr-1">
            <span className="text-[12px] md:text-[14px] text-white/90 leading-tight font-medium mb-[0px] md:mb-[1px] tracking-tight">Tanya Pada</span>
            <span className="text-[22px] md:text-[32px] text-white leading-[1.1] font-black tracking-normal">NEURA</span>
          </div>
        </motion.button>
      </motion.div>

      {/* Pop-up Chat Window */}
      {/* Background overlay on mobile only */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-[9998] md:hidden transition-opacity" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      <div
        className={`fixed z-[10000] bottom-0 right-0 md:bottom-24 md:right-8 w-full md:w-[400px] h-[85vh] md:h-[550px] bg-white md:rounded-2xl shadow-2xl flex flex-col transition-transform duration-300 origin-bottom-right ${
          isOpen ? "scale-100 translate-y-0" : "scale-0 md:translate-y-8 translate-y-full"
        }`}
      >
        {/* Header */}
        <div className="bg-[#672cb9] md:rounded-t-2xl p-4 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center overflow-hidden shrink-0">
              <img
                alt="AI"
                src="/assets/MASKOT NEURA AI FULL.svg"
                className="w-8 h-8 object-contain scale-125"
              />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">NEURA</h3>
              <p className="text-white/80 text-xs">Selalu online</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Area Pesan Chat */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#f8f9fa] flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex max-w-[85%] ${
                msg.sender === "user" ? "self-end" : "self-start"
              }`}
            >
              <div
                className={`p-3 text-sm rounded-2xl ${
                  msg.sender === "user"
                    ? "bg-[#672cb9] text-white rounded-br-sm"
                    : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white md:rounded-b-2xl border-t border-gray-100 shrink-0">
          <form
            onSubmit={handleSend}
            className="flex flex-col gap-3"
          >
            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" style={{scrollbarWidth: 'none'}}>
                {["Tujuan Aplikasi", "Fitur Utama", "Cara Pemakaian"].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => submitQuickAction(suggestion)}
                    className="whitespace-nowrap text-xs text-[#672cb9] bg-[#672cb9]/10 hover:bg-[#672cb9]/20 font-medium px-3 py-1.5 rounded-full transition-colors border border-[#672cb9]/20"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full p-1 pl-4 focus-within:ring-2 focus-within:ring-[#672cb9]/30 focus-within:border-[#672cb9] transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pertanyaan Anda..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 py-2 w-full focus:ring-0"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-[#672cb9] disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#522199] text-white rounded-full w-10 h-10 flex items-center justify-center shrink-0 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
                  <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
