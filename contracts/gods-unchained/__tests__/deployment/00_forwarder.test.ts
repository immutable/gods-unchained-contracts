import 'jest';

import { Forwarder } from '../../src/contracts';
import { Wallet, ethers } from 'ethers';

import { getAddressBook } from '@imtbl/addresses';

const config = require('dotenv').config({ path: '../../.env' }).parsed;

const provider = new ethers.providers.JsonRpcProvider(config.RPC_ENDPOINT);

const wallet: Wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);

const addressBook = getAddressBook(config.DEPLOYMENT_NETWORK_ID, config.DEPLOYMENT_ENVIRONMENT);

describe('00_forwarder', () => {
  let forwarder: Forwarder;

  beforeAll(async () => {
    forwarder = Forwarder.at(wallet, addressBook.forwarderAddress);
  });

  it('should have a forwarder contract deployed', async () => {
    const code = await provider.getCode(forwarder.address);
    expect(code.length).toBeGreaterThan(3);
  });

  it('should have the correct exchange address set', async () => {
    const exchangeAddress = await forwarder.ZERO_EX_EXCHANGE();
    expect(addressBook.zeroExExchangeAddress.toLowerCase()).toEqual(exchangeAddress.toLowerCase());
  });

  it('should have the correct 0x ERC20 proxy address set', async () => {
    const erc20ProxyAddress = await forwarder.ZERO_EX_TOKEN_PROXY();
    expect(addressBook.zeroExERC20ProxyAddress.toLowerCase()).toBe(erc20ProxyAddress.toLowerCase());
  });

  it('should have the correct WETH address set', async () => {
    const wethAddress = await forwarder.ETHER_TOKEN();
    expect(addressBook.wethAddress.toLowerCase()).toBe(wethAddress.toLowerCase());
  });
});
