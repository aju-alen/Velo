import { MapPin } from 'lucide-react';

type MapPlaceholderProps = {
  title?: string;
};

export default function MapPlaceholder({ title = 'Our Location' }: MapPlaceholderProps) {
  return (
    <section className="scroll-mt-28 py-12">
      <h2 className="text-2xl font-bold text-black mb-6">{title}</h2>
      <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 aspect-[16/7] flex flex-col items-center justify-center text-gray-500">
        <MapPin className="w-10 h-10 mb-3 text-gray-400" />
        <p className="font-medium">Map coming soon</p>
        <p className="text-sm mt-1">Dubai office location</p>
      </div>
    </section>
  );
}
