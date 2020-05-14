const fs = require('fs');

const addresses = require('../../../packages/addresses/src/outputs');
const { execSync } = require('child_process');

const dotenv = require('dotenv');
const config = dotenv.config({ path: '../../.env' }).parsed;

const CONTRACT_NAMES = require('./MAIN_CONTRACTS');

CONTRACT_NAMES.forEach((item) => {
  const root = addresses[`${config.DEPLOYMENT_NETWORK_ID}-${config.DEPLOYMENT_ENVIRONMENT}`];
  const address = root.addresses[item];
  if (!address) {
    return;
  }

  const buildPath = `./build/contracts/${item}.json`;

  let file = JSON.parse(fs.readFileSync(buildPath));
  file.networks[config.DEPLOYMENT_NETWORK_ID] = { address: address };
  file = JSON.stringify(file, null, 2);
  fs.writeFileSync(buildPath, file);

  console.log(`${item} - ${address}`);
  execSync(
    `truffle run verify ${item}@${address} --network ${root.human_friendly_name.split('-')[0]}`,
  );
});
