import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Uit in Arnhem | Cultuur, Agenda, Hotspots & Nachtleven',
  description: 'Ontdek wat er te doen is in Arnhem. De complete culturele agenda, tips voor eten & drinken, vintage winkelen en verborgen parels in de Rijnstad.',
  keywords: ['Arnhem', 'Agenda', 'Cultuur', 'Hotspots', 'Nachtleven', 'Sonsbeek', 'Modekwartier', 'Uit in Arnhem'],
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
      <body className="min-h-screen flex flex-col bg-white text-[#121212] selection:bg-[#FF4F00] selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
