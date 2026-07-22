import type { ServiceWireframeConfig } from '@/types/wireframe';

const phase6Faqs = [
  {
    question: 'Can businesses schedule pickups?',
    answer: 'Yes. Pickup requests are handled through the Velo platform.',
  },
  {
    question: 'Can I ship commercial inventory?',
    answer:
      'Yes. Velo supports commercial cargo, inventory shipping Dubai to Kenya, and larger consignments.',
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
    answer:
      'Yes. Different shipping methods are available depending on your requirements for commercial cargo Dubai to Kenya.',
  },
  {
    question: 'How are shipping costs calculated?',
    answer:
      'Pricing depends on factors such as weight, dimensions, cargo type, and delivery requirements.',
  },
];

export const businessShippingConfig: ServiceWireframeConfig = {
  hero: {
    headline: "Your Business Can't Afford to Run on Follow-Ups",
    paragraphs: [
      'As shipments increase, so do the consequences of poor visibility. Inventory runs low. Customers start asking questions. Plans change because information arrives too late. And before long, too much time is spent following up on cargo instead of focusing on the business itself.',
      'Velo gives you a better way to manage shipments between Dubai and Kenya. Arrange pickups, track cargo in real time, and keep your supply chain moving without relying on scattered conversations and manual processes. Because growth becomes difficult when logistics constantly compete for your attention.',
    ],
    cta: { label: 'Request a Business Quote', href: '/contact' },
  },
  trust: {
    title: 'Running a Business Is Hard Enough',
    paragraphs: [
      "Logistics shouldn't make it harder. You already have suppliers to manage. Customers to serve. Orders to fulfill. The last thing you need is another shipment disappearing into a maze of phone calls and unanswered messages.",
      'Velo gives you one place to manage shipments so you spend less time asking questions and more time making decisions.',
    ],
    items: [
      {
        icon: 'MapPin',
        title: 'Pickup Across Dubai and the UAE',
        description: 'Arrange collection from your office, warehouse, or business premises.',
      },
      {
        icon: 'Radar',
        title: 'Real-Time Tracking',
        description: 'Know where your cargo is without chasing updates.',
      },
      {
        icon: 'Truck',
        title: 'Delivery Across Kenya',
        description: 'Support customers and operations beyond Nairobi.',
      },
      {
        icon: 'Package',
        title: 'Commercial and Bulk Cargo',
        description: 'From regular inventory to larger shipments and machinery.',
      },
      {
        icon: 'Smartphone',
        title: 'Available on iPhone and Android',
        description: 'Stay connected wherever work takes you.',
      },
    ],
  },
  benefits: [],
  narrativeBeforeCargo: true,
  introNarrative: {
    title: 'Growth Creates New Problems',
    paragraphs: [
      'Sending one shipment is simple. Managing shipments every week is something else entirely.',
      'What starts as a few packages becomes inventory planning. Delivery schedules. Cash flow. Customer expectations. And eventually, you realize that the process you used when you were smaller no longer works.',
      'Growth demands more than hard work. It demands better systems.',
    ],
  },
  narrative: {
    title: "Shipping Should Support Your Business, Not Interrupt It",
    paragraphs: [
      'Many businesses spend more time coordinating shipments than they realize. A missed update becomes a delayed order. A delayed order affects inventory. Inventory shortages affect customers. And before long, small disruptions become larger problems.',
      "The goal isn't simply to move cargo. It's to maintain momentum. That's why visibility matters. Not because tracking is exciting. Because planning becomes easier when you know what's happening.",
    ],
  },
  cargoSection: {
    title: 'Who This Is Built For',
    paragraphs: [],
  },
  cargoCards: [
    {
      title: 'Retailers',
      description: 'Maintain stock without losing visibility.',
      href: '/contact',
      learnMoreLabel: '',
    },
    {
      title: 'Importers',
      description: 'Keep products moving without unnecessary interruptions.',
      href: '/contact',
      learnMoreLabel: '',
    },
    {
      title: 'Wholesalers',
      description: 'Manage recurring shipments with greater confidence.',
      href: '/contact',
      learnMoreLabel: '',
    },
    {
      title: 'Online Sellers',
      description: 'Stay ahead of demand and avoid stock shortages.',
      href: '/contact',
      learnMoreLabel: '',
    },
    {
      title: 'Businesses Moving Machinery or Equipment',
      description: 'Handle larger shipments without adding complexity.',
      href: '/contact',
      learnMoreLabel: '',
    },
  ],
  process: {
    title: 'What Happens After You Start?',
    intro: "Growth shouldn't create more uncertainty.",
    steps: [
      {
        step: '01',
        title: 'Schedule Pickup',
        description: 'Arrange collection from your preferred location.',
      },
      {
        step: '02',
        title: 'Collection',
        description: 'Cargo is picked up from your warehouse, office, or premises.',
      },
      {
        step: '03',
        title: 'Shipping',
        description: 'Choose the method that fits your requirements.',
      },
      {
        step: '04',
        title: 'Tracking',
        description: 'Monitor progress throughout the journey.',
      },
      {
        step: '05',
        title: 'Delivery',
        description: 'Receive your cargo in Kenya.',
      },
    ],
  },
  closingNarrative: {
    title: 'Why Businesses Are Moving Away from Manual Processes',
    paragraphs: [
      'For years, many businesses have relied on fragmented systems. Spreadsheets. Phone calls. WhatsApp messages. Personal contacts.',
      "Eventually, those workarounds stop working. Not because the business failed. Because it outgrew them.",
      'As shipments increase, visibility becomes more important. And relying on memory and conversations becomes harder to sustain. Velo gives businesses a more organized way to manage international shipping without adding unnecessary complexity.',
    ],
  },
  faqs: phase6Faqs,
  finalCta: {
    headline: 'Your Business Needs More Than Cargo Movement',
    paragraphs: [
      'It needs consistency. It needs visibility. And it needs a process that becomes easier to manage as you grow. Arrange pickups. Track shipments. Keep inventory moving. And spend less time following up on cargo.',
    ],
    cta: { label: 'Request a Business Quote', href: '/contact' },
  },
};
