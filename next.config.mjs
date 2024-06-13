/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jobdataapi.com",
      },
      {
        protocol: "https",
        hostname: "cms.jibecdn.com",
      },
      {
        protocol: "https",
        hostname: "tailwindui.com",
      },
      {
        protocol: "https",
        hostname: "wellfound.com",
      },
    ],
  },
};

export default nextConfig;
