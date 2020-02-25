const dotenv = require('dotenv');
const config = dotenv.config({ path: '../../.env' }).parsed;

const truffleConfig = require('../../truffle.config');

module.exports = {
  ...truffleConfig,
  contracts_build_directory: './build/contracts',
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: config.ETHERSCAN_KEY,
  },
};
