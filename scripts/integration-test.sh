#!/usr/bin/env bash

set -euxo pipefail

docker-compose up -d
yarn install
yarn lerna bootstrap
yarn setup
yarn lint
docker-compose logs
docker-compose ps
export ETHERSCAN_KEY=0
export RPC_ENDPOINT=http://localhost:8545
export DEPLOYMENT_NETWORK_ID=50
export DEPLOYMENT_ENVIRONMENT=development
env
yarn test
docker-compose down -v
