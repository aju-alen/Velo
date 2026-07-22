import type { SeoPageConfig } from '@/types/seo';
import type { PricingWireframeConfig } from '@/types/wireframe';
import WireframeLayout from '@/components/layouts/WireframeLayout';
import WireframeHero from '@/components/sections/WireframeHero';
import BenefitGrid from '@/components/sections/BenefitGrid';
import OptionCards from '@/components/sections/OptionCards';
import CalculatorShell from '@/components/sections/CalculatorShell';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import FaqSection from '@/components/sections/FaqSection';
import CtaBand from '@/components/sections/CtaBand';
import SectionLabel from '@/components/sections/SectionLabel';

type PricingWireframePageProps = {
  config: SeoPageConfig;
  wireframe: PricingWireframeConfig;
};

export default function PricingWireframePage({ config, wireframe }: PricingWireframePageProps) {
  const headline = wireframe.hero?.headline ?? config.h1;
  const heroParagraphs = wireframe.hero?.paragraphs ?? [config.description];
  const heroCta = wireframe.hero?.cta ?? config.primaryCta;

  return (
    <WireframeLayout config={config} content={{ sections: {}, faqs: wireframe.faqs }}>
      <WireframeHero headline={headline} paragraphs={heroParagraphs} cta={heroCta} />
      <BenefitGrid
        title={wireframe.trust.title}
        paragraphs={wireframe.trust.paragraphs}
        items={wireframe.trust.items}
        label="Trust"
      />
      {wireframe.introNarrative && (
        <section className="scroll-mt-28 py-12 border-t border-gray-100">
          <SectionLabel>Perspective</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">{wireframe.introNarrative.title}</h2>
          <div className="space-y-4 max-w-3xl">
            {wireframe.introNarrative.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-gray-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}
      {wireframe.infoSection && (
        <OptionCards
          title={wireframe.infoSection.title}
          paragraphs={wireframe.infoSection.paragraphs}
          items={wireframe.infoSection.items}
          label="Details"
        />
      )}
      {wireframe.narrative && (
        <section className="scroll-mt-28 py-12 border-t border-gray-100">
          <SectionLabel>Perspective</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">{wireframe.narrative.title}</h2>
          <div className="space-y-4 max-w-3xl">
            {wireframe.narrative.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-gray-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}
      <CalculatorShell />
      <ProcessTimeline
        title={wireframe.process.title}
        intro={wireframe.process.intro}
        steps={wireframe.process.steps}
      />
      {wireframe.businessCta && (
        <section className="scroll-mt-28 py-12 border-t border-gray-100">
          <SectionLabel>Business</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">{wireframe.businessCta.title}</h2>
          <div className="space-y-4 max-w-3xl mb-8">
            {wireframe.businessCta.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-gray-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          <CtaBand cta={wireframe.businessCta.cta} />
        </section>
      )}
      <FaqSection faqs={wireframe.faqs} title="Common Questions" />
      <CtaBand
        cta={wireframe.finalCta.cta}
        headline={wireframe.finalCta.headline}
        paragraphs={wireframe.finalCta.paragraphs}
      />
    </WireframeLayout>
  );
}
