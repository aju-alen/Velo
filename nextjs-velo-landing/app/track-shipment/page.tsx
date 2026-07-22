import { buildMetadata, getPageConfig } from '@/lib/seo';
import { getTrackWireframe } from '@/content/wireframes';
import TrackWireframePage from '@/components/pages/TrackWireframePage';

const slug = 'track-shipment';
const config = getPageConfig(slug);
export const metadata = buildMetadata(config);

export default function Page() {
  return <TrackWireframePage config={config} wireframe={getTrackWireframe()} />;
}
