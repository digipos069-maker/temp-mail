'use client';

import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, QrCode as QrIcon, Smartphone } from 'lucide-react';

interface QrCodeModalProps {
  address: string;
  isOpen: boolean;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ address, isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current && address) {
      QRCode.toCanvas(canvasRef.current, address, {
        width: 220,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
    }
  }, [isOpen, address]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-100">Scan for Mobile Access</h3>
          <p className="text-xs text-slate-400 mt-1">Scan this QR code with your mobile camera to quickly copy your temporary address.</p>
        </div>

        <div className="bg-white p-4 rounded-xl inline-block shadow-inner">
          <canvas ref={canvasRef} className="mx-auto" />
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 font-bold break-all">
          {address}
        </div>
      </div>
    </div>
  );
};
