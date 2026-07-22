import Link from 'next/link';
import { Smartphone } from 'lucide-react';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/app-links';
import SectionLabel from './SectionLabel';

type AppFeatureBlockProps = {
  title?: string;
  description?: string;
};

export default function AppFeatureBlock({
  title = 'Download the Velo App',
  description = 'Schedule pickup, track shipments, and manage deliveries from your phone.',
}: AppFeatureBlockProps) {
  return (
    <section className="scroll-mt-28 py-12 border-t border-gray-100">
      <SectionLabel>Mobile App</SectionLabel>
      <div className="rounded-2xl bg-gray-50 border border-gray-200 p-8 lg:p-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">{title}</h2>
            <p className="text-gray-600 mb-6 max-w-lg">{description}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={APP_STORE_URL} className="inline-flex items-center justify-center min-h-11 bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-900">
                App Store
              </Link>
              <Link href={PLAY_STORE_URL} className="inline-flex items-center justify-center min-h-11 border border-gray-300 px-6 py-3 rounded-full font-semibold hover:border-black">
                Google Play
              </Link>
            </div>
          </div>
          <div className="w-32 h-32 rounded-3xl bg-black flex items-center justify-center mx-auto lg:mx-0 shrink-0">
            <Smartphone className="w-16 h-16 text-[#FFAC1C]" />
          </div>
        </div>
      </div>
    </section>
  );
}
