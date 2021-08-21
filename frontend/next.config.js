 // next.config.js
const withTM = require('next-transpile-modules')([
  '@solana/wallet-adapter-react',
  '@solana/wallet-adapter-base'
]); 

module.exports = withTM();