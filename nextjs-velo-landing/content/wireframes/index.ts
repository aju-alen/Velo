import type {
  AboutWireframeConfig,
  PricingWireframeConfig,
  RouteWireframeConfig,
  ServiceWireframeConfig,
  TrackWireframeConfig,
} from '@/types/wireframe';
import { aboutConfig } from './about';
import { airFreightConfig } from './air-freight';
import { businessShippingConfig } from './business-shipping';
import { getBlogPostMeta } from './blog-posts';
import { doorToDoorConfig } from './door-to-door';
import { packagePickupConfig } from './package-pickup';
import { pricingCalculatorConfig } from './pricing-calculator';
import { seaFreightConfig } from './sea-freight';
import {
  cargoServicesNairobiConfig,
  shippingFromDubaiConfig,
} from './shipping-from-dubai-to-kenya';
import { trackShipmentConfig } from './track-shipment';

export { getBlogPostMeta };
export {
  blogArticleStructure,
  blogCtaByIntent,
  blogFinalCtaTemplate,
  blogVoiceGuidelines,
  blogArticleTypeExamples,
  requiredBlogFaqs,
} from './blog-article-framework';

const routeConfigs: Record<string, RouteWireframeConfig> = {
  'shipping-from-dubai-to-kenya': shippingFromDubaiConfig,
  'cargo-services-dubai-to-nairobi': cargoServicesNairobiConfig,
};

const serviceConfigs: Record<string, ServiceWireframeConfig> = {
  'air-freight-dubai-to-kenya': airFreightConfig,
  'sea-freight-dubai-to-kenya': seaFreightConfig,
  'door-to-door-shipping-kenya': doorToDoorConfig,
  'package-pickup-dubai': packagePickupConfig,
  'business-shipping': businessShippingConfig,
};

export function getRouteWireframe(slug: string): RouteWireframeConfig {
  const config = routeConfigs[slug];
  if (!config) throw new Error(`Unknown route wireframe slug: ${slug}`);
  return config;
}

export function getServiceWireframe(slug: string): ServiceWireframeConfig {
  const config = serviceConfigs[slug];
  if (!config) throw new Error(`Unknown service wireframe slug: ${slug}`);
  return config;
}

export function getAboutWireframe(): AboutWireframeConfig {
  return aboutConfig;
}

export function getPricingWireframe(): PricingWireframeConfig {
  return pricingCalculatorConfig;
}

export function getTrackWireframe(): TrackWireframeConfig {
  return trackShipmentConfig;
}
