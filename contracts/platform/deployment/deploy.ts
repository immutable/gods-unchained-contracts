import { DeploymentParams, AddressBook, DeploymentStage, Manager, DeploymentEnvironment } from '@imtbl/deployment-utils';

import { CoreStage } from './01_core';

const config = require('dotenv').config({ path: '../../.env' }).parsed;

export const params: DeploymentParams = {
  private_key: process.env.PRIVATE_KEY,
  network_id: parseInt(process.env.DEPLOYMENT_NETWORK_ID),
  environment: process.env.DEPLOYMENT_ENVIRONMENT as DeploymentEnvironment,
  rpc_url: process.env.RPC_ENDPOINT
};

async function start() {
  const args = require('minimist')(process.argv.slice(2));

  let stages: DeploymentStage[] = [];

  if (args.all) {
    args.core = true;
  }

  if (args.core) {
    stages.push(
      new CoreStage(params),
    );
  }

  const book = new AddressBook(
    './src/addresses', 
    config.DEPLOYMENT_NETWORK_ID
  );

  const newManager = new Manager(stages, book, params);

  await newManager.deploy();
}

start();
