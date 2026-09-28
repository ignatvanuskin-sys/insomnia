import type { MetadataRoute } from 'next';
import { quests } from '@/data/business';

const BASE = 'https://insomnia-karaganda.kz';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/booking`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    ...quests.map((q) => ({
      url: `${BASE}/quests/${q.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
