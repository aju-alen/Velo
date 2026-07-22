import type { FaqItem } from '@/types/seo';
import type { Testimonial } from '@/types/wireframe';

export const placeholderTestimonials: Testimonial[] = [
  {
    quote:
      'Velo made shipping from Dubai to Kenya straightforward. Pickup was on time and tracking kept us informed throughout.',
    author: 'Sarah M.',
    role: 'Small business owner, Nairobi',
  },
  {
    quote:
      'We use Velo for regular commercial shipments. The app makes scheduling pickups and checking status much easier.',
    author: 'James K.',
    role: 'Operations manager, Dubai',
  },
  {
    quote:
      'Door-to-door delivery to Mombasa worked exactly as described. Clear communication at every step.',
    author: 'Amina H.',
    role: 'Personal shipper',
  },
];

export const b2bTestimonials: Testimonial[] = [
  {
    quote:
      'Velo gives our team visibility across recurring shipments. We spend less time chasing updates and more time serving customers.',
    author: 'David O.',
    role: 'Supply chain lead, retail',
  },
  {
    quote:
      'Bulk cargo handling and reporting features scale with our volume. A reliable partner for Dubai–Kenya logistics.',
    author: 'Priya S.',
    role: 'Logistics director, electronics',
  },
];

export const routeFaqs: FaqItem[] = [
  {
    question: 'Can you handle my shipment?',
    answer:
      'Yes. Velo handles personal parcels, commercial cargo, and bulk shipments from Dubai to destinations across Kenya.',
  },
  {
    question: 'Which shipping method should I use?',
    answer:
      'Air freight suits urgent or smaller shipments. Sea freight is better for larger, heavier, or cost-sensitive cargo.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Transit times depend on the method chosen. Air freight is typically faster; sea freight takes longer but suits larger loads.',
  },
  {
    question: 'How much will shipping cost?',
    answer:
      'Pricing depends on weight, dimensions, cargo type, and delivery requirements. Use our pricing calculator for an estimate.',
  },
  {
    question: 'How do I get started?',
    answer:
      'Request a quote or download the Velo app to schedule pickup and manage your shipment from one place.',
  },
];

export const airFreightFaqs: FaqItem[] = [
  {
    question: 'How fast is air freight from Dubai to Kenya?',
    answer: 'Air freight is the fastest option, typically delivering within a few business days after departure.',
  },
  {
    question: 'What cargo types can I send by air?',
    answer: 'Documents, electronics, personal parcels, and many commercial goods are suitable for air freight.',
  },
  {
    question: 'Is pickup available in Dubai?',
    answer: 'Yes. Schedule collection from your home, office, or warehouse through the Velo app.',
  },
];

export const seaFreightFaqs: FaqItem[] = [
  {
    question: 'When should I choose sea freight?',
    answer: 'Sea freight suits larger shipments, bulk cargo, and cost-sensitive deliveries where speed is less critical.',
  },
  {
    question: 'What container options are available?',
    answer: 'Options vary by cargo size and type. Contact our team for guidance on the best fit for your shipment.',
  },
  {
    question: 'Can I track sea freight shipments?',
    answer: 'Yes. Track your shipment status through the Velo app from collection through delivery.',
  },
];

export const doorToDoorFaqs: FaqItem[] = [
  {
    question: 'What does door-to-door shipping include?',
    answer: 'Collection from your location in Dubai, international shipping, and delivery to the recipient in Kenya.',
  },
  {
    question: 'Which areas in Kenya do you deliver to?',
    answer: 'Delivery is intended to cover destinations throughout Kenya, including major cities and regional areas.',
  },
  {
    question: 'How do I schedule pickup?',
    answer: 'Use the Velo app or contact our team to arrange collection at a time that works for you.',
  },
];

export const packagePickupFaqs: FaqItem[] = [
  {
    question: 'Where can you collect packages in Dubai?',
    answer: 'We collect from homes, offices, and warehouses across Dubai and the wider UAE.',
  },
  {
    question: 'How do I schedule a pickup?',
    answer: 'Open the Velo app, enter shipment details, and choose your preferred pickup date and location.',
  },
  {
    question: 'Is same-day pickup available?',
    answer: 'Availability depends on location and time of request. The app will show available slots when you book.',
  },
];

