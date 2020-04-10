import 'jest';

import {
  Cards,
  Fusing,
  OpenMinter
} from '../../src/contracts';
import { Wallet, ethers } from 'ethers';

import { getAddressBook } from '@imtbl/addresses';

const config = require('dotenv').config({ path: '../../.env' }).parsed;

const provider = new ethers.providers.JsonRpcProvider(config.RPC_ENDPOINT);

const wallet: Wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);

const addressBook = getAddressBook(config.DEPLOYMENT_NETWORK_ID, config.DEPLOYMENT_ENVIRONMENT);

describe('01_core', () => {
  let cards: Cards;
  let openMinter: OpenMinter;
  let fusing: Fusing;

  beforeAll(async () => {
    cards = Cards.at(wallet, addressBook.cardsAddress);
    openMinter = OpenMinter.at(wallet, addressBook.openMinterAddress);
    fusing = Fusing.at(wallet, addressBook.fusingAddress);
  });

  it('should have deployed cards', async () => {
    const code = await provider.getCode(cards.address);
    expect(code.length).toBeGreaterThan(3);
  });

  it('should have deployed open minter', async () => {
    const code = await provider.getCode(openMinter.address);
    expect(code.length).toBeGreaterThan(3);
  });

  it('should have deployed fusing', async () => {
    const code = await provider.getCode(fusing.address);
    expect(code.length).toBeGreaterThan(3);
  });
});
