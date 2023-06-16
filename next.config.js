/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    Server_Url: process.env.Server_Url,
  },
  webpack(config, options) {
    const { isServer } = options;
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve("url-loader"),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve("file-loader"),
            publicPath: `${config.assetPrefix}/_next/static/images/`,
            outputPath: `${isServer ? "../" : ""}static/images/`,
            name: "[name]-[hash].[ext]",
            esModule: config.esModule || false,
          },
        },
      ],
    });

    return config;
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "source.unsplash.com",
      "scontent.fnak3-1.fna.fbcdn.net",
      "cdn.sanity.io",
      "rickandmortyapi.com",
      "images.unsplash.com",
      "n14jpqkv.api.sanity.io",
      "lh3.googleusercontent.com",
      "storage.googleapis.com",
    ],
  },
};

module.exports = nextConfig;
