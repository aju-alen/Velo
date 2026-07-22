import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { CtaConfig } from '@/types/seo';
import SectionLabel from './SectionLabel';

type CtaBandProps = {
  cta: CtaConfig;
  headline?: string;
  subcopy?: string;
  paragraphs?: string[];
};

export default function CtaBand({ cta, headline, subcopy, paragraphs }: CtaBandProps) {
  return (
    <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#FFAC1C] to-[#FFB84D] p-8 text-center">
      {headline && <h2 className="text-2xl font-bold text-black mb-3">{headline}</h2>}
      {paragraphs && paragraphs.length > 0 && (
        <div className="space-y-3 mb-6 max-w-2xl mx-auto">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-black/70 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}
      {!paragraphs?.length && subcopy && <p className="text-black/70 mb-6 max-w-xl mx-auto">{subcopy}</p>}
      <Link
        href={cta.href}
        className="inline-flex items-center justify-center w-full sm:w-auto min-h-11 bg-black text-white px-7 py-3.5 rounded-full hover:bg-gray-900 transition-colors font-semibold"
      >
        {cta.label}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </div>
  );
}
