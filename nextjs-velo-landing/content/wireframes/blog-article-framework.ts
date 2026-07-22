/**
 * Phase 6 — Blog Article Framework
 * Governs every article published on Velo (Phase 9 writing standard).
 * No AI-style patterns. No filler. No writing for algorithms at the expense of readers.
 */

export type BlogArticleIntent =
  | 'informational'
  | 'commercial'
  | 'business'
  | 'tracking';

export type BlogArticleType =
  | 'cost'
  | 'route'
  | 'educational'
  | 'comparison'
  | 'business';

export const blogArticleStructure = [
  {
    id: 'problem',
    title: 'Start With The Problem',
    guidance:
      'Avoid essay openings. Begin with the question or frustration that caused the search. Place the primary keyword in the title tag, H1, and opening paragraph.',
  },
  {
    id: 'why-not-simple',
    title: "Explain Why The Question Doesn't Have A Simple Answer",
    guidance:
      "People want clarity, not complexity. Explain the variables without drowning the reader.",
  },
  {
    id: 'answer',
    title: 'Answer The Main Question',
    guidance:
      'Deliver on the title promise immediately. No delaying, storytelling, or fluff.',
  },
  {
    id: 'hidden-questions',
    title: 'Address Hidden Questions',
    guidance:
      'Anticipate related questions: cost, tracking, business suitability, what can be shipped.',
  },
  {
    id: 'compare',
    title: 'Compare Alternatives',
    guidance:
      'Help readers compare honestly. Never declare one option universally better.',
  },
  {
    id: 'velo',
    title: 'Introduce Velo Naturally',
    guidance:
      'Educate first. Product enters only when useful. Never interrupt with a sales pitch.',
  },
  {
    id: 'faq',
    title: 'FAQ Section',
    guidance:
      'Cover pickup, tracking, delivery outside Nairobi, pricing factors, and business use.',
  },
  {
    id: 'next-step',
    title: 'End With The Next Logical Step',
    guidance: 'CTA depends on search intent.',
  },
] as const;

export const blogCtaByIntent: Record<BlogArticleIntent, { label: string; href: string }> = {
  informational: { label: 'Calculate Shipping Costs', href: '/pricing-calculator' },
  commercial: { label: 'Request a Quote', href: '/contact' },
  business: { label: 'Explore Business Shipping', href: '/business-shipping' },
  tracking: { label: 'Track Your Shipment', href: '/track-shipment' },
};

export const blogFinalCtaTemplate = {
  headline: 'The Right Information Makes Shipping Easier',
  paragraphs: [
    'Understanding your options is often the difference between an expensive mistake and a confident decision.',
    "If you're planning a shipment from Dubai to Kenya, start with the information you need and move forward when you're ready.",
  ],
  primaryCta: { label: 'Request a Quote', href: '/contact' },
};

/** Words and patterns to avoid in Velo blog content. */
export const blogVoiceAvoid = [
  'solutions',
  'seamless',
  'cutting-edge',
  'innovative',
  'leading provider',
  'world-class',
  'end-to-end solutions',
  'revolutionize your shipping experience',
  'transform your logistics today',
  'unlock efficiency',
] as const;

export const blogVoiceGuidelines = {
  use: ['You', 'Your shipment', 'Your business'],
  avoid: blogVoiceAvoid,
  rhythm:
    'Conversational and uneven, like a person speaking. Avoid stacked short-sentence AI rhythms.',
  keywords: 'Answer a question first. Never stuff keywords.',
};

export const blogArticleTypeExamples: Record<BlogArticleType, string[]> = {
  cost: [
    'How Much Does Shipping From Dubai to Kenya Cost?',
    'Air Freight vs Sea Freight Costs',
    'What Affects Shipping Prices?',
  ],
  route: [
    'Shipping From Dubai to Nairobi',
    'Shipping From UAE to Kenya',
    'Sending Packages to Mombasa',
  ],
  educational: [
    'How Does Door-to-Door Shipping Work?',
    'What Is Freight Forwarding?',
    'What Can You Ship From Dubai to Kenya?',
  ],
  comparison: [
    'Air Freight vs Sea Freight',
    'Door-to-Door Shipping vs Traditional Cargo Agents',
    'Courier Services vs Freight Forwarding',
  ],
  business: [
    'How Businesses Import Goods From Dubai to Kenya',
    'Avoiding Inventory Delays',
    'Choosing The Right Shipping Method For Your Business',
  ],
};

export const requiredBlogFaqs = [
  'Can I schedule pickup?',
  'Can I track my shipment?',
  'Do you deliver outside Nairobi?',
  'What affects pricing?',
  'Can businesses use this service?',
];
