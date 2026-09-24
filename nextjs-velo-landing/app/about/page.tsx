import Link from 'next/link';
import { buildMetadata, buildSchemas, getPageConfig } from '@/lib/seo';
import { getPageContent } from '@/content/pages';
import JsonLd from '@/components/seo/JsonLd';

const config = getPageConfig('about');
const content = getPageContent('about');
export const metadata = buildMetadata(config);

const heading = 'text-3xl font-bold leading-tight text-[#11181C] sm:text-4xl md:text-5xl md:leading-[1.25]';
const lead = 'text-[1.3rem] leading-8 text-[#687076]';
const wrap = 'mx-auto max-w-6xl px-6';
const btnPrimary =
  'inline-flex items-center justify-center rounded-xl bg-[#FFAC1C] px-5 py-3 text-[1.3rem] leading-8 font-medium text-[#11181C] hover:bg-[#FFB84D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAC1C] focus-visible:ring-offset-2';
const btnSecondary =
  'inline-flex items-center justify-center rounded-xl border border-[#11181C] bg-white px-5 py-3 text-[1.3rem] leading-8 font-medium text-[#11181C] hover:bg-[#11181C] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAC1C] focus-visible:ring-offset-2';

export default function AboutPage() {
  const schemas = buildSchemas(config, content);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F5F5] text-[1.3rem] leading-8 text-[#11181C]">
      <JsonLd data={schemas} />

      <section className="bg-gradient-to-b from-white to-[#F5F5F5] pb-16 pt-16">
        <div className={`${wrap} max-w-3xl`}>
          <h1 className="text-3xl font-semibold leading-tight text-[#11181C] sm:text-4xl md:text-5xl md:leading-[1.25]">
            Why Velo Exists
          </h1>
          <div className={`mt-6 space-y-4 ${lead}`}>
            <p>
              Sending something from the UAE to Kenya has always meant relying on someone you know, hoping
              they&apos;re free, and waiting without knowing what&apos;s happening.
            </p>
            <p>
              Velo exists to put structure around that: a place to find who can help, see what it costs, and know
              where things stand — instead of a chat thread that scrolls away.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className={`${wrap} max-w-3xl`}>
          <h2 className={heading}>What We Do</h2>
          <div className={`mt-6 space-y-4 ${lead}`}>
            <p>
              Velo connects people who need something shipped to Kenya with Logistics Agents — solo or
              organizations — who already do this work, and gives both sides a shared record: one quote, one
              tracker, one place to look instead of a phone full of chats.
            </p>
            <p>We&apos;re not the shipping company. We&apos;re the layer that was missing around it.</p>
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
    </div>
  );
}
