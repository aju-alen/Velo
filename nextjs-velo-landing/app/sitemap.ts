import type { MetadataRoute } from 'next';
import { getIndexablePages, siteConfig } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  return getIndexablePages().map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.template === 'blog' ? 'monthly' : 'weekly',
    priority: page.sitemapPriority ?? 0.5,
  }));
}
