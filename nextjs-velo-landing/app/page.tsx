import Link from 'next/link';
import DownloadAppLink from '@/components/DownloadAppLink';
import OpenAppLink from '@/components/OpenAppLink';
import type { RegistrationPath } from '@/lib/app-links';
import {
  MapPin,
  Radar,
  Truck,
  Package,
  Smartphone,
  Plane,
  Ship,
  DoorOpen,
  Download,
  ArrowRight,
  Calendar,
  Box,
  Navigation,
  Store,
} from 'lucide-react';
import { buildMetadata, buildSchemas, getPageConfig } from '@/lib/seo';
import { getPageContent } from '@/content/pages';
import JsonLd from '@/components/seo/JsonLd';
import StickyCta from '@/components/home/StickyCta';
import StoreBadges from '@/components/home/StoreBadges';
import ProcessSteps from '@/components/home/ProcessSteps';
import HomeFaqs from '@/components/home/HomeFaqs';

const homeConfig = getPageConfig('home');
export const metadata = buildMetadata(homeConfig);

const heading = 'text-3xl font-bold leading-tight text-[#11181C] sm:text-4xl md:text-5xl md:leading-[1.25]';
const lead = 'text-[1.3rem] leading-8 text-[#687076]';
const body = 'text-[1.3rem] leading-8 text-[#687076]';
const cardTitle = 'mb-2 text-2xl font-bold leading-8 text-[#11181C]';
const wrap = 'mx-auto max-w-6xl px-6';
const section = 'py-20';
const card = 'rounded-2xl border border-[#E6E8EB] bg-white p-6';
const btnPrimary =
  'inline-flex items-center justify-center rounded-xl bg-[#FFAC1C] px-5 py-3 text-[1.3rem] leading-8 font-medium text-[#11181C] hover:bg-[#FFB84D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAC1C] focus-visible:ring-offset-2';
const btnSecondary =
  'inline-flex items-center justify-center rounded-xl border border-[#11181C] bg-white px-5 py-3 text-[1.3rem] leading-8 font-medium text-[#11181C] hover:bg-[#11181C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAC1C] focus-visible:ring-offset-2';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-[1.3rem] leading-8 font-medium text-[#FFAC1C]">{children}</p>;
}

