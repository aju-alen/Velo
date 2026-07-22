import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { CtaConfig } from '@/types/seo';

type WireframeHeroProps = {
  headline: string;
  paragraphs: string[];
  cta?: CtaConfig;
  children?: React.ReactNode;
};

export default function WireframeHero({ headline, paragraphs, cta, children }: WireframeHeroProps) {
  return (
    <header className="mb-16 max-w-3xl">
      <h1 className="text-4xl sm:text-5xl font-bold text-black leading-tight mb-6">{headline}</h1>
      <div className="space-y-4 mb-8">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-lg text-gray-600 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
      {children}
      {cta && (
        <Link
          href={cta.href}
          className="inline-flex items-center justify-center w-full sm:w-auto min-h-11 bg-black text-white px-7 py-3.5 rounded-full hover:bg-gray-900 transition-colors font-semibold"
        >
          {cta.label}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      )}
    </header>
  );
}
