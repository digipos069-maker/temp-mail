'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/LanguageContext';

export const SeoFaqSection: React.FC = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What is a Temporary Email Address and how does Temp Mail work?',
      answer: 'A temporary email address (also known as disposable mail, 10-minute mail, or fake mail) is a short-lived inbox that allows you to receive incoming emails without revealing your primary personal or work email address. Temp Mail generates disposable addresses instantly that auto-expire after your selected duration.'
    },
    {
      question: 'Why should I use a disposable temporary mail address?',
      answer: 'Using disposable mail protects your real inbox from spam, unwanted promotional newsletters, malware, and phishing attacks. It is ideal for signing up to new services, downloading whitepapers, performing QA testing on web applications, and avoiding data leaks.'
    },
    {
      question: 'How fast do incoming emails arrive in my inbox?',
      answer: 'Emails deliver instantly in real time using Server-Sent Events (SSE). Unlike legacy temp mail websites that require manual page refreshes, Temp Mail updates your inbox stream in less than 500 milliseconds.'
    },
    {
      question: 'Is Temp Mail completely free to use?',
      answer: 'Yes! Temp Mail is 100% free with unlimited disposable email address generation, custom alias creation, local SMTP server access, and developer REST API integrations.'
    },
    {
      question: 'How long do temporary email addresses and messages remain active?',
      answer: 'By default, temporary mailboxes remain active for 60 minutes. You can easily extend the lifespan by clicking "+ Add 30 mins" as many times as needed, or select 24-hour retention.'
    }
  ];

  // Schema.org FAQPage JSON-LD markup for Google Rich Snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return (
    <section className="w-full py-12 border-t border-slate-800/80 bg-slate-950/40 mt-12">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Title */}
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <HelpCircle className="w-4 h-4" />
            <span>{t('faqTitle')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            {t('faqSubtitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            {t('faqDescription')}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl transition"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-200 text-sm hover:text-white transition"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
