import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

export const metadata: Metadata = {
  title: 'Temp Mail - Free Disposable Temporary Email System & Disposable Inbox',
  description: 'Instant, private, and free temporary email address generator in 12 languages. Receive emails in real-time without registration, avoid spam, test web applications, and protect your primary email.',
  keywords: [
    'temp mail',
    'temporary email',
    'disposable email',
    '10 minute mail',
    'throwaway email',
    'fake email generator',
    'free temp mail',
    'anonymous email',
    'temp inbox',
    'mail generator'
  ],
  authors: [{ name: 'Temp Mail Engineering' }],
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tempomail.store'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
      'km': '/?lang=km',
      'th': '/?lang=th',
      'vi': '/?lang=vi',
      'ko': '/?lang=ko',
      'zh': '/?lang=zh',
      'ru': '/?lang=ru',
      'ja': '/?lang=ja',
      'fr': '/?lang=fr',
      'hi': '/?lang=hi',
      'ur': '/?lang=ur',
      'pt-BR': '/?lang=pt-BR',
    },
  },
  openGraph: {
    title: 'Temp Mail - Free Disposable Temporary Email System',
    description: 'Protect your primary inbox from spam. Generate instant temporary email addresses with real-time SSE delivery and security analysis.',
    type: 'website',
    url: 'https://www.tempomail.store',
    siteName: 'Temp Mail',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Temp Mail - Temporary Email Platform',
    description: 'Instant disposable email generator with real-time SSE stream & developer API in 12 languages.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3F3PY1KPDQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3F3PY1KPDQ');
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        <LanguageProvider>
          <div className="fixed inset-0 bg-radial-glow pointer-events-none -z-10" />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
