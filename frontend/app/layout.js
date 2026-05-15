import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';

import AuthNav from '../components/AuthNav';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'GlobalTNA – Service Requests',
  description: 'Connect homeowners with trusted tradespeople',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-gray-900 antialiased`}>
        {/* ── Navbar ─────────────────────────────────────────────────────────── */}
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-lg group-hover:bg-white/30 transition-colors">
                🔧
              </div>
              <span className="text-xl font-bold text-white tracking-tight">GlobalTNA</span>
            </Link>

            <AuthNav />
          </div>
        </header>

        {/* ── Page content ───────────────────────────────────────────────────── */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</main>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <footer className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 text-white font-semibold">
              <span>🔧</span> GlobalTNA
            </div>
            <p className="text-blue-200 text-xs text-center">
              Connecting homeowners with trusted local tradespeople
            </p>
            <p className="text-blue-300 text-xs">© {new Date().getFullYear()} GlobalTNA</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
