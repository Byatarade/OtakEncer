'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Award, Loader2 } from 'lucide-react';

interface LeaderboardEntry {
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  total_score: number;
}

/* ────────────── Avatar ────────────── */
function Avatar({ user, size, mdSize }: { user: LeaderboardEntry; size: number; mdSize?: number }) {
  const md = mdSize ?? size;
  return user.user_avatar ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={user.user_avatar}
      alt={user.user_name}
      className="rounded-full object-cover border-2 border-white/60 shadow-md avatar-img"
      style={
        {
          '--size': `${size}px`,
          '--md-size': `${md}px`,
          width: `${size}px`,
          height: `${size}px`,
        } as React.CSSProperties
      }
    />
  ) : (
    <div
      className="rounded-full bg-gray-800 text-white flex items-center justify-center font-bold border-2 border-white/40 shadow-md font-montserrat avatar-div"
      style={
        {
          '--size': `${size}px`,
          '--md-size': `${md}px`,
          width: `${size}px`,
          height: `${size}px`,
          fontSize: `${Math.round(size * 0.38)}px`,
        } as React.CSSProperties
      }
    >
      {user.user_name.charAt(0).toUpperCase()}
    </div>
  );
}

/* ────────────── Podium Card ────────────── */
function PodiumCard({
  user,
  rank,
  height,
  mdHeight,
  avatarSize,
  mdAvatarSize,
}: {
  user: LeaderboardEntry;
  rank: number;
  height: number;
  mdHeight: number;
  avatarSize: number;
  mdAvatarSize: number;
}) {
  const colorMap: Record<number, { bg: string }> = {
    1: {
      bg: 'linear-gradient(to bottom, #c97e00 0%, #e09b14 45%, #f7f7f7 100%)',
    },
    2: {
      bg: 'linear-gradient(to bottom, #8a8a8a 0%, #b0b0b0 45%, #f7f7f7 100%)',
    },
    3: {
      bg: 'linear-gradient(to bottom, #7a3a10 0%, #b06030 45%, #f7f7f7 100%)',
    },
  };

  const colors = colorMap[rank];
  const avatarOffset = Math.round(avatarSize * 0.34);

  return (
    <div className="flex flex-col items-center podium-col">
      {/* Avatar floats above card */}
      <div className="relative z-10 podium-avatar-wrap" style={{ marginBottom: `-${avatarOffset}px` }}>
        <Avatar user={user} size={avatarSize} mdSize={mdAvatarSize} />
      </div>

      {/* Card body */}
      <div
        className="w-full rounded-t-3xl flex flex-col items-center relative overflow-hidden podium-card"
        style={{
          height,
          background: colors.bg,
          paddingTop: avatarOffset + 6,
        }}
      >
        {/* Username */}
        <span className="text-white font-semibold text-xs md:text-base text-center leading-tight drop-shadow px-1 font-montserrat">
          {user.user_name}
        </span>

        {/* Rank number */}
        <span
          className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 text-gray-900 font-extrabold font-montserrat"
          style={{ fontSize: rank === 1 ? 26 : 20 }}
        >
          {rank}
        </span>


      </div>

      {/* Responsive md styles via a style tag trick — handled via Tailwind classes below */}
    </div>
  );
}

