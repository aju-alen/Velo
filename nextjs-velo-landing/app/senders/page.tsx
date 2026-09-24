import Link from 'next/link';
import OpenAppLink from '@/components/OpenAppLink';
import { buildMetadata, buildSchemas, getPageConfig } from '@/lib/seo';
import { getPageContent } from '@/content/pages';
import JsonLd from '@/components/seo/JsonLd';
import HomeFaqs from '@/components/home/HomeFaqs';

const config = getPageConfig('marketplace-senders');
const content = getPageContent('marketplace-senders');
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

const situations = [
  {
    title: 'A one-off gift or personal item',
    description: "A document, a parcel, something for family — schedule a pickup and you're done.",
  },
  {
    title: 'Sending regularly',
    description: 'Repeat shipments get the same process, with your history kept in one place instead of scattered across old conversations.',
  },
  {
    title: 'Something needs sourcing first',
    description: 'Skip ahead to the Marketplace — find a Logistics Agent who can find it, then ship it, without coordinating two separate things.',
  },
];

const included = [
  {
    title: 'Pickup from your address',
    description: 'Home, office, or wherever the item actually is.',
  },
  {
    title: 'Real-time tracking',
    description: 'See status from collection to delivery.',
    detail: true,
  },
  {
    title: 'Delivery across Kenya',
    description: 'Not just Nairobi.',
  },
  {
    title: 'A record you can find again',
    description: 'Quote, timeline, and status, kept in the app.',
  },
];

export default function ForSendersPage() {
  const schemas = buildSchemas(config, content);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F5F5] text-[1.3rem] leading-8 text-[#11181C]">
      <JsonLd data={schemas} />

      <section className="bg-gradient-to-b from-white to-[#F5F5F5] pb-16 pt-16">
        <div className={`${wrap} max-w-3xl`}>
          <h1 className="text-3xl font-semibold leading-tight text-[#11181C] sm:text-4xl md:text-5xl md:leading-[1.25]">
            Send Something to Kenya Without Doing It Yourself
          </h1>
          <div className={`mt-6 space-y-4 ${lead}`}>
            <p>You have something that needs to get to Kenya. You shouldn&apos;t have to become a logistics expert to make that happen.</p>
            <p>Tell us what you&apos;re sending. We&apos;ll match it to the right option, collect it from you, and keep you updated until it&apos;s delivered.</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <OpenAppLink path="sender" className={btnPrimary}>
              Get Started
            </OpenAppLink>
            <Link href="/how-it-works" className={btnSecondary}>
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      <section className={section}>
        <div className={wrap}>
          <h2 className={`mb-10 max-w-3xl ${heading}`}>Built for How You Actually Send Things</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {situations.map((item) => (
              <div key={item.title} className={card}>
                <h3 className={cardTitle}>{item.title}</h3>
                <p className={lead}>
                  {item.title === 'Something needs sourcing first' ? (
                    <>
                      Skip ahead to the{' '}
                      <Link href="/marketplace" className="font-semibold text-[#11181C] underline">
                        Marketplace
                      </Link>{' '}
                      — find a Logistics Agent who can find it, then ship it, without coordinating two separate things.
                    </>
                  ) : (
                    item.description
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${section} bg-white`}>
        <div className={wrap}>
          <div className="mb-10 max-w-3xl">
            <h2 className={heading}>What You&apos;re Actually Getting</h2>
            <p className={`mt-4 ${lead}`}>
              Not a shipping company. A way to stop being the one who has to carry things, chase updates, and hope the timeline holds.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <article className={card}>
              <h3 className={cardTitle}>You send a request, not a favor.</h3>
              <p className={lead}>No relying on whoever happens to be free to help you get something to Deira.</p>
            </article>
            <article className={card}>
              <h3 className={cardTitle}>You watch it move, instead of waiting on a reply.</h3>
              <p className={lead}>The tracker replaces the follow-up message.</p>
            </article>
            <article className={card}>
              <h3 className={cardTitle}>You get one quote, not a negotiation.</h3>
              <p className={lead}>
                Price is shown before you commit — see{' '}
                <Link href="/how-it-works#what-affects-your-price" className="font-semibold text-[#11181C] underline">
                  How It Works
                </Link>{' '}
                → What Affects Your Price.
              </p>
            </article>
            <article className={card}>
              <h3 className={cardTitle}>You choose who ships it.</h3>
              <p className={lead}>
                Compare Logistics Agents in the{' '}
                <Link href="/marketplace" className="font-semibold text-[#11181C] underline">
                  Marketplace
                </Link>{' '}
                instead of using whoever you already know.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className={section}>
        <div className={wrap}>
          <h2 className={`mb-10 ${heading}`}>What&apos;s Included</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {included.map((item) => (
              <article key={item.title} className={card}>
                <h3 className={cardTitle}>{item.title}</h3>
                <p className={lead}>
                  {item.description}
                  {item.detail ? (
                    <>
                      {' '}
                      <Link href="/how-it-works#the-process-in-full" className="font-semibold text-[#11181C] underline">
                        Full detail →
                      </Link>
                    </>
                  ) : null}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${section} bg-white`}>
        <div className={`${wrap} max-w-3xl`}>
          <h2 className={heading}>Sending for a Business, Not Just Yourself?</h2>
          <p className={`mt-4 ${lead}`}>
            Recurring shipments get the same process, with visibility across all of them in one place — not one thread per shipment.
          </p>
        </div>
      </section>

      <section className={section}>
        <div className={wrap}>
          <h2 className={`mb-10 ${heading}`}>Sender Questions</h2>
          <div className="mx-auto max-w-3xl">
            <HomeFaqs
              faqs={content.faqs}
              links={{
                Marketplace: '/marketplace',
                'How It Works': '/how-it-works#when-it-starts-with-sourcing-not-shipping',
              }}
            />
          </div>
        </div>
      </section>

      <section className="bg-[#FFAC1C] py-20">
        <div className={`${wrap} max-w-3xl text-center`}>
          <h2 className={heading}>Ready to Send Something?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[1.3rem] leading-8 text-[#11181C]">
            One request, matched to the right option, tracked the whole way.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <OpenAppLink path="sender" className={btnOnAmber}>
              Get Started as a Sender
            </OpenAppLink>
            <Link href="/marketplace" className={btnOnAmberSecondary}>
              Browse the Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
