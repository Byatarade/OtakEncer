import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/'], // Halaman private dan backend disembunyikan
    },
    sitemap: 'https://otakencer.me/sitemap.xml',
  };
}