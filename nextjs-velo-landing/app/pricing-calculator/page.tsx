import { buildMetadata, getPageConfig } from '@/lib/seo';
import { getPricingWireframe } from '@/content/wireframes';
import PricingWireframePage from '@/components/pages/PricingWireframePage';

const slug = 'pricing-calculator';
const config = getPageConfig(slug);
export const metadata = buildMetadata(config);

export default function Page() {
  return <PricingWireframePage config={config} wireframe={getPricingWireframe()} />;
}
