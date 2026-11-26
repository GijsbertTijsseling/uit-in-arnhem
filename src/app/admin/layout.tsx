'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Calendar,
  Users,
  MapPin,
  PlusCircle,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Layers,
  Lock,
  Pencil,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getCurrentEditorUser, updateCurrentEditorName } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('editor');
  const [userEmail, setUserEmail] = useState('');
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    let active = true;
    getCurrentEditorUser().then((editor) => {
      if (!active) return;
      if (!editor) {
        setAuthenticated(false);
        setAuthChecking(false);
        router.replace('/login');
        return;
      }
      setUserRole(editor.role || 'editor');
      setUserEmail(editor.email || '');
      setUserFullName(editor.author_name);
      setFirstNameInput(editor.first_name || '');
      setLastNameInput(editor.last_name || '');
      setAuthenticated(true);
      setAuthChecking(false);
    });
    return () => {
      active = false;
    };
  }, [router]);

  const handleSaveProfileName = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError('');
    const result = await updateCurrentEditorName(firstNameInput, lastNameInput);
    setSavingProfile(false);
    if (result.error) {
      setProfileError(result.error);
      return;
    }
    setUserFullName(result.fullName);
    setProfileModalOpen(false);
    window.dispatchEvent(new Event('uit-arnhem-profile-updated'));
  };

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
    { href: '/admin/statistieken', label: 'Statistieken', icon: BarChart3 },
    { href: '/admin/articles', label: 'Artikelen', icon: FileText },
    { href: '/admin/agenda', label: 'Agenda & Inzendingen', icon: Calendar },
    { href: '/admin/locaties', label: 'Vaste Locaties', icon: MapPin },
    { href: '/admin/agenda/bronnen', label: 'Agenda Bronnen', icon: Layers, adminOnly: true },
    { href: '/admin/users', label: 'Rollen & Gebruikers', icon: Users, adminOnly: true },
  ];

  if (authChecking || !authenticated) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-zinc-300 border-t-[#FF4F00] rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-zinc-500">
            Redactie-sessie controleren...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#121212] text-white p-4 flex items-center justify-between border-b border-zinc-800 sticky top-0 z-30">
        <Link href="/admin" className="relative h-8 w-32 brightness-0 invert">
          <Image src="/logo.png" alt="Uit in Arnhem" fill sizes="128px" className="object-contain" />
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Sluit menu' : 'Open menu'}
          className="p-2 text-zinc-400 hover:text-white cursor-pointer"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Sluit zijmenu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs md:hidden"
        />
      )}

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
              const active =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : item.href === '/admin/agenda'
                  ? pathname === '/admin/agenda' ||
                    (pathname.startsWith('/admin/agenda/') && !pathname.startsWith('/admin/agenda/bronnen'))
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const isRestricted = item.adminOnly && userRole !== 'admin';

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    active
                      ? 'bg-zinc-800 text-[#FF4F00]'
                      : isRestricted
                      ? 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.adminOnly && (
                    <span className="flex items-center gap-1 text-[9px] uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-semibold tracking-wider">
                      {isRestricted ? <Lock className="w-2.5 h-2.5 text-zinc-500" /> : null}
                      Admin
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="p-4 m-4 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FF4F00] text-white font-bold text-xs flex items-center justify-center shrink-0">
              {userFullName ? userFullName[0].toUpperCase() : userRole === 'admin' ? 'A' : 'R'}
            </div>
            <div className="truncate flex-1">
              <div className="text-xs font-bold text-white truncate">
                {userFullName || userEmail}
              </div>
              {userFullName && (
                <div className="text-[10px] text-zinc-400 truncate">{userEmail}</div>
              )}
              <div className="text-[10px] text-[#FF4F00] font-semibold uppercase tracking-wider">
                {userRole === 'admin' ? 'Beheerder (Volledig)' : 'Redactielid (Editor)'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setProfileError('');
                setProfileModalOpen(true);
              }}
              title="Auteursnaam instellen of wijzigen"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>

          {!userFullName && (
            <button
              type="button"
              onClick={() => {
                setProfileError('');
                setProfileModalOpen(true);
              }}
              className="w-full py-1.5 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-semibold text-zinc-200 transition-colors text-left cursor-pointer"
            >
              Voor- en achternaam instellen
            </button>
          )}

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
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-10 max-w-7xl">
        {children}
      </main>

      {/* Account Name Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-heading font-black text-lg text-zinc-950">
                  Redacteurnaam instellen
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Deze voor- en achternaam wordt automatisch gebruikt als auteur bij nieuwe artikelen.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {profileError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {profileError}
              </div>
            )}

            <form onSubmit={handleSaveProfileName} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="h-5 flex items-end text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                    Voornaam
                  </label>
                  <input
                    type="text"
                    value={firstNameInput}
                    onChange={(e) => setFirstNameInput(e.target.value)}
                    required
                    placeholder="Bijv. Sanne"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="h-5 flex items-end text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                    Achternaam
                  </label>
                  <input
                    type="text"
                    value={lastNameInput}
                    onChange={(e) => setLastNameInput(e.target.value)}
                    required
                    placeholder="Bijv. van den Berg"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#FF4F00] focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {savingProfile ? 'Opslaan...' : 'Opslaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
