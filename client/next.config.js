/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'res.cloudinary.com',
      'cdn.123job.vn',
      'doopage.com',
      'daygiare.com',
      'shopeeplus.com',
    ],
  },
};

module.exports = nextConfig;
