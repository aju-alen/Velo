import Link from 'next/link';
import { buildMetadata, buildSchemas, getPageConfig } from '@/lib/seo';
import { getPageContent } from '@/content/pages';
import { siteConfig } from '@/lib/seo/site';
import JsonLd from '@/components/seo/JsonLd';
import ContactForm from '@/components/ContactForm';

const config = getPageConfig('contact');
const content = getPageContent('contact');
export const metadata = buildMetadata(config);

const heading = 'text-3xl font-bold leading-tight text-[#11181C] sm:text-4xl md:text-5xl md:leading-[1.25]';
const lead = 'text-[1.3rem] leading-8 text-[#687076]';
const cardTitle = 'mb-2 text-2xl font-bold leading-8 text-[#11181C]';
const wrap = 'mx-auto max-w-6xl px-6';
const card = 'rounded-2xl border border-[#E6E8EB] bg-white p-6';
const btnSecondary =
  'inline-flex items-center justify-center rounded-xl border border-[#11181C] bg-white px-5 py-3 text-[1.3rem] leading-8 font-medium text-[#11181C] hover:bg-[#11181C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAC1C] focus-visible:ring-offset-2';

const hasRealPhone = siteConfig.phone !== '+971-000-0000';

export default function ContactPage() {
  const schemas = buildSchemas(config, content);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F5F5] text-[1.3rem] leading-8 text-[#11181C]">
      <JsonLd data={schemas} />

      <section className="bg-gradient-to-b from-white to-[#F5F5F5] pb-16 pt-16">
        <div className={`${wrap} max-w-3xl`}>
          <h1 className="text-3xl font-semibold leading-tight text-[#11181C] sm:text-4xl md:text-5xl md:leading-[1.25]">
            Get in Touch
          </h1>
          <p className={`mt-6 ${lead}`}>
            Questions about a shipment, becoming an Agent, or anything else — here&apos;s how to reach us.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className={wrap}>
          <h2 className={`mb-10 ${heading}`}>Ways to Reach Us</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <article className={card}>
              <h3 className={cardTitle}>WhatsApp</h3>
              {hasRealPhone ? (
                <p className="mb-2 text-[1.3rem] font-semibold leading-8 text-[#11181C]">{siteConfig.phone}</p>
              ) : null}
              <p className={lead}>Fastest way to reach us during business hours.</p>
            </article>
            <article className={card}>
              <h3 className={cardTitle}>Phone</h3>
              {hasRealPhone ? (
                <p className="mb-2 text-[1.3rem] font-semibold leading-8 text-[#11181C]">{siteConfig.phone}</p>
              ) : null}
              <p className={lead}>UAE business hours.</p>
            </article>
            <article className={card}>
              <h3 className={cardTitle}>Email</h3>
              <p className="mb-2 text-[1.3rem] leading-8">
                <a href={`mailto:${siteConfig.email}`} className="font-semibold text-[#11181C] underline">
                  {siteConfig.email}
                </a>
              </p>
              <p className={lead}>For anything that isn&apos;t urgent.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className={`${wrap} max-w-3xl`}>
          <h2 className={heading}>Before You Reach Out</h2>
          <p className={`mt-4 ${lead}`}>
            Most questions are already answered on{' '}
            <Link href="/how-it-works" className="font-semibold text-[#11181C] underline">
              How It Works
            </Link>
            ,{' '}
            <Link href="/senders" className="font-semibold text-[#11181C] underline">
              For Senders
            </Link>
            , or{' '}
            <Link href="/agents" className="font-semibold text-[#11181C] underline">
              For Logistics Agents
            </Link>{' '}
            — worth a quick check before messaging, especially for pricing and process questions.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {hasRealPhone ? (
              <a
                href={`https://wa.me/${siteConfig.phone.replace(/\D/g, '')}`}
                className="inline-flex items-center justify-center rounded-xl bg-[#FFAC1C] px-5 py-3 text-[1.3rem] leading-8 font-medium text-[#11181C] hover:bg-[#FFB84D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAC1C] focus-visible:ring-offset-2"
              >
                Message on WhatsApp
              </a>
            ) : null}
            <Link href="/how-it-works" className={btnSecondary}>
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      <section id="quote-form" className="py-20">
        <div className={`${wrap} max-w-3xl`}>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
