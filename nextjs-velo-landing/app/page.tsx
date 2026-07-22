import Image from 'next/image';
import Link from 'next/link';
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
  Building2,
} from 'lucide-react';
import { buildMetadata, buildSchemas, getPageConfig } from '@/lib/seo';
import { getPageContent } from '@/content/pages';
import JsonLd from '@/components/seo/JsonLd';

const homeConfig = getPageConfig('home');
export const metadata = buildMetadata(homeConfig);

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[#FFAC1C] mb-4">
      {children}
    </span>
  );
}

export default function HomePage() {
  const homeContent = getPageContent('home');
  const schemas = buildSchemas(homeConfig, homeContent);

  const trustItems = [
    {
      icon: MapPin,
      title: 'Pickup Across Dubai and the UAE',
      description: 'Arrange collection from your home, office, warehouse, or business premises.',
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

  const services = [
    {
      icon: Plane,
      title: 'Air Freight',
      description: 'For urgent deliveries and time-sensitive cargo.',
    },
    {
      icon: Ship,
      title: 'Sea Freight',
      description: 'For larger shipments and heavier loads.',
    },
    {
      icon: DoorOpen,
      title: 'Door-to-Door Shipping',
      description: 'Collection and delivery handled through one process.',
    },
    {
      icon: Package,
      title: 'Package Pickup',
      description: 'Collection arranged from your preferred location.',
    },
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
      <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative isolate">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#f9fafb_0%,#ffffff_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,172,28,0.12),transparent_45%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 lg:pb-32">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
            <div className="max-w-2xl">
              <SectionLabel>Dubai → Kenya</SectionLabel>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-black leading-[1.1] tracking-tight mb-8">
                Ship from Dubai to Kenya Without the Hassle
              </h1>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed border-l-4 border-[#FFAC1C] pl-6 mb-10">
                <p>
                  Sending goods to Kenya shouldn&apos;t mean driving across the city, chasing updates, or relying on scattered conversations just to know what&apos;s happening.
                </p>
                <p>Velo brings the entire process together in one place.</p>
                <p>
                  Arrange pickup from your home, office, or warehouse. Follow your shipment in real time. Stay informed from collection to delivery.
                </p>
                <p>
                  From documents and personal parcels to commercial cargo and heavy machinery, you can manage your shipments without disrupting your day.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-black text-white px-7 py-3.5 rounded-full hover:bg-gray-800 transition-colors font-semibold"
                >
                  Request a Quote
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  href="/download-app"
                  className="inline-flex items-center justify-center bg-white text-black px-7 py-3.5 rounded-full border-2 border-black hover:bg-black hover:text-white transition-colors font-semibold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download the App
                </Link>
              </div>
            </div>

            <div className="relative lg:pl-4">
              <div className="rounded-3xl bg-black p-8 sm:p-10 shadow-2xl">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                  <Image src="/logo.png" alt="Velo" width={64} height={40} className="w-16 h-10 brightness-0 invert" />
                  <span className="text-xs font-medium uppercase tracking-wider text-[#FFAC1C]">Live route</span>
                </div>
                <div className="space-y-4">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                    <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Origin</p>
                    <p className="text-white font-semibold text-lg">Dubai, UAE</p>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-px h-8 bg-gradient-to-b from-[#FFAC1C] to-white/20" />
                  </div>
                  <div className="rounded-2xl bg-[#FFAC1C]/10 border border-[#FFAC1C]/30 p-5">
                    <p className="text-[#FFAC1C] text-xs uppercase tracking-wider mb-1">Destination</p>
                    <p className="text-white font-semibold text-lg">Kenya</p>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                  {['Pickup', 'Track', 'Deliver'].map((label) => (
                    <div key={label} className="rounded-xl bg-white/5 py-3 px-2">
                      <p className="text-white text-sm font-medium">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full rounded-3xl bg-[#FFAC1C]/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section id="real-time-shipment-tracking" className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <div className="lg:sticky lg:top-32">
              <SectionLabel>Visibility</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-bold text-black leading-tight mb-6">
                Real-Time Shipment Tracking
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>For many people, the hardest part of shipping isn&apos;t sending the package.</p>
                <p>It&apos;s everything that comes after.</p>
                <p className="text-black font-medium">Waiting. Following up. Calling. Wondering.</p>
                <p>
                  Velo gives you visibility throughout the journey so you spend less time chasing information and more time focusing on what matters.{' '}
                  <Link href="/track-shipment" className="text-[#FFAC1C] font-medium hover:underline">
                    Track your shipment
                  </Link>{' '}
                  in real time.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {trustItems.map((item, index) => (
                <div
                  key={index}
                  className={`group rounded-2xl border border-gray-200 bg-gray-50/80 p-6 hover:border-[#FFAC1C]/50 hover:bg-white hover:shadow-lg transition-all duration-300 ${
                    index === trustItems.length - 1 ? 'sm:col-span-2' : ''
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl bg-[#FFAC1C] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <item.icon className="w-5 h-5 text-black" />
                  </div>
                  <h3 className="text-base font-bold text-black mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 lg:py-32 bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <SectionLabel>Services</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Air Freight Services</h2>
            <p className="text-gray-400 mb-6">
              <Link href="/air-freight-dubai-to-kenya" className="hover:text-[#FFAC1C] transition-colors">
                Learn about air freight →
              </Link>
            </p>
            <h2 className="text-2xl font-bold mb-5">Sea Freight Solutions</h2>
            <p className="text-gray-400 mb-6">
              <Link href="/sea-freight-dubai-to-kenya" className="hover:text-[#FFAC1C] transition-colors">
                Learn about sea freight →
              </Link>
            </p>
            <p className="text-white pt-2">
              <Link href="/shipping-from-dubai-to-kenya" className="hover:text-[#FFAC1C] transition-colors">
                View all Dubai to Kenya shipping options →
              </Link>
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <article
                key={index}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-7 hover:bg-[#FFAC1C] hover:border-[#FFAC1C] transition-colors duration-300"
              >
                <Link
                  href={
                    service.title === 'Air Freight'
                      ? '/air-freight-dubai-to-kenya'
                      : service.title === 'Sea Freight'
                        ? '/sea-freight-dubai-to-kenya'
                        : service.title === 'Door-to-Door Shipping'
                          ? '/door-to-door-shipping-kenya'
                          : '/package-pickup-dubai'
                  }
                  className="block"
                >
                <div className="w-12 h-12 rounded-xl bg-[#FFAC1C] group-hover:bg-black flex items-center justify-center mb-6 transition-colors">
                  <service.icon className="w-6 h-6 text-black group-hover:text-[#FFAC1C]" />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-black">{service.title}</h3>
                <p className="text-sm text-gray-400 group-hover:text-black/70 leading-relaxed">{service.description}</p>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why Velo */}
      <section id="why-velo" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionLabel>Why Velo</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-bold text-black leading-tight">
                Why Customers Choose Velo
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-5 text-gray-600 text-lg leading-relaxed">
              <p>
                People sending goods to Kenya have spent years adapting to systems that were never built around convenience.
              </p>
              <p>
                Packages are dropped off in one place. Updates come from somewhere else. Information depends on who answers the phone. And many people still travel to cargo offices because there hasn&apos;t been a better alternative.
              </p>
              <p>The industry has learned to work around these limitations.</p>
              <blockquote className="border-l-4 border-[#FFAC1C] pl-6 py-2 my-8">
                <p className="text-xl font-bold text-black">Velo was built to remove them.</p>
              </blockquote>
              <p>Instead of adjusting your day around shipping, shipping should adjust to you.</p>
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                {['Book a pickup.', 'Follow your shipment.', 'Stay informed.', 'Handle everything from one place.'].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-black font-medium text-base">
                      <span className="w-2 h-2 rounded-full bg-[#FFAC1C] shrink-0" />
                      {item}
                    </div>
                  ),
                )}
              </div>
              <p className="font-semibold text-black pt-4">
                Because convenience shouldn&apos;t stop at online shopping.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <SectionLabel>Process</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
              From Pickup to Delivery, Without the Detours
            </h2>
            <p className="text-gray-600 leading-relaxed">
              International shipping becomes much simpler when the experience is connected.
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-[#FFAC1C]/30" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
              {steps.map((step, index) => (
                <div key={index} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center text-sm font-bold mb-5 shadow-lg ring-4 ring-gray-50">
                    {step.step}
                  </div>
                  <h3 className="text-base font-bold text-black mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-[200px]">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Business */}
      <section id="business" className="py-24 lg:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#FFAC1C] flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-black" />
                </div>
                <SectionLabel>Business</SectionLabel>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 leading-tight">
                Shipping Solutions for Businesses
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>Growing businesses don&apos;t just ship products. They depend on them.</p>
                <p>
                  Inventory levels, customer expectations, and delivery schedules all depend on goods arriving when they&apos;re needed.
                </p>
                <p>
                  Managing recurring shipments through calls and fragmented processes becomes harder as your business grows.
                </p>
                <p className="text-gray-300">
                  Velo gives businesses greater visibility and a more organized way to manage regular shipments. So you can spend less time following up and more time planning ahead.
                </p>
              </div>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-[#FFAC1C] to-[#FFB84D] p-10 lg:p-12">
              <p className="text-black/70 text-sm font-semibold uppercase tracking-wider mb-3">For teams</p>
              <p className="text-2xl font-bold text-black mb-8 leading-snug">
                Greater visibility. Less follow-up. More planning ahead.
              </p>
              <Link
                href="/business-shipping"
                className="inline-flex items-center justify-center bg-black text-white px-7 py-3.5 rounded-full hover:bg-gray-900 transition-colors font-semibold"
              >
                Explore Business Shipping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* App */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-gray-50 border border-gray-200 overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="p-10 lg:p-14 flex flex-col justify-center">
                <SectionLabel>Mobile App</SectionLabel>
                <h2 className="text-3xl sm:text-4xl font-bold text-black mb-5 leading-tight">
                  Schedule Pickup Through the Velo App
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">Open the app and see what&apos;s happening.</p>
                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {appFeatures.map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-start gap-3 rounded-xl bg-white border border-gray-200 p-4">
                      <Icon className="w-5 h-5 text-[#FFAC1C] shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-gray-800">{text}</span>
                    </div>
                  ))}
                </div>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Everything stays within reach, even when you&apos;re away from your desk. Because staying informed shouldn&apos;t depend on who answers the phone.
                </p>
                <Link
                  href="/download-app"
                  className="inline-flex w-fit items-center justify-center bg-black text-white px-7 py-3.5 rounded-full hover:bg-gray-800 transition-colors font-semibold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download the App
                </Link>
              </div>
              <div className="relative bg-black flex items-center justify-center p-12 min-h-[320px] lg:min-h-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,172,28,0.15),transparent_55%)]" />
                <div className="relative w-56 rounded-[2rem] border-4 border-gray-800 bg-white p-6 shadow-2xl">
                  <Image src="/logo.png" alt="Velo app" width={64} height={40} className="w-16 h-10 mx-auto mb-4" />
                  <p className="text-center text-sm text-gray-600">Manage shipments on iPhone and Android</p>
                  <div className="mt-6 space-y-2">
                    <div className="h-2 rounded-full bg-gray-100" />
                    <div className="h-2 rounded-full bg-[#FFAC1C]/30 w-4/5 mx-auto" />
                    <div className="h-2 rounded-full bg-gray-100 w-3/5 mx-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
            <div>
              <SectionLabel>FAQ</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-bold text-black">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-2xl bg-white border border-gray-200 overflow-hidden open:shadow-md open:border-[#FFAC1C]/30 transition-all"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-semibold text-black hover:bg-gray-50/80">
                    {faq.question}
                    <span className="text-[#FFAC1C] text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#FFAC1C] via-[#FFB84D] to-[#FFAC1C] px-8 py-16 sm:px-14 sm:py-20 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.06),transparent_50%)]" />
            <div className="relative max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6 leading-tight">
                Spend Less Time Following Up. Spend More Time Moving Forward.
              </h2>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-black/80 mb-4">
                <span>Start with a quote.</span>
                <span className="hidden sm:inline text-black/30">·</span>
                <span>Schedule a pickup.</span>
                <span className="hidden sm:inline text-black/30">·</span>
                <span>Track your shipment from collection to delivery.</span>
              </div>
              <p className="text-black/70 mb-10">
                No unnecessary trips. No endless phone calls. No wondering where your cargo is.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-black text-white px-7 py-3.5 rounded-full hover:bg-gray-900 transition-colors font-semibold"
                >
                  Request a Quote
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  href="/download-app"
                  className="inline-flex items-center justify-center bg-white text-black px-7 py-3.5 rounded-full border-2 border-black/10 hover:border-black transition-colors font-semibold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download the App
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
