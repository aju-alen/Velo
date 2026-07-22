import type { RouteWireframeConfig } from '@/types/wireframe';
import { placeholderTestimonials, standardProcess, standardTransitTable, kenyaCoverage } from './shared';

const phase6Faqs = [
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
    answer: 'No. Deliveries are intended to cover destinations throughout Kenya, including Dubai to Nairobi shipping routes and beyond.',
  },
  {
    question: 'Can I track my shipment?',
    answer: 'Yes. Tracking updates are available throughout the international shipping from Dubai to Kenya process.',
  },
  {
    question: 'How much does shipping from Dubai to Kenya cost?',
    answer:
      'Pricing depends on the weight, dimensions, cargo type, shipping method, and delivery requirements. Air freight Dubai to Kenya and sea freight Dubai to Kenya are priced differently based on your cargo.',
  },
  {
    question: 'Can I arrange pickup?',
    answer: 'Yes. Pickup requests are handled through the Velo platform.',
  },
];

export const shippingFromDubaiConfig: RouteWireframeConfig = {
  hero: {
    headline: "Shipping from Dubai to Kenya Doesn't Have to Involve Three Different People",
    paragraphs: [
      "If you've shipped goods before, you already know how much time can disappear into follow-ups. One person arranges pickup. Another handles the cargo. Someone else sends updates. And somewhere in between, you're left wondering where things stand.",
      'Velo gives you a simpler way to ship. Arrange collection from your home, office, or warehouse. Follow your shipment in real time and stay informed from pickup to delivery.',
      'From personal parcels and business inventory to oversized cargo and machinery, you stay connected to the process without having to chase it.',
    ],
    cta: { label: 'Request a Quote', href: '/contact' },
  },
  trust: {
    title: "You Shouldn't Have to Ask for Updates",
    paragraphs: [
      'The shipment is yours. Knowing where it is shouldn\'t depend on who answers the phone.',
      "That's why Velo brings tracking, pickup, and shipment management into one experience. So instead of spending your day following up, you can simply check your progress and get on with everything else.",
    ],
    items: [
      {
        icon: 'MapPin',
        title: 'Collection Across Dubai and the UAE',
        description: 'No unnecessary trips to drop off your shipment.',
      },
      {
        icon: 'Radar',
        title: 'Real-Time Tracking',
        description: 'Stay informed without making calls.',
      },
      {
        icon: 'Truck',
        title: 'Delivery Across Kenya',
        description: 'Not limited to Nairobi.',
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
  shippingOptions: {
    title: 'Not Every Shipment Needs the Same Approach',
    paragraphs: [
      'Some cargo needs to arrive quickly. Some shipments are too large for that to make sense. And sometimes, keeping costs under control matters more than shaving a few days off delivery time.',
      "That's why you can choose the shipping method that fits your requirements instead of forcing every shipment into the same process.",
    ],
    items: [
      {
        title: 'Air Freight',
        description:
          'When time matters, air freight helps you move urgent packages and commercial cargo faster.',
        bullets: ['Documents', 'Electronics', 'Personal packages', 'Commercial shipments'],
        href: '/air-freight-dubai-to-kenya',
        learnMoreLabel: 'Learn About Air Freight',
      },
      {
        title: 'Sea Freight',
        description:
          "If you're shipping larger quantities or heavier cargo, sea freight provides a more economical option.",
        href: '/sea-freight-dubai-to-kenya',
        learnMoreLabel: 'Learn About Sea Freight',
      },
    ],
  },
  narrative: {
    title: 'Why People Are Looking for Something Better',
    paragraphs: [
      'For years, shipping from Dubai to Kenya has relied heavily on phone calls, personal contacts, and fragmented processes. People have learned to work around them because that\'s simply how things have been done.',
      "But working around problems isn't the same as solving them.",
      "You shouldn't need to drive across the city just to hand over a package. You shouldn't have to wonder whether your cargo has left. And you shouldn't have to spend your afternoon asking for updates.",
      "Shipping should fit around your schedule. Not the other way around. That's the idea behind Velo.",
    ],
  },
  pricing: {
    title: 'What Affects Shipping Costs?',
    body: 'People often ask one question first: "How much will it cost?" The answer depends on what you\'re shipping. Weight matters. Dimensions matter. The shipping method matters. Delivery requirements matter. Because no two shipments are identical, pricing is calculated based on the details of your cargo rather than rough estimates.',
    cta: { label: 'Calculate Shipping Costs', href: '/pricing-calculator' },
  },
  process: {
    title: 'What Happens After You Book?',
    intro: "Getting started shouldn't require ten conversations.",
    steps: [
      {
        step: '01',
        title: 'Schedule Pickup',
        description: "Choose where and when you'd like your shipment collected.",
      },
      {
        step: '02',
        title: 'Collection',
        description: 'Your cargo is picked up from your location.',
      },
      {
        step: '03',
        title: 'Shipping',
        description: 'Air or sea freight options are used depending on your requirements.',
      },
      {
        step: '04',
        title: 'Tracking',
        description: 'Monitor progress throughout the journey.',
      },
      {
        step: '05',
        title: 'Delivery',
        description: 'Receive your shipment in Kenya.',
      },
    ],
  },
  businessCta: {
    title: 'For People Who Ship Regularly',
    paragraphs: [
      'One package is one thing. Recurring shipments are another.',
      "When you're constantly moving inventory or supplying customers, delays and poor visibility affect much more than a single delivery. You need consistency. You need information. And you need a process that becomes easier as your business grows.",
      'Velo helps you manage recurring shipments without relying on scattered conversations and endless follow-ups.',
    ],
    cta: { label: 'Explore Business Shipping', href: '/business-shipping' },
  },
  faqs: phase6Faqs,
  finalCta: {
    headline: 'Spend Less Time Following Up and More Time Getting Things Done',
    paragraphs: [
      "Shipping from Dubai to Kenya doesn't need to consume your day. Start with a quote. Arrange collection. Track your shipment from pickup to delivery. And spend your time on something more important than chasing updates.",
    ],
    cta: { label: 'Request a Quote', href: '/contact' },
  },
};

export const cargoServicesNairobiConfig: RouteWireframeConfig = {
  hero: {
    paragraphs: [
      'Reliable cargo services from Dubai to Nairobi. Air and sea cargo options with pickup, freight forwarding to Kenya, and real-time tracking.',
    ],
    cta: { label: 'Request a Quote', href: '/contact' },
  },
  trust: {
    title: 'Key Advantages',
    paragraphs: ['Cargo services Dubai to Kenya with pickup, tracking, and nationwide delivery.'],
    items: [
      { icon: 'MapPin', title: 'Pickup Available', description: 'Collection across Dubai and the UAE.' },
      { icon: 'Radar', title: 'Tracking', description: 'Monitor your cargo in real time.' },
      { icon: 'Truck', title: 'Nairobi & Beyond', description: 'Delivery across Kenya.' },
      { icon: 'Smartphone', title: 'App-Based Experience', description: 'Manage shipments from one app.' },
    ],
  },
  shippingOptions: {
    title: 'Shipping Options',
    paragraphs: ['Choose air or sea cargo depending on your timeline and load size.'],
    items: [
      {
        title: 'Air Cargo',
        description: 'Express air cargo from Dubai to Nairobi for time-sensitive shipments.',
        href: '/air-freight-dubai-to-kenya',
        learnMoreLabel: 'Learn About Air Freight',
      },
      {
        title: 'Sea Cargo',
        description: 'Sea cargo solutions for larger loads destined for Nairobi and beyond.',
        href: '/sea-freight-dubai-to-kenya',
        learnMoreLabel: 'Learn About Sea Freight',
      },
    ],
  },
  process: {
    title: 'Delivery Process',
    steps: standardProcess,
  },
  transitTable: {
    title: 'Transit Times to Nairobi',
    columns: standardTransitTable.columns,
    rows: [
      { method: 'Air Cargo', transit: '3–5 business days', notes: 'Direct to Nairobi' },
      { method: 'Sea Cargo', transit: '4–6 weeks', notes: 'Port arrival plus last-mile delivery' },
      { method: 'Door-to-Door', transit: 'Varies by method', notes: 'Pickup in Dubai to Nairobi delivery' },
    ],
  },
  pricing: {
    title: 'Cargo Pricing',
    body: 'Nairobi cargo rates depend on weight, volume, and service level. Get an estimate with our calculator or contact us for commercial cargo quotes.',
    cta: { label: 'Calculate Shipping Cost', href: '/pricing-calculator' },
  },
  testimonials: placeholderTestimonials,
  faqs: phase6Faqs,
  finalCta: {
    headline: 'Ready to Ship to Nairobi?',
    paragraphs: ['Get a quote for cargo services from Dubai to Nairobi today.'],
    cta: { label: 'Request a Quote', href: '/contact' },
  },
};

export { kenyaCoverage };
