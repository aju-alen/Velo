// Shared backend base URL for contact and other API calls.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://velo-vackend.onrender.com';

export const CONTACT_ENDPOINT = `${API_BASE_URL}/api/rise/send-contact`;
export const WEB_MARKETPLACE_CATEGORIES_ENDPOINT = `${API_BASE_URL}/api/web/marketplace/categories`;

export function webMarketplaceListingsEndpoint(categoryId?: string) {
  const url = new URL(`${API_BASE_URL}/api/web/marketplace/listings`);
  if (categoryId) url.searchParams.set('categoryId', categoryId);
  return url.toString();
}

export function trackingEndpoint(shipmentId: string) {
  return `${API_BASE_URL}/api/shipment/track/${encodeURIComponent(shipmentId)}`;
}
