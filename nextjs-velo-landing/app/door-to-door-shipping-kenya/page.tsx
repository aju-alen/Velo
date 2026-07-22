import { buildMetadata, getPageConfig } from '@/lib/seo';
import { getServiceWireframe } from '@/content/wireframes';
import ServiceWireframePage from '@/components/pages/ServiceWireframePage';

const slug = 'door-to-door-shipping-kenya';
const config = getPageConfig(slug);
export const metadata = buildMetadata(config);

export default function Page() {
  return (
    <ServiceWireframePage
      config={config}
      wireframe={getServiceWireframe(slug)}
      benefitsTitle="Key Benefits"
    />
  );
}
