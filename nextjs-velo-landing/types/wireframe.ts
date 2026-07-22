import type { CtaConfig, FaqItem } from '@/types/seo';

export type BenefitItem = {
  icon: string;
  title: string;
  description: string;
};

export type OptionCard = {
  title: string;
  description: string;
  href: string;
  learnMoreLabel?: string;
  bullets?: string[];
};

export type NarrativeBlock = {
  title: string;
  paragraphs: string[];
};

export type FinalCtaBlock = {
  headline: string;
  paragraphs: string[];
  cta: CtaConfig;
};

export type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

export type TableColumn = {
  key: string;
  label: string;
};

export type TableData = {
  title: string;
  columns: TableColumn[];
  rows: Record<string, string>[];
};

export type Testimonial = {
  quote: string;
  author: string;
  role?: string;
};

export type IndustryCard = {
  icon: string;
  title: string;
  description: string;
};

export type FeatureBlock = {
  icon: string;
  title: string;
  description: string;
};

export type SupportChannel = {
  type: 'phone' | 'whatsapp' | 'email';
  label: string;
  value: string;
  href: string;
};

export type BlogMeta = {
  date: string;
  category: string;
};

export type PricingSection = {
  title: string;
  body: string;
  cta: CtaConfig;
};

export type RouteWireframeConfig = {
  hero: {
    headline?: string;
    paragraphs: string[];
    cta: CtaConfig;
  };
  trust: {
    title: string;
    paragraphs: string[];
    items: BenefitItem[];
  };
  shippingOptions: {
    title: string;
    paragraphs: string[];
    items: OptionCard[];
  };
  narrative?: NarrativeBlock;
  pricing: PricingSection;
  process: {
    title: string;
    intro?: string;
    steps: ProcessStep[];
  };
  businessCta?: NarrativeBlock & { cta: CtaConfig };
  faqs: FaqItem[];
  finalCta: FinalCtaBlock;
  transitTable?: TableData;
  testimonials?: Testimonial[];
};

export type ServiceWireframeConfig = {
  hero?: {
    headline?: string;
    paragraphs: string[];
    cta: CtaConfig;
  };
  trust?: {
    title: string;
    paragraphs: string[];
    items: BenefitItem[];
  };
  benefits: BenefitItem[];
  cargoCards?: OptionCard[];
  cargoSection?: {
    title: string;
    paragraphs?: string[];
  };
  introNarrative?: NarrativeBlock;
  narrative?: NarrativeBlock;
  /** When true, `narrative` renders before audience/cargo cards (default: after). */
  narrativeBeforeCargo?: boolean;
  closingNarrative?: NarrativeBlock;
  pricing?: PricingSection;
  transitTable?: TableData;
  containerTable?: TableData;
  process: { title: string; intro?: string; steps: ProcessStep[] };
  businessCta?: NarrativeBlock & { cta: CtaConfig };
  coverage?: string[];
  industries?: IndustryCard[];
  dashboardFeatures?: FeatureBlock[];
  testimonials?: Testimonial[];
  faqs: FaqItem[];
  finalCta: CtaConfig | FinalCtaBlock;
};

export type AboutWireframeConfig = {
  hero?: {
    headline?: string;
    paragraphs: string[];
    cta: CtaConfig;
  };
  story: NarrativeBlock;
  lifestyleNarrative?: NarrativeBlock;
  cargoSection?: {
    title: string;
    paragraphs: string[];
    items: OptionCard[];
  };
  marketNarrative?: NarrativeBlock;
  longTermNarrative?: NarrativeBlock;
  appSection?: NarrativeBlock & { cta: CtaConfig };
  faqs: FaqItem[];
  finalCta: FinalCtaBlock;
};

export type PricingWireframeConfig = {
  hero?: {
    headline?: string;
    paragraphs: string[];
    cta: CtaConfig;
  };
  trust: {
    title: string;
    paragraphs: string[];
    items: BenefitItem[];
  };
  introNarrative?: NarrativeBlock;
  infoSection?: {
    title: string;
    paragraphs?: string[];
    items: OptionCard[];
  };
  narrative?: NarrativeBlock;
  process: {
    title: string;
    intro?: string;
    steps: ProcessStep[];
  };
  businessCta?: NarrativeBlock & { cta: CtaConfig };
  faqs: FaqItem[];
  finalCta: FinalCtaBlock;
};

export type TrackWireframeConfig = {
  hero?: {
    headline?: string;
    paragraphs: string[];
  };
  trust: {
    title: string;
    paragraphs: string[];
    items: BenefitItem[];
  };
  introNarrative?: NarrativeBlock;
  visibility: {
    title: string;
    paragraphs?: string[];
    items: OptionCard[];
  };
  businessCta?: NarrativeBlock & { cta: CtaConfig };
  supportNarrative?: NarrativeBlock;
  statusSteps: ProcessStep[];
  support: SupportChannel[];
  faqs: FaqItem[];
  finalCta: FinalCtaBlock;
};

export type BlogPostWireframeMeta = BlogMeta & {
  relatedPath: string;
  relatedTitle: string;
  intent?: 'informational' | 'commercial' | 'business' | 'tracking';
};
