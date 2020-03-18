const fs = require('fs');

const addresses = require('../../../packages/addresses/src/outputs');
const { execSync } = require('child_process');

const dotenv = require('dotenv');
const config = dotenv.config({ path: '../../.env' }).parsed;

const argv = require('yargs').argv;

const item = argv.name;
const address = argv.address;

const buildPath = `./build/contracts/${item}.json`;
const root = addresses[`${config.DEPLOYMENT_NETWORK_ID}-${config.DEPLOYMENT_ENVIRONMENT}`];

let file = JSON.parse(fs.readFileSync(buildPath));
file.networks[config.DEPLOYMENT_NETWORK_ID] = { address: address };
file = JSON.stringify(file, null, 2);
fs.writeFileSync(buildPath, file);

console.log(`${item} - ${address}`);
execSync(
  `truffle run verify ${item}@${address} --network ${root.human_friendly_name.split('-')[0]}`,
);
