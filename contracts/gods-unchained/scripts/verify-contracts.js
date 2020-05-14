const fs = require('fs');

const addresses = require('../../../packages/addresses/src/outputs');
const { execSync } = require('child_process');

const dotenv = require('dotenv');
const config = dotenv.config({ path: '../../.env' }).parsed;

const CONTRACT_NAMES = require('./MAIN_CONTRACTS');

CONTRACT_NAMES.forEach((i) => {
  const item = Object.entries(i)[0][0];
  const value = Object.entries(i)[0][1];

  const root = addresses[`${config.DEPLOYMENT_NETWORK_ID}-${config.DEPLOYMENT_ENVIRONMENT}`];
  const address = root.addresses[item];
  console.log(item, value);

  if (!address) {
    return;
  }

  const buildPath = `./build/contracts/${value}.json`;

  let file = JSON.parse(fs.readFileSync(buildPath));
  file.networks[config.DEPLOYMENT_NETWORK_ID] = { address: address };
  file = JSON.stringify(file, null, 2);
  fs.writeFileSync(buildPath, file);

  console.log(`${value} - ${address}`);
  execSync(
    `truffle run verify ${value}@${address} --network ${root.human_friendly_name.split('-')[0]}`,
  );
});
