import type { BlogPostWireframeMeta } from '@/types/wireframe';
import { blogCtaByIntent, blogFinalCtaTemplate } from './blog-article-framework';

export { blogArticleStructure, blogCtaByIntent, blogFinalCtaTemplate, blogVoiceGuidelines, blogArticleTypeExamples, requiredBlogFaqs } from './blog-article-framework';

export const blogPostMeta: Record<string, BlogPostWireframeMeta> = {
  'blog-shipping-cost-dubai-to-kenya': {
    date: 'March 15, 2025',
    category: 'Shipping Guides',
    relatedPath: '/blog/air-freight-vs-sea-freight-kenya',
    relatedTitle: 'Air Freight vs Sea Freight: Which Option Is Right for You?',
    intent: 'informational',
  },
  'blog-air-freight-vs-sea-freight-kenya': {
    date: 'April 2, 2025',
    category: 'Shipping Guides',
    relatedPath: '/blog/shipping-cost-dubai-to-kenya',
    relatedTitle: 'How Much Does Shipping from Dubai to Kenya Cost?',
    intent: 'informational',
  },
};

export function getBlogPostMeta(slug: string): BlogPostWireframeMeta | undefined {
  return blogPostMeta[slug];
}

export function getBlogIntentCta(intent: BlogPostWireframeMeta['intent'] = 'commercial') {
  return blogCtaByIntent[intent ?? 'commercial'];
}

export function getBlogFinalCta() {
  return blogFinalCtaTemplate;
}
