'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trophy, Award, Crown, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface LeaderboardEntry {
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  total_score: number;
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Kita butuh custom RPC view / query sum
        // Karena supabase client biasa gak bisa nge-sum direct tanpa di-group by user
        // Namun sebagai jalan pintas React, kita bisa select * table poin aja lalu disum di client array
        
        // Ambil dari tabel streak
        const { data: streakData, error: dbError } = await supabase
          .from('user_streaks')
          .select('user_id, current_streak, user_name, user_avatar')
          .order('current_streak', { ascending: false })
          .limit(100);

        if (dbError) throw dbError;

        // Map data agar sesuai dengan interface (kita ganti total_score jadi refer ke current_streak)
        const results = (streakData || []).map(row => ({
           user_id: row.user_id,
           user_name: row.user_name || 'Pelajar Misterius',
           user_avatar: row.user_avatar,
           total_score: row.current_streak || 0 // total_score ini sekarang adalah nilai Streak
        })).filter(user => user.total_score > 0);

        setData(results);

      } catch (err: unknown) {
        console.error(err);
        setError("Gagal memuat papan peringkat.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 font-sans pb-20 p-8 sm:p-12">
       <Button variant="ghost" onClick={() => router.push('/dashboard/library')} className="mb-6 hover:bg-gray-200">
         <ArrowLeft size={18} className="mr-2" /> Kembali ke Library
       </Button>
       
       <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-yellow-200">
              <Trophy size={40} className="text-yellow-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Papan Peringkat</h1>
            <p className="text-gray-500 mt-3 text-lg">Top pelajar OtakEncer dengan rekor Streak belajar berturut-turut.</p>
          </div>

          {loading ? (
             <div className="flex flex-col items-center py-20">
               <Loader2 size={40} className="animate-spin text-[#672cb9] mb-4" />
               <span className="font-medium text-gray-500">Mengkalkulasi streak...</span>
             </div>
          ) : error ? (
            <div className="text-center bg-red-50 text-red-500 p-6 rounded-2xl border border-red-100">
              {error}
            </div>
          ) : data.length === 0 ? (
            <div className="text-center bg-white p-12 rounded-3xl border border-gray-200 shadow-sm border-dashed">
              <Award size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Juara</h3>
              <p className="text-gray-500">Belum ada pengguna yang mencapai streak. Kerjakan quiz tiap hari dari sekarang dan rebut posisi pertama!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.map((user, index) => {
                const isTop3 = index < 3;
                return (
                  <div key={user.user_id} className={`flex items-center justify-between p-5 rounded-2xl transition-all duration-300 border hover:scale-[1.02] cursor-default
                    ${index === 0 ? 'bg-gradient-to-r from-yellow-50 to-amber-100/50 border-yellow-200 shadow-sm' : 
                      index === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-100 border-gray-200' :
                      index === 2 ? 'bg-gradient-to-r from-orange-50/50 to-amber-50 border-orange-100' : 
                      'bg-white border-gray-100 hover:border-[#672cb9]/30'}
                  `}>
                     <div className="flex items-center gap-5">
                       <span className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg border-2
                         ${index === 0 ? 'bg-yellow-400 text-yellow-900 border-yellow-500 shadow-sm' : 
                           index === 1 ? 'bg-gray-300 text-gray-700 border-gray-400':
                           index === 2 ? 'bg-orange-300 text-orange-900 border-orange-400':
                           'bg-gray-100 text-gray-500 border-transparent'}
                       `}>
                          {index === 0 ? <Crown size={20} /> : index + 1}
                       </span>
                       <div className="flex items-center gap-3">
                         {user.user_avatar ? (
                           <>
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img src={user.user_avatar} alt={user.user_name} className="w-10 h-10 rounded-full border border-gray-200 shadow-sm object-cover" />
                           </>
                         ) : (
                           <div className="w-10 h-10 rounded-full bg-[#672cb9]/10 text-[#672cb9] flex items-center justify-center font-bold border border-[#672cb9]/20">
                             {user.user_name.charAt(0).toUpperCase()}
                           </div>
                         )}
                         <div>
                           <h3 className={`font-bold ${isTop3 ? 'text-gray-900 text-lg' : 'text-gray-700 text-base'}`}>
                             {user.user_name}
                           </h3>
                           <span className="text-xs font-medium text-gray-400">Total Hari Beruntun 🔥</span>
                         </div>
                       </div>
                     </div>
                     <div className="font-extrabold text-2xl px-4 py-1.5 rounded-xl bg-white/50 border border-white/60">
                        {isTop3 ? (
                          <span className={`bg-clip-text text-transparent bg-gradient-to-br ${index === 0 ? 'from-yellow-600 to-amber-800' : 'from-[#672cb9] to-indigo-800'}`}>
                             {user.total_score}
                          </span>
                        ) : (
                          <span className="text-gray-800">{user.total_score}</span>
                        )}
                        <span className="text-sm font-semibold text-gray-400 ml-1">hari</span>
                     </div>
                  </div>
                );
              })}
            </div>
          )}
       </div>
    </div>
  );
}
