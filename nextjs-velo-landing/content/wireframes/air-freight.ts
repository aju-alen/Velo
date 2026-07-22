import type { ServiceWireframeConfig } from '@/types/wireframe';

const phase6Faqs = [
  {
    question: 'How fast is air freight from Dubai to Kenya?',
    answer:
      'Transit times depend on the shipment and customs requirements, but air freight is generally the fastest shipping option available for express shipping Dubai to Kenya.',
  },
  {
    question: 'What can I send by air?',
    answer:
      'Documents, electronics, personal parcels, commercial cargo, and many other shipment types suitable for international air cargo to Kenya.',
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
    answer:
      'Yes. Deliveries are intended to cover destinations throughout Kenya, including Dubai to Nairobi air cargo routes and beyond.',
  },
  {
    question: 'How much does air freight from Dubai to Kenya cost?',
    answer:
      'Pricing depends on factors such as weight, dimensions, cargo type, and delivery requirements.',
  },
];

export const airFreightConfig: ServiceWireframeConfig = {
  hero: {
    headline: "When Time Matters, Waiting Isn't an Option",
    paragraphs: [
      "Some shipments simply can't afford unnecessary delays. Documents need to arrive. Inventory needs replenishing. Customers are waiting. And sometimes, replacing a missing part quickly matters more than saving a little money.",
      'Air freight from Dubai to Kenya gives you a faster way to move cargo while keeping you informed throughout the journey. Arrange collection, track your shipment, and stay updated from pickup to delivery.',
    ],
    cta: { label: 'Request an Air Freight Quote', href: '/contact' },
  },
  trust: {
    title: "Speed Shouldn't Mean Losing Visibility",
    paragraphs: [
      'Moving something quickly is important. Knowing where it is matters just as much.',
      "Velo combines air freight with real-time tracking, so you don't spend your day wondering whether your shipment has landed or who to call for an update.",
    ],
    items: [
      {
        icon: 'MapPin',
        title: 'Collection Across Dubai and the UAE',
        description: 'Arrange pickup from your home, office, or warehouse.',
      },
      {
        icon: 'Radar',
        title: 'Real-Time Tracking',
        description: 'Follow progress throughout the journey.',
      },
      {
        icon: 'Truck',
        title: 'Delivery Across Kenya',
        description: 'Reach destinations beyond Nairobi.',
      },
      {
        icon: 'Package',
        title: 'Personal and Commercial Cargo',
        description: 'From documents to commercial inventory.',
      },
      {
        icon: 'Smartphone',
        title: 'Available on iPhone and Android',
        description: 'Stay connected wherever you are.',
      },
    ],
  },
  benefits: [],
  cargoSection: {
    title: 'When Air Freight Makes Sense',
    paragraphs: [
      'Not every shipment belongs on a plane. But some do. Air freight is often the better option when time matters more than cost.',
    ],
  },
  cargoCards: [
    {
      title: 'Urgent Documents',
      description: 'Contracts, paperwork, and time-sensitive correspondence.',
      href: '/contact',
      learnMoreLabel: '',
    },
    {
      title: 'Electronics',
      description: 'Items that need faster transit times.',
      href: '/contact',
      learnMoreLabel: '',
    },
    {
      title: 'Business Inventory',
      description: 'Restocking products without waiting for longer shipping schedules.',
      href: '/business-shipping',
      learnMoreLabel: '',
    },
    {
      title: 'Replacement Parts',
      description: "Keeping operations moving when delays aren't an option.",
      href: '/contact',
      learnMoreLabel: '',
    },
    {
      title: 'High-Value Cargo',
      description: 'When faster movement provides additional peace of mind.',
      href: '/contact',
      learnMoreLabel: '',
    },
  ],
  narrative: {
    title: "Paying Less Isn't Always Cheaper",
    paragraphs: [
      'People often focus on shipping costs. But delays have costs too.',
      'Empty shelves cost money. Missed deadlines cost opportunities. Waiting for replacement parts can affect entire operations.',
      'In many situations, getting cargo there sooner creates more value than saving on transport. That\'s why businesses and individuals often choose air freight when timing matters.',
    ],
  },
  pricing: {
    title: 'What Affects Air Freight Costs?',
    body: 'Air freight pricing depends on several factors including weight, dimensions, cargo type, delivery requirements, and final destination. Because shipments vary, costs are calculated based on the details of your cargo rather than one fixed price.',
    cta: { label: 'Calculate Shipping Costs', href: '/pricing-calculator' },
  },
  process: {
    title: 'What Happens After You Book?',
    intro: "Getting started shouldn't involve a chain of phone calls.",
    steps: [
      {
        step: '01',
        title: 'Schedule Pickup',
        description: 'Choose where your shipment should be collected.',
      },
      {
        step: '02',
        title: 'Collection',
        description: 'Your cargo is picked up from your location.',
      },
      {
        step: '03',
        title: 'Air Transport',
        description: 'The shipment moves from Dubai to Kenya.',
      },
      {
        step: '04',
        title: 'Tracking',
        description: 'Monitor progress throughout the journey.',
      },
      {
        step: '05',
        title: 'Delivery',
        description: 'Receive your shipment at its destination.',
      },
    ],
  },
  businessCta: {
    title: "For Businesses That Can't Afford Delays",
    paragraphs: [
      'Some businesses operate on schedules that leave little room for waiting. Running out of stock affects sales. Delays affect customers. And uncertainty makes planning harder than it needs to be.',
      'Air freight gives businesses a faster option when time-sensitive cargo needs to move. Because staying competitive often means staying ahead.',
    ],
    cta: { label: 'Explore Business Shipping', href: '/business-shipping' },
  },
  faqs: phase6Faqs,
  finalCta: {
    headline: 'Some Things Are Too Important to Leave Waiting',
    paragraphs: [
      'When time matters, air freight gives you a faster way to move cargo from Dubai to Kenya. Arrange collection. Track your shipment. Stay informed from beginning to end.',
    ],
    cta: { label: 'Request an Air Freight Quote', href: '/contact' },
  },
};