export default function HomePage() {
  const homeContent = getPageContent('home');
  const schemas = buildSchemas(homeConfig, homeContent);

  const featureItems = [
    {
      icon: MapPin,
      title: 'Pickup Across Dubai and the UAE',
      description: 'Arrange collection from your home, office, warehouse, or business premises.',
    },
    {
      icon: Store,
      title: 'A Marketplace of Verified Agents',
      description:
        'Compare Logistics Agents by what they offer, instead of relying on whoever you happen to know.',
      isNew: true,
    },
    {
      icon: Radar,
      title: 'Real-Time Tracking',
      description: 'Stay informed as your shipment moves.',
    },
    {
      icon: Truck,
      title: 'Delivery Across Kenya',
      description: 'Reach destinations beyond Nairobi.',
    },
    {
      icon: Package,
      title: 'Personal and Commercial Cargo',
      description: 'From envelopes to heavy machinery.',
    },
    {
      icon: Smartphone,
      title: 'Available on iPhone and Android',
      description: 'Manage shipments wherever you are.',
    },
  ];

  const trustBarItems = [
    {
      title: "NO MIDDLEMEN YOU CAN'T SEE",
      description: 'Every Agent on Velo is verified before they can list.',
    },
    {
      title: 'NO GUESSING',
      description: 'Every shipment is tracked from pickup to delivery.',
    },
    {
      title: 'NO DISAPPEARING ACTS',
      description: 'Every listing, price, and request lives in the app — not a chat that can vanish.',
    },
  ];

  const roles: Array<{
    title: string;
    description: string;
    cta: string;
    href: string;
    registrationPath?: RegistrationPath;
  }> = [
    {
      title: 'Sender',
      description:
        'Schedule a pickup for what you already have, or browse the Marketplace to find an Agent who can source it for you.',
      cta: 'Get Started as a Sender',
      href: '/get-started/sender',
      registrationPath: 'sender',
    },
    {
      title: 'Logistics Agent — Solo or Org',
      description:
        'List what you can source or ship. Manage every request from one place instead of a phone full of chats.',
      cta: 'Become an Agent',
      href: '/get-started/agent',
      registrationPath: 'agent',
    },
    {
      title: 'Guest',
      description:
        "Browse the Marketplace anytime — see what's moving, who's shipping it, and what it costs. No account needed.",
      cta: 'Browse the Marketplace',
      href: '/marketplace',
    },
  ];

  const services = [
    { icon: Plane, title: 'Air Freight', href: '/air-freight-dubai-to-kenya' },
    { icon: Ship, title: 'Sea Freight', href: '/sea-freight-dubai-to-kenya' },
    { icon: DoorOpen, title: 'Door-to-Door Shipping', href: '/door-to-door-shipping-kenya' },
    { icon: Package, title: 'Package Pickup', href: '/package-pickup-dubai' },
  ];

  const steps = [
    {
      step: '01',
      title: 'Schedule Pickup',
      description: 'Choose when and where your shipment should be collected.',
    },
    {
      step: '02',
      title: 'Collection',
      description: 'We collect from your location.',
    },
    {
      step: '03',
      title: 'Shipping',
      description: 'Select the option that fits your cargo and timeline.',
    },
    {
      step: '04',
      title: 'Tracking',
      description: 'Monitor progress throughout the journey.',
    },
    {
      step: '05',
      title: 'Delivery in Kenya',
      description: 'Your shipment reaches its destination.',
    },
  ];

  const faqs = homeContent.faqs;

  const appFeatures = [
    { icon: Calendar, text: 'Schedule a pickup.' },
    { icon: Navigation, text: 'Track shipments.' },
    { icon: Box, text: 'Receive updates.' },
    { icon: Package, text: 'Manage multiple deliveries.' },
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <div className="min-h-screen overflow-x-hidden bg-[#F5F5F5] text-[1.3rem] leading-8 text-[#11181C]">
      {/* Hero */}
      <section id="home-hero" className="bg-gradient-to-b from-white to-[#F5F5F5]">
        <div className={`${wrap} pb-16 pt-10 lg:pt-24`}>
          <div className="max-w-3xl">
            <div>
              <h1 className="mb-6 text-3xl font-semibold leading-tight text-[#11181C] sm:text-4xl md:text-5xl md:leading-[1.25]">
                Ship from Dubai to Kenya Without the Hassle
              </h1>
              <div className={`mb-8 max-w-[65ch] space-y-4 ${lead}`}>
                <p>
                  Sending goods to Kenya shouldn&apos;t mean driving across the city, chasing updates, or relying on scattered conversations just to know what&apos;s happening.
                </p>
                <p>Velo brings the entire process together in one place.</p>
                <p>
                  Schedule a pickup from your home, office, or warehouse. Follow your shipment in real time. Stay informed from collection to delivery.
                </p>
                <p>
                  From documents and personal parcels to commercial cargo and heavy machinery, you can manage your shipments without disrupting your day.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/marketplace" className={btnPrimary}>
                  Browse the Marketplace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <DownloadAppLink className={btnSecondary}>
                  <Download className="mr-2 h-4 w-4" />
                  Download the App
                </DownloadAppLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar — Option B */}
      <section className={section}>
        <div className={wrap}>
          <div className="grid gap-4 sm:grid-cols-3">
            {trustBarItems.map((item) => (
              <div key={item.title} className={card}>
                <h3 className={cardTitle}>{item.title}</h3>
                <p className={body}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Velo Is For */}
      <section className={section}>
        <div className={wrap}>
          <div className="mb-10 max-w-3xl">
            <SectionLabel>Built for everyone sending something home</SectionLabel>
            <h2 className={heading}>Who Velo Is For</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {roles.map((role, index) => (
              <div key={role.title} className={`${card} flex flex-col`}>
                <h3 className={cardTitle}>{role.title}</h3>
                <p className={`mb-8 flex-1 ${body}`}>{role.description}</p>
                {role.registrationPath ? (
                  <OpenAppLink path={role.registrationPath} className={index === 0 ? btnPrimary : btnSecondary}>
                    {role.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </OpenAppLink>
                ) : (
                  <Link href={role.href} className={index === 0 ? btnPrimary : btnSecondary}>
                    {role.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-Time Tracking */}
      <section id="real-time-shipment-tracking" className={section}>
        <div className={wrap}>
          <div className="max-w-3xl">
            <h2 className={`${heading} mb-6`}>Real-Time Shipment Tracking</h2>
            <div className={`space-y-4 ${lead}`}>
              <p>For many people, the hardest part of shipping isn&apos;t sending the package.</p>
              <p>It&apos;s everything that comes after.</p>
              <p>Waiting. Following up. Calling. Wondering.</p>
              <p>
                Velo gives you visibility throughout the journey, so you spend less time chasing information and more time focusing on what matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className={section}>
        <div className={wrap}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featureItems.map((item, index) => {
              const tones = ['bg-[#FFAC1C]', 'bg-[#FFAC1C]', 'bg-[#FFAC1C]', 'bg-[#FFAC1C]', 'bg-[#FFAC1C]', 'bg-[#FFAC1C]'];
              const isMarketplace = 'isNew' in item && item.isNew;
              return (
                <div key={item.title} className={`relative ${card}`}>
                  {isMarketplace ? (
                    <span className="absolute right-4 top-4 rounded-lg bg-[#FFAC1C] px-2 py-1 text-[1.3rem] leading-8 font-semibold text-[#11181C]">
                      New
                    </span>
                  ) : null}
                  <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${tones[index]}`}>
                    <item.icon className="h-5 w-5 text-[#11181C]" />
                  </div>
                  <h3 className={cardTitle}>{item.title}</h3>
                  <p className={body}>{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className={section}>
        <div className={wrap}>
          <h2 className={`${heading} mb-10`}>Services</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <article key={service.title} className={card}>
                <Link href={service.href} className="block text-[1.3rem] leading-8">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFAC1C]">
                    <service.icon className="h-5 w-5 text-[#11181C]" />
                  </div>
                  <h3 className={cardTitle}>{service.title}</h3>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Velo */}
      <section id="why-velo" className={section}>
        <div className={wrap}>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 className={heading}>Why Customers Choose Velo</h2>
            </div>
            <div className={`space-y-5 lg:col-span-7 ${lead}`}>
              <p>
                People sending goods to Kenya have spent years adapting to systems that were never built around convenience.
              </p>
              <p>
                Packages are dropped off in one place. Updates come from somewhere else. Information depends on who answers the phone. And many people still travel to cargo offices because there hasn&apos;t been a better alternative.
              </p>
              <p>The industry has learned to work around these limitations.</p>
              <p>Velo was built to remove them.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={section}>
        <div className="mx-auto w-full max-w-[96rem] px-6">
          <ProcessSteps steps={steps} />
        </div>
      </section>

      {/* Business */}
      <section id="business" className={section}>
        <div className={wrap}>
          <div>
            <div className="max-w-3xl">
              <h2 className={`${heading} mb-6`}>Shipping Solutions for Businesses</h2>
              <div className={`space-y-4 ${lead}`}>
                <p>Growing businesses don&apos;t just ship products. They depend on them.</p>
                <p>
                  Velo gives businesses greater visibility and a more organized way to manage regular shipments, so you can spend less time following up and more time planning ahead.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App */}
      <section className={section}>
        <div className={wrap}>
          <div>
            <div className="max-w-3xl">
              <h2 className={`${heading} mb-5`}>Mobile App</h2>
              <p className={`mb-8 ${lead}`}>Open the app and see what&apos;s happening.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {appFeatures.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3 rounded-xl border border-[#E6E8EB] bg-white p-4">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#11181C]" />
                    <span className="text-[1.3rem] leading-8 font-medium text-[#11181C]">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={section}>
        <div className={wrap}>
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <div>
              <h2 className={heading}>FAQ</h2>
            </div>
            <HomeFaqs faqs={faqs} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="home-closing" className="bg-[#FFAC1C] py-16 sm:py-20 lg:py-24">
        <div className={`${wrap} flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-20`}>
          <StoreBadges />
          <div className="w-full max-w-xl text-center lg:max-w-none lg:text-left">
            <h2 className="text-balance text-3xl font-bold leading-[1.15] text-[#11181C] sm:text-4xl lg:text-5xl lg:leading-[1.12]">
              Spend Less Time Following Up. Spend More Time Moving Forward.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[1.3rem] leading-8 text-[#11181C] lg:mx-0">
              Start with a quote. Schedule a pickup. Track your shipment from collection to delivery.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#11181C] px-5 py-3 text-[1.3rem] leading-8 font-medium text-white hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#11181C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFAC1C]"
            >
              Request a Quote
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <StickyCta />
    </div>
    </>
  );
}
