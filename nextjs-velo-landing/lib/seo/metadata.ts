import type { Metadata } from 'next';
import type { SeoPageConfig } from '@/types/seo';
import { siteConfig } from './site';

export function buildMetadata(config: SeoPageConfig): Metadata {
  return {
    title: config.titleTag,
    description: config.description,
    alternates: { canonical: config.path },
    openGraph: {
      title: config.titleTag,
      description: config.description,
      url: config.path,
      siteName: siteConfig.name,
      type: config.template === 'blog' ? 'article' : 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.titleTag,
      description: config.description,
    },
    robots: config.noindex ? { index: false, follow: false } : undefined,
  };
}
