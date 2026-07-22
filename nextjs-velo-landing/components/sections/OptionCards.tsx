import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { OptionCard } from '@/types/wireframe';
import SectionLabel from './SectionLabel';

type OptionCardsProps = {
  title: string;
  paragraphs?: string[];
  items: OptionCard[];
  label?: string;
};

export default function OptionCards({ title, paragraphs, items, label = 'Options' }: OptionCardsProps) {
  return (
    <section className="scroll-mt-28 py-12 border-t border-gray-100">
      <SectionLabel>{label}</SectionLabel>
      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">{title}</h2>
      {paragraphs && paragraphs.length > 0 && (
        <div className="space-y-4 mb-8 max-w-3xl">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-gray-600 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-gray-200 p-8 hover:border-[#FFAC1C]/40 transition-colors">
            <h3 className="text-xl font-bold text-black mb-3">{item.title}</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
            {item.bullets && item.bullets.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-black mb-2">Suitable for:</p>
                <ul className="space-y-1">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="text-sm text-gray-600">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {item.learnMoreLabel !== '' && (
              <Link
                href={item.href}
                className="inline-flex items-center text-black font-semibold hover:text-[#FFAC1C] transition-colors min-h-11"
              >
                {item.learnMoreLabel ?? 'Learn More'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
