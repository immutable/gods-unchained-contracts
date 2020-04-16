import { Address } from '@imtbl/common-types';
import { RaffleItemFactory } from './../../src/generated/RaffleItemFactory';
import { RaffleItem } from './../../src/generated/RaffleItem';

import 'jest';

jest.setTimeout(30000);

import { Blockchain, expectRevert, generatedWallets } from '@imtbl/test-utils';
import { Wallet, ethers } from 'ethers';

import { parseLogs } from '@imtbl/utils';

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

describe('Raffle Item', () => {
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
    let raffleItem: RaffleItem;
    let callerDestination: Address;
    let callerWallet;

    beforeEach(async () => {
      raffleItem = await new RaffleItemFactory(ownerWallet).deploy('GU: Item', 'GU:ITEM');
      await raffleItem.setMinterStatus(minterWallet.address, true);
      callerDestination = userWallet.address;
      callerWallet = minterWallet;
    });

    async function subject() {
      const contract = await new RaffleItemFactory(callerWallet).attach(raffleItem.address);
      await contract.mint(callerDestination);
    }

    it('should not be able to mint as an unauthorised user', async () => {
      callerWallet = userWallet;
      await expectRevert(subject());
    });

    it('should be able to mint as a valid minter', async () => {
      await subject();
      const supply = await raffleItem.functions.totalSupply();
      expect(supply.toNumber()).toBe(1);
    });
  });

  describe('#transferFrom', () => {
    let raffleItem: RaffleItem;
    let callerWallet;

    beforeEach(async () => {
      raffleItem = await new RaffleItemFactory(ownerWallet).deploy('GU: ITEM', 'GU:ITEM');
      await raffleItem.setMinterStatus(minterWallet.address, true);
      await raffleItem.mint(userWallet.address);
      callerWallet = userWallet;
    });

    async function subject() {
      const contract = await new RaffleItemFactory(callerWallet).attach(raffleItem.address);
      const tx = await contract.transferFrom(userWallet.address, ownerWallet.address, 0);
      return tx.wait();
    }

    it('should not be able to transfer if trading has not been unlocked', async () => {
      await expectRevert(subject());
    });

    it('should be able to trade if trading unlocked', async () => {
      //
      // const tx = await raffleItem.functions.setTradabilityStatus(true);
      // await tx.wait();
      // await subject();
      // const balance = await raffleItem.functions.ownerOf(ownerWallet.address);
      // expect(balance).toBe(1);
    });
  });
});
