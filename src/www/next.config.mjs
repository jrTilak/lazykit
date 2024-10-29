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
  }
};

export default nextConfig;
