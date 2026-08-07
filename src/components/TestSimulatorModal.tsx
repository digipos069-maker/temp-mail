'use client';

import React, { useState } from 'react';
import { Sparkles, Shield, Key, Receipt, FileText, X, Check } from 'lucide-react';
import { PresetTemplate } from '@/lib/simulator';

interface TestSimulatorModalProps {
  activeAddress: string;
  isOpen: boolean;
  onClose: () => void;
  onSendSuccess: () => void;
}

export const TestSimulatorModal: React.FC<TestSimulatorModalProps> = ({
  activeAddress,
  isOpen,
  onClose,
  onSendSuccess
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PresetTemplate>('otp');
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const templates: { id: PresetTemplate; name: string; desc: string; icon: any }[] = [
    { id: 'otp', name: '2FA Verification Code', desc: 'GitHub device login OTP verification code', icon: Key },
    { id: 'welcome', name: 'Welcome Email', desc: 'Vercel Pro account onboarding welcome message', icon: Sparkles },
    { id: 'invoice', name: 'Stripe Receipt', desc: 'Itemized invoice receipt with attached PDF', icon: Receipt },
    { id: 'security', name: 'Security Alert', desc: 'Google login detection warning from new macOS device', icon: Shield },
    { id: 'newsletter', name: 'Tech Digest Newsletter', desc: 'HTML newsletter with formatted articles and buttons', icon: FileText }
  ];

  const handleSend = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: activeAddress, template: selectedTemplate })
      });
      const data = await res.json();
      if (data.success) {
        setSentSuccess(true);
        setTimeout(() => {
          setSentSuccess(false);
          onSendSuccess();
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Send Test Email</h3>
            <p className="text-xs text-slate-400">Simulate incoming real-world emails to your active inbox</p>
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
          <span className="text-slate-400">Target Inbox:</span>
          <span className="font-mono font-bold text-blue-400">{activeAddress}</span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {templates.map((tpl) => {
            const Icon = tpl.icon;
            const isSelected = selectedTemplate === tpl.id;

            return (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500/80'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{tpl.name}</h4>
                    <p className="text-[11px] text-slate-400">{tpl.desc}</p>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading || sentSuccess}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs shadow-lg shadow-purple-600/30 transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <span>Dispatching...</span>
            ) : sentSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Delivered!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Dispatch Email</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
