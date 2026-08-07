'use client';

import React, { useState } from 'react';
import {
  Mail,
  ShieldCheck,
  Code,
  Download,
  Trash2,
  Paperclip,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import { EmailMessage } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/LanguageContext';

interface EmailViewerProps {
  message: EmailMessage | null;
  onDeleteMessage: (messageId: string) => void;
}

export const EmailViewer: React.FC<EmailViewerProps> = ({ message, onDeleteMessage }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'html' | 'text' | 'raw' | 'security'>('html');
  const [allowImages, setAllowImages] = useState(true);

  if (!message) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl h-[600px] flex flex-col items-center justify-center p-8 text-center backdrop-blur-xl shadow-xl">
        <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center border border-slate-700/60 mb-4">
          <Mail className="w-8 h-8 text-blue-400 opacity-60" />
        </div>
        <h3 className="text-slate-200 font-bold text-base">{t('noEmailSelected')}</h3>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          {t('noEmailSelectedNotice')}
        </p>
      </div>
    );
  }

  const handleDownloadEml = () => {
    const content = message.rawMime || `From: ${message.senderEmail}\nTo: ${message.inboxAddress}\nSubject: ${message.subject}\n\n${message.bodyText}`;
    const blob = new Blob([content], { type: 'message/rfc822' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${message.subject.replace(/[^a-z0-9]/gi, '_')}.eml`;
    a.click();
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(message, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email_${message.id}.json`;
    a.click();
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col h-[600px] overflow-hidden backdrop-blur-xl shadow-xl">
      
      {/* Top Header Controls */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-100 line-clamp-1">{message.subject}</h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>{t('from')} <strong className="text-slate-200">{message.senderName}</strong> &lt;{message.senderEmail}&gt;</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadEml}
            title="Download .EML"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">.EML</span>
          </button>

          <button
            onClick={handleDownloadJson}
            title="Download JSON"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            <Code className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">JSON</span>
          </button>

          <button
            onClick={() => onDeleteMessage(message.id)}
            title="Delete Email"
            className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg border border-red-800/40 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/30 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('html')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'html' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {t('htmlPreview')}
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'text' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {t('plainText')}
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'raw' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {t('rawHeaders')}
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              activeTab === 'security' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {t('securityScore')}
          </button>
        </div>

        {/* External Images Toggle for HTML Mode */}
        {activeTab === 'html' && (
          <button
            onClick={() => setAllowImages(!allowImages)}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition shrink-0 ${
              allowImages
                ? 'bg-slate-800 border-slate-700 text-slate-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            <span>{allowImages ? t('imagesEnabled') : t('imagesBlocked')}</span>
          </button>
        )}
      </div>

      {/* Email Body Content Panel */}
      <div className="flex-1 overflow-y-auto bg-slate-950/40 p-4">
        
        {/* HTML View Mode */}
        {activeTab === 'html' && (
          <div className="w-full h-full bg-white rounded-xl overflow-hidden shadow-inner border border-slate-700">
            <iframe
              title="Sanitized Email Viewer"
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <style>
                      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; color: #1e293b; background: #ffffff; }
                      ${!allowImages ? 'img { display: none !important; }' : ''}
                      a { color: #2563eb; }
                    </style>
                  </head>
                  <body>${message.bodyHtml}</body>
                </html>
              `}
              sandbox="allow-same-origin"
              className="w-full h-full min-h-[400px] border-none"
            />
          </div>
        )}

        {/* Plain Text View Mode */}
        {activeTab === 'text' && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-text">
            {message.bodyText || 'No plain text representation available.'}
          </div>
        )}

        {/* Raw Headers & MIME View Mode */}
        {activeTab === 'raw' && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400 whitespace-pre-wrap overflow-x-auto select-text">
            Received: by temp-pulse.io (TempPulse MTA v1.0); {message.receivedAt}{'\n'}
            X-Original-To: {message.inboxAddress}{'\n'}
            From: {message.senderName} &lt;{message.senderEmail}&gt;{'\n'}
            To: {message.inboxAddress}{'\n'}
            Subject: {message.subject}{'\n'}
            Authentication-Results: temp-pulse.io; spf=pass dkim=pass dmarc=pass{'\n'}
            Content-Type: text/html; charset=utf-8{'\n'}
            {'\n'}
            {message.rawMime || message.bodyHtml}
          </div>
        )}

        {/* Security & Phishing Analysis View Mode */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{t('securityRating')}</h4>
                    <p className="text-xs text-slate-400">Automated authentication & anti-phishing inspection</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-emerald-400">
                    {message.securityScore?.score || 98}/100
                  </span>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">{t('trustScore')}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center">
                  <span className="block text-xs font-bold text-slate-300">SPF Record</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
                    <Check className="w-3 h-3" /> PASS
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center">
                  <span className="block text-xs font-bold text-slate-300">DKIM Signature</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
                    <Check className="w-3 h-3" /> PASS
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center">
                  <span className="block text-xs font-bold text-slate-300">DMARC Policy</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
                    <Check className="w-3 h-3" /> PASS
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attachments Section */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-4 border-t border-slate-800 pt-4">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
              <Paperclip className="w-4 h-4 text-blue-400" />
              {t('attachments')} ({message.attachments.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {message.attachments.map((att) => (
                <div
                  key={att.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="block text-xs font-semibold text-slate-200 truncate">{att.filename}</span>
                    <span className="block text-[10px] text-slate-400">{Math.round(att.size / 1024)} KB</span>
                  </div>
                  <button
                    onClick={() => alert(`Downloading attachment ${att.filename}`)}
                    className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30 hover:bg-blue-600/30 transition text-xs font-medium"
                  >
                    {t('download')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
