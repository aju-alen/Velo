import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { PricingSection } from '@/types/wireframe';
import SectionLabel from './SectionLabel';

type PricingExplainerProps = {
  section: PricingSection;
};

export default function PricingExplainer({ section }: PricingExplainerProps) {
  return (
    <section className="scroll-mt-28 py-12 border-t border-gray-100">
      <SectionLabel>Pricing</SectionLabel>
      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">{section.title}</h2>
      <p className="text-gray-600 leading-relaxed mb-6 max-w-3xl">{section.body}</p>
      <Link
        href={section.cta.href}
        className="inline-flex items-center justify-center w-full sm:w-auto min-h-11 bg-black text-white px-7 py-3.5 rounded-full hover:bg-gray-900 transition-colors font-semibold"
      >
        {section.cta.label}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </section>
  );
}
