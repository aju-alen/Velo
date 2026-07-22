import type { AboutWireframeConfig } from '@/types/wireframe';

const phase6Faqs = [
  {
    question: 'Where is Velo based?',
    answer:
      'Velo operates from Dubai and focuses on helping customers and businesses move goods to Kenya. We are a shipping company in Dubai serving the Dubai–Kenya corridor.',
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
];

export const aboutConfig: AboutWireframeConfig = {
  hero: {
    headline: 'Shipping Has Worked the Same Way for Years. We Think It Can Work Better.',
    paragraphs: [
      'International shipping has always depended on relationships. You know someone. They know someone. You make a call. You wait for an update. And over time, people simply accepted that this was how shipping worked.',
      'But convenience changed almost every other industry. Banking changed. Shopping changed. Transportation changed. Shipping, for many people moving goods between Dubai and Kenya, largely stayed the same.',
      "Velo was created because we believe sending cargo shouldn't require unnecessary trips, endless follow-ups, or fragmented conversations. The process should be easier. And the information should already be in your hands.",
    ],
    cta: { label: 'Request a Quote', href: '/contact' },
  },
  story: {
    title: 'The Problem Was Never Moving Cargo',
    paragraphs: [
      'Cargo has always moved. The problem was everything surrounding it.',
      "People driving across the city just to hand over packages. Businesses relying on WhatsApp messages to manage recurring shipments. Customers spending more time asking for updates than they expected. Not because they wanted to. Because there wasn't a better alternative.",
      "We saw an opportunity to rethink the experience. Not by changing where cargo goes. By changing how people interact with the process.",
    ],
  },
  lifestyleNarrative: {
    title: 'Built Around How People Actually Live',
    paragraphs: [
      "Life doesn't stop because you need to send something. Work continues. Meetings continue. Family responsibilities continue. Your day already has enough demands competing for your attention.",
      "Shipping shouldn't become another one. That's why Velo is designed around convenience. Arrange pickup. Track your shipment. Stay informed. Manage everything from one place.",
      "Because shipping should fit around your schedule. Not force you to build your schedule around shipping.",
    ],
  },
  cargoSection: {
    title: 'What We Help People Ship',
    paragraphs: [
      'No two customers look the same. And no two shipments do either. Some people send documents. Others send family packages. Businesses move inventory. Importers move products. Some shipments fit in an envelope. Others require machinery and equipment.',
      "Our role isn't to decide what's important. It's to help you move what matters to you.",
    ],
    items: [
      { title: 'Personal Parcels', description: 'Family packages and personal shipments.', href: '/contact', learnMoreLabel: '' },
      { title: 'Business Inventory', description: 'Stock and products for growing businesses.', href: '/business-shipping', learnMoreLabel: '' },
      { title: 'Household Goods', description: 'Relocations and larger personal shipments.', href: '/contact', learnMoreLabel: '' },
      { title: 'Commercial Cargo', description: 'Commercial consignments and freight.', href: '/business-shipping', learnMoreLabel: '' },
      { title: 'Machinery and Equipment', description: 'Oversized and heavy equipment shipments.', href: '/contact', learnMoreLabel: '' },
    ],
  },
  marketNarrative: {
    title: 'Why Dubai and Kenya?',
    paragraphs: [
      'Dubai connects markets. Kenya connects opportunities. Trade between the two continues to grow, and so do the people and businesses that depend on it.',
      "But while trade has evolved, the customer experience often hasn't. Velo focuses on bridging that gap. Helping customers move goods with greater convenience and better visibility than traditional processes have offered.",
    ],
  },
  longTermNarrative: {
    title: "We're Building for the Long Term",
    paragraphs: [
      "Trust isn't built through slogans. It's built over time. Shipment after shipment. Conversation after conversation. And decision after decision.",
      "We're building Velo with a simple belief. The easier shipping becomes, the more valuable it becomes. Not because logistics should be complicated. But because life already is.",
    ],
  },
  appSection: {
    title: 'The App Is Part of the Experience',
    paragraphs: [
      'For many people, shipping begins with a conversation and ends with uncertainty. We wanted something different.',
      'A place where you can schedule pickups, track shipments, receive updates, manage recurring cargo, and stay informed without depending entirely on phone calls.',
      "Because access to information shouldn't disappear once your package leaves your hands.",
    ],
    cta: { label: 'Download the App', href: '/download-app' },
  },
  faqs: phase6Faqs,
  finalCta: {
    headline: 'Shipping Should Feel More Like Progress And Less Like Administration',
    paragraphs: [
      "We're building Velo for people who have better things to do than spend their day following up on cargo. Arrange a pickup. Track your shipment. Stay informed from collection to delivery. And let shipping take up less space in your day.",
    ],
    cta: { label: 'Request a Quote', href: '/contact' },
  },
};
