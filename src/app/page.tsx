import type { Metadata } from 'next';
import { TRANSLATIONS, LanguageCode, SUPPORTED_LANGUAGES } from '@/lib/i18n/translations';
import MainDashboard from '@/components/MainDashboard';

interface PageProps {
  searchParams: { lang?: string };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const langCode = (searchParams.lang && SUPPORTED_LANGUAGES.some(l => l.code === searchParams.lang))
    ? (searchParams.lang as LanguageCode)
    : 'en';

  const t = TRANSLATIONS[langCode] || TRANSLATIONS['en'];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const title = `${t.appName} - ${t.tagline}`;
  const description = `${t.footerTagline} ${t.yourTempAddress}. ${t.disposableReadyNotice}`;

  // Map all 12 hreflang alternates
  const langAlternates = SUPPORTED_LANGUAGES.reduce((acc, l) => {
    acc[l.code] = l.code === 'en' ? baseUrl : `${baseUrl}/?lang=${l.code}`;
    return acc;
  }, {} as Record<string, string>);

  return {
    title,
    description,
    keywords: t.seoKeywords || [
      'temp mail',
      'temporary email',
      'disposable email',
      '10 minute mail',
      'fake mail'
    ],
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: langCode === 'en' ? baseUrl : `${baseUrl}/?lang=${langCode}`,
      languages: langAlternates,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: langCode === 'en' ? baseUrl : `${baseUrl}/?lang=${langCode}`,
      siteName: t.appName,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function HomePage({ searchParams }: PageProps) {
  const initialLang = (searchParams.lang && SUPPORTED_LANGUAGES.some(l => l.code === searchParams.lang))
    ? (searchParams.lang as LanguageCode)
    : undefined;

  return <MainDashboard initialLang={initialLang} />;
}
