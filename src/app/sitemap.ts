import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tempomail.store';
  const languages = ['en', 'km', 'th', 'vi', 'ko', 'zh', 'ru', 'ja', 'fr', 'hi', 'ur', 'pt-BR'];

  // Map alternates for hreflang
  const langAlternates = languages.reduce((acc, code) => {
    acc[code] = code === 'en' ? baseUrl : `${baseUrl}/?lang=${code}`;
    return acc;
  }, {} as Record<string, string>);

  const sitemapEntries: MetadataRoute.Sitemap = languages.map((lang) => ({
    url: lang === 'en' ? baseUrl : `${baseUrl}/?lang=${lang}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: lang === 'en' ? 1.0 : 0.9,
    alternates: {
      languages: langAlternates,
    },
  }));

  // Add developer API documentation page
  sitemapEntries.push({
    url: `${baseUrl}/api-docs`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  });

  return sitemapEntries;
}
