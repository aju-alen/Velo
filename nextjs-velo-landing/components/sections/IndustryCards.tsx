import type { IndustryCard } from '@/types/wireframe';
import { getIcon } from '@/lib/icons';
import SectionLabel from './SectionLabel';

type IndustryCardsProps = {
  title: string;
  items: IndustryCard[];
};

export default function IndustryCards({ title, items }: IndustryCardsProps) {
  return (
    <section className="scroll-mt-28 py-12 border-t border-gray-100">
      <SectionLabel>Industries</SectionLabel>
      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-8">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          const Icon = getIcon(item.icon);
          return (
            <div key={item.title} className="rounded-2xl border border-gray-200 p-6">
              <Icon className="w-8 h-8 text-[#FFAC1C] mb-4" />
              <h3 className="font-bold text-black mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
