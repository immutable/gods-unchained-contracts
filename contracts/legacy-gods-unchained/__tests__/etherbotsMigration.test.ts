import 'jest';

jest.setTimeout(30000);

import { Blockchain, expectRevert, generatedWallets } from '@imtbl/test-utils';
import { Wallet, ethers } from 'ethers';

import { Address } from '@imtbl/gods-unchained/node_modules/@imtbl/common-types';
import { CardIntegrationTwoFactory } from './../src/generated/CardIntegrationTwoFactory';
import { CardsFactory } from '@imtbl/gods-unchained';
import { CardsWrapper } from './../../gods-unchained/src/wrappers/cardsWrapper';
import { EtherbotsMigrationFactory } from './../src/generated/EtherbotsMigrationFactory';
import { asyncForEach } from '@imtbl/utils';

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

const etherbotIds = [
  400,
  413,
  414,
  421,
  427,
  428,
  389,
  415,
  416,
  422,
  424,
  425,
  426,
  382,
  420,
  417,
];

describe('Core', () => {
  const [ownerWallet, immutableWallet, userWallet, userWallet2] = generatedWallets(provider);
  const BATCH_SIZE = 101;

  beforeEach(async () => {
    await blockchain.resetAsync();
    await blockchain.saveSnapshotAsync();
  });

  afterEach(async () => {
    await blockchain.revertAsync();
  });

  describe('#constructor', () => {
    it('should be able to deploy the Etherbots migration contract', async () => {
      const etherbots = await new EtherbotsMigrationFactory(ownerWallet).deploy(
        ethers.constants.AddressZero,
        ethers.constants.AddressZero,
        etherbotIds,
      );
    });
  });

  describe('#migrate', () => {
    let caller;
    let callerTokenId;

    let etherbotsMigrationAddress;
    let oldCardsAddress;
    let newCardsAddress;

    beforeEach(async () => {
      caller = userWallet;
      callerTokenId = 0;

      const oldCards = await new CardIntegrationTwoFactory(ownerWallet).deploy();
      await oldCards.functions.addProto(400, 1, 1, 1, 1, 1, 1, 1, false);
      await oldCards.functions.addProto(300, 1, 1, 1, 1, 1, 1, 1, false);

      // Create 4 Etherbot cards to test with
      await asyncForEach([0, 1, 2, 3], async (item) => {
        const tx = await oldCards.functions.createCard(userWallet.address, 400, 1);
        await tx.wait();
      });

      // Create 4 Core cards to test with
      await asyncForEach([0, 1, 2, 3], async (item) => {
        const tx = await oldCards.functions.createCard(userWallet.address, 300, 1);
        await tx.wait();
      });

      const newCards = await new CardsWrapper(ownerWallet).deploy(BATCH_SIZE, [
        { name: 'Cpre', low: 1, high: 379 },
        { name: 'Etherbots', low: 380, high: 396 },
      ]);

      const etherbots = await new EtherbotsMigrationFactory(ownerWallet).deploy(
        oldCards.address,
        newCards.address,
        etherbotIds,
      );

      await newCards.functions.addFactory(etherbots.address, 1);
      await newCards.functions.addFactory(etherbots.address, 2);

      etherbotsMigrationAddress = etherbots.address;
      oldCardsAddress = oldCards.address;
      newCardsAddress = newCards.address;
      /* tslint:disable-next-line:align */
    });

    async function subject() {
      const etherbots = await new EtherbotsMigrationFactory(caller).attach(
        etherbotsMigrationAddress,
      );
      const tx = await etherbots.functions.migrate(callerTokenId);
      return await tx.wait();
    }

    it('should not be able to migrate the same card twice', async () => {
      await subject();
      await expectRevert(subject());
    });

    it('should not be able to migrate anything other than Etherbots', async () => {
      callerTokenId = 300;
      await expectRevert(subject());
    });

    it('should be able to migrate if it does not have ownership', async () => {
      caller = immutableWallet;
      await subject();
    });

    it('should be able to migrate the card with the correct proto', async () => {
      await subject();
      const newCards = await new CardsFactory(userWallet).attach(newCardsAddress);
      const card = await newCards.functions.getDetails(0);
      expect(card.proto).toBe(380);
    });
  });

  describe('#migrateSameOwner', () => {
    let caller: Wallet;
    let callerTokenIds: number[];
    let callerOwner: string;

    let etherbotsMigrationAddress;
    let oldCardsAddress;
    let newCardsAddress;

    beforeEach(async () => {
      caller = userWallet;
      callerTokenIds = [0, 1, 2, 3];
      callerOwner = userWallet.address;

      const oldCards = await new CardIntegrationTwoFactory(ownerWallet).deploy();
      await oldCards.functions.addProto(400, 1, 1, 1, 1, 1, 1, 1, false);
      await oldCards.functions.addProto(300, 1, 1, 1, 1, 1, 1, 1, false);

      // Create 4 Etherbot cards to test with
      await asyncForEach([0, 1, 2, 3], async (item) => {
        const tx = await oldCards.functions.createCard(userWallet.address, 400, 1);
        await tx.wait();
      });

      // Create 4 Core cards to test with
      await asyncForEach([0, 1, 2, 3], async (item) => {
        const tx = await oldCards.functions.createCard(userWallet.address, 300, 1);
        await tx.wait();
      });

      const newCards = await new CardsWrapper(ownerWallet).deploy(BATCH_SIZE, [
        { name: 'Core', low: 1, high: 379 },
        { name: 'Etherbots', low: 380, high: 396 },
      ]);

      const etherbots = await new EtherbotsMigrationFactory(ownerWallet).deploy(
        oldCards.address,
        newCards.address,
        etherbotIds,
      );

      await newCards.functions.addFactory(etherbots.address, 1);
      await newCards.functions.addFactory(etherbots.address, 2);

      etherbotsMigrationAddress = etherbots.address;
      oldCardsAddress = oldCards.address;
      newCardsAddress = newCards.address;
      /* tslint:disable-next-line:align */
    });

    async function subject() {
      const etherbots = await new EtherbotsMigrationFactory(caller).attach(
        etherbotsMigrationAddress,
      );
      const tx = await etherbots.functions.migrateSameOwner(callerTokenIds, callerOwner);
      return await tx.wait();
    }

    it('should not be able to migrate the same card twice', async () => {
      await subject();
      await expectRevert(subject());
    });

    it('should not be able to migrate anything other than Etherbots', async () => {
      callerTokenIds = [3, 4, 5, 6, 7];
      await expectRevert(subject());
      callerTokenIds = [4];
      await expectRevert(subject());
    });

    it('should be able to migrate if it does not have ownership', async () => {
      caller = immutableWallet;
      await subject();
    });

    it('should be able to migrate the card with the correct proto', async () => {
      await subject();
      const newCards = await new CardsFactory(userWallet).attach(newCardsAddress);
      const card = await newCards.functions.getDetails(0);
      expect(card.proto).toBe(380);
    });
  });
});
