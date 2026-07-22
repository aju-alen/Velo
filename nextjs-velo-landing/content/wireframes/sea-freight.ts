import type { ServiceWireframeConfig } from '@/types/wireframe';

const phase6Faqs = [
  {
    question: 'How long does sea freight from Dubai to Kenya take?',
    answer:
      'Transit times vary depending on cargo requirements, shipping schedules, and customs procedures. Sea freight is generally chosen when cost efficiency matters more than speed for ocean freight Dubai to Kenya.',
  },
  {
    question: 'What types of cargo can be shipped by sea?',
    answer:
      'Personal effects, commercial inventory, household goods, machinery, and many other cargo types suitable for container shipping to Kenya.',
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
    answer:
      'Yes. Deliveries are intended to cover destinations throughout Kenya, including sea cargo Dubai to Nairobi routes and beyond.',
  },
  {
    question: 'How much does sea freight from Dubai to Kenya cost?',
    answer: 'Pricing depends on weight, dimensions, cargo type, and delivery requirements.',
  },
];

export const seaFreightConfig: ServiceWireframeConfig = {
  hero: {
    headline: "Not Every Shipment Needs to Get There Tomorrow",
    paragraphs: [
      "Sometimes, the priority isn't speed. It's moving more cargo without watching shipping costs climb with every kilogram. That's why many businesses and individuals choose sea freight when they need more space, better cost efficiency, and a process they can still follow from beginning to end.",
      "Velo helps you move cargo from Dubai to Kenya without turning shipping into another job you have to manage. Arrange collection, monitor your shipment, and stay informed throughout the journey.",
    ],
    cta: { label: 'Request a Sea Freight Quote', href: '/contact' },
  },
  trust: {
    title: "Bigger Shipments Shouldn't Create Bigger Headaches",
    paragraphs: [
      'As cargo grows, complexity often grows with it. More cartons. More weight. More moving parts. But more cargo shouldn\'t mean more uncertainty.',
      "Velo gives you one place to manage shipments and follow their progress, so you're not left wondering who to call or what happens next.",
    ],
    items: [
      {
        icon: 'MapPin',
        title: 'Collection Across Dubai and the UAE',
        description: 'Arrange pickup from your home, office, warehouse, or business premises.',
      },
      {
        icon: 'Radar',
        title: 'Real-Time Tracking',
        description: 'Stay informed while your cargo moves.',
      },
      {
        icon: 'Truck',
        title: 'Delivery Across Kenya',
        description: 'Reach destinations beyond Nairobi.',
      },
      {
        icon: 'Package',
        title: 'Personal and Commercial Cargo',
        description: 'From household goods to commercial inventory and machinery.',
      },
      {
        icon: 'Smartphone',
        title: 'Available on iPhone and Android',
        description: 'Manage your shipments wherever you are.',
      },
    ],
  },
  benefits: [],
  cargoSection: {
    title: 'When Sea Freight Makes More Sense',
    paragraphs: [
      "There are times when paying for speed simply doesn't add much value. If your shipment is large, heavy, or part of regular stock replenishment, sea freight often becomes the more practical choice.",
    ],
  },
  cargoCards: [
    {
      title: 'Commercial Inventory',
      description: 'Maintain stock without absorbing unnecessary shipping costs.',
      href: '/business-shipping',
      learnMoreLabel: '',
    },
    {
      title: 'Heavy Cargo',
      description: "Move larger items that aren't time-sensitive.",
      href: '/contact',
      learnMoreLabel: '',
    },
    {
      title: 'Household Goods',
      description: 'Relocations and personal shipments with more volume.',
      href: '/contact',
      learnMoreLabel: '',
    },
    {
      title: 'Machinery and Equipment',
      description: 'Transport oversized cargo more economically.',
      href: '/contact',
      learnMoreLabel: '',
    },
    {
      title: 'Recurring Shipments',
      description: 'Ideal for businesses that import products regularly.',
      href: '/business-shipping',
      learnMoreLabel: '',
    },
  ],
  narrative: {
    title: "The Cheapest Option Isn't Always the Best Option",
    paragraphs: [
      'People naturally compare prices. But the real question is different. Does the shipping method fit what you\'re trying to accomplish?',
      "Paying for air freight when time isn't important may not make sense. Choosing sea freight allows you to prioritize value while still maintaining visibility throughout the process.",
      "The goal isn't simply to spend less. It's to make smarter decisions.",
    ],
  },
  pricing: {
    title: 'What Affects Sea Freight Costs?',
    body: 'No two shipments are exactly alike. Several factors influence pricing, including weight, dimensions, cargo type, shipping requirements, and final destination. Because every shipment is different, pricing is calculated based on the details of your cargo rather than using rough estimates.',
    cta: { label: 'Calculate Shipping Costs', href: '/pricing-calculator' },
  },
  process: {
    title: 'What Happens After You Book?',
    intro: "Shipping shouldn't become harder after you've made the decision.",
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
        title: 'Sea Transport',
        description: 'Your shipment moves from Dubai to Kenya.',
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
    title: 'For Businesses That Think Long Term',
    paragraphs: [
      'Running a business means making decisions that balance cost, inventory, and growth. Not every shipment needs urgency. But every shipment deserves predictability.',
      "Sea freight gives businesses a practical way to move larger volumes while maintaining visibility throughout the process. Because growth becomes easier when your logistics don't constantly demand your attention.",
    ],
    cta: { label: 'Explore Business Shipping', href: '/business-shipping' },
  },
  faqs: phase6Faqs,
  finalCta: {
    headline: 'Some Shipments Need Speed. Others Need Space.',
    paragraphs: [
      'Sea freight gives you a practical way to move larger shipments from Dubai to Kenya without sacrificing visibility. Arrange collection. Track your shipment. Stay informed throughout the journey.',
    ],
    cta: { label: 'Request a Sea Freight Quote', href: '/contact' },
  },
};
