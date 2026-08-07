'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/LanguageContext';
import { SUPPORTED_LANGUAGES, LanguageCode } from '@/lib/i18n/translations';
import { ChevronDown, Check } from 'lucide-react';

// Import SVG country flags from country-flag-icons
import {
  US,
  KH,
  TH,
  VN,
  KR,
  CN,
  RU,
  JP,
  FR,
  IN,
  PK,
  BR
} from 'country-flag-icons/react/3x2';

const FlagComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  US,
  KH,
  TH,
  VN,
  KR,
  CN,
  RU,
  JP,
  FR,
  IN,
  PK,
  BR
};

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const CurrentFlag = FlagComponents[currentLanguage.flagCode] || US;

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Selector Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 transition shadow-sm active:scale-95"
        title="Select Language"
      >
        <div className="w-5 h-3.5 rounded-sm overflow-hidden border border-slate-600/50 shadow-sm shrink-0 flex items-center justify-center">
          <CurrentFlag className="w-full h-full object-cover" />
        </div>
        <span className="hidden sm:inline font-medium">{currentLanguage.nativeName}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-fade-in backdrop-blur-xl max-h-80 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 mb-1">
            Select Language
          </div>

          <div className="space-y-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const FlagIcon = FlagComponents[lang.flagCode] || US;
              const isSelected = currentLanguage.code === lang.code;

              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                    isSelected
                      ? 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-3.5 rounded-sm overflow-hidden border border-slate-600/50 shadow-sm shrink-0 flex items-center justify-center">
                      <FlagIcon className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                      <span className="block text-xs leading-tight">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{lang.name}</span>
                    </div>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
