import type { MetadataRoute } from 'next';
import { getProfessionals } from '@/lib/api';

const BASE_URL = 'https://proconnect.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let professionals: Awaited<ReturnType<typeof getProfessionals>> = [];

  try {
    professionals = await getProfessionals({ pageSize: 1000, available: true });
  } catch {
    // silently fall back to static URLs only
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/professionals`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/for-professionals`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/list-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const professionalRoutes: MetadataRoute.Sitemap = professionals.map((p) => ({
    url: `${BASE_URL}/professionals/${p.slug ?? p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...professionalRoutes];
}
