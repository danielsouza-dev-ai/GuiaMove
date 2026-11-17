import type { MetadataRoute } from 'next';

const LAST_MODIFIED = new Date('2026-11-16T23:00:00.000Z');

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://guiamove.vercel.app',
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://guiamove.vercel.app/temporizador',
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://guiamove.vercel.app/termometro',
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://guiamove.vercel.app/rotinas',
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://guiamove.vercel.app/about',
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://guiamove.vercel.app/contact',
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://guiamove.vercel.app/privacy',
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
