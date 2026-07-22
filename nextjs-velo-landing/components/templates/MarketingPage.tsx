import type { PageContent } from '@/types/seo';
import type { SeoPageConfig } from '@/types/seo';
import { buildSchemas } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import PageHero from '@/components/sections/PageHero';
import ContentSection from '@/components/sections/ContentSection';
import FaqSection from '@/components/sections/FaqSection';
import CtaBand from '@/components/sections/CtaBand';
import RelatedLinks from '@/components/sections/RelatedLinks';

type MarketingPageProps = {
  config: SeoPageConfig;
  content: PageContent;
};

export default function MarketingPage({ config, content }: MarketingPageProps) {
  const schemas = buildSchemas(config, content);
  const faqH2 = config.h2s.find((h) => h.title.toLowerCase().includes('faq'));
  const contentH2s = config.h2s.filter((h) => h.id !== faqH2?.id);

  return (
    <>
      <JsonLd data={schemas} />
      <div className="min-h-screen bg-white pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PageHero config={config} intro={content.intro} />
          {contentH2s.map((h2) => (
            <ContentSection
              key={h2.id}
              id={h2.id}
              title={h2.title}
              body={content.sections[h2.id]?.body ?? '[Your content here]'}
            />
          ))}
          <FaqSection faqs={content.faqs} title={faqH2?.title ?? 'Frequently Asked Questions'} />
          <CtaBand cta={config.primaryCta} />
          <RelatedLinks paths={config.internalLinks} />
        </div>
      </div>
    </>
  );
}
