'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Terminal, Sparkles, BookOpen } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  activeAddress?: string;
  onOpenApiDocs: () => void;
  onOpenSimulator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeAddress,
  onOpenApiDocs,
  onOpenSimulator,
}) => {
  const { t } = useTranslation();
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[1px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-slate-100">
                Temp<span className="text-blue-600 dark:text-blue-500"> Mail</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">{t('tagline')}</p>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {t('sseConnected')}
          </div>

          {/* Theme Toggle (Sun/Moon Button) */}
          <ThemeToggle />

          {/* Language Selector Dropdown */}
          <LanguageSelector />

          {/* Test Simulator Button (Only shown in Development mode) */}
          {isDev && (
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-700/50 rounded-xl transition shadow-sm hover:shadow-purple-500/20 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline">{t('sendTestEmail')}</span>
              <span className="sm:hidden">Test</span>
            </button>
          )}

          {/* Blog Button */}
          <Link
            href="/blog"
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl transition shadow-sm active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Blog</span>
          </Link>

          {/* Developer API Docs Button */}
          <button
            onClick={onOpenApiDocs}
            className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl transition shadow-sm active:scale-95"
          >
            <Terminal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{t('apiDocs')}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
