'use client';

import React, { useState } from 'react';
import { Copy, Check, QrCode, Clock, Plus, Trash2, Globe, RefreshCw, ShieldCheck } from 'lucide-react';
import { Inbox } from '@/lib/store';
import { formatCountdown } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/LanguageContext';

interface InboxControlsProps {
  currentInbox: Inbox | null;
  activeInboxes: Inbox[];
  onGenerateNew: (prefix?: string, domain?: string) => void;
  onSelectInbox: (address: string) => void;
  onExtendTtl: (address: string) => void;
  onDeleteInbox: (address: string) => void;
  onOpenQrModal: () => void;
  onRefresh: () => void;
}

export const InboxControls: React.FC<InboxControlsProps> = ({
  currentInbox,
  activeInboxes,
  onGenerateNew,
  onSelectInbox,
  onExtendTtl,
  onDeleteInbox,
  onOpenQrModal,
  onRefresh
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customPrefix, setCustomPrefix] = useState('');

  const countdown = currentInbox
    ? formatCountdown(currentInbox.expiresAt)
    : { formatted: '60:00', percentage: 100, isExpired: false };

  const handleCopy = () => {
    if (!currentInbox) return;
    navigator.clipboard.writeText(currentInbox.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrefix.trim()) return;
    onGenerateNew(customPrefix.trim());
    setShowCustomModal(false);
    setCustomPrefix('');
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-2xl space-y-5 transition-colors duration-300">
      
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>{t('yourTempAddress')}</span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-500/20">
              Active
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('incomingNotice')}
          </p>
        </div>

        {/* Saved Active Inboxes Selector */}
        {activeInboxes.length > 1 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold hidden sm:inline">{t('activeInboxes')}</span>
            <select
              value={currentInbox?.address || ''}
              onChange={(e) => onSelectInbox(e.target.value)}
              className="bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono font-bold rounded-xl px-3 py-2 outline-none focus:border-blue-500 w-full sm:w-auto"
            >
              {activeInboxes.map((inbox) => (
                <option key={inbox.address} value={inbox.address}>
                  {inbox.address}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Primary Display & Action Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
        
        {/* Main Address Display Input */}
        <div className="lg:col-span-7 relative group">
          <div className="flex items-center bg-slate-50 dark:bg-slate-950/90 border border-slate-300 dark:border-slate-700/80 rounded-2xl px-4 py-3.5 shadow-inner group-hover:border-blue-500/60 transition">
            <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 shrink-0" />
            <input
              type="text"
              readOnly
              value={currentInbox?.address || '...'}
              className="bg-transparent text-blue-600 dark:text-blue-400 font-mono font-bold text-base sm:text-lg w-full outline-none select-all"
            />
            {copied && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-500/20 shrink-0 ml-2 animate-fade-in">
                {t('copied')}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="lg:col-span-5 flex flex-wrap items-center gap-2">
          
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm transition shadow-lg shrink-0 ${
              copied
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/20 active:scale-95'
            }`}
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            <span>{t('copy')}</span>
          </button>

          {/* Random New Address Icon Button */}
          <button
            onClick={() => onGenerateNew()}
            title={t('randomAddress')}
            className="flex items-center justify-center p-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl border border-slate-300 dark:border-slate-700 transition active:scale-95 text-sm"
          >
            <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="sr-only">{t('randomAddress')}</span>
          </button>

          {/* Custom Alias Creator Button */}
          <button
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-3.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-2xl border border-blue-200 dark:border-blue-700/50 transition active:scale-95 text-xs font-bold"
          >
            <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">{t('customAlias')}</span>
          </button>

          {/* QR Code Button */}
          <button
            onClick={onOpenQrModal}
            title="Scan QR Code for Mobile"
            className="flex items-center justify-center p-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl border border-slate-300 dark:border-slate-700 transition active:scale-95 text-sm"
          >
            <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </button>

          {/* Delete Inbox */}
          {currentInbox && (
            <button
              onClick={() => onDeleteInbox(currentInbox.address)}
              title={t('deleteInbox')}
              className="flex items-center justify-center p-3.5 bg-rose-50 dark:bg-red-950/40 hover:bg-rose-100 dark:hover:bg-red-900/60 text-rose-600 dark:text-red-400 rounded-2xl border border-rose-200 dark:border-red-800/40 transition active:scale-95 text-sm"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

        </div>
      </div>

      {/* Countdown Progress & Extension Bar */}
      {currentInbox && (
        <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2 font-mono">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin-slow" />
              <span>{t('expiresIn')} <strong className="text-slate-900 dark:text-slate-100 text-sm font-bold">{countdown.formatted}</strong></span>
            </div>
            <button
              onClick={() => onExtendTtl(currentInbox.address)}
              className="px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 rounded-xl transition"
            >
              {t('add30Mins')}
            </button>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-300 dark:border-slate-800">
            <div
              className={`h-full transition-all duration-1000 ${
                countdown.percentage < 20
                  ? 'bg-red-500'
                  : countdown.percentage < 50
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500'
              }`}
              style={{ width: `${countdown.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Custom Alias Creator Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {t('createCustomTitle')}
            </h3>
            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  {t('emailPrefix')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. john.doe"
                  value={customPrefix}
                  onChange={(e) => setCustomPrefix(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 text-sm outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg transition"
                >
                  {t('generateAddress')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
