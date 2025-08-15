/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["drive.google.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cf.cjdropshipping.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cf.cjdropshipping.com",
        pathname: "/quick/product/**",
      },
      {
        protocol: "https",
        hostname: "oss-cf.cjdropshipping.com",
        pathname: "/product/**",
      },
    ],
  },
};

export default nextConfig;
