'use client';

import Link from 'next/link';

type Faq = {
  question: string;
  answer: string;
};

export default function MarketplaceFaqs({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqs.map((faq, index) => (
        <details
          key={faq.question}
          ref={(node) => {
            if (node && index === 0 && node.dataset.primed !== '1') {
              node.open = true;
              node.dataset.primed = '1';
            }
          }}
          className="group rounded-2xl border border-[#E6E8EB] bg-[#F5F5F5] open:border-[#FFAC1C]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-[1.3rem] font-semibold leading-8 text-[#11181C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAC1C] focus-visible:ring-inset">
            {faq.question}
            <span className="text-2xl leading-none text-[#FFAC1C] transition-transform group-open:rotate-45">+</span>
          </summary>
          <div className="px-6 pb-5 text-[1.3rem] leading-8 text-[#687076]">
            {faq.question === 'Are these listings verified?' ? (
              <p>
                See{' '}
                <Link href="/how-it-works" className="font-semibold text-[#11181C] underline">
                  How It Works
                </Link>{' '}
                for what verification currently covers.
              </p>
            ) : (
              faq.answer
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
