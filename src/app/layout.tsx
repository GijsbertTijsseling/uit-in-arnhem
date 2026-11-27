import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { isIndexingAllowed } from '@/lib/site-access';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Uit in Arnhem | Cultuur, Agenda, Hotspots & Nachtleven',
  description:
    'Ontdek wat er te doen is in Arnhem. De complete culturele agenda, tips voor eten & drinken, vintage winkelen en verborgen parels in de Rijnstad.',
  keywords: ['Arnhem', 'Agenda', 'Cultuur', 'Hotspots', 'Nachtleven', 'Sonsbeek', 'Modekwartier', 'Uit in Arnhem'],
  robots: isIndexingAllowed()
    ? { index: true, follow: true }
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      },
  openGraph: {
    title: 'Uit in Arnhem | De officiële cultuur- en uitgaansgids',
    description: 'Ontdek de beste evenementen, exposities, concerten en culinaire hotspots van Arnhem.',
    url: 'https://uitinarnhem.nl',
    siteName: 'Uit in Arnhem',
    locale: 'nl_NL',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-canvas text-ink selection:bg-[#FF4F00] selection:text-white overflow-x-hidden">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
