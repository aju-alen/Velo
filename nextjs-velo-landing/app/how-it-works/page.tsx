import Link from 'next/link';
import OpenAppLink from '@/components/OpenAppLink';
import { ArrowRight } from 'lucide-react';
import { buildMetadata, buildSchemas, getPageConfig } from '@/lib/seo';
import { getPageContent } from '@/content/pages';
import JsonLd from '@/components/seo/JsonLd';
import HomeFaqs from '@/components/home/HomeFaqs';

const config = getPageConfig('how-it-works');
export const metadata = buildMetadata(config);

const heading = 'text-3xl font-bold leading-tight text-[#11181C] sm:text-4xl md:text-5xl md:leading-[1.25]';
const lead = 'text-[1.3rem] leading-8 text-[#687076]';
const wrap = 'mx-auto max-w-6xl px-6';
const section = 'py-20';
const card = 'rounded-2xl border border-[#E6E8EB] bg-white p-6';
const btnPrimary =
  'inline-flex items-center justify-center rounded-xl bg-[#FFAC1C] px-5 py-3 text-[1.3rem] leading-8 font-medium text-[#11181C] hover:bg-[#FFB84D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAC1C] focus-visible:ring-offset-2';
const btnSecondary =
  'inline-flex items-center justify-center rounded-xl border border-[#11181C] bg-white px-5 py-3 text-[1.3rem] leading-8 font-medium text-[#11181C] hover:bg-[#11181C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAC1C] focus-visible:ring-offset-2';

const changes = [
  {
    topic: 'Finding someone to ship with',
    oldWay: "Ask around, hope the contact's still active",
    withVelo: 'Browse verified Agents in the Marketplace',
  },
  {
    topic: 'Getting it there',
    oldWay: 'Carry it yourself, most of the time',
    withVelo: 'Schedule a pickup from your address',
  },
  {
    topic: "Knowing what's happening",
    oldWay: 'Message and wait',
    withVelo: 'Check the tracker, any time',
  },
  {
    topic: 'If it needs sourcing first',
    oldWay: 'A separate, informal conversation',
    withVelo: 'The same Agent can source and ship it',
  },
  {
    topic: 'The record of what you agreed',
    oldWay: 'A chat thread that scrolls away',
    withVelo: 'Kept in the app — price, timeline, status',
  },
];

const steps = [
  {
    step: '01',
    title: 'Schedule Pickup',
    description:
      "Tell us when and where — your home, office, warehouse, or a Logistics Agent's location if that's where the sourcing happened.",
    why: "Why it matters: you're not the one making the trip.",
  },
  {
    step: '02',
    title: 'Collection',
    description:
      "Your shipment is collected from that location and logged into the system, so there's a confirmed starting point — not just a promise it was picked up.",
    why: "Why it matters: there's a record from minute one, not just a memory of a conversation.",
  },
  {
    step: '03',
    title: 'Shipping',
    description:
      "The right option is matched to what you're sending and how soon it needs to get there — air for speed, sea for larger or less urgent loads.",
    why: "Why it matters: you're not guessing which option fits; it's matched to your shipment.",
  },
  {
    step: '04',
    title: 'Tracking',
    description: "Your shipment's progress is visible throughout the journey, not just at the start and the end.",
    why: 'Why it matters: this is the step that replaces "message and wait" entirely.',
  },
  {
    step: '05',
    title: 'Delivery in Kenya',
    description: 'It reaches its destination — not just Nairobi, but the address you specified.',
    why: 'Why it matters: no separate scramble to arrange collection on the Kenya side.',
  },
];

const priceFactors = [
  {
    title: "What you're sending",
    description:
      'A document costs less to move than a fridge. Weight and dimensions are the starting point for any estimate.',
  },
  {
    title: "How you're sending it",
    description:
      "Air is faster and costs more. Sea costs less and takes longer. You'll see both options before you decide.",
  },
  {
    title: "Where it's going",
    description:
      'Nairobi is the shortest route from port or airport. Destinations further out add distance, not complexity — but they do affect the estimate.',
  },
  {
    title: 'Whether it needs sourcing first',
    description:
      "If an Agent is finding or procuring the item, their sourcing cost is separate from shipping, and you'll see both broken out.",
  },
];

