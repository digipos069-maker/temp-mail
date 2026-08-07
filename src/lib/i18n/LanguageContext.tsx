'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
  TranslationDictionary,
  LanguageInfo
} from './translations';

export type StringTranslationKey = {
  [K in keyof TranslationDictionary]: TranslationDictionary[K] extends string ? K : never;
}[keyof TranslationDictionary];

interface LanguageContextType {
  currentLanguage: LanguageInfo;
  setLanguage: (code: LanguageCode) => void;
  t: (key: StringTranslationKey) => string;
  getKeywords: () => string[];
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

  const t = (key: StringTranslationKey): string => {
    const dict = TRANSLATIONS[langCode] || TRANSLATIONS['en'];
    const val = dict[key] || TRANSLATIONS['en'][key];
    return typeof val === 'string' ? val : (key as string);
  };

  const getKeywords = (): string[] => {
    const dict = TRANSLATIONS[langCode] || TRANSLATIONS['en'];
    return dict.seoKeywords || TRANSLATIONS['en'].seoKeywords;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage: handleSetLanguage, t, getKeywords }}>
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
