import type { ServiceWireframeConfig } from '@/types/wireframe';

const phase6Faqs = [
  {
    question: 'What is door-to-door shipping?',
    answer:
      'Door-to-door shipping means your cargo is collected from your location and delivered to its destination without requiring you to manage multiple stages yourself. It is door-to-door cargo services Dubai to Kenya handled as one connected process.',
  },
  {
    question: 'Can I arrange pickup from anywhere in Dubai?',
    answer:
      'Pickup is intended to cover locations throughout Dubai and the UAE. Pickup and delivery services Dubai are arranged through the Velo platform.',
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
];

export const doorToDoorConfig: ServiceWireframeConfig = {
  hero: {
    headline: "Shipping Is Easier When You Don't Have to Piece Everything Together",
    paragraphs: [
      "International shipping becomes frustrating when you're responsible for connecting every step yourself. Drop-off in one place. Updates from somewhere else. Delivery handled by someone you've never spoken to. And when something changes, you're left trying to figure out who to call.",
      'Door-to-door shipping removes that burden. Velo handles the journey from collection to delivery, giving you one place to manage the process and follow your shipment along the way.',
    ],
    cta: { label: 'Request a Quote', href: '/contact' },
  },
  trust: {
    title: "You Shouldn't Have to Coordinate the Entire Journey Yourself",
    paragraphs: [
      "Shipping goods is one thing. Managing several people, conversations, and handoffs is another.",
      "Many customers don't mind paying for convenience. They mind paying with their time. Door-to-door shipping gives you a more straightforward experience, so you can spend less energy managing logistics and more energy on everything else competing for your attention.",
    ],
    items: [
      {
        icon: 'MapPin',
        title: 'Collection Across Dubai and the UAE',
        description: 'Arrange pickup from your preferred location.',
      },
      {
        icon: 'Radar',
        title: 'Real-Time Tracking',
        description: 'Stay informed throughout the journey.',
      },
      {
        icon: 'Truck',
        title: 'Delivery Across Kenya',
        description: 'Not limited to Nairobi.',
      },
      {
        icon: 'Package',
        title: 'Personal and Commercial Cargo',
        description: 'From personal parcels to heavy machinery.',
      },
      {
        icon: 'Smartphone',
        title: 'Available on iPhone and Android',
        description: 'Manage shipments from wherever you are.',
      },
    ],
  },
  benefits: [],
  introNarrative: {
    title: 'The Less You Have to Think About Shipping, the Better',
    paragraphs: [
      "Most people aren't looking for more logistics. They're looking for less. Less coordination. Less uncertainty. Less disruption.",
      "That's what door-to-door shipping is designed to provide. You don't need to plan around drop-off locations. You don't need to spend your day checking in. And you don't need to build your schedule around the shipping process.",
      'Instead, shipping adapts to you.',
    ],
  },
  cargoSection: {
    title: 'Who Is Door-to-Door Shipping For?',
    paragraphs: ['Different people value convenience for different reasons.'],
  },
  cargoCards: [
    {
      title: 'Busy Professionals',
      description: "Because time spent driving across the city is time you don't get back.",
      href: '/contact',
      learnMoreLabel: '',
    },
    {
      title: 'Families Sending Personal Shipments',
      description: 'Because shipping should fit around daily life, not interrupt it.',
      href: '/contact',
      learnMoreLabel: '',
    },
    {
      title: 'Businesses Moving Inventory',
      description: 'Because recurring shipments become harder to manage when every step requires attention.',
      href: '/business-shipping',
      learnMoreLabel: '',
    },
    {
      title: 'Customers Outside Nairobi',
      description: 'Because the journey doesn\'t end when cargo reaches Kenya.',
      href: '/contact',
      learnMoreLabel: '',
    },
    {
      title: 'People Shipping Large or Heavy Items',
      description: 'Because handling logistics yourself becomes increasingly difficult as shipments grow.',
      href: '/contact',
      learnMoreLabel: '',
    },
  ],
  process: {
    title: 'What Happens After You Book?',
    intro: "Getting started shouldn't create more work.",
    steps: [
      {
        step: '01',
        title: 'Schedule Pickup',
        description: 'Choose where and when your shipment should be collected.',
      },
      {
        step: '02',
        title: 'Collection',
        description: 'Your shipment is picked up from your location.',
      },
      {
        step: '03',
        title: 'Transportation',
        description: 'The cargo moves from Dubai to Kenya.',
      },
      {
        step: '04',
        title: 'Tracking',
        description: 'Follow progress throughout the journey.',
      },
      {
        step: '05',
        title: 'Delivery',
        description: 'Receive your shipment at its final destination.',
      },
    ],
  },
  closingNarrative: {
    title: 'Why People Are Moving Away from Traditional Arrangements',
    paragraphs: [
      "For years, customers have accepted fragmented shipping because they assumed there wasn't another option. Drive to a cargo office. Call for updates. Coordinate different parties. Repeat the process next month.",
      "Eventually, inconvenience starts to feel normal. But normal doesn't always mean efficient.",
      "Door-to-door shipping gives you a simpler alternative. Because shipping should fit around your life, not ask you to rearrange it.",
    ],
  },
  businessCta: {
    title: 'For Businesses That Ship Regularly',
    paragraphs: [
      'Growth creates complexity. More products. More customers. More shipments. The last thing you need is a process that demands more attention every month.',
      "Door-to-door shipping helps businesses manage recurring cargo without adding more moving parts. Because scaling your business shouldn't mean scaling your headaches.",
    ],
    cta: { label: 'Explore Business Shipping', href: '/business-shipping' },
  },
  faqs: phase6Faqs,
  finalCta: {
    headline: "Shipping Shouldn't Require You to Become a Logistics Coordinator",
    paragraphs: [
      'Arrange a pickup. Follow your shipment. Receive your delivery. And spend less time managing the process yourself.',
    ],
    cta: { label: 'Request a Quote', href: '/contact' },
  },
};
