import { buildMetadata, getPageConfig } from '@/lib/seo';
import { getRouteWireframe } from '@/content/wireframes';
import RouteShippingPage from '@/components/pages/RouteShippingPage';

const slug = 'shipping-from-dubai-to-kenya';
const config = getPageConfig(slug);
export const metadata = buildMetadata(config);

export default function Page() {
  return <RouteShippingPage config={config} wireframe={getRouteWireframe(slug)} />;
}
