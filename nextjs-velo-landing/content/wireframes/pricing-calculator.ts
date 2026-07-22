import type { PricingWireframeConfig } from '@/types/wireframe';

const phase6Faqs = [
  {
    question: 'How are shipping costs calculated?',
    answer:
      'Pricing depends on weight, dimensions, cargo type, shipping method, and delivery requirements. Shipping rates Dubai to Kenya vary based on these details.',
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
    answer:
      'Yes. Deliveries are intended to cover destinations throughout Kenya, including shipping price Dubai to Nairobi routes and beyond.',
  },
  {
    question: 'Do you handle commercial cargo?',
    answer: 'Yes. Velo supports both personal and business shipments.',
  },
];

export const pricingCalculatorConfig: PricingWireframeConfig = {
  hero: {
    headline: 'The First Question Most People Ask Is About Cost',
    paragraphs: [
      'Before anything gets packed, one question usually comes up. "How much will it cost?" It\'s a fair question. But international shipping isn\'t priced the same way a taxi ride is.',
      'A document and a generator don\'t travel under the same conditions. A small parcel and commercial inventory don\'t occupy the same space. That\'s why shipping costs depend on the details of your cargo. The more accurate the information, the more useful the estimate becomes.',
    ],
    cta: { label: 'Calculate Shipping Costs', href: '#calculator' },
  },
  trust: {
    title: "Guesswork Doesn't Help You Plan",
    paragraphs: [
      'Rough estimates sound convenient. Until the actual shipment turns out to be different. And suddenly, the number you were relying on no longer means much.',
      'Shipping costs are influenced by several factors, which is why accurate information matters more than unrealistic promises. Because making decisions based on assumptions rarely ends well.',
    ],
    items: [
      { icon: 'Package', title: 'Weight', description: 'Heavier shipments affect pricing.' },
      { icon: 'Box', title: 'Dimensions', description: 'Size matters, not just weight.' },
      { icon: 'Archive', title: 'Cargo Type', description: 'Different goods have different requirements.' },
      { icon: 'Plane', title: 'Shipping Method', description: 'Air and sea freight have different cost structures.' },
      { icon: 'Truck', title: 'Delivery Requirements', description: 'Final destination and service requirements also affect pricing.' },
    ],
  },
  introNarrative: {
    title: "Why There Isn't One Price for Everything",
    paragraphs: [
      "People sometimes expect a standard rate. The challenge is that international shipping doesn't work that way.",
      'Two packages that weigh the same can cost different amounts. Why? Because dimensions matter. Cargo type matters. The shipping method matters. And destination requirements matter.',
      "That's why meaningful estimates start with information, not assumptions.",
    ],
  },
  infoSection: {
    title: "What Information You'll Need",
    paragraphs: ['The more accurate your details, the better the estimate.'],
    items: [
      {
        title: 'Weight',
        description: 'Approximate weight of the shipment.',
        href: '#calculator',
        learnMoreLabel: '',
      },
      {
        title: 'Dimensions',
        description: 'Length, width, and height.',
        href: '#calculator',
        learnMoreLabel: '',
      },
      {
        title: 'Cargo Description',
        description: "What you're sending.",
        href: '#calculator',
        learnMoreLabel: '',
      },
      {
        title: 'Preferred Shipping Method',
        description: 'Air freight or sea freight.',
        href: '#calculator',
        learnMoreLabel: '',
      },
      {
        title: 'Destination',
        description: 'Where the shipment is headed in Kenya.',
        href: '#calculator',
        learnMoreLabel: '',
      },
    ],
  },
  narrative: {
    title: 'Cost Is Only One Part of the Decision',
    paragraphs: [
      'Everyone wants to avoid overpaying. But focusing only on price can create different problems.',
      'Sometimes speed matters more. Sometimes volume matters more. Sometimes convenience matters more.',
      "The goal isn't simply to find the cheapest number. It's to choose the option that makes the most sense for what you're shipping.",
    ],
  },
  process: {
    title: 'After You Receive Your Estimate',
    intro: 'Once you have an idea of the cost, the next step becomes much simpler.',
    steps: [
      {
        step: '01',
        title: 'Schedule Pickup',
        description: 'Choose where your shipment should be collected.',
      },
      {
        step: '02',
        title: 'Collection',
        description: 'Cargo is picked up from your location.',
      },
      {
        step: '03',
        title: 'Shipping',
        description: 'Select the method that fits your priorities.',
      },
      {
        step: '04',
        title: 'Tracking',
        description: 'Monitor your shipment throughout the journey.',
      },
      {
        step: '05',
        title: 'Delivery',
        description: 'Receive your cargo in Kenya.',
      },
    ],
  },
  businessCta: {
    title: 'For Businesses Planning Ahead',
    paragraphs: [
      'Businesses don\'t just need prices. They need predictability. Margins depend on it. Inventory planning depends on it. Customer expectations depend on it.',
      "Understanding shipping costs helps businesses make better decisions before goods even begin moving. Because surprises are easier to handle when they happen on your terms, not someone else's.",
    ],
    cta: { label: 'Explore Business Shipping', href: '/business-shipping' },
  },
  faqs: phase6Faqs,
  finalCta: {
    headline: 'Better Information Leads to Better Decisions',
    paragraphs: [
      'Start with an estimate. Understand your options. Choose the shipping method that fits your priorities. And move forward with greater confidence.',
    ],
    cta: { label: 'Calculate Shipping Costs', href: '#calculator' },
  },
};
