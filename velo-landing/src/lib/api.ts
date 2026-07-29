// Shared backend base URL for contact and other API calls.
export const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || 'https://velo-vackend.onrender.com';

export const CONTACT_ENDPOINT = `${API_BASE_URL}/api/rise/send-contact`;
