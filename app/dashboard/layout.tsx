"use client"; // Trigger rescan
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Settings, Menu, Users, Library, Trophy } from 'lucide-react';
import Image from 'next/image';
import { AuthGuard } from '@/components/AuthProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AuthGuard>
      <div className="h-screen w-screen flex font-['Montserrat',sans-serif] bg-[#672cb9] overflow-hidden relative">

          {/* Main Card Container wrapper */}
        <div className="flex h-full w-full relative z-10">
          
          {/* Sidebar - Solid Color, Left part of the screen */}
          <aside className="w-[280px] bg-[#672cb9] text-white hidden md:flex flex-col relative z-20 shrink-0 py-6">
            {/* Logo Section */}
            <div className="pt-4 pb-12 px-10 shrink-0">
              <Link href="/?view=landing" className="flex items-center gap-3">
                <div className="w-8 h-8 relative flex items-center justify-center p-0.5">
                  <Image src="/assets/logo.svg" alt="Logo" fill className="object-contain brightness-0 invert" />
                </div>
                <div className="leading-[1.1]">
                  <div className="text-[20px] font-bold text-white tracking-tight">OtakEncer</div>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-0 flex flex-col space-y-1">
              <NavLink href="/dashboard" icon={<LayoutDashboard size={20} />} active={pathname === '/dashboard'}>Dashboard</NavLink>
              <NavLink href="/dashboard/library" icon={<Library size={20} />} active={pathname.startsWith('/dashboard/library')}>Library</NavLink>
              <NavLink href="/dashboard/leaderboard" icon={<Trophy size={20} />} active={pathname.startsWith('/dashboard/leaderboard')}>Leaderboard</NavLink>
              <NavLink href="/dashboard/kolaborasi" icon={<Users size={20} />} active={pathname.startsWith('/dashboard/kolaborasi')}>Ruang Kolaborasi</NavLink>

              <div className="mt-auto pb-4">
                <NavLink href="/dashboard/settings" icon={<Settings size={20} />} active={pathname.startsWith('/dashboard/settings')}>Pengaturan</NavLink>
              </div>
            </nav>
          </aside>

          {/* Mobile Header (Only visible on small screens) */}
          <header className="h-16 bg-[#672cb9] text-white flex items-center justify-between px-4 sticky top-0 z-30 md:hidden absolute w-full shadow-md">
            <Link href="/?view=landing" className="flex items-center gap-2">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <Image src="/assets/logo.png" alt="OtakEncer Logo" fill className="object-contain brightness-0 invert p-1" />
              </div>
              <span className="font-bold text-[16px] tracking-tight">
                OtakEncer
              </span>
            </Link>
            <button className="w-10 h-10 flex items-center justify-center text-white focus:outline-none">
              <Menu size={24} />
            </button>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 h-full overflow-y-auto bg-[#f8fafc] md:rounded-l-[40px] shadow-[-10px_0_30px_rgba(0,0,0,0.1)] content-area-scroll w-full pt-16 md:pt-0">
            {children}
          </main>

        </div>
      </div>
    </AuthGuard>
  );
}

function NavLink({ href, icon, children, active = false }: { href: string, icon: React.ReactNode, children: React.ReactNode, active?: boolean }) {
  if (active) {
    return (
      <Link href={href} className="relative flex items-center pl-10 py-4 cursor-pointer text-[#672cb9]">
        {/* Active Pill background connecting to the right edge */}
        <div className="absolute left-6 right-0 top-0 bottom-0 bg-[#f8fafc] rounded-l-full shadow-sm"></div>
        <div className="relative z-10 flex items-center gap-4 text-[#672cb9] font-bold w-full">
           {icon}
           <span className="text-[15px]">{children}</span>
        </div>
        {/* Dot indicator on the right edge */}
        <div className="absolute right-0 w-1 h-7 full rounded bg-[#FFA515] z-10"></div>
      </Link>
    );
  }

  return (
    <Link 
      href={href} 
      className="flex items-center gap-4 pl-10 py-4 text-[15px] font-medium text-white/70 hover:text-white transition-colors group relative"
    >
      <span className="opacity-80 group-hover:opacity-100 transition-opacity">
        {icon}
      </span>
      <span>
        {children}
      </span>
    </Link>
  );
}