/* eslint-disable @typescript-eslint/no-var-requires */
const withTM = require('next-transpile-modules')([
  '@project-serum/sol-wallet-adapter',
  '@solana/wallet-adapter-react',
  '@solana/wallet-adapter-base',
  '@solana/wallet-adapter-wallets',
  '@solana/wallet-adapter-bitpie',
  'react-animated-menu',
]);

const withImages = require('next-images');

// module.exports = withTM(withImages({
//   reactStrictMode: true,
//   webpack5: true,
//   webpack: (config, { isServer }) => {
//     // Fixes npm packages that depend on `fs` module
//     if (!isServer) {
//       config.resolve.fallback.fs = false;
//     }

//     return config
//   }
// }));

module.exports = withTM({
  swcMinify: true,
  reactStrictMode: true,
  experimental: {
    concurrentFeatures: true,
  },
  images: {
    formats: ['image/avif', 'image/webp']
  },
  webpack5: true,

  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    return config
  }
});
