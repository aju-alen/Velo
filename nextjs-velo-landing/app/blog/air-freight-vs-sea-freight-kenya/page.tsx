import { buildMetadata, getPageConfig } from '@/lib/seo';
import { getPageContent } from '@/content/pages';
import { getBlogPostMeta } from '@/content/wireframes';
import BlogPost from '@/components/templates/BlogPost';

const slug = 'blog-air-freight-vs-sea-freight-kenya';
const config = getPageConfig(slug);
export const metadata = buildMetadata(config);

export default function Page() {
  const meta = getBlogPostMeta(slug);
  if (!meta) throw new Error('Missing blog meta');
  return <BlogPost config={config} content={getPageContent(slug)} meta={meta} />;
}
