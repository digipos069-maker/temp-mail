'use client';

import React, { useState } from 'react';
import { Mail, Search, Inbox as InboxIcon, ShieldCheck, Paperclip, RefreshCw, Sparkles } from 'lucide-react';
import { EmailMessage } from '@/lib/store';
import { formatTimeAgo } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/LanguageContext';

interface InboxListProps {
  messages: EmailMessage[];
  selectedMessageId: string | null;
  onSelectMessage: (message: EmailMessage) => void;
  onRefresh: () => void;
  onOpenSimulator: () => void;
}

export const InboxList: React.FC<InboxListProps> = ({
  messages,
  selectedMessageId,
  onSelectMessage,
  onRefresh,
  onOpenSimulator,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const isDev = process.env.NODE_ENV === 'development';

  const filteredMessages = messages.filter(
    (m) =>
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.senderEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col h-[600px] overflow-hidden backdrop-blur-xl shadow-xl">
      
      {/* Header Bar */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950/40">
        <div className="flex items-center gap-2">
          <InboxIcon className="w-5 h-5 text-blue-400" />
          <h2 className="font-bold text-slate-100 text-sm">{t('inboxMessages')}</h2>
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {messages.length}
          </span>
        </div>

        <button
          onClick={onRefresh}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
          title="Refresh Inbox"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      {messages.length > 0 && (
        <div className="p-3 border-b border-slate-800/80 bg-slate-950/20">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-500 absolute left-3" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Messages List Container */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
        {filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center border border-slate-700/50">
              <Mail className="w-8 h-8 text-slate-500 animate-pulse" />
            </div>
            <div>
              <h3 className="text-slate-200 font-semibold text-sm">{t('waitingForEmails')}</h3>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                {t('disposableReadyNotice')}
              </p>
            </div>

            {isDev && (
              <button
                onClick={onOpenSimulator}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-semibold transition"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>{t('sendSampleEmail')}</span>
              </button>
            )}
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isSelected = selectedMessageId === msg.id;

            return (
              <div
                key={msg.id}
                onClick={() => onSelectMessage(msg)}
                className={`p-4 cursor-pointer transition flex items-start gap-3 hover:bg-slate-800/40 ${
                  isSelected ? 'bg-blue-950/30 border-l-4 border-blue-500' : ''
                } ${msg.isUnread ? 'bg-slate-900/90' : ''}`}
              >
                {/* Sender Avatar Icon */}
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-xs shrink-0 mt-0.5">
                  {msg.senderName.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-xs truncate ${msg.isUnread ? 'font-bold text-slate-100' : 'text-slate-300'}`}>
                      {msg.senderName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono shrink-0">
                      {formatTimeAgo(msg.receivedAt)}
                    </span>
                  </div>

                  <h4 className={`text-xs truncate ${msg.isUnread ? 'font-bold text-slate-100' : 'text-slate-300'}`}>
                    {msg.subject}
                  </h4>

                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {msg.bodyText || 'HTML content included...'}
                  </p>

                  {/* Metadata Icons */}
                  <div className="flex items-center gap-3 mt-2">
                    {msg.securityScore?.phishingRisk === 'safe' && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3" />
                        Safe
                      </span>
                    )}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                        <Paperclip className="w-3 h-3 text-blue-400" />
                        {msg.attachments.length} {t('attachments')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
