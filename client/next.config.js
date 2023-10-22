/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // domains: [
    //   'res.cloudinary.com',
    //   'cdn.123job.vn',
    //   'doopage.com',
    //   'daygiare.com',
    //   'shopeeplus.com',
    // ],
  },
};

module.exports = nextConfig;
