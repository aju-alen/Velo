import type { BenefitItem } from '@/types/wireframe';
import { getIcon } from '@/lib/icons';
import SectionLabel from './SectionLabel';

type BenefitGridProps = {
  title: string;
  paragraphs?: string[];
  subtitle?: string;
  items: BenefitItem[];
  label?: string;
};

export default function BenefitGrid({ title, paragraphs, subtitle, items, label = 'Benefits' }: BenefitGridProps) {
  const gridCols =
    items.length >= 5 ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' : 'sm:grid-cols-2 lg:grid-cols-4';

  return (
    <section className="scroll-mt-28 py-12 border-t border-gray-100">
      <SectionLabel>{label}</SectionLabel>
      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3">{title}</h2>
      {paragraphs && paragraphs.length > 0 && (
        <div className="space-y-4 mb-8 max-w-3xl">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-gray-600 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      )}
      {subtitle && <p className="text-gray-600 mb-8 max-w-2xl">{subtitle}</p>}
      <div className={`grid ${gridCols} gap-6`}>
        {items.map((item) => {
          const Icon = getIcon(item.icon);
          return (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-[#FFAC1C]/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FFAC1C]/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-[#FFAC1C]" />
              </div>
              <h3 className="text-base font-bold text-black mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
