import { buildMetadata, getPageConfig } from '@/lib/seo';
import { getServiceWireframe } from '@/content/wireframes';
import ServiceWireframePage from '@/components/pages/ServiceWireframePage';

const slug = 'sea-freight-dubai-to-kenya';
const config = getPageConfig(slug);
export const metadata = buildMetadata(config);

export default function Page() {
  return (
    <ServiceWireframePage
      config={config}
      wireframe={getServiceWireframe(slug)}
      benefitsTitle="Benefits"
      cargoTitle="Cargo Types"
    />
  );
}
