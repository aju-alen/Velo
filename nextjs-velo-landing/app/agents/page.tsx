import Link from 'next/link';
import OpenAppLink from '@/components/OpenAppLink';
import { buildMetadata, buildSchemas, getPageConfig } from '@/lib/seo';
import { getPageContent } from '@/content/pages';
import JsonLd from '@/components/seo/JsonLd';
import HomeFaqs from '@/components/home/HomeFaqs';

const config = getPageConfig('marketplace-agents');
const content = getPageContent('marketplace-agents');
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

const changes = [
  {
    title: "Your reach isn't capped by your contact list.",
    description: 'Anyone browsing the Marketplace can find you — not just people who already have your number.',
  },
  {
    title: "A request doesn't get lost in the noise.",
    description: 'Every request lives in the app, in order — even on your busiest day.',
  },
  {
    title: 'Your price and terms are set once, not repeated.',
    description: 'List it once. Everyone sees the same listing, the same terms.',
  },
  {
    title: 'What you agreed to is on record.',
    description: "No more relying on memory for what was said — it's written down, for both sides.",
  },
];

export default function ForAgentsPage() {
  const schemas = buildSchemas(config, content);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F5F5] text-[1.3rem] leading-8 text-[#11181C]">
      <JsonLd data={schemas} />

      <section className="bg-gradient-to-b from-white to-[#F5F5F5] pb-16 pt-16">
        <div className={`${wrap} max-w-3xl`}>
          <h1 className="text-3xl font-semibold leading-tight text-[#11181C] sm:text-4xl md:text-5xl md:leading-[1.25]">
            Keep Doing What You Do — Just Stop Losing Track of It
          </h1>
          <div className={`mt-6 space-y-4 ${lead}`}>
            <p>
              You already know how to find things and get them moving. WhatsApp is where a lot of that happens, and
              that&apos;s not the problem — it&apos;s a good tool for talking to people.
            </p>
            <p>
              The problem is everything else: a request buried under ten other conversations, a price nobody wrote
              down, no way to show a Sender what happened after you said &quot;it&apos;s on the way.&quot;
            </p>
            <p>List what you offer. Manage every request in one place. Get paid for work that&apos;s actually tracked, not just remembered.</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <OpenAppLink path="agent" className={btnPrimary}>
              Become an Agent
            </OpenAppLink>
            <Link href="/how-it-works" className={btnSecondary}>
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      <section className={section}>
        <div className={wrap}>
          <h2 className={`mb-10 ${heading}`}>However You Operate</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <article className={card}>
              <h3 className={cardTitle}>Solo Agent</h3>
              <p className={lead}>
                Working independently? Register as yourself, list what you source or ship, and manage requests
                directly — no separate business setup required to get started.
              </p>
            </article>
            <article className={card}>
              <h3 className={cardTitle}>Organization</h3>
              <p className={lead}>
                Running a team or a registered business? Register as an Org, and manage listings and requests across
                your whole operation from one account.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className={`${section} bg-white`}>
        <div className={wrap}>
          <h2 className={`mb-10 max-w-4xl ${heading}`}>What Changes When Your Work Has a System Behind It</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {changes.map((item) => (
              <article key={item.title} className={card}>
                <h3 className={cardTitle}>{item.title}</h3>
                <p className={lead}>
                  {item.title.startsWith('Your reach') ? (
                    <>
                      Anyone browsing the{' '}
                      <Link href="/marketplace" className="font-semibold text-[#11181C] underline">
                        Marketplace
                      </Link>{' '}
                      can find you — not just people who already have your number.
                    </>
                  ) : (
                    item.description
                  )}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={section}>
        <div className={wrap}>
          <h2 className={`mb-10 ${heading}`}>What You Get as an Agent</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <article className={card}>
              <h3 className={cardTitle}>A Marketplace listing</h3>
              <p className={lead}>Visible to Senders actively looking, not just people who already know you.</p>
            </article>
            <article className={card}>
              <h3 className={cardTitle}>Request management</h3>
              <p className={lead}>See and respond to requests in one place, not across a dozen chat threads.</p>
            </article>
            <article className={card}>
              <h3 className={cardTitle}>The same pickup-to-delivery process</h3>
              <p className={lead}>
                Once agreed, it runs through Schedule Pickup → Collection → Shipping → Tracking → Delivery.{' '}
                <Link href="/how-it-works#the-process-in-full" className="font-semibold text-[#11181C] underline">
                  Full process →
                </Link>
              </p>
            </article>
            <article className={card}>
              <h3 className={cardTitle}>A track record</h3>
              <p className={lead}>Completed requests build a visible history, not a reputation only your regulars know about.</p>
            </article>
          </div>
        </div>
      </section>

      <section className={`${section} bg-white`}>
        <div className={wrap}>
          <h2 className={`mb-10 ${heading}`}>Agent Questions</h2>
          <div className="mx-auto max-w-3xl">
            <HomeFaqs faqs={content.faqs} links={{ Marketplace: '/marketplace' }} />
          </div>
        </div>
      </section>

      <section className="bg-[#FFAC1C] py-20">
        <div className={`${wrap} max-w-3xl text-center`}>
          <h2 className={heading}>Ready to Put a System Behind What You Already Do?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[1.3rem] leading-8 text-[#11181C]">
            List what you offer. Manage requests in one place. Keep doing business exactly how you already talk to people.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <OpenAppLink path="agent" className={btnOnAmber}>
              Become a Solo Agent
            </OpenAppLink>
            <OpenAppLink path="agent" className={btnOnAmberSecondary}>
              Register an Organization
            </OpenAppLink>
            <Link href="/how-it-works" className={btnOnAmberSecondary}>
              See How It Works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
