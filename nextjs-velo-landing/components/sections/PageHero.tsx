import Link from 'next/link';
import type { SeoPageConfig } from '@/types/seo';

type PageHeroProps = {
  config: SeoPageConfig;
  intro?: string;
};

export default function PageHero({ config, intro }: PageHeroProps) {
  return (
    <header className="mb-12 max-w-3xl">
      <h1 className="text-4xl sm:text-5xl font-bold text-black leading-tight mb-6">{config.h1}</h1>
      {intro && <p className="text-lg text-gray-600 leading-relaxed">{intro}</p>}
      {!intro && config.description && (
        <p className="text-lg text-gray-600 leading-relaxed">{config.description}</p>
      )}
    </header>
  );
}
