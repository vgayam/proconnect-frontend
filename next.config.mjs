/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static image imports
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
