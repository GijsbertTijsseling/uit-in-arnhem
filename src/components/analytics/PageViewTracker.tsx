'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const EXCLUDED_PREFIXES = [
  '/admin',
  '/api',
  '/login',
  '/register',
  '/auth',
  '/wachtwoord-',
];

// Module-level deduplicatie tegen dubbele React StrictMode-effects op hetzelfde pad
let lastTrackedPath = '';
let lastTrackedTimestamp = 0;

function isExcludedClientPath(pathname: string): boolean {
  const lower = pathname.toLowerCase();
  return EXCLUDED_PREFIXES.some(
    (prefix) =>
      lower === prefix ||
      lower.startsWith(`${prefix}/`) ||
      (prefix.endsWith('-') && lower.startsWith(prefix))
  );
}

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || isExcludedClientPath(pathname)) {
      return;
    }

    const now = Date.now();
    if (pathname === lastTrackedPath && now - lastTrackedTimestamp < 1500) {
      return;
    }

    lastTrackedPath = pathname;
    lastTrackedTimestamp = now;

    const payload = JSON.stringify({ path: pathname });

    try {
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([payload], { type: 'application/json' });
        const sent = navigator.sendBeacon('/api/track', blob);
        if (sent) return;
      }

      void fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Negeer netwerkfouten stil
    }
  }, [pathname]);

  return null;
}
