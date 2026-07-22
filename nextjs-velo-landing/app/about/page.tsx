import { buildMetadata, getPageConfig } from '@/lib/seo';
import { getAboutWireframe } from '@/content/wireframes';
import AboutWireframePage from '@/components/pages/AboutWireframePage';

const slug = 'about';
const config = getPageConfig(slug);
export const metadata = buildMetadata(config);

export default function Page() {
  return <AboutWireframePage config={config} wireframe={getAboutWireframe()} />;
}
