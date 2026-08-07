'use client';

import React from 'react';
import { Mail, Shield, Lock, Globe } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 py-10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              <span className="font-extrabold text-lg text-slate-100 tracking-tight">Temp Mail</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {t('footerTagline')}
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">{t('supportedDomains')}</h4>
            <ul className="space-y-1 text-slate-400 font-mono text-[11px]">
              <li>@tempomail.store</li>
              <li>@disposta.net</li>
              <li>@inboxpad.dev</li>
              <li>@quickmail.box</li>
              <li>@shadowbox.email</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">{t('privacyCompliance')}</h4>
            <div className="space-y-2 text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>{t('zeroLogNotice')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>{t('automaticExpiry')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <span>{t('httpsEnforced')}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Temp Mail. {t('allRightsReserved')}</p>
        </div>

      </div>
    </footer>
  );
};
