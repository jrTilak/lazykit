/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects() {
    return [
      {
        source: "/docs",
        destination: "/docs/introduction/",
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com"
      }
    ]
  }
};

export default nextConfig;
