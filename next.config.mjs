/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        destination: '/home',
        permanent: true,
        source: '/',
      },
    ];
  },
};

export default nextConfig;
