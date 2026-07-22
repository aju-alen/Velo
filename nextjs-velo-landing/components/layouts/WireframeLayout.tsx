import type { PageContent, SeoPageConfig } from '@/types/seo';
import { buildSchemas } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';

type WireframeLayoutProps = {
  config: SeoPageConfig;
  content?: PageContent;
  children: React.ReactNode;
  wide?: boolean;
};

export default function WireframeLayout({ config, content, children, wide = true }: WireframeLayoutProps) {
  const schemas = buildSchemas(config, content ?? { sections: {}, faqs: [] });
  const containerClass = wide ? 'max-w-7xl' : 'max-w-4xl';

  return (
    <>
      <JsonLd data={schemas} />
      <div className="min-h-screen bg-white pb-20 pt-20">
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-12 ${containerClass}`}>{children}</div>
      </div>
    </>
  );
}
