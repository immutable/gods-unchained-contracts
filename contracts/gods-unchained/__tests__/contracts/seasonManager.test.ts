import 'jest';

import { Address } from '@imtbl/common-types';
import { parseLogs } from '@imtbl/utils';
import { SeasonManagerFactory } from '../../src/generated/SeasonManagerFactory';
import { SeasonCore } from '../../src/generated/SeasonCore';
import { JsonRpcProvider } from 'ethers/providers';
import { generatedWallets, expectRevert } from '@imtbl/test-utils';
import { ethers, Wallet } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider();

describe('SeasonCore', () => {
  const [ownerWallet, userWallet, randomWallet, creatorWallet] = generatedWallets(provider);

  describe('#createSeason', () => {
    let seasonCoreAddress: Address;

    let caller: Wallet;
    let callerTotalProtos: number;
    let callerStartProto: number;

    beforeEach(async () => {
      caller = ownerWallet;
      callerTotalProtos = 10;
      callerStartProto = 1;

      const seasonCore = await new SeasonManagerFactory(ownerWallet).deploy();
      seasonCoreAddress = seasonCore.address;
    });

    async function subject() {
      const seasonCore = await new SeasonManagerFactory(caller).attach(seasonCoreAddress);
      const tx = await seasonCore.functions.createSeason(callerTotalProtos, callerStartProto);
      return await tx.wait();
    }

    it('should not be able to create a season as an unauthorised user', async () => {
      caller = randomWallet;
      await expectRevert(subject());
    });

    it('should not be able to create a season with the start specified as 0', async () => {
      callerStartProto = 0;
      await expectRevert(subject());
    });

    it('should not be able to create a season with the total specified as 0', async () => {
      callerTotalProtos = 0;
      await expectRevert(subject());
    });

    it('should be able to create a new season and emit the correct event', async () => {
      const receipt = await subject();
      const parsed = parseLogs(receipt.logs, new SeasonManagerFactory().interface.abi);
      // TODO: Check event emitted correctly
    });
  });

  describe('#createPack', () => {
    let seasonCoreAddress: string;

    let caller: Wallet;
    let callerSeason: number;
    let callerName: string;
    let callerChestSize: number;
    let callerChestAddress: Address;
    let callerPackAddress: Address;

    beforeEach(async () => {
      caller = ownerWallet;
      callerSeason = 1;
      callerName = 'RarePack';
      callerChestSize = 6;
      callerChestAddress = ethers.constants.AddressZero;
      callerPackAddress = ethers.constants.AddressZero;

      const seasonCore = await new SeasonManagerFactory(ownerWallet).deploy();
      await seasonCore.functions.createSeason(10, 1);
      seasonCoreAddress = seasonCore.address;
    });

    async function subject() {
      const seasonCore = await new SeasonManagerFactory(caller).attach(seasonCoreAddress);
      const tx = await seasonCore.functions.createPack(
        callerSeason,
        callerName,
        callerChestSize,
        callerChestAddress,
        callerPackAddress,
      );
      return await tx.wait();
    }

    it('should not be able to create as an unauthorised user', async () => {
      caller = randomWallet;
      await expectRevert(subject());
    });

    it('should not be able to create if there are existing details', async () => {
      await subject();
      await expectRevert(subject());
    });

    it('should be able to create a pack with the correct events emitted', async () => {
      await subject();
      // TODO: Check correct event emitted correctly
    });
  });

  describe('#packRedeemed', () => {
    let seasonCoreAddress: string;

    let caller: Wallet;
    let callerSeason: number;
    let callerPackId: string;
    let callerItemCount: number;
    let callerLockUp: number;
    let callerUser: Address;

    beforeEach(async () => {
      caller = creatorWallet;
      callerSeason = 1;
      callerPackId = '';
      callerItemCount = 1;
      callerLockUp = 0;
      callerUser = userWallet.address;

      const seasonCore = await new SeasonManagerFactory(ownerWallet).deploy();
      seasonCoreAddress = seasonCore.address;
      await seasonCore.functions.createSeason(10, 1);
      await seasonCore.functions.createPack(
        1,
        'RarePack',
        6,
        creatorWallet.address,
        creatorWallet.address,
      );
      // TODO: Need to get Pack ID from above
    });

    async function subject() {
      const seasonCore = await new SeasonManagerFactory(caller).attach(seasonCoreAddress);
      const tx = await seasonCore.functions.packRedeemed(
        callerSeason,
        callerPackId,
        callerItemCount,
        callerLockUp,
        callerUser,
      );
      return await tx.wait();
    }

    it('should not be able to redeem unless from a valid chest or pack address', async () => {
      caller = randomWallet;
      await expectRevert(subject());
    });

    it('should not be able to redeem a pack for a non-existent season', async () => {
      callerSeason = 2;
      await expectRevert(subject());
    });

    it('should not be able to redeem a pack for an invalid pack', async () => {
      callerPackId = 'abc';
      await expectRevert(subject());
    });

    it('should not be able to redeem 0 items', async () => {
      callerItemCount = 0;
      await expectRevert(subject());
    });

    it('should not be able to redeem a pack without a valid user', async () => {
      callerUser = '';
      await expectRevert(subject());
    });

    it('should be able to redeem a pack', async () => {
      const receipt = await subject();
      const purchaseId = 1; // TODO: Make this real
      const seasonCore = await new SeasonManagerFactory(userWallet).attach(seasonCoreAddress);
      const purchaseData = await seasonCore.functions.purchases(purchaseId);
    });
  });

  describe('#commitPackRandomness', () => {
    let seasonCoreAddress: string;

    let caller: Wallet;
    let callerPurchaseId: number;
    let callerFastForwardBlocks: number;

    beforeEach(async () => {
      caller = creatorWallet;
      callerPurchaseId = 0;
      callerFastForwardBlocks = 0;

      const seasonCore = await new SeasonManagerFactory(ownerWallet).deploy();
      seasonCoreAddress = seasonCore.address;
      await seasonCore.functions.createSeason(10, 1);
      await seasonCore.functions.createPack(
        1,
        'RarePack',
        6,
        creatorWallet.address,
        creatorWallet.address,
      );
      // TODO: Need to get Pack ID from above
      await seasonCore.functions.packRedeemed(1, 'callerPackId', 1, 1, userWallet.address);
    });

    async function subject() {
      const seasonCore = await new SeasonManagerFactory(caller).attach(seasonCoreAddress);
      const tx = await seasonCore.functions.commitPackRandomness(callerPurchaseId);
      return await tx.wait();
    }
    it('should not be able to commit randomness with an invalid purchase id', async () => {
      callerPurchaseId = 500;
      await expectRevert(subject());
    });

    it('should not be able to commit randomness before the lockup period', async () => {
      // TODO: Figure out how to test this?
    });

    it('should not be able to commit randomness if the status is claimed', async () => {
      await subject();
      await expectRevert(subject());
    });

    it('should be able to recommit randomness and emit the correct events', async () => {
      await subject();
    });

    it('should be able to commit randomness as any user', async () => {
      caller = randomWallet;
      await subject();
    });

    it('should be able to commit randomness as the owner', async () => {
      caller = ownerWallet;
      await subject();
    });

    it('should be able to commit randomness as the purchaser', async () => {
      caller = creatorWallet;
      await subject();
    });
  });

  describe('#predictPackDetails', () => {
    it('should return a valid result', async () => {});
  });

  describe('#predictCardDetails', () => {
    it('should return a valid result', async () => {});
  });
});
