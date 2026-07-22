import type { SeoPageConfig } from '@/types/seo';
import type { CtaConfig } from '@/types/seo';
import type { FinalCtaBlock, NarrativeBlock, ServiceWireframeConfig } from '@/types/wireframe';
import WireframeLayout from '@/components/layouts/WireframeLayout';
import WireframeHero from '@/components/sections/WireframeHero';
import BenefitGrid from '@/components/sections/BenefitGrid';
import OptionCards from '@/components/sections/OptionCards';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import ScrollableTable from '@/components/sections/ScrollableTable';
import PricingExplainer from '@/components/sections/PricingExplainer';
import CoverageList from '@/components/sections/CoverageList';
import IndustryCards from '@/components/sections/IndustryCards';
import FeatureBlocks from '@/components/sections/FeatureBlocks';
import AppFeatureBlock from '@/components/sections/AppFeatureBlock';
import Testimonials from '@/components/sections/Testimonials';
import FaqSection from '@/components/sections/FaqSection';
import CtaBand from '@/components/sections/CtaBand';
import SectionLabel from '@/components/sections/SectionLabel';

type ServiceWireframePageProps = {
  config: SeoPageConfig;
  wireframe: ServiceWireframeConfig;
  benefitsTitle?: string;
  cargoTitle?: string;
  showAppBlock?: boolean;
};

function isFinalCtaBlock(cta: CtaConfig | FinalCtaBlock): cta is FinalCtaBlock {
  return 'headline' in cta && 'paragraphs' in cta;
}

function NarrativeSection({ block, label = 'Perspective' }: { block: NarrativeBlock; label?: string }) {
  return (
    <section className="scroll-mt-28 py-12 border-t border-gray-100">
      <SectionLabel>{label}</SectionLabel>
      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">{block.title}</h2>
      <div className="space-y-4 max-w-3xl">
        {block.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-gray-600 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

export default function ServiceWireframePage({
  config,
  wireframe,
  benefitsTitle = 'Key Benefits',
  cargoTitle = 'Suitable Cargo',
  showAppBlock = false,
}: ServiceWireframePageProps) {
  const headline = wireframe.hero?.headline ?? config.h1;
  const heroParagraphs = wireframe.hero?.paragraphs ?? [config.description];
  const heroCta = wireframe.hero?.cta ?? config.primaryCta;
  const trustTitle = wireframe.trust?.title ?? benefitsTitle;
  const trustParagraphs = wireframe.trust?.paragraphs;
  const trustItems = wireframe.trust?.items ?? wireframe.benefits;
  const cargoSectionTitle = wireframe.cargoSection?.title ?? cargoTitle;
  const cargoParagraphs = wireframe.cargoSection?.paragraphs;

  return (
    <WireframeLayout config={config} content={{ sections: {}, faqs: wireframe.faqs }}>
      <WireframeHero headline={headline} paragraphs={heroParagraphs} cta={heroCta} />
      {trustItems.length > 0 && (
        <BenefitGrid
          title={trustTitle}
          paragraphs={trustParagraphs}
          items={trustItems}
          label="Trust"
        />
      )}
      {wireframe.introNarrative && <NarrativeSection block={wireframe.introNarrative} label="Convenience" />}
      {wireframe.narrativeBeforeCargo && wireframe.narrative && (
        <NarrativeSection block={wireframe.narrative} />
      )}
      {wireframe.cargoCards && (
        <OptionCards
          title={cargoSectionTitle}
          paragraphs={cargoParagraphs}
          items={wireframe.cargoCards}
          label="Who It's For"
        />
      )}
      {!wireframe.narrativeBeforeCargo && wireframe.narrative && (
        <NarrativeSection block={wireframe.narrative} />
      )}
      {wireframe.pricing && <PricingExplainer section={wireframe.pricing} />}
      {wireframe.transitTable && <ScrollableTable data={wireframe.transitTable} />}
      {wireframe.containerTable && <ScrollableTable data={wireframe.containerTable} label="Containers" />}
      <ProcessTimeline
        title={wireframe.process.title}
        intro={wireframe.process.intro}
        steps={wireframe.process.steps}
      />
      {wireframe.closingNarrative && <NarrativeSection block={wireframe.closingNarrative} label="Why Change" />}
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
      {wireframe.coverage && <CoverageList title="Areas Served" areas={wireframe.coverage} />}
      {wireframe.dashboardFeatures && (
        <FeatureBlocks title="Dashboard Features" items={wireframe.dashboardFeatures} label="Platform" />
      )}
      {wireframe.industries && (
        <IndustryCards title="Industries Served" items={wireframe.industries} />
      )}
      {showAppBlock && <AppFeatureBlock />}
      {wireframe.testimonials && wireframe.testimonials.length > 0 && (
        <Testimonials
          title={wireframe.industries ? 'Customer Stories' : 'What Our Customers Say'}
          items={wireframe.testimonials}
        />
      )}
      <FaqSection faqs={wireframe.faqs} />
      {isFinalCtaBlock(wireframe.finalCta) ? (
        <CtaBand
          cta={wireframe.finalCta.cta}
          headline={wireframe.finalCta.headline}
          paragraphs={wireframe.finalCta.paragraphs}
        />
      ) : (
        <CtaBand cta={wireframe.finalCta} />
      )}
    </WireframeLayout>
  );
}
