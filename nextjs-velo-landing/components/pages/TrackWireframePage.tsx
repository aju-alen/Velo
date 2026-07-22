import type { SeoPageConfig } from '@/types/seo';
import type { TrackWireframeConfig } from '@/types/wireframe';
import WireframeLayout from '@/components/layouts/WireframeLayout';
import WireframeHero from '@/components/sections/WireframeHero';
import TrackingShell from '@/components/sections/TrackingShell';
import BenefitGrid from '@/components/sections/BenefitGrid';
import OptionCards from '@/components/sections/OptionCards';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import SupportArea from '@/components/sections/SupportArea';
import FaqSection from '@/components/sections/FaqSection';
import CtaBand from '@/components/sections/CtaBand';
import SectionLabel from '@/components/sections/SectionLabel';

type TrackWireframePageProps = {
  config: SeoPageConfig;
  wireframe: TrackWireframeConfig;
};

export default function TrackWireframePage({ config, wireframe }: TrackWireframePageProps) {
  const headline = wireframe.hero?.headline ?? config.h1;
  const heroParagraphs = wireframe.hero?.paragraphs ?? [config.description];

  return (
    <WireframeLayout config={config} content={{ sections: {}, faqs: wireframe.faqs }}>
      <WireframeHero headline={headline} paragraphs={heroParagraphs}>
        <div id="track-form" className="scroll-mt-28 mb-2">
          <TrackingShell />
        </div>
      </WireframeHero>
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
      <OptionCards
        title={wireframe.visibility.title}
        paragraphs={wireframe.visibility.paragraphs}
        items={wireframe.visibility.items}
        label="Visibility"
      />
      <section id="shipment-status">
        <ProcessTimeline
          title="Shipment Status"
          intro="Follow progress as your cargo moves from collection to delivery."
          steps={wireframe.statusSteps}
          label="Tracking"
        />
      </section>
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
      {wireframe.supportNarrative && (
        <section className="scroll-mt-28 py-12 border-t border-gray-100">
          <SectionLabel>Support</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">{wireframe.supportNarrative.title}</h2>
          <div className="space-y-4 max-w-3xl mb-8">
            {wireframe.supportNarrative.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-gray-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}
      <SupportArea channels={wireframe.support} />
      <FaqSection faqs={wireframe.faqs} />
      <CtaBand
        cta={wireframe.finalCta.cta}
        headline={wireframe.finalCta.headline}
        paragraphs={wireframe.finalCta.paragraphs}
      />
    </WireframeLayout>
  );
}
