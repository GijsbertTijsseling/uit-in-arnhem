'use client';

import React, { useState } from 'react';
import { UserProfile, UserRole } from '@/types';
import { Users, UserPlus, Shield, CheckCircle2, ShieldCheck, Edit, Mail } from 'lucide-react';

const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-1',
    full_name: 'Gijsbert Tijsseling',
    email: 'hoofdredactie@uitinarnhem.nl',
    role: 'admin',
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'usr-2',
    full_name: 'Rein Aalbers',
    email: 'rein@uitinarnhem.nl',
    role: 'admin',
    created_at: '2026-02-01T12:00:00Z',
  },
  {
    id: 'usr-3',
    full_name: 'Marleen',
    email: 'marleen@uitinarnhem.nl',
    role: 'editor',
    created_at: '2026-02-10T14:30:00Z',
  },
  {
    id: 'usr-4',
    full_name: 'Luxor Live Promotie',
    email: 'info@luxorlive.nl',
    role: 'contributor',
    created_at: '2026-03-01T09:15:00Z',
  },
  {
    id: 'usr-5',
    full_name: 'Focus Filmtheater',
    email: 'publiciteit@focusfilmtheater.nl',
    role: 'contributor',
    created_at: '2026-03-05T11:00:00Z',
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('editor');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    setSuccessMsg(`Rol van gebruiker succesvol bijgewerkt naar ${newRole}!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      full_name: inviteName || inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      created_at: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
    setSuccessMsg(`Uitnodiging verzonden naar ${inviteEmail}!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-zinc-950">
            Gebruikers & Rollenbeheer
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Beheer toegangsrechten voor de kernredactie, auteurs en externe cultuurpartners.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nieuw Redactielid Uitnodigen</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Role explanation cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-zinc-200/90 space-y-1">
          <div className="flex items-center gap-2 font-bold text-xs text-zinc-900">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Beheerder (Admin)</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Volledige controle over platform, gebruikersrollen, artikelen, agenda en site-configuratie.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-zinc-200/90 space-y-1">
          <div className="flex items-center gap-2 font-bold text-xs text-zinc-900">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF4F00]" />
            <span>Redacteur (Editor)</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Kan alle artikelen en evenementen schrijven, bewerken, afbeeldingen uploaden en publiceren.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-zinc-200/90 space-y-1">
          <div className="flex items-center gap-2 font-bold text-xs text-zinc-900">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Inzender / Partner (Contributor)</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Kan evenementen indienen (worden gepubliceerd na goedkeuring door redactie).
          </p>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <th className="py-4 px-6">Naam & Profiel</th>
                <th className="py-4 px-4">E-mailadres</th>
                <th className="py-4 px-4">Huidige Rol</th>
                <th className="py-4 px-4">Rol Aanpassen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                        {u.full_name ? u.full_name[0] : 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900">{u.full_name}</div>
                        <div className="text-[11px] text-zinc-400">ID: {u.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-zinc-600 font-mono text-[11px]">
                    {u.email}
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : u.role === 'editor'
                          ? 'bg-[#FFF3ED] text-[#FF4F00] border border-[#FF4F00]/20'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF4F00]"
                    >
                      <option value="admin">Beheerder (Admin)</option>
                      <option value="editor">Redacteur (Editor)</option>
                      <option value="contributor">Inzender (Contributor)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div>
              <h3 className="font-heading font-black text-xl text-zinc-900">
                Nieuw Redactielid Uitnodigen
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                De genodigde ontvangt een uitnodigingslink om toegang te krijgen tot het CMS.
              </p>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Naam
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Bijv. Lisa van Arnhem"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  E-mailadres *
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  placeholder="collega@uitinarnhem.nl"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Rol toewijzen
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold"
                >
                  <option value="editor">Redacteur (Editor)</option>
                  <option value="contributor">Inzender / Partner (Contributor)</option>
                  <option value="admin">Beheerder (Admin)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-xl"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FF4F00] hover:bg-[#E04500] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm"
                >
                  Uitnodiging Verzenden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
