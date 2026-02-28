import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/list-service', '/api/'],
      },
    ],
    sitemap: 'https://proconnect.in/sitemap.xml',
  };
}
