import React from 'react';
import { Database, AlertTriangle } from 'lucide-react';

interface MigrationPendingNoticeProps {
  compact?: boolean;
}

export function MigrationPendingNotice({ compact = false }: MigrationPendingNoticeProps) {
  return (
    <div
      className={`rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3 ${
        compact ? 'p-4' : 'p-5'
      }`}
    >
      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
        {compact ? <AlertTriangle className="w-4 h-4" /> : <Database className="w-4 h-4" />}
      </div>
      <div className="space-y-1 min-w-0">
        <h3 className="text-xs sm:text-sm font-heading font-bold text-amber-950">
          Analytics-database nog niet geactiveerd
        </h3>
        <p className="text-xs text-amber-900/90 leading-relaxed">
          Voer de Supabase-migratie{' '}
          <code className="px-1.5 py-0.5 rounded bg-amber-100/90 font-mono text-[11px] text-amber-950">
            supabase/migrations/20261126000001_analytics_schema.sql
          </code>{' '}
          uit om cookieloze bezoekersstatistieken op te slaan en hier te tonen.
        </p>
      </div>
    </div>
  );
}
