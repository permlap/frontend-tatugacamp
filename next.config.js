/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "scontent.fnak3-1.fna.fbcdn.net",
      "cdn.sanity.io",
      "rickandmortyapi.com",
      "images.unsplash.com",
      "n14jpqkv.api.sanity.io",
      "lh3.googleusercontent.com",
    ],
  },
};

module.exports = nextConfig;
