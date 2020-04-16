import 'jest';
jest.setTimeout(30000);

import { Blockchain, expectRevert, generatedWallets } from '@imtbl/test-utils';
import { Cards, CardsFactory, Forge, ForgeFactory } from '../../src';
import { Wallet, ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

describe('Forge', () => {
  const [ownerWallet, minterWallet, userWallet] = generatedWallets(provider);
  const BATCH_SIZE = 101;

  beforeEach(async () => {
    await blockchain.resetAsync();
    await blockchain.saveSnapshotAsync();
  });

  afterEach(async () => {
    await blockchain.revertAsync();
  });

  describe('#forge', () => {
    let cards: Cards;
    let forge: Forge;

    let callerIds: number[];
    let caller: Wallet;

    beforeEach(async () => {
      callerIds = [];
      caller = minterWallet;

      cards = await new CardsFactory(ownerWallet).deploy(BATCH_SIZE, 'Test', 'TEST');
      forge = await new ForgeFactory(ownerWallet).deploy(cards.address);

      const season = await cards.functions.startSeason('Test', 1, 100);
      await season.wait();

      const factory = await cards.functions.addFactory(ownerWallet.address, 1);
      await factory.wait();

      const forgeFactory = await cards.functions.addFactory(forge.address, 1);
      await forgeFactory.wait();

      const unlockTrading = await cards.functions.unlockTrading(1);
      await unlockTrading.wait();
    });

    async function createCards(count: number, proto: number, quality: number) {
      const protos = [];
      const qualities = [];
      const ids = [];

      for (let i = 0; i < count; i++) {
        protos.push(proto);
        qualities.push(quality);
        ids.push(i);
      }

      const tx = await cards.functions.mintCards(minterWallet.address, protos, qualities);
      await tx.wait();

      return ids;
    }

    async function subject(approve: boolean = true): Promise<any> {
      for (let i = 0; i < callerIds.length; i++) {
        if (approve) {
          await new CardsFactory(caller)
            .attach(cards.address)
            .functions.approve(forge.address, callerIds[i]);
        }
      }

      const tx = await new ForgeFactory(caller).attach(forge.address).functions.forge(callerIds);
      return await tx.wait();
    }

    it('should not be able to forge 0 cards', async () => {
      await expectRevert(subject());
    });

    it('should not be able to forge more than 5 cards', async () => {
      callerIds = await createCards(6, 1, 4);
      await expectRevert(subject());
    });

    it('should not be able to forge exactly 5 diamond cards', async () => {
      callerIds = await createCards(5, 1, 1);
      await expectRevert(subject());
    });

    it('should not be able to forge cards with different protos', async () => {
      const tx = await cards.functions.mintCards(
        ownerWallet.address,
        [1, 1, 1, 1, 2],
        [4, 4, 4, 4, 4],
      );
      await tx.wait();
      callerIds = [0, 1, 2, 3, 4];
      await expectRevert(subject());
    });

    it('should not be able to forge cards with different qualities', async () => {
      const tx = await cards.functions.mintCards(
        ownerWallet.address,
        [1, 1, 1, 1, 1],
        [4, 4, 4, 4, 3],
      );
      await tx.wait();
      callerIds = [0, 1, 2, 3, 4];
      await expectRevert(subject());
    });

    it('should not be able to forge cards as an unauthorised user', async () => {
      callerIds = await createCards(5, 1, 2);
      caller = userWallet;
      await expectRevert(subject());
    });

    it('should not be able to forge cards if the contract is locked', async () => {
      callerIds = await createCards(5, 1, 2);
      await forge.functions.setLock(true);
      await expectRevert(subject());
    });

    it('should be able to forge on behalf of someone else', async () => {
      callerIds = await createCards(5, 1, 2);
      caller = userWallet;
      await new CardsFactory(minterWallet)
        .attach(cards.address)
        .functions.setApprovalForAll(userWallet.address, true);

      const beforeSupply = await cards.functions.totalSupply();
      expect(beforeSupply.toNumber()).toEqual(5);

      await subject();

      const details = await cards.functions.getDetails(0);
      expect(details.quality).toBe(1);
      const supply = await cards.functions.totalSupply();
      expect(supply.toNumber()).toEqual(1);
    });

    it('should be able to forge exactly 5 cards', async () => {
      callerIds = await createCards(5, 1, 2);

      const beforeSupply = await cards.functions.totalSupply();
      expect(beforeSupply.toNumber()).toEqual(5);

      await subject();

      const details = await cards.functions.getDetails(0);
      expect(details.quality).toBe(1);
      const supply = await cards.functions.totalSupply();
      expect(supply.toNumber()).toEqual(1);
    });
  });
});