export const businessFaqs: FaqItem[] = [
  {
    question: 'Can Velo support recurring shipments?',
    answer: 'Yes. Velo is designed for businesses with regular shipping needs between Dubai and Kenya.',
  },
  {
    question: 'Will I have visibility into my shipments?',
    answer: 'Yes. Track status, timelines, and shipment history through the platform and app.',
  },
  {
    question: 'What industries do you serve?',
    answer: 'We work with retail, electronics, fashion, automotive, and other sectors shipping to Kenya.',
  },
];

export const pricingFaqs: FaqItem[] = [
  {
    question: 'How is shipping cost calculated?',
    answer: 'Costs depend on origin, destination, weight, dimensions, and cargo type. Our calculator provides an estimate.',
  },
  {
    question: 'Are there additional fees?',
    answer: 'Final pricing may include handling, customs, or delivery surcharges depending on your shipment details.',
  },
  {
    question: 'Can I get a formal quote?',
    answer: 'Yes. Submit your details through the contact form and our team will provide a detailed quote.',
  },
];

export const aboutFaqs: FaqItem[] = [
  {
    question: 'Where is Velo based?',
    answer: 'Velo is a Dubai-based shipping company serving customers shipping to Kenya and beyond.',
  },
  {
    question: 'What makes Velo different?',
    answer: 'Pickup, tracking, and delivery are connected through one app-based experience.',
  },
  {
    question: 'How can I contact Velo?',
    answer: 'Reach us by phone, email, WhatsApp, or through the contact form on this site.',
  },
];

export const kenyaCoverage = [
  'Nairobi',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Eldoret',
  'Thika',
  'Nyeri',
  'Machakos',
  'Kitale',
  'Malindi',
];

export const dubaiCoverage = [
  'Dubai Marina',
  'Downtown Dubai',
  'Business Bay',
  'JLT',
  'Deira',
  'Bur Dubai',
  'Jebel Ali',
  'DIFC',
  'Al Quoz',
  'Sharjah',
];

export const standardTransitTable = {
  title: 'Transit Times',
  columns: [
    { key: 'method', label: 'Method' },
    { key: 'transit', label: 'Transit Time' },
    { key: 'notes', label: 'Notes' },
  ],
  rows: [
    { method: 'Air Freight', transit: '3–7 business days', notes: 'Fastest option for urgent cargo' },
    { method: 'Sea Freight', transit: '4–6 weeks', notes: 'Best for larger or bulk shipments' },
    { method: 'Door-to-Door', transit: 'Varies by method', notes: 'Includes pickup and final delivery' },
  ],
};

export const airTransitTable = {
  title: 'Air Freight Transit Times',
  columns: [
    { key: 'route', label: 'Route' },
    { key: 'transit', label: 'Transit Time' },
    { key: 'notes', label: 'Notes' },
  ],
  rows: [
    { route: 'Dubai → Nairobi', transit: '3–5 business days', notes: 'Express air options available' },
    { route: 'Dubai → Mombasa', transit: '4–6 business days', notes: 'Subject to flight schedules' },
    { route: 'Dubai → Other Kenya', transit: '5–7 business days', notes: 'Includes last-mile delivery' },
  ],
};

export const containerTable = {
  title: 'Container Options',
  columns: [
    { key: 'type', label: 'Type' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'bestFor', label: 'Best For' },
  ],
  rows: [
    { type: 'LCL (Less than Container)', capacity: 'Shared space', bestFor: 'Smaller commercial loads' },
    { type: '20ft Container', capacity: '~33 CBM', bestFor: 'Medium bulk shipments' },
    { type: '40ft Container', capacity: '~67 CBM', bestFor: 'Large volume cargo' },
  ],
};

export const standardProcess = [
  { step: '01', title: 'Pickup', description: 'We collect from your location in Dubai or the UAE.' },
  { step: '02', title: 'Shipping', description: 'Your cargo is prepared and shipped by air or sea.' },
  { step: '03', title: 'Tracking', description: 'Monitor status in real time through the Velo app.' },
  { step: '04', title: 'Delivery', description: 'Delivery to the recipient across Kenya.' },
];
