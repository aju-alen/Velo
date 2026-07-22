export type SchemaType =
  | 'Organization'
  | 'WebSite'
  | 'FAQPage'
  | 'Service'
  | 'SoftwareApplication'
  | 'LocalBusiness'
  | 'Article';

export type IntentCluster = 'commercial' | 'transactional' | 'local' | 'informational' | 'utility';

export type PageTemplate = 'marketing' | 'blog' | 'tool' | 'custom';

export type FaqItem = {
  question: string;
  answer: string;
};

export type SectionContent = {
  body: string;
};

export type PageContent = {
  intro?: string;
  sections: Record<string, SectionContent>;
  faqs: FaqItem[];
};

export type CtaConfig = {
  label: string;
  href: string;
};

export type H2Config = {
  id: string;
  title: string;
};

export type SeoPageConfig = {
  slug: string;
  path: string;
  titleTag: string;
  description: string;
  h1: string;
  h2s: H2Config[];
  primaryCta: CtaConfig;
  internalLinks: string[];
  schemaTypes: SchemaType[];
  intent: IntentCluster;
  template: PageTemplate;
  noindex?: boolean;
  sitemapPriority?: number;
  footerGroup?: 'routes' | 'services' | 'company' | 'resources';
  footerLabel?: string;
};
