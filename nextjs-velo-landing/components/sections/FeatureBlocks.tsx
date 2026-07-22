import type { FeatureBlock } from '@/types/wireframe';
import { getIcon } from '@/lib/icons';
import SectionLabel from './SectionLabel';

type FeatureBlocksProps = {
  title: string;
  items: FeatureBlock[];
  label?: string;
};

export default function FeatureBlocks({ title, items, label = 'Features' }: FeatureBlocksProps) {
  return (
    <section className="scroll-mt-28 py-12 border-t border-gray-100">
      <SectionLabel>{label}</SectionLabel>
      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-8">{title}</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((item) => {
          const Icon = getIcon(item.icon);
          return (
            <div key={item.title} className="flex items-start gap-4 rounded-xl border border-gray-200 p-5">
              <Icon className="w-6 h-6 text-[#FFAC1C] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-black mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
