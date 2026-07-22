import type { PageContent } from '@/types/seo';
import type { SeoPageConfig } from '@/types/seo';
import type { BlogPostWireframeMeta } from '@/types/wireframe';
import WireframeLayout from '@/components/layouts/WireframeLayout';
import BlogHeader from '@/components/sections/BlogHeader';
import BlogToc from '@/components/sections/BlogToc';
import ContentSection from '@/components/sections/ContentSection';
import FaqSection from '@/components/sections/FaqSection';
import RelatedArticles from '@/components/sections/RelatedArticles';
import DualCtaBlock from '@/components/sections/DualCtaBlock';

type BlogPostProps = {
  config: SeoPageConfig;
  content: PageContent;
  meta: BlogPostWireframeMeta;
};

export default function BlogPost({ config, content, meta }: BlogPostProps) {
  return (
    <WireframeLayout config={config} content={content} wide={false}>
      <BlogHeader title={config.h1} meta={meta} />
      <BlogToc items={config.h2s} />
      {content.intro && (
        <p className="text-lg text-gray-600 leading-relaxed mb-8">{content.intro}</p>
      )}
      {config.h2s.map((h2) => (
        <ContentSection
          key={h2.id}
          id={h2.id}
          title={h2.title}
          body={content.sections[h2.id]?.body ?? '[Your content here]'}
        />
      ))}
      {!content.intro && config.h2s.length === 0 && (
        <div className="prose prose-gray max-w-none text-gray-600 italic mb-8">[Your article content here]</div>
      )}
      <FaqSection faqs={content.faqs} />
      <RelatedArticles articles={[{ path: meta.relatedPath, title: meta.relatedTitle }]} />
      <DualCtaBlock intent={meta.intent ?? 'commercial'} />
    </WireframeLayout>
  );
}
