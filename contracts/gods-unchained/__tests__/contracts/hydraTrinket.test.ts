import { Address } from '@imtbl/common-types';
import 'jest';
jest.setTimeout(30000);

import { Blockchain, expectRevert, generatedWallets } from '@imtbl/test-utils';
import { HydraTrinketFactory } from './../../src/generated/HydraTrinketFactory';
import { HydraTrinket } from './../../src/generated/HydraTrinket';
import { Wallet, ethers } from 'ethers';

import { parseLogs } from '@imtbl/utils';

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

describe('Hydra Trinket', () => {
  const [ownerWallet, minterWallet, userWallet, userWallet2, userWallet3] = generatedWallets(
    provider,
  );

  beforeEach(async () => {
    await blockchain.resetAsync();
    await blockchain.saveSnapshotAsync();
  });

  afterEach(async () => {
    await blockchain.revertAsync();
  });

  describe('#mint', () => {
    let hydraTrinket: HydraTrinket;
    let callerDestination: Address;
    let callerHeads: number;
    let callerWallet;

    beforeEach(async () => {
      hydraTrinket = await new HydraTrinketFactory(ownerWallet).deploy('GU: Hydra', 'GU:HYDRA');
      await hydraTrinket.setMinterStatus(minterWallet.address, true);
      callerDestination = userWallet.address;
      callerHeads = 1;
      callerWallet = minterWallet;
    });

    async function subject() {
      const contract = await new HydraTrinketFactory(callerWallet).attach(hydraTrinket.address);
      await contract.mint(callerDestination, callerHeads);
    }

    it('should not be able to mint as an unauthorised user', async () => {
      callerWallet = userWallet;
      await expectRevert(subject());
    });

    it('should be able to mint as a valid minter', async () => {
      await subject();
      const supply = await hydraTrinket.functions.totalSupply();
      expect(supply.toNumber()).toBe(1);
    });
  });

  describe('#transferFrom', () => {
    let hydraTrinket: HydraTrinket;
    let callerWallet;

    beforeEach(async () => {
      hydraTrinket = await new HydraTrinketFactory(ownerWallet).deploy('GU: Hydra', 'GU:HYDRA');
      await hydraTrinket.setMinterStatus(minterWallet.address, true);
      await hydraTrinket.mint(userWallet.address, 1);
      callerWallet = userWallet;
    });

    async function subject() {
      const contract = await new HydraTrinketFactory(callerWallet).attach(hydraTrinket.address);
      const tx = await contract.functions.transferFrom(userWallet.address, ownerWallet.address, 1);
      return tx.wait();
    }

    it('should not be able to transfer if trading has not been unlocked', async () => {
      await expectRevert(subject());
    });

    it('should be able to trade if trading unlocked', async () => {
      await hydraTrinket.functions.setTradabilityStatus(true);
      await subject();
      const balance = await hydraTrinket.functions.balanceOf(ownerWallet.address);
      expect(balance.toNumber()).toBe(1);
    });
  });
});
