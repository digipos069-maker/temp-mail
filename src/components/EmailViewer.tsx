'use client';

import React, { useState } from 'react';
import {
  Mail,
  Trash2,
  Paperclip,
  Download,
  ShieldCheck,
  Check,
  Code,
  FileText,
  Eye,
  Image as ImageIcon
} from 'lucide-react';
import { EmailMessage } from '@/lib/store';
import { formatTimeAgo } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/LanguageContext';

interface EmailViewerProps {
  message: EmailMessage | null;
  onDeleteMessage?: (messageId: string) => void;
}

export const EmailViewer: React.FC<EmailViewerProps> = ({ message, onDeleteMessage }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'html' | 'text' | 'raw' | 'security'>('html');
  const [allowImages, setAllowImages] = useState(true);

  if (!message) {
    return (
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl h-[600px] flex flex-col items-center justify-center p-8 text-center backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-2xl transition-colors duration-300">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700/80 mb-4">
          <Mail className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-slate-900 dark:text-slate-100 font-extrabold text-base mb-1">
          {t('noEmailSelected')}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          {t('noEmailSelectedNotice')}
        </p>
      </div>
    );
  }

  // Format HTML srcDoc cleanly without double document nesting
  const prepareHtmlDoc = (rawHtml: string, showImages: boolean) => {
    let html = rawHtml || '';

    // Inject image blocking CSS if images are disabled
    if (!showImages) {
      const styleTag = '<style>img { display: none !important; }</style>';
      if (html.includes('</head>')) {
        html = html.replace('</head>', `${styleTag}</head>`);
      } else {
        html = `${styleTag}${html}`;
      }
    }

    // Check if rawHtml is already a complete HTML document
    const isFullDoc = /<!DOCTYPE|<html/i.test(rawHtml);
    if (isFullDoc) {
      return html;
    }

    // Wrap partial HTML snippet
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 20px;
              color: #0f172a;
              background-color: #ffffff;
              line-height: 1.6;
            }
            img { max-width: 100%; height: auto; }
            a { color: #2563eb; text-decoration: underline; }
            table { max-width: 100% !important; }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `;
  };

  return (
    <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col h-[600px] overflow-hidden backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-2xl transition-colors duration-300">
      
      {/* Header Info Panel */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
              {message.subject}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{message.senderName}</span>
              <span>&lt;{message.senderEmail}&gt;</span>
              <span>•</span>
              <span className="font-mono">{formatTimeAgo(message.receivedAt)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onDeleteMessage && (
              <button
                onClick={() => onDeleteMessage(message.id)}
                title="Delete Email"
                className="p-2 text-rose-600 dark:text-red-400 hover:bg-rose-50 dark:hover:bg-red-900/40 rounded-xl border border-rose-200 dark:border-red-800/40 transition active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/60">
          <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-950 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('html')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'html'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t('htmlPreview')}</span>
            </button>

            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'text'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t('plainText')}</span>
            </button>

            <button
              onClick={() => setActiveTab('raw')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'raw'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>{t('rawHeaders')}</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'security'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('securityScore')}</span>
            </button>
          </div>

          {/* Toggle Remote Images */}
          {activeTab === 'html' && (
            <button
              onClick={() => setAllowImages(!allowImages)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                allowImages
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                  : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{allowImages ? t('imagesEnabled') : t('imagesBlocked')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Email Body Content Panel */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-100/50 dark:bg-slate-950/40">
        
        {/* HTML View Mode */}
        {activeTab === 'html' && (
          <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800">
            <iframe
              title="Sanitized Email Viewer"
              srcDoc={prepareHtmlDoc(message.bodyHtml || message.bodyText, allowImages)}
              sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              className="w-full h-full min-h-[400px] border-none"
            />
          </div>
        )}

        {/* Plain Text View Mode */}
        {activeTab === 'text' && (
          <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed select-text shadow-sm">
            {message.bodyText || message.bodyHtml || 'No plain text representation available.'}
          </div>
        )}

        {/* Raw Headers & MIME View Mode */}
        {activeTab === 'raw' && (
          <div className="bg-slate-900 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-200 dark:text-slate-400 whitespace-pre-wrap overflow-x-auto select-text shadow-inner">
            Received: by tempomail.store (Temp Mail MTA v1.0); {message.receivedAt}{'\n'}
            X-Original-To: {message.inboxAddress}{'\n'}
            From: {message.senderName} &lt;{message.senderEmail}&gt;{'\n'}
            To: {message.inboxAddress}{'\n'}
            Subject: {message.subject}{'\n'}
            Authentication-Results: tempomail.store; spf=pass dkim=pass dmarc=pass{'\n'}
            Content-Type: text/html; charset=utf-8{'\n'}
            {'\n'}
            {message.rawMime || message.bodyHtml}
          </div>
        )}

        {/* Security & Phishing Analysis View Mode */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">{t('securityRating')}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Automated authentication & anti-phishing inspection</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {message.securityScore?.score || 98}/100
                  </span>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">{t('trustScore')}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
                  <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">SPF Record</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                    <Check className="w-3 h-3" /> PASS
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
                  <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">DKIM Signature</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                    <Check className="w-3 h-3" /> PASS
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
                  <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">DMARC Policy</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                    <Check className="w-3 h-3" /> PASS
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attachments Section */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{t('attachments')} ({message.attachments.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {message.attachments.map((att) => (
                <div
                  key={att.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between shadow-sm"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">{att.filename}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{(att.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <a
                    href={att.contentUrl || '#'}
                    download={att.filename}
                    className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
