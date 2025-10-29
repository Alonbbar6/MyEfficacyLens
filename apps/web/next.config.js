/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      // NextJS <Image> component needs to whitelist domains for src={}
      "lh3.googleusercontent.com",
      "pbs.twimg.com",
      "images.unsplash.com",
      "logos-world.net",
    ],
  },
  // Transpile workspace packages for monorepo support
  transpilePackages: [
    '@efficacy/shared-constants',
    '@efficacy/shared-types',
    '@efficacy/shared-utils',
  ],
};

module.exports = nextConfig;
