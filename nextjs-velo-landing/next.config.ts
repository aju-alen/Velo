import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  redirects: async () => [
    { source: '/contact-us', destination: '/contact', permanent: true },
    { source: '/download', destination: '/download-app', permanent: true },
    { source: '/marketplace/senders', destination: '/senders', permanent: true },
    { source: '/marketplace/agents', destination: '/agents', permanent: true },
  ],
};

export default nextConfig;
