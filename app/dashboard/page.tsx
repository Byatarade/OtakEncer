"use client";

import { Search, Bell, Plus, Filter, LogOut, Settings, HelpCircle, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null; // Handled by AuthGuard

  return (
    <div className="flex flex-col min-h-full w-full p-4 lg:p-8 xl:p-10 max-w-[1600px] mx-auto gap-6 sm:gap-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <h1 className="text-[28px] font-bold text-[#0f172a] tracking-tight whitespace-nowrap">Hi, {user.name.split(' ')[0]}! ??</h1>
        
        <div className="flex flex-wrap items-center gap-3 md:gap-4 justify-end">
          
          {/* Search Box */}
          <div className="relative group hidden sm:flex">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#672cb9] transition-colors" size={18} />
             <input 
               type="text" 
               placeholder="Cari..." 
               className="w-full sm:w-[240px] bg-white border border-slate-200 text-[14px] font-medium rounded-full py-2.5 pl-11 pr-4 outline-none focus:border-[#672cb9] focus:ring-1 focus:ring-[#672cb9]/30 transition-all shadow-sm"
             />
          </div>

          <button className="sm:hidden p-2.5 text-slate-500 hover:text-[#672cb9] bg-white rounded-full border border-slate-200 shadow-sm transition-colors">
            <Search size={18} />
          </button>
          
          <button className="p-2.5 text-slate-500 hover:text-[#672cb9] bg-white rounded-full border border-slate-200 shadow-sm transition-colors relative">
            <Filter size={18} />
          </button>
          
          <button className="p-2.5 text-slate-500 hover:text-[#672cb9] bg-white rounded-full border border-slate-200 shadow-sm transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-rose-500 rounded-full outline outline-2 outline-white"></span>
          </button>

          <button className="flex items-center gap-2 bg-[#672cb9] text-white px-5 py-2.5 rounded-full text-[14px] font-bold shadow-md hover:bg-[#58249c] hover:shadow-lg transition-all transform hover:-translate-y-0.5 ml-2">
            <Plus size={18} strokeWidth={2.5}/>
            <span className="hidden sm:inline">Create</span>
          </button>
          
          <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block"></div>

          {/* Profile Dropdown */}
          <div className="relative flex items-center" ref={dropdownRef}>
             <button 
               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
               className="flex items-center gap-2 focus:outline-none group"
             >
               {user.picture ? (
                 <Image src={user.picture} alt={user.name} width={42} height={42} className="rounded-full shadow-sm border-2 border-white ring-2 ring-transparent group-hover:ring-[#672cb9]/20 transition-all hover:scale-105" />
               ) : (
                 <div className="w-[42px] h-[42px] rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm ring-2 ring-transparent group-hover:ring-[#672cb9]/20 transition-all hover:scale-105">
                   {user.name?.[0] || 'U'}
                 </div>
               )}
               <ChevronDown size={16} className={`text-slate-400 transition-transform hidden sm:block ${isDropdownOpen ? 'rotate-180' : ''}`} />
             </button>

             {/* Dropdown Menu */}
             {isDropdownOpen && (
               <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
                 <div className="px-4 py-3 border-b border-slate-100 mb-1">
                   <p className="text-[14px] font-bold text-slate-800">{user.name}</p>
                   <p className="text-[12px] text-slate-500 truncate">{user.email}</p>
                 </div>
                 
                 <div className="flex flex-col px-2">
                   <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-slate-600 hover:text-[#672cb9] hover:bg-indigo-50/50 rounded-xl transition-colors">
                     <Settings size={18} />
                     Pengaturan Akun
                   </Link>
                   
                   <Link href="mailto:support@otakencer.com" className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-slate-600 hover:text-[#672cb9] hover:bg-indigo-50/50 rounded-xl transition-colors">
                     <HelpCircle size={18} />
                     Bantuan & Support
                   </Link>
                   
                   <div className="h-px w-full bg-slate-100 my-1"></div>
                   
                   <button 
                     onClick={handleLogout}
                     className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors w-full text-left"
                   >
                     <LogOut size={18} />
                     Keluar / Logout
                   </button>
                 </div>
               </div>
             )}
          </div>

        </div>
      </div>

      {/* Konten Dashboard (Placeholder) */}
      <div className="bg-white border text-center border-slate-200/60 rounded-[32px] p-10 flex flex-col items-center justify-center min-h-[500px] shadow-sm mt-4">
         <p className="text-slate-400 font-medium pb-2 text-[15px]">Ruang Kerjamu Masih Kosong.</p>
      </div>

    </div>
  );
}
