'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, X, Code2, Server } from 'lucide-react';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/api/v1/inbox',
      desc: 'Generate a new random or custom temporary email inbox',
      curl: `curl -X POST http://localhost:3000/api/v1/inbox \\\n  -H "Content-Type: application/json" \\\n  -d '{"customPrefix": "myalias", "customDomain": "temp-pulse.io", "ttlMinutes": 60}'`,
      response: `{
  "success": true,
  "inbox": {
    "address": "myalias@temp-pulse.io",
    "prefix": "myalias",
    "domain": "temp-pulse.io",
    "createdAt": "2026-08-07T20:30:00.000Z",
    "expiresAt": "2026-08-07T21:30:00.000Z",
    "ttlMinutes": 60
  }
}`
    },
    {
      method: 'GET',
      path: '/api/v1/inbox/:address/messages',
      desc: 'Retrieve all messages received by the specified temporary address',
      curl: `curl http://localhost:3000/api/v1/inbox/myalias@temp-pulse.io/messages`,
      response: `{
  "success": true,
  "address": "myalias@temp-pulse.io",
  "count": 1,
  "messages": [
    {
      "id": "msg_1723062600_a8x9",
      "senderName": "GitHub Security",
      "senderEmail": "noreply@github.com",
      "subject": "Verification code",
      "bodyText": "Your code is 849201",
      "receivedAt": "2026-08-07T20:31:00.000Z"
    }
  ]
}`
    },
    {
      method: 'POST',
      path: '/api/v1/webhook',
      desc: 'Inbound Webhook endpoint for receiving emails from external providers or custom MTA',
      curl: `curl -X POST http://localhost:3000/api/v1/webhook \\\n  -H "Content-Type: application/json" \\\n  -d '{"recipient": "myalias@temp-pulse.io", "senderEmail": "test@domain.com", "subject": "Hello", "text": "World"}'`,
      response: `{
  "success": true,
  "messageId": "msg_1723062600_b9y2",
  "recipient": "myalias@temp-pulse.io"
}`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 relative max-h-[90vh] flex flex-col">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Developer REST API Reference</h3>
            <p className="text-xs text-slate-400">Programmatically generate temporary inboxes and query incoming messages</p>
          </div>
        </div>

        {/* Local SMTP Banner */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
          <Server className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-slate-200 block">Local SMTP Receiver Active on Port 2525</span>
            <span className="text-slate-400">Send standard emails directly via SMTP to <code className="text-emerald-400">localhost:2525</code> using any mailer client.</span>
          </div>
        </div>

        {/* Endpoints List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {endpoints.map((ep, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    ep.method === 'POST' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {ep.method}
                  </span>
                  <code className="text-xs font-bold text-slate-200">{ep.path}</code>
                </div>
                <button
                  onClick={() => handleCopy(ep.curl, idx)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 bg-slate-900 px-2.5 py-1 rounded border border-slate-800"
                >
                  {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === idx ? 'Copied cURL' : 'Copy cURL'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-400">{ep.desc}</p>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
                <pre>{ep.curl}</pre>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
