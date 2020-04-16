import 'jest';

jest.setTimeout(30000);

import { Blockchain, expectRevert, generatedWallets } from '@imtbl/test-utils';
import { Cards, CardsFactory } from '../../src';
import { Wallet, ethers } from 'ethers';

import { Address } from '@imtbl/common-types';

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

describe('Core', () => {
  const [ownerWallet, managerWallet, userWallet] = generatedWallets(provider);
  const BATCH_SIZE = 101;

  beforeEach(async () => {
    await blockchain.resetAsync();
    await blockchain.saveSnapshotAsync();
  });

  afterEach(async () => {
    await blockchain.revertAsync();
  });

  describe('#constructor', () => {
    async function subject(): Promise<any> {
      return await new CardsFactory(ownerWallet).deploy(BATCH_SIZE, 'Hey', 'Hi');
    }

    it('should be able to deploy', async () => {
      const cards = await subject();
      const manager = await cards.functions.propertyManager();
      expect(manager).toEqual(ownerWallet.address);
    });
  });

  describe('#startSeason', () => {
    let cards: Cards;

    let caller: Wallet;
    let callerName: Address;
    let callerLow: number;
    let callerHigh: number;

    beforeEach(async () => {
      caller = ownerWallet;
      callerName = 'New Season';
      callerLow = 1;
      callerHigh = 100;
      cards = await new CardsFactory(ownerWallet).deploy(BATCH_SIZE, 'Test', 'TEST');
    });

    async function subject(): Promise<any> {
      const newCards = await new CardsFactory(caller).attach(cards.address);
      const tx = await newCards.functions.startSeason(callerName, callerLow, callerHigh);
      return await tx.wait();
    }

    it('should not be able to call as an unauthorised user', async () => {
      caller = userWallet;
      await expectRevert(subject());
    });

    it('should not be able to start at 0', async () => {
      callerLow = 0;
      await expectRevert(subject());
    });

    it('should not be able to have a low higher than the start', async () => {
      callerLow = 101;
      callerHigh = 100;
      await expectRevert(subject());
    });

    it('should not be able to have a high the same as the low', async () => {
      callerLow = 100;
      callerHigh = 100;
      await expectRevert(subject());
    });

    it('should not be able to start a season at the mythic threshold', async () => {
      const mythicThreshold = await cards.functions.MYTHIC_THRESHOLD();
      callerHigh = mythicThreshold + 1;
      await expectRevert(subject());
    });

    it('should be able to start a season correctly', async () => {
      await subject();
      const season = await cards.functions.seasons(0);
      expect(season.low).toEqual(1);
      expect(season.high).toEqual(100);
    });
  });

  describe('#addFactory', () => {
    let cards: Cards;

    let caller: Wallet;
    let callerFactory: Address;
    let callerSeason: number;

    beforeEach(async () => {
      callerFactory = ownerWallet.address;
      callerSeason = 1;
      caller = ownerWallet;
      cards = await new CardsFactory(ownerWallet).deploy(BATCH_SIZE, 'Test', 'TEST');
      await cards.functions.startSeason('Test', 1, 100);
    });

    async function subject(): Promise<any> {
      const newCards = await new CardsFactory(caller).attach(cards.address);
      const tx = await newCards.functions.addFactory(callerFactory, callerSeason);
      return await tx.wait();
    }

    it('should not be able to start as an unauthorised user', async () => {
      caller = userWallet;
      await expectRevert(subject());
    });

    it('should not be able to start with the season set as 0', async () => {
      callerSeason = 0;
      await expectRevert(subject());
    });

    /* tslint:disable-next-line:max-line-length */
    it('should not be able to start a season greater than the number of seasons existing', async () => {
      callerSeason = 2;
      await expectRevert(subject());
    });

    it('should not be able to add an existing factory', async () => {
      await subject();
      await expectRevert(subject());
    });

    it('should not be able to add a factory where the season is tradeable', async () => {
      await subject();
      const tradeable = await cards.functions.unlockTrading(1);
      await tradeable.wait();
      await expectRevert(subject());
    });

    it('should be able to deploy a new factory', async () => {
      await subject();
      const factoryApproved = await cards.functions.factoryApproved(ownerWallet.address, 1);
      expect(factoryApproved).toBeTruthy();
    });
  });

  describe('#approveForMythic', () => {
    let cards: Cards;

    let caller: Wallet;
    let callerFactory: Address;
    let callerMythic: number;

    beforeEach(async () => {
      caller = ownerWallet;
      callerFactory = ownerWallet.address;
      cards = await new CardsFactory(ownerWallet).deploy(BATCH_SIZE, 'Test', 'TEST');
      callerMythic = await cards.functions.MYTHIC_THRESHOLD();
    });

    async function subject(): Promise<any> {
      const newCards = await new CardsFactory(caller).attach(cards.address);
      const tx = await newCards.functions.approveForMythic(callerFactory, callerMythic);
      return tx.wait();
    }

    it('should not be able to call as an unauthorised user', async () => {
      caller = userWallet;
      await expectRevert(subject());
    });

    it('should not be able to approve below the threshold', async () => {
      callerMythic -= 10;
      await expectRevert(subject());
    });

    it('should not be able to approve the same mythic twice', async () => {
      await subject();
      await expectRevert(subject());
    });

    it('should be able to approve a new mythic', async () => {
      await subject();
      const approved = await cards.functions.mythicApproved(callerMythic, callerFactory);
      expect(approved).toBeTruthy();
    });
  });

  describe('#makeMythicTradable', () => {
    let cards: Cards;

    let caller: Wallet;
    let callerMythic: number;

    beforeEach(async () => {
      cards = await new CardsFactory(ownerWallet).deploy(BATCH_SIZE, 'Test', 'TEST');
      caller = ownerWallet;
      callerMythic = await cards.functions.MYTHIC_THRESHOLD();
    });

    async function subject(): Promise<any> {
      const newCards = await new CardsFactory(caller).attach(cards.address);
      return newCards.functions.makeMythicTradable(callerMythic);
    }

    it('should not be able to make mythics tradeable as an unauthorised user', async () => {
      caller = userWallet;
      await expectRevert(subject());
    });

    it('should not be able to pass a non-mythic', async () => {
      callerMythic = 1;
      await expectRevert(subject());
    });

    it('should not be able to make a mythic tradable if it already is', async () => {
      await subject();
      await expectRevert(subject());
    });

    it('should be able to make a mythic tradeable', async () => {
      await subject();
      const tradeable = await cards.functions.mythicTradable(callerMythic);
      expect(tradeable).toBeTruthy();
    });
  });

  describe('#unlockTrading', () => {
    let cards: Cards;

    let caller: Wallet;
    let callerSeason: number;

    beforeEach(async () => {
      caller = ownerWallet;
      callerSeason = 1;

      cards = await new CardsFactory(ownerWallet).deploy(BATCH_SIZE, 'Test', 'TEST');
      await cards.functions.startSeason('Season', 1, 100);
    });

    async function subject(): Promise<any> {
      const newCards = await new CardsFactory(caller).attach(cards.address);
      return newCards.functions.unlockTrading(callerSeason);
    }

    it('should not be able to make season tradeable as an unauthorised user', async () => {
      caller = userWallet;
      await expectRevert(subject());
    });

    it('should not be able to make non-existinent season tradeable', async () => {
      callerSeason = 2;
      await expectRevert(subject());
    });

    it('should not be able to make a season tradable if it already is', async () => {
      await subject();
      await expectRevert(subject());
    });

    it('should be able to make a season tradeable', async () => {
      await subject();
      const tradeable = await cards.functions.seasonTradable(1);
      expect(tradeable).toBeTruthy();
    });
  });

  describe('#mintCard', () => {
    let cards: Cards;
    let mythicThreshold;

    let caller: Wallet;
    let callerTo: Address;
    let callerProto: number;
    let callerQuality: number;

    beforeEach(async () => {
      caller = ownerWallet;
      callerTo = ownerWallet.address;
      callerProto = 1;
      callerQuality = 1;
      cards = await new CardsFactory(ownerWallet).deploy(BATCH_SIZE, 'Test', 'TEST');

      mythicThreshold = await cards.functions.MYTHIC_THRESHOLD();

      await cards.functions.startSeason('Genesis', 1, 377);
      await cards.functions.startSeason('Etherbots', 380, 396);
      await cards.functions.startSeason('Promo', 400, 500);
      await cards.functions.addFactory(ownerWallet.address, 1);
      await cards.functions.approveForMythic(ownerWallet.address, mythicThreshold);
      await cards.functions.approveForMythic(ownerWallet.address, mythicThreshold + 1);
    });

    async function subject(): Promise<any> {
      const newCards = await new CardsFactory(caller).attach(cards.address);
      const tx = await newCards.functions.mintCard(callerTo, callerProto, callerQuality);
      return tx.wait();
    }

    it('should not be able to mint a regular card as an unauthorised user', async () => {
      caller = userWallet;
      await expectRevert(subject());
    });

    it('should not be able to mint a mythic card as an unauthorised user', async () => {
      caller = userWallet;
      callerProto = mythicThreshold;
      await expectRevert(subject());
    });

    it('should not be able to mint an invalid proto', async () => {
      callerProto = 501;
      await expectRevert(subject());
    });

    it('should not be able to mint an invalid mythic', async () => {
      callerProto = mythicThreshold + 2;
      await expectRevert(subject());
    });

    it('should be able to mint a card', async () => {
      await subject();
      const balance = await cards.functions.balanceOf(callerTo);
      expect(balance.toNumber()).toBe(1);
    });
  });

  describe('#mintCards', () => {
    let cards: Cards;

    let callerSize: number;
    let callerProtos: number[];
    let callerQualities: number[];

    beforeEach(async () => {
      callerSize = BATCH_SIZE;
      callerProtos = null;
      callerQualities = null;

      cards = await new CardsFactory(ownerWallet).deploy(BATCH_SIZE, 'Test', 'TEST');

      await cards.functions.startSeason('Genesis', 1, 377);
      await cards.functions.startSeason('Etherbots', 380, 396);
      await cards.functions.startSeason('Promo', 400, 500);

      await cards.functions.addFactory(ownerWallet.address, 1);

      await cards.functions.approveForMythic(ownerWallet.address, 65000);
      await cards.functions.approveForMythic(ownerWallet.address, 65001);
    });

    async function subject(): Promise<any> {
      callerProtos = callerProtos || Array(callerSize).fill(1);
      callerQualities = callerQualities || Array(callerSize).fill(1);
      return await cards.functions.mintCards(ownerWallet.address, callerProtos, callerQualities);
    }

    it('should not be able to mint with zero supplied protos', async () => {
      callerProtos = [];
      callerQualities = [];
      await expectRevert(subject());
    });

    it('should not be able to mint with different proto and qualities size', async () => {
      callerProtos = Array(callerSize - 1).fill(1);
      await expectRevert(subject());
    });

    it('should not be able to mint from different seasons', async () => {
      callerProtos = [377, 380];
      callerQualities = [1, 1];
      await expectRevert(subject());
    });

    it('should not be able to mint from different seasons', async () => {
      callerProtos = [65000, 65001, 65002];
      callerQualities = [1, 1, 1];
      await expectRevert(subject());
    });

    it('should not be able to mint from different seasons', async () => {
      callerProtos = [500, 65001];
      callerQualities = [1, 1];
      await expectRevert(subject());
    });

    it('should not be able to mint beyond the limit', async () => {
      callerSize = BATCH_SIZE + 1;
      await expectRevert(subject());
    });

    it('should not be able to mint with a proto of 0', async () => {
      // @TODO: Fix this up.
      // callerProtos = [0];
      // callerQualities = [10];
      // await expectRevert(subject());
    });

    it('should be able to batch mint exactly the limit', async () => {
      await subject();
      const supply = await cards.functions.totalSupply();
      expect(supply.toNumber()).toBe(callerSize);
    });
  });

  describe('#updateProtos', () => {});

  describe('#lockProtos', () => {});

  describe('#transferFrom', () => {});

  describe('#getDetails', () => {});

  describe('#isTradable', () => {});

  describe('#setPropertyManager', () => {});

  describe('#setProperty', () => {});

  describe('#setClassProperty', () => {});

  describe('#setQuality', () => {});
});