/* ────────────── Rank Badge ────────────── */
function RankBadge({ rank }: { rank: number }) {
  const style: Record<number, string> = {
    1: 'bg-[#f5c842] text-yellow-900',
    2: 'bg-[#d0d0d0] text-gray-700',
    3: 'bg-[#c97849] text-white',
  };
  return (
    <div
      className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0 font-montserrat ${
        style[rank] ?? 'bg-gray-100 text-gray-500'
      }`}
    >
      {rank}
    </div>
  );
}

/* ────────────── Score Badge ────────────── */
function ScoreBadge({ score, rank }: { score: number; rank: number }) {
  const color =
    rank === 1
      ? 'bg-[#fef3c7] text-yellow-800 border border-yellow-200'
      : rank === 2
      ? 'bg-gray-100 text-gray-600 border border-gray-200'
      : rank === 3
      ? 'bg-[#fde8d4] text-orange-800 border border-orange-200'
      : 'bg-gray-100 text-gray-500 border border-gray-200';

  return (
    <span
      className={`text-xs md:text-sm font-semibold px-3 py-1 md:px-4 md:py-1.5 rounded-full flex-shrink-0 font-montserrat ${color}`}
    >
      {score} Hari
    </span>
  );
}

/* ────────────── Row Item ────────────── */
function LeaderRow({ user, rank }: { user: LeaderboardEntry; rank: number }) {
  const rowBg =
    rank === 1
      ? 'bg-[#fef9ec] border border-yellow-200'
      : rank === 2
      ? 'bg-[#f5f5f5] border border-gray-200'
      : rank === 3
      ? 'bg-[#fdf1e8] border border-orange-100'
      : 'bg-white border border-gray-100';

  return (
    <div
      className={`flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 rounded-2xl transition-transform duration-200 hover:scale-[1.015] cursor-default ${rowBg}`}
    >
      <RankBadge rank={rank} />
      <div className="w-9 h-9 md:w-12 md:h-12 rounded-full overflow-hidden flex-shrink-0">
        {user.user_avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.user_avatar}
            alt={user.user_name}
            className="w-full h-full object-cover border-2 border-white/60 rounded-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 text-white flex items-center justify-center font-bold rounded-full text-sm md:text-base font-montserrat">
            {user.user_name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <span className="flex-1 font-semibold text-gray-800 text-sm md:text-base font-montserrat">
        {user.user_name}
      </span>
      <ScoreBadge score={user.total_score} rank={rank} />
    </div>
  );
}

/* ────────────── Main Page ────────────── */
export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data: streakData, error: dbError } = await supabase
          .from('user_streaks')
          .select('user_id, current_streak, user_name, user_avatar')
          .order('current_streak', { ascending: false })
          .limit(100);

        if (dbError) throw dbError;

        const results = (streakData || [])
          .map((row) => ({
            user_id: row.user_id,
            user_name: row.user_name || 'Pelajar Misterius',
            user_avatar: row.user_avatar,
            total_score: row.current_streak || 0,
          }))
          .filter((u) => u.total_score > 0);

        setData(results);
      } catch (err: unknown) {
        console.error(err);
        setError('Gagal memuat papan peringkat.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  // Podium order: 2nd (left), 1st (center), 3rd (right)
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumRank = [2, 1, 3];

  // Mobile heights
  const mobileHeights = [150, 190, 130];
  // Desktop heights (bigger)
  const desktopHeights = [210, 270, 180];

  // Mobile avatar sizes
  const mobileAvatarSizes = [52, 64, 48];
  // Desktop avatar sizes
  const desktopAvatarSizes = [72, 90, 64];

  return (
    <>
      {/* Responsive podium sizes via CSS custom properties */}
      <style>{`
        @media (min-width: 936px) {
          .podium-card { height: var(--md-card-height) !important; padding-top: var(--md-pad-top) !important; }
          .podium-col { flex: 1; }
          .podium-avatar-wrap img,
          .podium-avatar-wrap div {
            width: var(--md-avatar) !important;
            height: var(--md-avatar) !important;
          }
          .podium-avatar-wrap { margin-bottom: calc(var(--md-avatar) * -0.34) !important; }
        }
      `}</style>

      <div className="min-h-screen bg-[#f7f7f7] text-gray-900 font-montserrat pb-28">
        {/* ── Header ── */}
        <div className="pt-10 md:pt-14 pb-4 text-center px-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 font-montserrat">
            Leaderboard
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base font-medium leading-snug font-montserrat">
            Top pelajar OtakEncer dengan rekor Streak<br />belajar berturut-turut.
          </p>
        </div>

        {/* ── States ── */}
        {loading ? (
          <div className="flex flex-col items-center py-24">
            <Loader2 size={40} className="animate-spin text-[#672cb9] mb-4" />
            <span className="font-medium text-gray-400 font-montserrat">Mengkalkulasi streak...</span>
          </div>
        ) : error ? (
          <div className="mx-6 mt-6 text-center bg-red-50 text-red-500 p-6 rounded-2xl border border-red-100 font-medium font-montserrat">
            {error}
          </div>
        ) : data.length === 0 ? (
          <div className="mx-6 mt-6 text-center bg-white p-12 rounded-3xl border border-dashed border-gray-200 shadow-sm">
            <Award size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 font-montserrat">
              Belum Ada Juara
            </h3>
            <p className="text-gray-400 text-sm md:text-base font-medium font-montserrat">
              Belum ada pengguna yang mencapai streak. Kerjakan quiz tiap hari dan rebut posisi pertama!
            </p>
          </div>
        ) : (
          /* max-w: mobile full, desktop wider */
          <div className="w-full max-w-md md:max-w-2xl mx-auto px-4 md:px-6">
            {/* ── Podium ── */}
            {top3.length >= 2 && (
              <div
                className="relative z-10 flex items-end gap-2 md:gap-4 mt-6 md:mt-10 -mb-14 md:-mb-20"
                style={{ minHeight: 240 }}
              >
                {podiumOrder.map((user, i) => {
                  if (!user) return <div key={i} style={{ flex: 1 }} />;
                  return (
                    <div
                      key={user.user_id}
                      className="flex flex-col items-center podium-col"
                      style={{ flex: 1 }}
                    >
                      {/* Avatar floats above card */}
                      <div
                        className="relative z-10 podium-avatar-wrap"
                        style={{
                          marginBottom: `-${Math.round(mobileAvatarSizes[i] * 0.34)}px`,
                          // pass desktop avatar size as CSS var
                          ['--md-avatar' as string]: `${desktopAvatarSizes[i]}px`,
                        }}
                      >
                        <Avatar
                          user={user}
                          size={mobileAvatarSizes[i]}
                          mdSize={desktopAvatarSizes[i]}
                        />
                      </div>

                      {/* Card */}
                      <div
                        className="w-full rounded-t-3xl flex flex-col items-center relative overflow-hidden podium-card"
                        style={
                          {
                            height: mobileHeights[i],
                            '--md-card-height': `${desktopHeights[i]}px`,
                            '--md-pad-top': `${Math.round(desktopAvatarSizes[i] * 0.34) + 6}px`,
                            paddingTop: Math.round(mobileAvatarSizes[i] * 0.34) + 6,
                            background:
                              podiumRank[i] === 1
                                ? 'linear-gradient(to bottom, #c97e00 0%, #e09b14 45%, #f7f7f7 100%)'
                                : podiumRank[i] === 2
                                ? 'linear-gradient(to bottom, #8a8a8a 0%, #b0b0b0 45%, #f7f7f7 100%)'
                                : 'linear-gradient(to bottom, #7a3a10 0%, #b06030 45%, #f7f7f7 100%)',
                          } as React.CSSProperties
                        }
                      >
                        {/* Username */}
                        <span className="text-white font-semibold text-xs md:text-base text-center leading-tight drop-shadow px-1 font-montserrat">
                          {user.user_name}
                        </span>

                        {/* Rank number */}
                        <span
                          className="absolute bottom-4 md:bottom-7 left-1/2 -translate-x-1/2 text-gray-900 font-extrabold font-montserrat"
                          style={{ fontSize: podiumRank[i] === 1 ? 26 : 20 }}
                        >
                          {podiumRank[i]}
                        </span>


                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Ranked List ── */}
            <div className="relative z-0 flex flex-col gap-3 md:gap-4 pt-16 md:pt-24">
              {top3.map((user, i) => (
                <LeaderRow key={user.user_id} user={user} rank={i + 1} />
              ))}
              {rest.map((user, i) => (
                <LeaderRow key={user.user_id} user={user} rank={i + 4} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
