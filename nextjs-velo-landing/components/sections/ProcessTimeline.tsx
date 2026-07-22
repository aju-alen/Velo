import type { ProcessStep } from '@/types/wireframe';
import SectionLabel from './SectionLabel';

type ProcessTimelineProps = {
  title: string;
  intro?: string;
  steps: ProcessStep[];
  label?: string;
};

export default function ProcessTimeline({ title, intro, steps, label = 'Process' }: ProcessTimelineProps) {
  const gridCols = steps.length > 4 ? 'lg:grid-cols-5' : 'lg:grid-cols-4';

  return (
    <section className="scroll-mt-28 py-12 border-t border-gray-100">
      <SectionLabel>{label}</SectionLabel>
      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3">{title}</h2>
      {intro && <p className="text-gray-600 mb-10 max-w-2xl">{intro}</p>}
      {!intro && <div className="mb-10" />}
      <div className="relative">
        <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-[#FFAC1C]/30" />
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-8 ${gridCols}`}>
          {steps.map((step) => (
            <div key={step.step} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center text-sm font-bold mb-5 shadow-lg ring-4 ring-white">
                {step.step}
              </div>
              <h3 className="text-base font-bold text-black mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-[220px]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
