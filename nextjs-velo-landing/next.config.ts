import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  redirects: async () => [
    { source: '/contact-us', destination: '/contact', permanent: true },
    { source: '/download', destination: '/download-app', permanent: true },
  ],
};

export default nextConfig;
