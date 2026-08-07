'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
  TranslationDictionary,
  LanguageInfo
} from './translations';

interface LanguageContextType {
  currentLanguage: LanguageInfo;
  setLanguage: (code: LanguageCode) => void;
  t: (key: keyof TranslationDictionary) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [langCode, setLangCode] = useState<LanguageCode>('en');

  // Load language from localStorage on initial render
  useEffect(() => {
    const saved = localStorage.getItem('temppulse_lang') as LanguageCode;
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      setLangCode(saved);
    }
  }, []);

  // Update localStorage and document properties when language changes
  const handleSetLanguage = (code: LanguageCode) => {
    setLangCode(code);
    localStorage.setItem('temppulse_lang', code);

    const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    if (langInfo) {
      document.documentElement.lang = code;
      document.documentElement.dir = langInfo.dir || 'ltr';
    }
  };

  useEffect(() => {
    const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    if (langInfo) {
      document.documentElement.lang = langCode;
      document.documentElement.dir = langInfo.dir || 'ltr';
    }
  }, [langCode]);

  const currentLanguage = SUPPORTED_LANGUAGES.find((l) => l.code === langCode) || SUPPORTED_LANGUAGES[0];

  const t = (key: keyof TranslationDictionary): string => {
    const dict = TRANSLATIONS[langCode] || TRANSLATIONS['en'];
    return dict[key] || TRANSLATIONS['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
