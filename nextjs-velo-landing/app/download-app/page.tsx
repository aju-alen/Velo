import Image from 'next/image';
import Link from 'next/link';
import { Apple, ArrowLeft, Smartphone } from 'lucide-react';
import { buildMetadata, buildSchemas, getPageConfig } from '@/lib/seo';
import { getPageContent } from '@/content/pages';
import JsonLd from '@/components/seo/JsonLd';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/app-links';

const slug = 'download-app';
const config = getPageConfig(slug);
export const metadata = buildMetadata(config);

const platforms = [
  {
    name: 'iOS',
    subtitle: 'iPhone & iPad',
    description: 'Download on the App Store and manage pickups, tracking, and deliveries from your iPhone or iPad.',
    href: APP_STORE_URL,
    icon: Apple,
    buttonLabel: 'Download on the App Store',
    accent: 'bg-black text-white hover:bg-gray-800',
  },
  {
    name: 'Android',
    subtitle: 'Phones & tablets',
    description: 'Get Velo on Google Play and stay informed about your shipments wherever you are.',
    href: PLAY_STORE_URL,
    icon: Smartphone,
    buttonLabel: 'Get it on Google Play',
    accent: 'bg-[#FFAC1C] text-black hover:bg-[#FFB84D]',
  },
];

export default function DownloadAppPage() {
  const schemas = buildSchemas(config, getPageContent(slug));

  return (
    <>
      <JsonLd data={schemas} />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-black transition-colors mb-10 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>

          <div className="text-center mb-14">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-md border border-gray-100 mb-6">
              <Image src="/logo.png" alt="Velo" width={64} height={40} className="w-16 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">{config.h1}</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">{config.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg hover:border-[#FFAC1C]/40 transition-all duration-300 flex flex-col"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
                  <platform.icon className="w-7 h-7 text-black" />
                </div>
                <p className="text-sm font-semibold text-[#FFAC1C] uppercase tracking-wide mb-1">{platform.name}</p>
                <h2 className="text-2xl font-bold text-black mb-3">{platform.subtitle}</h2>
                <p className="text-gray-600 leading-relaxed mb-8 flex-1">{platform.description}</p>
                <a
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center w-full px-6 py-4 rounded-xl font-semibold transition-colors ${platform.accent}`}
                >
                  {platform.buttonLabel}
                </a>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-10">
            Available for iPhone, iPad, and Android devices.
          </p>
        </div>
      </div>
    </>
  );
}
