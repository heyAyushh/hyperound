// eslint-disable-next-line @typescript-eslint/no-var-requires
const withTM = require('next-transpile-modules')([
  '@project-serum/sol-wallet-adapter'
]);

module.exports = withTM();