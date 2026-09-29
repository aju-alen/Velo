// Local API (same machine as Expo). Override with EXPO_PUBLIC_BACKEND_URL in .env if needed.
// export const ipURL = "https://velo-vackend.onrender.com"

export const ipURL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://192.168.1.245:3001';
