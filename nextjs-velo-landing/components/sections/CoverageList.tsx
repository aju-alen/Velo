import { MapPin } from 'lucide-react';
import SectionLabel from './SectionLabel';

type CoverageListProps = {
  title: string;
  areas: string[];
  label?: string;
};

export default function CoverageList({ title, areas, label = 'Coverage' }: CoverageListProps) {
  return (
    <section className="scroll-mt-28 py-12 border-t border-gray-100">
      <SectionLabel>{label}</SectionLabel>
      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-8">{title}</h2>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {areas.map((area) => (
          <li key={area} className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-4 h-4 text-[#FFAC1C] shrink-0" />
            {area}
          </li>
        ))}
      </ul>
    </section>
  );
}
