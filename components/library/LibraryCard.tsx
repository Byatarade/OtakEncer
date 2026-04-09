"use client";

import React from "react";

import { MoreVertical, Clock, Search, Video, FileType2, Music, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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
}

export const LibraryCard = ({ material }: LibraryCardProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "youtube":
        return <Video size={14} />;
      case "pdf":
      case "docx":
      case "ppt":
        return <FileType2 size={14} />;
      case "audio":
        return <Music size={14} />;
      default:
        return <FileText size={14} />;
    }
  };

  const getCardOverlayIcon = (type: string) => {
    switch (type) {
      case "youtube":
        return <Video size={24} />;
      case "pdf":
      case "docx":
      case "ppt":
        return <FileText size={24} />;
      case "audio":
        return <Music size={24} />;
      default:
        return <FileText size={24} />;
    }
  };

  return (
    <Card hoverable padding="none" variant="white" className="flex flex-col cursor-pointer bg-white group h-full">
      {/* Premium Thumbnail Header */}
      <div className={`relative h-44 w-full bg-gradient-to-br ${material.coverColor} p-5 flex flex-col justify-between overflow-hidden shrink-0`}>
        {/* Glass overlays and animated blobs */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

        {/* Top bar inside thumbnail */}
        <div className="relative z-10 flex justify-between items-start w-full">
          <Badge variant="secondary" size="sm" icon={getIcon(material.type)} className="uppercase tracking-wider">
            {material.type}
          </Badge>
          <button className="text-white hover:text-white transition-colors bg-white/10 hover:bg-white/30 p-2 rounded-full backdrop-blur-md border border-white/10">
            <MoreVertical size={16} />
          </button>
        </div>

        {/* Center Icon Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-md p-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 shadow-xl border border-white/10 text-white">
          {getCardOverlayIcon(material.type)}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col">
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
          <div className="text-gray-400 text-[11px] font-bold tracking-wide uppercase">{material.date}</div>
        </div>
      </div>
    </Card>
  );
};
