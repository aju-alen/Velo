import Link from 'next/link';
import { buildMetadata, buildSchemas, getPageConfig } from '@/lib/seo';
import { getPageContent } from '@/content/pages';
import JsonLd from '@/components/seo/JsonLd';
import MarketplaceFaqs from './MarketplaceFaqs';
import ListingGrid from '@/components/marketplace/ListingGrid';

const config = getPageConfig('marketplace');
const content = getPageContent('marketplace');
export const metadata = buildMetadata(config);

const heading = 'text-3xl font-bold leading-tight text-[#11181C] sm:text-4xl md:text-5xl md:leading-[1.25]';
const lead = 'text-[1.3rem] leading-8 text-[#687076]';
const cardTitle = 'mb-2 text-2xl font-bold leading-8 text-[#11181C]';
const wrap = 'mx-auto max-w-6xl px-6';
const section = 'py-20';
const card = 'rounded-2xl border border-[#E6E8EB] bg-white p-6';
const btnPrimary =
  'inline-flex items-center justify-center rounded-xl bg-[#FFAC1C] px-5 py-3 text-[1.3rem] leading-8 font-medium text-[#11181C] hover:bg-[#FFB84D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAC1C] focus-visible:ring-offset-2';
const btnSecondary =
  'inline-flex items-center justify-center rounded-xl border border-[#11181C] bg-white px-5 py-3 text-[1.3rem] leading-8 font-medium text-[#11181C] hover:bg-[#11181C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAC1C] focus-visible:ring-offset-2';
const btnOnAmber =
  'inline-flex items-center justify-center rounded-xl bg-[#11181C] px-5 py-3 text-[1.3rem] leading-8 font-medium text-white hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#11181C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFAC1C]';
const btnOnAmberSecondary =
  'inline-flex items-center justify-center rounded-xl border border-[#11181C] bg-white px-5 py-3 text-[1.3rem] leading-8 font-medium text-[#11181C] hover:bg-[#11181C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#11181C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFAC1C]';

const audiences = [
  {
    title: 'Guest',
    description:
      "Browse freely. No account needed. If you want to act on anything you see, you're prompted to get the app.",
  },
  {
    title: 'Sender',
    description: 'Browse the same listings, then open the app to message an Agent or request a shipment.',
    href: '/senders',
    linkLabel: 'For Senders',
  },
  {
    title: 'Logistics Agent',
    description:
      'See how other Agents present their listings for reference; managing your own listing happens in the app.',
    href: '/agents',
    linkLabel: 'For Logistics Agents',
  },
];

const reasons = [
  {
    title: "Compare, don't guess",
    description: 'See multiple Agents side by side instead of relying on whoever you already know.',
  },
  {
    title: 'No account required to look',
    description: 'Decide if this is worth pursuing before you commit to anything.',
  },
  {
    title: 'The same listings, on web or app',
    description: 'What an Agent posts appears identically in both places.',
  },
];

export default function MarketplacePage() {
  const schemas = buildSchemas(config, content);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F5F5] text-[1.3rem] leading-8 text-[#11181C]">
      <JsonLd data={schemas} />

      <section className="bg-gradient-to-b from-white to-[#F5F5F5] pb-16 pt-16">
        <div className={`${wrap} max-w-3xl`}>
          <h1 className="text-3xl font-semibold leading-tight text-[#11181C] sm:text-4xl md:text-5xl md:leading-[1.25]">
            See What&apos;s Moving Before You Commit to Anything
          </h1>
          <div className={`mt-6 space-y-4 ${lead}`}>
            <p>
              Browse Logistics Agents and what they can source or ship — no account, no commitment, just a look at
              what&apos;s actually available.
            </p>
            <p>When you&apos;re ready to send something or list something yourself, that happens in the app.</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/download-app" className={btnPrimary}>
              Get the App
            </Link>
            <Link href="/how-it-works" className={btnSecondary}>
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      <section className={section}>
        <div className={wrap}>
          <div className="mb-10 max-w-3xl">
            <h2 className={heading}>What You&apos;ll See Here</h2>
            <p className={`mt-4 ${lead}`}>These are the same listings agents post in the app.</p>
          </div>
          <ListingGrid />
        </div>
      </section>

      <section className={`${section} bg-white`}>
        <div className={wrap}>
          <div className="mb-10 max-w-3xl">
            <h2 className={heading}>Who Sees What Here</h2>
            <p className={`mt-4 ${lead}`}>
              The same page, three different next steps — every action still opens the app.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {audiences.map((item) => (
              <div key={item.title} className={`${card} flex flex-col`}>
                <h3 className={cardTitle}>{item.title}</h3>
                <p className={`flex-1 ${lead}`}>{item.description}</p>
                {'href' in item && item.href ? (
                  <Link href={item.href} className="mt-6 font-semibold text-[#11181C] underline">
                    {item.linkLabel}
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={section}>
        <div className={wrap}>
          <h2 className={`mb-10 max-w-3xl ${heading}`}>Why Browse Here Instead of Asking Around</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {reasons.map((item) => (
              <div key={item.title} className={card}>
                <h3 className={cardTitle}>{item.title}</h3>
                <p className={lead}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${section} bg-white`}>
        <div className={wrap}>
          <h2 className={`mb-10 ${heading}`}>Marketplace Questions</h2>
          <MarketplaceFaqs faqs={content.faqs} />
        </div>
      </section>

      <section className="bg-[#FFAC1C] py-20">
        <div className={`${wrap} max-w-3xl text-center`}>
          <h2 className={heading}>Ready to Act on What You&apos;ve Seen?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[1.3rem] leading-8 text-[#11181C]">
            Browsing is free and open. Messaging an Agent or listing something yourself happens in the app.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/download-app" className={btnOnAmber}>
              Get the App
            </Link>
            <Link href="/how-it-works" className={btnOnAmberSecondary}>
              See How It Works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
