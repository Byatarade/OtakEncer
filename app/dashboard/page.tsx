import { Search, Bell, Plus } from 'lucide-react';
import Image from 'next/image';

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-full w-full p-4 lg:p-8 xl:p-10 max-w-[1600px] mx-auto gap-6 sm:gap-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-[28px] font-bold text-[#0f172a] tracking-tight">Hi, User!</h1>
        <div className="flex items-center gap-3 md:gap-4">
          <button className="text-[14px] font-bold text-slate-600 hover:text-[#672cb9] transition-colors px-4 py-2">
            Log In
          </button>
          <button className="flex items-center gap-2 bg-[#672cb9] text-white px-6 py-2.5 rounded-full text-[14px] font-bold shadow-md hover:bg-[#58249c] transition-colors">
            Sign In
          </button>
        </div>
      </div>
      
    </div>
  );
}

