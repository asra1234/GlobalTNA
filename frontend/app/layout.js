import './globals.css';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import Link from 'next/link';

import AuthNav from '../components/AuthNav';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

export const metadata = {
  title: 'GlobalTNA – Service Requests',
  description: 'Connect homeowners with trusted tradespeople',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className} ${fraunces.variable} min-h-screen text-gray-900 antialiased`}>
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl animate-drift" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-amber-300/20 blur-3xl animate-soft-pulse" />
          <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-200/20 blur-3xl animate-drift" />
        </div>

        <header className="sticky top-0 z-20 px-4 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between rounded-[28px] border border-white/60 bg-white/55 px-4 py-3 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-6">
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-amber-500 text-lg text-white shadow-lg transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105">
                🔧
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-700/70">Trade network</p>
                <span className="text-lg font-extrabold tracking-tight text-slate-900">GlobalTNA</span>
              </div>
            </Link>

            <AuthNav />
          </div>
        </header>

        <main className="relative mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">{children}</main>

        <footer className="px-4 pb-8 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 rounded-[32px] border border-white/60 bg-white/55 px-6 py-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-slate-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-amber-500 text-white shadow-md">
                🔧
              </div>
              <div>
                <p className="text-sm font-bold">GlobalTNA</p>
                <p className="text-xs text-slate-500">Find, post, and manage local trade work faster.</p>
              </div>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-500">
              A calmer, faster request flow for homeowners and trusted tradespeople, with live status updates and secure posting.
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">© {new Date().getFullYear()}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
