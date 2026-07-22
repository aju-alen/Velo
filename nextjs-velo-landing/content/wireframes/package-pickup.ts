import type { ServiceWireframeConfig } from '@/types/wireframe';

const phase6Faqs = [
  {
    question: 'Can I schedule a pickup through the app?',
    answer: 'Yes. Pickup requests are handled directly through the Velo platform.',
  },
  {
    question: 'Where can my package be collected from?',
    answer:
      'Collection is intended to cover homes, offices, warehouses, and other locations across Dubai and the UAE. Package collection service Dubai and pickup service UAE are arranged through Velo.',
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
];

export const packagePickupConfig: ServiceWireframeConfig = {
  hero: {
    headline: "Sending a Package Shouldn't Begin With a Drive Across the City",
    paragraphs: [
      "For years, many people have accepted that shipping means making time to visit a cargo office. Not because it's convenient. Because that's simply how things have always been done.",
      "But your day shouldn't revolve around handing over a package. With Velo, you can arrange collection from your home, office, or warehouse and continue with everything else you need to do. Because shipping should fit around your schedule, not force you to rearrange it.",
    ],
    cta: { label: 'Schedule a Pickup', href: '/download-app' },
  },
  trust: {
    title: 'Your Time Is Worth More Than the Trip',
    paragraphs: [
      "Some journeys are necessary. Driving across town just to start a shipment shouldn't be one of them.",
      'Package pickup gives you a simpler way to send cargo while keeping you informed throughout the process. No unnecessary detours. No wasted afternoons. No wondering what happens next.',
    ],
    items: [
      {
        icon: 'MapPin',
        title: 'Pickup Across Dubai and the UAE',
        description: 'Collection arranged from your preferred location.',
      },
      {
        icon: 'Radar',
        title: 'Real-Time Tracking',
        description: 'Follow your shipment after collection.',
      },
      {
        icon: 'Truck',
        title: 'Delivery Across Kenya',
        description: 'Reach destinations beyond Nairobi.',
      },
      {
        icon: 'Package',
        title: 'Personal and Commercial Cargo',
        description: 'From documents to heavy equipment.',
      },
      {
        icon: 'Smartphone',
        title: 'Available on iPhone and Android',
        description: 'Manage everything from your phone.',
      },
    ],
  },
  benefits: [],
  introNarrative: {
    title: 'Why People Are Choosing Convenience',
    paragraphs: [
      "Nobody wakes up hoping to spend their day dealing with logistics. People want shipping to happen. Not become another task competing for their attention.",
      'Package pickup removes one more thing from your schedule. No loading your car. No navigating traffic. No adjusting your day around office hours.',
      'Just choose a pickup location and let the process begin from there.',
    ],
  },
  cargoSection: {
    title: 'Who Benefits Most from Package Pickup?',
    paragraphs: ["Convenience matters differently depending on what you're shipping."],
  },
  cargoCards: [
    {
      title: 'Busy Professionals',
      description: "Because work doesn't stop for errands.",
      href: '/download-app',
      learnMoreLabel: '',
    },
    {
      title: 'Families Sending Personal Parcels',
      description: 'Because your weekends have better uses.',
      href: '/download-app',
      learnMoreLabel: '',
    },
    {
      title: 'Online Sellers and Small Businesses',
      description: 'Because repeated trips quickly become lost hours.',
      href: '/business-shipping',
      learnMoreLabel: '',
    },
    {
      title: 'Importers and Wholesalers',
      description: 'Because time spent driving is time not spent growing your business.',
      href: '/business-shipping',
      learnMoreLabel: '',
    },
    {
      title: 'Customers Shipping Large Items',
      description: "Because some things simply aren't practical to transport yourself.",
      href: '/download-app',
      learnMoreLabel: '',
    },
  ],
  process: {
    title: 'What Happens After You Request a Pickup?',
    intro: 'Getting started should be the easiest part.',
    steps: [
      {
        step: '01',
        title: 'Schedule Collection',
        description: 'Choose where and when your shipment should be collected.',
      },
      {
        step: '02',
        title: 'Pickup',
        description: 'Your package is collected from your location.',
      },
      {
        step: '03',
        title: 'Shipping',
        description: 'The cargo begins its journey to Kenya.',
      },
      {
        step: '04',
        title: 'Tracking',
        description: 'Stay informed throughout the process.',
      },
      {
        step: '05',
        title: 'Delivery',
        description: 'Receive your shipment at its destination.',
      },
    ],
  },
  closingNarrative: {
    title: 'The Old Way Costs More Than Time',
    paragraphs: [
      "Driving to cargo offices might feel normal. But normal isn't always efficient.",
      'Fuel costs money. Traffic consumes time. Repeated trips interrupt your day. And as shipments become more frequent, those small inconveniences become larger frustrations.',
      "Package pickup gives you that time back. Because convenience isn't a luxury. It's part of a better experience.",
    ],
  },
  businessCta: {
    title: 'For Businesses That Ship Regularly',
    paragraphs: [
      'As shipments increase, so do the demands on your time. Weekly deliveries become daily ones. A quick trip becomes several trips. And eventually, managing logistics starts taking attention away from running your business.',
      "Package pickup helps businesses maintain momentum without adding another task to the day. Because growth shouldn't require more interruptions.",
    ],
    cta: { label: 'Explore Business Shipping', href: '/business-shipping' },
  },
  faqs: phase6Faqs,
  finalCta: {
    headline: 'Your Shipment Should Start With a Pickup, Not a Road Trip',
    paragraphs: [
      'Arrange collection from your home, office, or warehouse. Track your shipment. Stay informed from pickup to delivery. And spend your time on something better than traffic.',
    ],
    cta: { label: 'Schedule a Pickup', href: '/download-app' },
  },
};
