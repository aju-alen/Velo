import type { SeoPageConfig } from '@/types/seo';
import type { RouteWireframeConfig } from '@/types/wireframe';
import WireframeLayout from '@/components/layouts/WireframeLayout';
import WireframeHero from '@/components/sections/WireframeHero';
import BenefitGrid from '@/components/sections/BenefitGrid';
import OptionCards from '@/components/sections/OptionCards';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import ScrollableTable from '@/components/sections/ScrollableTable';
import PricingExplainer from '@/components/sections/PricingExplainer';
import Testimonials from '@/components/sections/Testimonials';
import FaqSection from '@/components/sections/FaqSection';
import CtaBand from '@/components/sections/CtaBand';
import SectionLabel from '@/components/sections/SectionLabel';

type RouteShippingPageProps = {
  config: SeoPageConfig;
  wireframe: RouteWireframeConfig;
};

export default function RouteShippingPage({ config, wireframe }: RouteShippingPageProps) {
  const headline = wireframe.hero.headline ?? config.h1;

  return (
    <WireframeLayout config={config} content={{ sections: {}, faqs: wireframe.faqs }}>
      <WireframeHero headline={headline} paragraphs={wireframe.hero.paragraphs} cta={wireframe.hero.cta} />
      <BenefitGrid
        title={wireframe.trust.title}
        paragraphs={wireframe.trust.paragraphs}
        items={wireframe.trust.items}
        label="Trust"
      />
      <OptionCards
        title={wireframe.shippingOptions.title}
        paragraphs={wireframe.shippingOptions.paragraphs}
        items={wireframe.shippingOptions.items}
        label="Shipping Methods"
      />
      {wireframe.narrative && (
        <section className="scroll-mt-28 py-12 border-t border-gray-100">
          <SectionLabel>Why Velo</SectionLabel>
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
      <PricingExplainer section={wireframe.pricing} />
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
      {wireframe.transitTable && <ScrollableTable data={wireframe.transitTable} label="Transit" />}
      {wireframe.testimonials && wireframe.testimonials.length > 0 && (
        <Testimonials items={wireframe.testimonials} />
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
