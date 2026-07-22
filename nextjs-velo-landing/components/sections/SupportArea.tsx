import { Mail, MessageCircle, Phone } from 'lucide-react';
import type { SupportChannel } from '@/types/wireframe';
import SectionLabel from './SectionLabel';

const icons = { phone: Phone, whatsapp: MessageCircle, email: Mail };

type SupportAreaProps = {
  title?: string;
  channels: SupportChannel[];
};

export default function SupportArea({ title = 'Need Help?', channels }: SupportAreaProps) {
  return (
    <section className="scroll-mt-28 py-12 border-t border-gray-100">
      <SectionLabel>Support</SectionLabel>
      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-8">{title}</h2>
      <div className="grid sm:grid-cols-3 gap-6">
        {channels.map((ch) => {
          const Icon = icons[ch.type];
          return (
            <a
              key={ch.type}
              href={ch.href}
              className="flex flex-col items-center text-center rounded-2xl border border-gray-200 p-6 hover:border-[#FFAC1C]/40 transition-colors min-h-11"
            >
              <Icon className="w-8 h-8 text-[#FFAC1C] mb-3" />
              <p className="font-semibold text-black mb-1">{ch.label}</p>
              <p className="text-sm text-gray-600">{ch.value}</p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
