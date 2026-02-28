import type { MetadataRoute } from 'next';

const BASE_URL = 'https://proconnect.in';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface SitemapProfessional {
  id: number;
  slug?: string | null;
}

export const revalidate = 3600; // regenerate sitemap at most once per hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let professionals: SitemapProfessional[] = [];

  try {
    const res = await fetch(
      `${API_URL}/api/professionals?pageSize=1000&available=true`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const data = await res.json();
      const list: SitemapProfessional[] = Array.isArray(data) ? data : (data.results ?? []);
      professionals = list;
    }
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
