import type { PageContent } from '@/types/seo';
import { placeholderSections } from '@/lib/seo/utils';
import { getPageConfig } from '@/lib/seo/pages';

const homeFaqs = [
  {
    question: 'Can I schedule a pickup?',
    answer:
      'Yes. Collection requests are handled through the Velo app, and pickup is intended to cover locations across Dubai and the UAE.',
  },
  {
    question: 'What can I ship?',
    answer: 'Everything from documents and personal parcels to commercial cargo and heavy machinery.',
  },
  {
    question: 'Can I track my shipment?',
    answer: "Yes. You'll be able to monitor your shipment throughout the shipping process.",
  },
  {
    question: 'Do you deliver outside Nairobi?',
    answer: 'Yes. Deliveries are intended to cover destinations throughout Kenya.',
  },
  {
    question: 'How much does shipping from Dubai to Kenya cost?',
    answer:
      'Pricing depends on factors such as weight, dimensions, cargo type, and delivery requirements. Estimates are calculated through the platform.',
  },
];

function emptyContent(slug: string): PageContent {
  const config = getPageConfig(slug);
  return {
    intro: '[Your intro content here]',
    sections: placeholderSections(config.h2s),
    faqs: [],
  };
}

const contentRegistry: Record<string, PageContent> = {
  home: {
    sections: {},
    faqs: homeFaqs,
  },
  'shipping-from-dubai-to-kenya': {
    sections: {},
    faqs: [
      {
        question: 'Can I ship personal items from Dubai to Kenya?',
        answer: 'Yes. Velo supports both personal parcels and commercial cargo.',
      },
      {
        question: 'Can I send heavy machinery?',
        answer: 'Yes. Shipments range from envelopes and documents to oversized cargo and machinery.',
      },
      {
        question: 'Do you only deliver to Nairobi?',
        answer: 'No. Deliveries are intended to cover destinations throughout Kenya.',
      },
      {
        question: 'Can I track my shipment?',
        answer: 'Yes. Tracking updates are available throughout the shipping process.',
      },
      {
        question: 'How much does shipping from Dubai to Kenya cost?',
        answer:
          'Pricing depends on the weight, dimensions, cargo type, shipping method, and delivery requirements.',
      },
      {
        question: 'Can I arrange pickup?',
        answer: 'Yes. Pickup requests are handled through the Velo platform.',
      },
    ],
  },
  'cargo-services-dubai-to-nairobi': emptyContent('cargo-services-dubai-to-nairobi'),
  'door-to-door-shipping-kenya': {
    sections: {},
    faqs: [
      {
        question: 'What is door-to-door shipping?',
        answer:
          'Door-to-door shipping means your cargo is collected from your location and delivered to its destination without requiring you to manage multiple stages yourself.',
      },
      {
        question: 'Can I arrange pickup from anywhere in Dubai?',
        answer: 'Pickup is intended to cover locations throughout Dubai and the UAE.',
      },
      {
        question: 'Do you deliver outside Nairobi?',
        answer: 'Yes. Deliveries are intended to cover destinations throughout Kenya.',
      },
      {
        question: 'Can I track my shipment?',
        answer: 'Yes. Tracking updates are available throughout the process.',
      },
      {
        question: 'What can I ship?',
        answer: 'Personal parcels, commercial cargo, household goods, machinery, and many other shipment types.',
      },
      {
        question: 'How much does door-to-door shipping cost?',
        answer:
          'Pricing depends on factors such as weight, dimensions, cargo type, and delivery requirements.',
      },
    ],
  },
  'air-freight-dubai-to-kenya': {
    sections: {},
    faqs: [
      {
        question: 'How fast is air freight from Dubai to Kenya?',
        answer:
          'Transit times depend on the shipment and customs requirements, but air freight is generally the fastest shipping option available.',
      },
      {
        question: 'What can I send by air?',
        answer: 'Documents, electronics, personal parcels, commercial cargo, and many other shipment types.',
      },
      {
        question: 'Can I track my shipment?',
        answer: 'Yes. Tracking updates are available throughout the process.',
      },
      {
        question: 'Can I arrange pickup?',
        answer: 'Yes. Collection requests are handled through the Velo platform.',
      },
      {
        question: 'Do you deliver outside Nairobi?',
        answer: 'Yes. Deliveries are intended to cover destinations throughout Kenya.',
      },
      {
        question: 'How much does air freight from Dubai to Kenya cost?',
        answer:
          'Pricing depends on factors such as weight, dimensions, cargo type, and delivery requirements.',
      },
    ],
  },
  'sea-freight-dubai-to-kenya': {
    sections: {},
    faqs: [
      {
        question: 'How long does sea freight from Dubai to Kenya take?',
        answer:
          'Transit times vary depending on cargo requirements, shipping schedules, and customs procedures. Sea freight is generally chosen when cost efficiency matters more than speed.',
      },
      {
        question: 'What types of cargo can be shipped by sea?',
        answer: 'Personal effects, commercial inventory, household goods, machinery, and many other cargo types.',
      },
      {
        question: 'Can I track my shipment?',
        answer: 'Yes. Tracking updates are available throughout the shipping process.',
      },
      {
        question: 'Can I arrange pickup?',
        answer: 'Yes. Collection requests are handled through the Velo platform.',
      },
      {
        question: 'Do you deliver outside Nairobi?',
        answer: 'Yes. Deliveries are intended to cover destinations throughout Kenya.',
      },
      {
        question: 'How much does sea freight from Dubai to Kenya cost?',
        answer: 'Pricing depends on weight, dimensions, cargo type, and delivery requirements.',
      },
    ],
  },
  'package-pickup-dubai': {
    sections: {},
    faqs: [
      {
        question: 'Can I schedule a pickup through the app?',
        answer: 'Yes. Pickup requests are handled directly through the Velo platform.',
      },
      {
        question: 'Where can my package be collected from?',
        answer:
          'Collection is intended to cover homes, offices, warehouses, and other locations across Dubai and the UAE.',
      },
      {
        question: 'What can I ship?',
        answer: 'Everything from documents and personal parcels to commercial cargo and heavy machinery.',
      },
      {
        question: 'Can I track my shipment after collection?',
        answer: 'Yes. Tracking updates are available throughout the process.',
      },
      {
        question: 'Do you deliver outside Nairobi?',
        answer: 'Yes. Deliveries are intended to cover destinations throughout Kenya.',
      },
      {
        question: 'How much does shipping cost?',
        answer:
          'Pricing depends on factors such as dimensions, weight, cargo type, and delivery requirements.',
      },
    ],
  },
  'business-shipping': {
    sections: {},
    faqs: [
      {
        question: 'Can businesses schedule pickups?',
        answer: 'Yes. Pickup requests are handled through the Velo platform.',
      },
      {
        question: 'Can I ship commercial inventory?',
        answer: 'Yes. Velo supports commercial cargo, inventory shipments, and larger consignments.',
      },
      {
        question: 'Can I track shipments?',
        answer: 'Yes. Tracking updates are available throughout the shipping process.',
      },
      {
        question: 'Do you deliver outside Nairobi?',
        answer: 'Yes. Deliveries are intended to cover destinations throughout Kenya.',
      },
      {
        question: 'Can businesses use both air and sea freight?',
        answer: 'Yes. Different shipping methods are available depending on your requirements.',
      },
      {
        question: 'How are shipping costs calculated?',
        answer:
          'Pricing depends on factors such as weight, dimensions, cargo type, and delivery requirements.',
      },
    ],
  },
  about: {
    sections: {},
    faqs: [
      {
        question: 'Where is Velo based?',
        answer:
          'Velo operates from Dubai and focuses on helping customers and businesses move goods to Kenya.',
      },
      {
        question: 'What types of cargo do you handle?',
        answer: 'Everything from documents and personal parcels to commercial cargo and heavy machinery.',
      },
      {
        question: 'Do you deliver outside Nairobi?',
        answer: 'Yes. Deliveries are intended to cover destinations throughout Kenya.',
      },
      {
        question: 'Can I arrange pickups?',
        answer: 'Yes. Pickup requests are handled through the Velo platform.',
      },
      {
        question: 'Can I track shipments?',
        answer: 'Yes. Tracking updates are available throughout the process.',
      },
      {
        question: 'Is Velo only for businesses?',
        answer: 'No. Velo supports both individuals and businesses.',
      },
    ],
  },
  'track-shipment': {
    sections: {},
    faqs: [
      {
        question: 'Can I track my shipment in real time?',
        answer: 'Yes. Tracking updates are available throughout the shipping process.',
      },
      {
        question: 'Do I need the app to track my cargo?',
        answer: 'Tracking capabilities are available through the Velo platform.',
      },
      {
        question: 'Can I track business shipments?',
        answer: 'Yes. Both personal and commercial cargo can be tracked.',
      },
      {
        question: 'Does tracking work outside Nairobi?',
        answer: 'Yes. Deliveries are intended to cover destinations throughout Kenya.',
      },
      {
        question: 'Can I track shipments after pickup?',
        answer: 'Yes. Tracking begins once your shipment enters the process.',
      },
      {
        question: 'What types of cargo can be tracked?',
        answer:
          'Everything from documents and personal parcels to commercial inventory and machinery.',
      },
    ],
  },
  'pricing-calculator': {
    sections: {},
    faqs: [
      {
        question: 'How are shipping costs calculated?',
        answer:
          'Pricing depends on weight, dimensions, cargo type, shipping method, and delivery requirements.',
      },
      {
        question: 'Can I calculate prices through the app?',
        answer: 'Yes. Estimates are generated through the Velo platform.',
      },
      {
        question: 'Is air freight more expensive than sea freight?',
        answer:
          'Generally, air freight prioritizes speed while sea freight prioritizes cost efficiency. The right option depends on what you\'re shipping.',
      },
      {
        question: 'Can I arrange pickup after receiving an estimate?',
        answer: 'Yes. Collection requests can be scheduled through the platform.',
      },
      {
        question: 'Do you deliver outside Nairobi?',
        answer: 'Yes. Deliveries are intended to cover destinations throughout Kenya.',
      },
      {
        question: 'Do you handle commercial cargo?',
        answer: 'Yes. Velo supports both personal and business shipments.',
      },
    ],
  },
  'blog-shipping-cost-dubai-to-kenya': emptyContent('blog-shipping-cost-dubai-to-kenya'),
  'blog-air-freight-vs-sea-freight-kenya': {
    intro: '[Your article content here]',
    sections: {},
    faqs: [],
  },
};

export function getPageContent(slug: string): PageContent {
  return contentRegistry[slug] ?? { sections: {}, faqs: [] };
}
