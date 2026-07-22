import type { PageContent } from '@/types/seo';
import type { SeoPageConfig } from '@/types/seo';
import { buildSchemas } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import PageHero from '@/components/sections/PageHero';
import ContentSection from '@/components/sections/ContentSection';
import CtaBand from '@/components/sections/CtaBand';
import RelatedLinks from '@/components/sections/RelatedLinks';

type ToolPageProps = {
  config: SeoPageConfig;
  content: PageContent;
  children?: React.ReactNode;
};

export default function ToolPage({ config, content, children }: ToolPageProps) {
  const schemas = buildSchemas(config, content);

  return (
    <>
      <JsonLd data={schemas} />
      <div className="min-h-screen bg-white pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PageHero config={config} />
          {children ?? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center text-gray-500 italic mb-8">
              [Tool UI placeholder — implement calculator or tracking widget here]
            </div>
          )}
          {config.h2s.map((h2) => (
            <ContentSection
              key={h2.id}
              id={h2.id}
              title={h2.title}
              body={content.sections[h2.id]?.body ?? '[Your content here]'}
            />
          ))}
          <CtaBand cta={config.primaryCta} />
          <RelatedLinks paths={config.internalLinks} />
        </div>
      </div>
    </>
  );
}
