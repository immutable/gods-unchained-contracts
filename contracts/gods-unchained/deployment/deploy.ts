import { DeploymentStage, Manager } from '@imtbl/deployment-utils';

import { CoreStage } from './01_core';
import { ForwarderStage } from './00_forwarder';
import { GenesisPromiseStage } from './02_genesis_promise';

const config = require('dotenv').config({ path: '../../.env' }).parsed;

async function start() {
  const args = require('minimist')(process.argv.slice(2));

  let stages: DeploymentStage[] = [];

  if (args.all) {
    args.forwarder = true;
    args.core = true;
  }

  if (args.forwarder) {
    stages.push(new ForwarderStage(config.PRIVATE_KEY, config.RPC_ENDPOINT));
  }

  if (args.core) {
    stages.push(
      new CoreStage(config.PRIVATE_KEY, config.RPC_ENDPOINT, config.DEPLOYMENT_NETWORK_ID),
    );
  }

  if (args.genesis) {
    stages.push(new GenesisPromiseStage(config.PRIVATE_KEY, config.RPC_ENDPOINT));
  }

  const newManager = new Manager(stages);

  try {
    await newManager.deploy();
  } catch (error) {
    console.log(error);
  }
}

start();
