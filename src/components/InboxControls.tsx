'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, QrCode, RefreshCw, Clock, Plus, Trash2, Globe, Sparkles, ChevronDown } from 'lucide-react';
import { Inbox, SUPPORTED_DOMAINS } from '@/lib/store';
import { formatCountdown } from '@/lib/utils';

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
  const [copied, setCopied] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customPrefix, setCustomPrefix] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(SUPPORTED_DOMAINS[0]);
  const [countdown, setCountdown] = useState({ formatted: '60:00', percentage: 100, isExpired: false });

  // Update countdown timer every second
  useEffect(() => {
    if (!currentInbox) return;

    const timer = setInterval(() => {
      setCountdown(formatCountdown(currentInbox.expiresAt));
    }, 1000);

    setCountdown(formatCountdown(currentInbox.expiresAt));
    return () => clearInterval(timer);
  }, [currentInbox]);

  const handleCopy = () => {
    if (!currentInbox) return;
    navigator.clipboard.writeText(currentInbox.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrefix.trim()) return;
    onGenerateNew(customPrefix.trim(), selectedDomain);
    setShowCustomModal(false);
    setCustomPrefix('');
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
      
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>Your Temporary Email Address</span>
            <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
              Disposable
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Incoming messages deliver instantly without page refresh
          </p>
        </div>

        {/* Saved Active Inboxes Selector */}
        {activeInboxes.length > 1 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Active:</span>
            <select
              value={currentInbox?.address || ''}
              onChange={(e) => onSelectInbox(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-blue-500 w-full sm:w-auto"
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
          <div className="flex items-center bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-3 shadow-inner group-hover:border-blue-500/60 transition">
            <Globe className="w-5 h-5 text-blue-400 mr-3 shrink-0" />
            <input
              type="text"
              readOnly
              value={currentInbox?.address || 'Generating temp address...'}
              className="bg-transparent text-slate-100 font-mono font-semibold text-base sm:text-lg w-full outline-none select-all"
            />
            {copied && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 shrink-0 ml-2 animate-fade-in">
                Copied!
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="lg:col-span-5 flex flex-wrap items-center gap-2">
          
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-600/30 active:scale-95 text-sm"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            <span>Copy</span>
          </button>

          {/* Random New Address */}
          <button
            onClick={() => onGenerateNew()}
            title="Generate Random Address"
            className="flex items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition active:scale-95 text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4 text-blue-400" />
            <span className="sr-only">Random</span>
          </button>

          {/* Custom Alias Creator Button */}
          <button
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-1.5 px-3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition active:scale-95 text-sm font-medium"
          >
            <Plus className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Custom Alias</span>
          </button>

          {/* QR Code Button */}
          <button
            onClick={onOpenQrModal}
            title="Scan QR Code for Mobile"
            className="flex items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition active:scale-95 text-sm"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Delete Inbox */}
          {currentInbox && (
            <button
              onClick={() => onDeleteInbox(currentInbox.address)}
              title="Delete Inbox"
              className="flex items-center justify-center p-3 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-xl border border-red-800/40 transition active:scale-95 text-sm"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

        </div>
      </div>

      {/* Countdown Progress & Extension Bar */}
      {currentInbox && (
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <div className="flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Expires in: <strong className="text-slate-200">{countdown.formatted}</strong></span>
            </div>
            <button
              onClick={() => onExtendTtl(currentInbox.address)}
              className="text-blue-400 hover:text-blue-300 hover:underline font-medium text-xs flex items-center gap-1"
            >
              + Add 30 mins
            </button>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
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

      {/* Custom Alias Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Create Custom Temp Email
            </h3>
            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Email Prefix
                </label>
                <input
                  type="text"
                  placeholder="e.g. john.doe or test-signup"
                  value={customPrefix}
                  onChange={(e) => setCustomPrefix(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm outline-none focus:border-purple-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Domain Name
                </label>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm outline-none focus:border-purple-500"
                >
                  {SUPPORTED_DOMAINS.map((domain) => (
                    <option key={domain} value={domain}>
                      @{domain}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-purple-600/30 transition"
                >
                  Generate Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
