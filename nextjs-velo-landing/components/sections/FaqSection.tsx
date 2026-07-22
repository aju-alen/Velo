import type { FaqItem } from '@/types/seo';

type FaqSectionProps = {
  faqs: FaqItem[];
  title?: string;
};

export default function FaqSection({ faqs, title = 'Frequently Asked Questions' }: FaqSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="scroll-mt-28 py-12">
      <h2 className="text-2xl font-bold text-black mb-6">{title}</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group rounded-xl bg-gray-50 border border-gray-200 overflow-hidden open:border-[#FFAC1C]/40"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-semibold text-black">
              {faq.question}
              <span className="text-[#FFAC1C] text-xl group-open:rotate-45 transition-transform">+</span>
            </summary>
            <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-200 pt-4">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