export default function HowItWorksPage() {
  const content = getPageContent('how-it-works');
  const schemas = buildSchemas(config, content);

  return (
    <>
      <JsonLd data={schemas} />
      <div className="min-h-screen overflow-x-hidden bg-[#F5F5F5] text-[1.3rem] leading-8 text-[#11181C]">
        <section className="bg-gradient-to-b from-white to-[#F5F5F5]">
          <div className={`${wrap} max-w-3xl pb-16 pt-10 lg:pt-24`}>
            <h1 className="mb-6 text-3xl font-semibold leading-tight text-[#11181C] sm:text-4xl md:text-5xl md:leading-[1.25]">
              Shipping to Kenya, Without the Guesswork
            </h1>
            <div className={`mb-8 space-y-4 ${lead}`}>
              <p>You shouldn&apos;t need an insider contact to get something to Kenya reliably. You need a process you can actually see.</p>
              <p>
                Here&apos;s exactly what happens, from the moment you decide to send something to the moment it&apos;s in someone&apos;s hands.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <OpenAppLink path="sender" className={btnPrimary}>
                Get Started as a Sender
                <ArrowRight className="ml-2 h-4 w-4" />
              </OpenAppLink>
              <OpenAppLink path="agent" className={btnSecondary}>
                Become a Logistics Agent
              </OpenAppLink>
            </div>
          </div>
        </section>

        <section className={section}>
          <div className={wrap}>
            <h2 className={`${heading} mb-10`}>What Changes</h2>
            <div className="hidden grid-cols-[1.1fr_1fr_1fr] gap-4 px-6 pb-4 sm:grid">
              <p className="font-semibold text-[#11181C]" />
              <p className="font-semibold text-[#11181C]">THE OLD WAY</p>
              <p className="font-semibold text-[#11181C]">WITH VELO</p>
            </div>
            <div className="space-y-4">
              {changes.map((row) => (
                <article key={row.topic} className={`${card} grid gap-4 sm:grid-cols-[1.1fr_1fr_1fr] sm:items-start`}>
                  <h3 className="text-2xl font-bold leading-8 text-[#11181C]">{row.topic}</h3>
                  <p className={lead}>
                    <span className="mb-1 block font-semibold text-[#11181C] sm:hidden">THE OLD WAY</span>
                    {row.oldWay}
                  </p>
                  <p className={lead}>
                    <span className="mb-1 block font-semibold text-[#11181C] sm:hidden">WITH VELO</span>
                    {row.withVelo}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={section}>
          <div className={wrap}>
            <h2 className={`${heading} mb-10`}>Two Ways to Start</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <article className={card}>
                <h3 className="mb-3 text-2xl font-bold leading-8 text-[#11181C]">You already have something to send.</h3>
                <p className={lead}>
                  Documents, parcels, commercial cargo, even heavy machinery — schedule a pickup and it moves through the process below.
                </p>
              </article>
              <article className={card}>
                <h3 className="mb-3 text-2xl font-bold leading-8 text-[#11181C]">You need something found first.</h3>
                <p className={lead}>
                  Browse the Marketplace for a Logistics Agent who sources what you&apos;re after, agree the details, and the same process picks up once they have it in hand.
                </p>
              </article>
            </div>
            <p className={`mt-8 max-w-3xl ${lead}`}>
              Both paths end the same way: tracked, from wherever it starts to your destination in Kenya.
            </p>
          </div>
        </section>

        <section className={section}>
          <div className={wrap}>
            <h2 id="the-process-in-full" className={`${heading} mb-10`}>The Process, in Full</h2>
            <div className="space-y-4">
              {steps.map((step) => (
                <article key={step.step} className={card}>
                  <p className="mb-3 font-semibold text-[#FFAC1C]">{step.step}</p>
                  <h3 className="mb-3 text-2xl font-bold leading-8 text-[#11181C]">{step.title}</h3>
                  <p className={lead}>{step.description}</p>
                  <p className="mt-4 font-medium text-[#11181C]">{step.why}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={section}>
          <div className={`${wrap} max-w-3xl`}>
            <h2 id="when-it-starts-with-sourcing-not-shipping" className={`${heading} mb-6`}>
              When It Starts with Sourcing, Not Shipping
            </h2>
            <div className={`space-y-4 ${lead}`}>
              <p>
                Not everything you send already exists in your hands. If you need something found — a part, a specific product, anything you&apos;d otherwise have tracked down yourself — that&apos;s what the Marketplace is for.
              </p>
              <p>
                Logistics Agents, Solo or Org, list what they can source. You review listings, agree the details with the Agent directly in the app, and once they have it, it moves into the same five-step process on the previous page.
              </p>
              <p className="font-medium text-[#11181C]">
                Why it matters: sourcing and shipping stop being two separate, disconnected problems.
              </p>
            </div>
          </div>
        </section>

        <section className={section}>
          <div className={wrap}>
            <h2 id="what-affects-your-price" className={`${heading} mb-6`}>What Affects Your Price</h2>
            <p className={`mb-10 max-w-3xl ${lead}`}>
              There&apos;s no single number that applies to every shipment, and it wouldn&apos;t be honest to pretend otherwise.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {priceFactors.map((factor) => (
                <article key={factor.title} className={card}>
                  <h3 className="mb-3 text-2xl font-bold leading-8 text-[#11181C]">{factor.title}</h3>
                  <p className={lead}>{factor.description}</p>
                </article>
              ))}
            </div>
            <p className={`mt-8 max-w-3xl ${lead}`}>
              You&apos;ll get an estimate before you confirm anything — never a surprise total at the end.{' '}
              <Link href="/pricing-calculator" className="font-medium text-[#FFAC1C] underline underline-offset-4">
                Try the Pricing Calculator
              </Link>
            </p>
          </div>
        </section>

        <section className={section}>
          <div className={wrap}>
            <div className="grid items-start gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
              <h2 className={heading}>Questions About the Process</h2>
              <HomeFaqs faqs={content.faqs} links={{ 'For Senders': '/senders' }} />
            </div>
          </div>
        </section>

        <section className="bg-[#FFAC1C] py-20">
          <div className={`${wrap} text-center`}>
            <h2 className={`${heading} mx-auto mb-6 max-w-4xl`}>Ready to Send Something, or List What You Offer?</h2>
            <p className="mb-8 text-[1.3rem] leading-8 text-[#11181C]">Two ways in, one process behind both of them.</p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <OpenAppLink
                path="sender"
                className="inline-flex items-center justify-center rounded-xl bg-[#11181C] px-5 py-3 text-[1.3rem] leading-8 font-medium text-white hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#11181C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFAC1C]"
              >
                Get Started as a Sender
              </OpenAppLink>
              <OpenAppLink
                path="agent"
                className="inline-flex items-center justify-center rounded-xl border border-[#11181C] bg-white px-5 py-3 text-[1.3rem] leading-8 font-medium text-[#11181C] hover:bg-[#11181C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#11181C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFAC1C]"
              >
                Become a Logistics Agent
              </OpenAppLink>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center rounded-xl border border-[#11181C] bg-white px-5 py-3 text-[1.3rem] leading-8 font-medium text-[#11181C] hover:bg-[#11181C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#11181C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFAC1C]"
              >
                Browse the Marketplace
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
