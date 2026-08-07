import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TempPulse - Free Disposable Temporary Email System & Disposable Inbox',
  description: 'Instant, private, and free temporary email address generator. Receive emails in real-time without registration, avoid spam, test web applications, and protect your primary email.',
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
  authors: [{ name: 'TempPulse Engineering' }],
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'TempPulse - Free Disposable Temporary Email System',
    description: 'Protect your primary inbox from spam. Generate instant temporary email addresses with real-time SSE delivery and security analysis.',
    type: 'website',
    url: 'http://localhost:3000',
    siteName: 'TempPulse',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TempPulse - Temporary Email Platform',
    description: 'Instant disposable email generator with real-time SSE stream & developer API.',
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
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        <div className="fixed inset-0 bg-radial-glow pointer-events-none -z-10" />
        {children}
      </body>
    </html>
  );
}
