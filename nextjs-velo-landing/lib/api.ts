// Shared backend base URL for contact and other API calls.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://velo-vackend.onrender.com';

export const CONTACT_ENDPOINT = `${API_BASE_URL}/api/rise/send-contact`;
export const MARKETPLACE_LISTINGS_ENDPOINT = `${API_BASE_URL}/api/listing/get-listing-by-category/undefined`;
