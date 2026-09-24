'use client';

import { useEffect, useRef, useState } from 'react';

type Step = {
  step: string;
  title: string;
  description: string;
};

const badgeTones = ['bg-[#FFAC1C]', 'bg-[#FFAC1C]', 'bg-[#FFAC1C]', 'bg-[#FFAC1C]', 'bg-[#FFAC1C]'];

export default function ProcessSteps({ steps }: { steps: Step[] }) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const nodes = itemRefs.current.filter((node): node is HTMLDivElement => node !== null);
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = nodes.indexOf(visible.target as HTMLDivElement);
        if (index >= 0) setActive(index);
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: [0.25, 0.6, 1] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [steps.length]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {steps.map((step, index) => {
        const isActive = index === active;
        return (
          <div
            key={step.step}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            className={`rounded-2xl border bg-white p-5 ${isActive ? 'border-[#FFAC1C]' : 'border-[#E6E8EB]'}`}
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-[1.3rem] font-semibold leading-8 text-[#11181C] ${badgeTones[index % badgeTones.length]}`}
            >
              {step.step}
            </div>
            <h3 className="mb-2 text-2xl font-bold leading-8 text-[#11181C]">{step.title}</h3>
            <p className="text-[1.3rem] leading-8 text-[#687076]">{step.description}</p>
          </div>
        );
      })}
    </div>
  );
}
