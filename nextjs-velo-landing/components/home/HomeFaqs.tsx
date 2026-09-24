'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

type Faq = {
  question: string;
  answer: string;
};

function renderAnswer(answer: string, links?: Record<string, string>) {
  if (!links || Object.keys(links).length === 0) return answer;

  const nodes: ReactNode[] = [];
  let rest = answer;
  let key = 0;

  while (rest) {
    let earliest = -1;
    let phrase = '';
    for (const candidate of Object.keys(links)) {
      const index = rest.indexOf(candidate);
      if (index !== -1 && (earliest === -1 || index < earliest)) {
        earliest = index;
        phrase = candidate;
      }
    }
    if (earliest === -1) {
      nodes.push(rest);
      break;
    }
    if (earliest > 0) nodes.push(rest.slice(0, earliest));
    nodes.push(
      <Link key={key} href={links[phrase]} className="font-semibold text-[#11181C] underline">
        {phrase}
      </Link>,
    );
    key += 1;
    rest = rest.slice(earliest + phrase.length);
  }

  return nodes;
}

export default function HomeFaqs({ faqs, links }: { faqs: Faq[]; links?: Record<string, string> }) {
  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <details
          key={faq.question}
          ref={(node) => {
            if (node && index === 0 && node.dataset.primed !== '1') {
              node.open = true;
              node.dataset.primed = '1';
            }
          }}
          className="group rounded-2xl border border-[#E6E8EB] bg-white open:border-[#FFAC1C]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-[1.3rem] font-semibold leading-8 text-[#11181C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFAC1C] focus-visible:ring-inset">
            {faq.question}
            <span className="text-2xl leading-none text-[#FFAC1C] group-open:rotate-45 transition-transform">+</span>
          </summary>
          <div className="px-6 pb-5 text-[1.3rem] leading-8 text-[#687076]">{renderAnswer(faq.answer, links)}</div>
        </details>
      ))}
    </div>
  );
}
