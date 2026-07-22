import type { TrackWireframeConfig } from '@/types/wireframe';
import { siteConfig } from '@/lib/seo/site';

const phoneDigits = siteConfig.phone.replace(/\D/g, '');

const phase6Faqs = [
  {
    question: 'Can I track my shipment in real time?',
    answer:
      'Yes. Tracking updates are available throughout the shipping process for cargo tracking Dubai to Kenya and real-time shipment tracking.',
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
    answer:
      'Yes. Deliveries are intended to cover destinations throughout Kenya. Shipment tracking Kenya includes destinations beyond Nairobi.',
  },
  {
    question: 'Can I track shipments after pickup?',
    answer: 'Yes. Tracking begins once your shipment enters the process.',
  },
  {
    question: 'What types of cargo can be tracked?',
    answer:
      'Everything from documents and personal parcels to commercial inventory and machinery. International cargo tracking covers personal and commercial shipments.',
  },
];

export const trackShipmentConfig: TrackWireframeConfig = {
  hero: {
    headline: "You Shouldn't Have to Call Someone Just to Know Where Your Shipment Is",
    paragraphs: [
      "One of the most frustrating parts of shipping isn't sending the package. It's the silence that comes afterward. Has it left? Has it arrived? Is everything still on schedule?",
      "For years, many customers have accepted that uncertainty simply comes with international shipping. It doesn't have to. Velo gives you a way to follow your shipment without spending your day chasing updates or waiting for someone to answer the phone.",
    ],
  },
  trust: {
    title: "Knowing What's Happening Changes Everything",
    paragraphs: [
      'Uncertainty creates work. You start making calls. Sending messages. Following up. Trying to get information that should already be available to you.',
      "When you can see what's happening, you spend less time wondering and more time focusing on everything else competing for your attention. Because peace of mind doesn't come from promises. It comes from knowing.",
    ],
    items: [
      {
        icon: 'Radar',
        title: 'Real-Time Tracking',
        description: 'Follow your shipment throughout the journey.',
      },
      {
        icon: 'Smartphone',
        title: 'Available Through the App',
        description: 'Stay informed wherever you are.',
      },
      {
        icon: 'Package',
        title: 'Personal and Commercial Cargo',
        description: 'Track everything from parcels to machinery.',
      },
      {
        icon: 'Truck',
        title: 'Delivery Across Kenya',
        description: 'Follow shipments beyond Nairobi.',
      },
      {
        icon: 'MapPin',
        title: 'Pickup Across Dubai and the UAE',
        description: 'Stay connected from collection to delivery.',
      },
    ],
  },
  introNarrative: {
    title: 'Shipping Is Stressful Enough Without the Guesswork',
    paragraphs: [
      "Most people don't enjoy uncertainty. Especially when something important is involved. A family package. Business inventory. Urgent documents. Equipment needed for a project.",
      'When information is difficult to get, your mind fills in the blanks. And usually, it assumes the worst.',
      "Tracking doesn't eliminate every question. But it removes one of the biggest frustrations people experience after sending cargo. Not knowing.",
    ],
  },
  visibility: {
    title: "What You'll Be Able to See",
    paragraphs: ["You don't need endless technical details. You simply want to know where things stand."],
    items: [
      {
        title: 'Collection',
        description: 'Confirmation that your shipment has been picked up.',
        href: '#track-form',
        learnMoreLabel: '',
      },
      {
        title: 'Movement',
        description: 'Updates as the cargo progresses through the journey.',
        href: '#track-form',
        learnMoreLabel: '',
      },
      {
        title: 'Shipping Status',
        description: 'Information on where the shipment currently stands.',
        href: '#track-form',
        learnMoreLabel: '',
      },
      {
        title: 'Delivery Progress',
        description: 'Visibility until the shipment reaches its destination.',
        href: '#track-form',
        learnMoreLabel: '',
      },
    ],
  },
  businessCta: {
    title: 'Why This Matters for Businesses',
    paragraphs: [
      'The larger the shipment, the larger the consequences of uncertainty. Customers expect answers. Teams need information. Inventory planning depends on timing. And when updates are difficult to obtain, delays become harder to manage.',
      "Tracking doesn't just provide information. It helps businesses make decisions with greater confidence. Because planning becomes easier when surprises become smaller.",
    ],
    cta: { label: 'Explore Business Shipping', href: '/business-shipping' },
  },
  supportNarrative: {
    title: 'What Happens If I Need Help?',
    paragraphs: [
      'Technology is useful. But sometimes you simply want reassurance. Or clarification. Or answers to a specific question.',
      "Tracking gives you visibility, but support still matters. Because people don't just need information. They need confidence.",
    ],
  },
  statusSteps: [
    { step: '01', title: 'Collection', description: 'Confirmation that your shipment has been picked up.' },
    { step: '02', title: 'Movement', description: 'Updates as the cargo progresses through the journey.' },
    { step: '03', title: 'Shipping Status', description: 'Information on where the shipment currently stands.' },
    { step: '04', title: 'Delivery Progress', description: 'Visibility until the shipment reaches its destination.' },
  ],
  support: [
    { type: 'phone', label: 'Phone', value: siteConfig.phone, href: `tel:${siteConfig.phone}` },
    { type: 'whatsapp', label: 'WhatsApp', value: siteConfig.phone, href: `https://wa.me/${phoneDigits}` },
    { type: 'email', label: 'Email', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  ],
  faqs: phase6Faqs,
  finalCta: {
    headline: "Your Shipment Is Important. You Shouldn't Have to Guess What's Happening.",
    paragraphs: [
      'Follow your cargo. Stay informed. And spend less time chasing updates. Because knowing is better than wondering.',
    ],
    cta: { label: 'Track Your Shipment', href: '#track-form' },
  },
};
