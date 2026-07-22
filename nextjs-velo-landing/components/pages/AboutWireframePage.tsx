import type { SeoPageConfig } from '@/types/seo';
import type { AboutWireframeConfig, NarrativeBlock } from '@/types/wireframe';
import WireframeLayout from '@/components/layouts/WireframeLayout';
import WireframeHero from '@/components/sections/WireframeHero';
import OptionCards from '@/components/sections/OptionCards';
import AppFeatureBlock from '@/components/sections/AppFeatureBlock';
import FaqSection from '@/components/sections/FaqSection';
import CtaBand from '@/components/sections/CtaBand';
import SectionLabel from '@/components/sections/SectionLabel';

type AboutWireframePageProps = {
  config: SeoPageConfig;
  wireframe: AboutWireframeConfig;
};

function NarrativeSection({ block, label }: { block: NarrativeBlock; label: string }) {
  return (
    <section className="scroll-mt-28 py-12 border-t border-gray-100">
      <SectionLabel>{label}</SectionLabel>
      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">{block.title}</h2>
      <div className="space-y-4 text-gray-600 leading-relaxed max-w-3xl">
        {block.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

export default function AboutWireframePage({ config, wireframe }: AboutWireframePageProps) {
  const headline = wireframe.hero?.headline ?? config.h1;
  const heroParagraphs = wireframe.hero?.paragraphs ?? [config.description];
  const heroCta = wireframe.hero?.cta ?? config.primaryCta;

  return (
    <WireframeLayout config={config} content={{ sections: {}, faqs: wireframe.faqs }}>
      <WireframeHero headline={headline} paragraphs={heroParagraphs} cta={heroCta} />
      <NarrativeSection block={wireframe.story} label="Why Velo Exists" />
      {wireframe.lifestyleNarrative && (
        <NarrativeSection block={wireframe.lifestyleNarrative} label="How We Design" />
      )}
      {wireframe.cargoSection && (
        <OptionCards
          title={wireframe.cargoSection.title}
          paragraphs={wireframe.cargoSection.paragraphs}
          items={wireframe.cargoSection.items}
          label="What We Ship"
        />
      )}
      {wireframe.marketNarrative && (
        <NarrativeSection block={wireframe.marketNarrative} label="Our Corridor" />
      )}
      {wireframe.longTermNarrative && (
        <NarrativeSection block={wireframe.longTermNarrative} label="Our Approach" />
      )}
      {wireframe.appSection && (
        <section className="scroll-mt-28 py-12 border-t border-gray-100">
          <SectionLabel>The App</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">{wireframe.appSection.title}</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed max-w-3xl mb-8">
            {wireframe.appSection.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <AppFeatureBlock
            title="Download the Velo App"
            description="Schedule pickups, track shipments, and stay informed without depending entirely on phone calls."
          />
          <div className="mt-6">
            <CtaBand cta={wireframe.appSection.cta} />
          </div>
        </section>
      )}
      <FaqSection faqs={wireframe.faqs} />
      <CtaBand
        cta={wireframe.finalCta.cta}
        headline={wireframe.finalCta.headline}
        paragraphs={wireframe.finalCta.paragraphs}
      />
    </WireframeLayout>
  );
}
