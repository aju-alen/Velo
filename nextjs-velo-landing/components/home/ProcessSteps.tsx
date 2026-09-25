import { Check } from 'lucide-react';

type Step = {
  step: string;
  title: string;
  description: string;
};

export default function ProcessSteps({ steps }: { steps: Step[] }) {
  const inset = `${100 / (steps.length * 2)}%`;

  return (
    <div className="overflow-x-auto pb-2">
      <ol className="relative grid min-w-[96rem] grid-cols-5 lg:min-w-0">
        <div
          aria-hidden
          className="pointer-events-none absolute top-[6px] h-[3px] rounded-full bg-[#FFAC1C]"
          style={{ left: inset, right: inset }}
        />
        {steps.map((step) => (
          <li key={step.step} className="flex flex-col items-center px-2">
            <span className="relative z-10 mb-5 h-3.5 w-3.5 rounded-full border-2 border-white bg-white" />
            <article className="flex h-full w-full flex-col rounded-2xl border border-[#E6E8EB] bg-white px-7 pb-6 pt-7">
              <span className="mx-auto inline-flex rounded-full bg-[#F3F4F6] px-4 py-1 text-center text-[1.15rem] font-semibold leading-7 text-[#11181C]">
                {step.title}
              </span>
              <p className="mt-5 flex items-start gap-2 text-left text-[1.15rem] leading-7 text-[#374151]">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[#0F766E]" strokeWidth={3} aria-hidden />
                <span>{step.description}</span>
              </p>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
