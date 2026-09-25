import DownloadAppLink from '@/components/DownloadAppLink';
import { buildMetadata, buildSchemas, getPageConfig } from '@/lib/seo';
import { getPageContent } from '@/content/pages';
import JsonLd from '@/components/seo/JsonLd';
import TrackLookup from './TrackLookup';

const config = getPageConfig('track-shipment');
const content = getPageContent('track-shipment');
export const metadata = buildMetadata(config);

const heading = 'text-3xl font-bold leading-tight text-[#11181C] sm:text-4xl md:text-5xl md:leading-[1.25]';
const lead = 'text-[1.3rem] leading-8 text-[#687076]';
const wrap = 'mx-auto max-w-6xl px-6';
const card = 'rounded-2xl border border-[#E6E8EB] bg-white p-6';

const steps = [
  {
    step: '01',
    title: 'Booked',
    tag: 'Live',
    description: 'Confirmed the moment you schedule pickup in the app.',
  },
  {
    step: '02',
    title: 'Collected',
    tag: 'Live',
    description: 'Confirmed with a photo at pickup.',
  },
  {
    step: '03',
    title: 'Handed to Shipping Partner',
    tag: 'Live',
    description: 'Confirmed with a reference number.',
  },
  {
    step: '04',
    title: 'In Transit',
    tag: 'Manual update',
    description: 'Updated as status is received — not yet a live automated feed.',
  },
  {
    step: '05',
    title: 'Delivered',
    tag: 'Live',
    description: 'Confirmed with a photo or signature.',
  },
];

export default function TrackShipmentPage() {
  const schemas = buildSchemas(config, content);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F5F5] text-[1.3rem] leading-8 text-[#11181C]">
      <JsonLd data={schemas} />

      <section className="bg-gradient-to-b from-white to-[#F5F5F5] pb-16 pt-16">
        <div className={`${wrap} max-w-3xl`}>
          <h1 className="text-3xl font-semibold leading-tight text-[#11181C] sm:text-4xl md:text-5xl md:leading-[1.25]">
            Track Your Shipment
          </h1>
          <p className={`mt-6 ${lead}`}>
            Enter your tracking number to see where things stand. This is a status lookup — scheduling or changing a
            pickup happens in the app.
          </p>
          <TrackLookup />
        </div>
      </section>

      <section className="py-20">
        <div className={wrap}>
          <h2 className={`mb-10 max-w-3xl ${heading}`}>What You&apos;ll See</h2>
          <div className="grid gap-4">
            {steps.map((item) => (
              <article key={item.step} className={`${card} grid gap-3 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:gap-6`}>
                <p className="text-2xl font-bold leading-8 text-[#FFAC1C]">{item.step}</p>
                <div>
                  <h3 className="text-2xl font-bold leading-8 text-[#11181C]">{item.title}</h3>
                  <p className={`mt-2 ${lead}`}>{item.description}</p>
                </div>
                <p className="text-[1.3rem] font-semibold leading-8 text-[#11181C]">{item.tag}</p>
              </article>
            ))}
          </div>
          <div className="mt-10">
            <DownloadAppLink className="inline-flex items-center justify-center rounded-xl bg-[#FFAC1C] px-5 py-3 text-[1.3rem] leading-8 font-medium text-[#11181C] hover:bg-[#FFB84D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAC1C] focus-visible:ring-offset-2">
              Get the App
            </DownloadAppLink>
          </div>
        </div>
      </section>
    </div>
  );
}
