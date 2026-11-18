'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  MapPin,
  PlusCircle,
  ExternalLink,
  LogOut,
  Sparkles,
  Menu,
  X,
  Layers,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState('admin');
  const [userEmail, setUserEmail] = useState('redactie@uitinarnhem.nl');

  useEffect(() => {
    // Check localStorage or supabase session
    const stored = localStorage.getItem('uit_arnhem_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.role) setUserRole(parsed.role);
        if (parsed.email) setUserEmail(parsed.email);
      } catch {}
    }
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    localStorage.removeItem('uit_arnhem_user');
    router.push('/login');
  };

  const navItems = [
    { href: '/admin', label: 'Overzicht', icon: LayoutDashboard },
    { href: '/admin/articles', label: 'Artikelen', icon: FileText },
    { href: '/admin/agenda', label: 'Agenda & Events', icon: Calendar },
    { href: '/admin/locaties', label: 'Vaste Locaties', icon: MapPin },
    { href: '/admin/users', label: 'Rollen & Gebruikers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#121212] text-white p-4 flex items-center justify-between border-b border-zinc-800">
        <Link href="/admin" className="relative h-8 w-32 brightness-0 invert">
          <Image src="/logo.png" alt="Uit in Arnhem" fill className="object-contain" />
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-zinc-400 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#121212] text-zinc-300 flex flex-col justify-between transition-transform duration-200 border-r border-zinc-800 shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Logo */}
          <div className="hidden md:block">
            <Link href="/" className="relative h-10 w-44 block brightness-0 invert">
              <Image src="/logo.png" alt="Uit in Arnhem" fill className="object-contain" />
            </Link>
            <div className="mt-2 text-[10px] uppercase font-bold tracking-widest text-[#FF4F00]">
              Editorial CMS Studio
            </div>
          </div>

          {/* Quick Create Buttons */}
          <div className="space-y-2 pt-2">
            <Link
              href="/admin/articles/new"
              onClick={() => setSidebarOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Nieuw Artikel</span>
            </Link>
            <Link
              href="/admin/agenda/new"
              onClick={() => setSidebarOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-[#FF4F00]" />
              <span>Nieuw Evenement</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 pt-4 border-t border-zinc-800">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    active
                      ? 'bg-zinc-800 text-[#FF4F00]'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="p-4 m-4 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FF4F00] text-white font-bold text-xs flex items-center justify-center">
              {userRole === 'admin' ? 'A' : 'E'}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">{userEmail}</div>
              <div className="text-[10px] text-[#FF4F00] font-semibold uppercase">
                {userRole === 'admin' ? 'Beheerder' : 'Redacteur'}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-zinc-400 hover:text-white"
            >
              <span>Live site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1 text-zinc-400 hover:text-rose-400 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Uitloggen</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
