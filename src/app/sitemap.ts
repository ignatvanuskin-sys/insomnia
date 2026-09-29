import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/data/business';
import { quests } from '@/data/business';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/booking`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    ...quests.map((q) => ({
      url: `${SITE_URL}/quests/${q.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
