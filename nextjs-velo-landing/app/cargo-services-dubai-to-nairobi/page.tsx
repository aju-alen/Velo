import { buildMetadata, getPageConfig } from '@/lib/seo';
import { getRouteWireframe } from '@/content/wireframes';
import RouteShippingPage from '@/components/pages/RouteShippingPage';

const slug = 'cargo-services-dubai-to-nairobi';
const config = getPageConfig(slug);
export const metadata = buildMetadata(config);

export default function Page() {
  return <RouteShippingPage config={config} wireframe={getRouteWireframe(slug)} />;
}
