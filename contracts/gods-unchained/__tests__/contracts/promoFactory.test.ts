import 'jest';

jest.setTimeout(30000);

import { Blockchain, expectRevert, generatedWallets } from '@imtbl/test-utils';
import { Cards, CardsFactory, PromoFactory, PromoFactoryFactory } from '../../src';
import { Wallet, ethers } from 'ethers';

import { Address } from '@imtbl/common-types';
import { asyncForEach } from '@imtbl/utils';

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

describe('Core', () => {
  const [
    ownerWallet,
    minterWallet,
    userWallet,
    adminMinter,
    adminMinter2,
    adminMinter3,
    adminMinter4,
  ] = generatedWallets(provider);
  const BATCH_SIZE = 101;

  beforeEach(async () => {
    await blockchain.resetAsync();
    await blockchain.saveSnapshotAsync();
  });

  afterEach(async () => {
    await blockchain.revertAsync();
  });

  describe('#constructor', () => {
    it('should be able to deploy', async () => {
      const cards = await new CardsFactory(ownerWallet).deploy(BATCH_SIZE, 'Test', 'TEST');
      const promoFactory = await new PromoFactoryFactory(ownerWallet).deploy(cards.address);
    });
  });

  describe('#addPromoMinter', () => {
    let cards: Cards;
    let promoFactory: PromoFactory;

    let caller: Wallet;
    let callerProtos: number;
    let callerMinter;

    beforeEach(async () => {
      caller = ownerWallet;
      callerMinter = minterWallet;
      callerProtos = 400;
      cards = await new CardsFactory(ownerWallet).deploy(BATCH_SIZE, 'Test', 'TEST');
      promoFactory = await new PromoFactoryFactory(ownerWallet).deploy(cards.address);

      await cards.functions.startSeason('Promo', 400, 500);
      await cards.functions.addFactory(promoFactory.address, 1);
    });

    async function subject(): Promise<any> {
      const newPromoFactory = await new PromoFactoryFactory(caller).attach(promoFactory.address);
      await newPromoFactory.functions.addPromoMinter(callerMinter.address, callerProtos);
    }

    it('should not be able to assign a minter as an unauthorised user', async () => {
      caller = userWallet;
      await expectRevert(subject());
    });

    it('should be able to to assign a minter', async () => {
      await subject();

      await asyncForEach(callerProtos, async (proto) => {
        const isValidMinter = await promoFactory.functions.isValidMinter(
          proto,
          minterWallet.address,
        );
        expect(isValidMinter).toBeTruthy();

        const isLocked = await promoFactory.functions.isPromoLocked(proto);
        expect(isLocked).toBeFalsy();
      });
    });

    it('should not be able to assign a minter as the minter', async () => {
      await subject();
      caller = minterWallet;
      callerMinter = userWallet;
      await expectRevert(subject());

      await asyncForEach(callerProtos, async (proto) => {
        const isValidMinter = await promoFactory.functions.isValidMinter(proto, userWallet.address);
        expect(isValidMinter).toBeFalsy();

        const isLocked = await promoFactory.functions.isPromoLocked(proto);
        expect(isLocked).toBeFalsy();
      });
    });

    it('should not be able to assign a minter to a locked promo', async () => {
      await subject();
      await promoFactory.functions.lock(callerProtos);
      callerMinter = userWallet;
      await expectRevert(subject());
    });

    it('should be able to reassign a minter as the owner', async () => {
      await subject();
      callerMinter = userWallet;
      await subject();

      await asyncForEach(callerProtos, async (proto) => {
        const isValidMinter = await promoFactory.functions.isValidMinter(
          proto,
          minterWallet.address,
        );
        expect(isValidMinter).toBeTruthy();

        const isLocked = await promoFactory.functions.isPromoLocked(proto);
        expect(isLocked).toBeFalsy();
      });
    });
  });

  describe('#removePromoMinter', () => {
    let promoFactoryAddress: Address;

    let caller: Wallet;
    let callerProto: number;
    let callerMinter: Wallet;

    beforeEach(async () => {
      caller = ownerWallet;
      callerMinter = minterWallet;
      callerProto = 400;

      const cards = await new CardsFactory(ownerWallet).deploy(BATCH_SIZE, 'Test', 'TEST');
      const promoFactory = await new PromoFactoryFactory(ownerWallet).deploy(cards.address);
      promoFactoryAddress = promoFactory.address;

      await cards.functions.startSeason('Promo', 400, 500);
      await cards.functions.addFactory(promoFactory.address, 1);

      await promoFactory.functions.addPromoMinter(minterWallet.address, 400);
    });

    async function subject() {
      const promoFactory = await new PromoFactoryFactory(caller).attach(promoFactoryAddress);
      const tx = await promoFactory.functions.removePromoMinter(callerMinter.address, callerProto);
      return await tx.wait();
    }

    it('should not be able to remove as a minter', async () => {
      caller = minterWallet;
      await expectRevert(subject());
    });

    it('should not be able to remove as an unauthorised user', async () => {
      caller = userWallet;
      await expectRevert(subject());

      const promoFactory = await new PromoFactoryFactory(caller).attach(promoFactoryAddress);

      const minters = await promoFactory.functions.validMinters(callerProto);
      expect(minters.length).toBe(1);
      console.log(minters);

      const isValidMinter = await promoFactory.functions.isValidMinter(
        callerMinter.address,
        callerProto,
      );
      expect(isValidMinter).toBeTruthy();
    });

    it('should be able to remove a minter', async () => {
      await subject();
      const promoFactory = await new PromoFactoryFactory(caller).attach(promoFactoryAddress);

      const minters = await promoFactory.functions.validMinters(callerProto);
      expect(minters.length).toBe(0);

      const isValidMinter = await promoFactory.functions.isValidMinter(
        callerMinter.address,
        callerProto,
      );
      expect(isValidMinter).toBeFalsy();
    });

    it('should be able to remove one of three minter', async () => {
      const promoFactory = await new PromoFactoryFactory(ownerWallet).attach(promoFactoryAddress);
      await promoFactory.functions.addPromoMinter(userWallet.address, callerProto);
      await promoFactory.functions.addPromoMinter(ownerWallet.address, callerProto);

      await subject();

      const minters = await promoFactory.functions.validMinters(callerProto);
      expect(minters.length).toBe(2);

      const isValidMinter = await promoFactory.functions.isValidMinter(
        callerMinter.address,
        callerProto,
      );
      expect(isValidMinter).toBeFalsy();
    });
  });

  describe('#addAdminMinter', () => {
    let promoFactoryAddress: Address;

    let caller: Wallet;
    let callerMinter: Address;

    beforeEach(async () => {
      caller = ownerWallet;
      callerMinter = adminMinter.address;

      const cards = await new CardsFactory(ownerWallet).deploy(BATCH_SIZE, 'Test', 'TEST');
      const promoFactory = await new PromoFactoryFactory(ownerWallet).deploy(cards.address);
      promoFactoryAddress = promoFactory.address;

      await cards.functions.startSeason('Promo', 400, 500);
      await cards.functions.addFactory(promoFactory.address, 1);
      await promoFactory.functions.addPromoMinter(minterWallet.address, 400);
    });

    async function subject() {
      const promoFactory = await new PromoFactoryFactory(caller).attach(promoFactoryAddress);
      const tx = await promoFactory.functions.addAdminMinter(callerMinter);
      return await tx.wait();
    }

    it('should not be able to add as an unauthorised user', async () => {
      caller = userWallet;
      await expectRevert(subject());
    });

    it('should not be able to add as a minter', async () => {
      caller = minterWallet;
      await expectRevert(subject());
    });

    it('should be able to add as the owner', async () => {
      await subject();

      const promoFactory = await new PromoFactoryFactory(caller).attach(promoFactoryAddress);

      const adminMinterMapping = await promoFactory.functions.adminMintersMapping(callerMinter);
      expect(adminMinterMapping).toBeTruthy();

      const adminMinterArray = await promoFactory.functions.getAdminMinters();
      expect(adminMinterArray.length).toBe(1);
    });

    it('should be able to add four admin minters and remove two', async () => {
      const promoFactory = await new PromoFactoryFactory(ownerWallet).attach(promoFactoryAddress);

      async function addAndCheckAdding(newAdmin: string, id: number) {
        callerMinter = newAdmin;
        await subject();
        const adminMinterMappingVal = await promoFactory.functions.adminMintersMapping(newAdmin);
        expect(adminMinterMappingVal.toNumber()).toBe(id);
        const adminMinterArrayVal = await promoFactory.functions.getAdminMinters();
        expect(adminMinterArrayVal[id - 1]).toBe(newAdmin);
        expect(adminMinterArrayVal).toContain(newAdmin);
      }

      async function removeAndCheckRemoving(removeAdmin: string, id: number) {
        const beforeAllAdmins = await promoFactory.functions.getAdminMinters();

        const beforeAllIds: number[] = [];
        await asyncForEach(beforeAllAdmins, async (address) => {
          const id = await promoFactory.functions.adminMintersMapping(address);
          beforeAllIds.push(id.toNumber());
        });

        await promoFactory.functions.removeAdminMinter(removeAdmin);

        const afterAllAdmins = await promoFactory.functions.getAdminMinters();

        const afterAllIds: number[] = [];
        await asyncForEach(afterAllAdmins, async (address) => {
          const id = await promoFactory.functions.adminMintersMapping(address);
          afterAllIds.push(id.toNumber());
        });

        expect(afterAllAdmins.length).toBe(beforeAllIds.length - 1);
        expect(afterAllIds.length).toBe(beforeAllIds.length - 1);

        expect(afterAllAdmins).not.toContain(removeAdmin);
        expect(afterAllIds).not.toContain(beforeAllIds.length);
      }

      await addAndCheckAdding(adminMinter.address, 1);
      await addAndCheckAdding(adminMinter2.address, 2);
      await addAndCheckAdding(adminMinter3.address, 3);
      await addAndCheckAdding(adminMinter4.address, 4);

      await removeAndCheckRemoving(adminMinter2.address, 2);
      await removeAndCheckRemoving(adminMinter4.address, 4);
      await removeAndCheckRemoving(adminMinter3.address, 3);
      await removeAndCheckRemoving(adminMinter.address, 1);

      await addAndCheckAdding(adminMinter2.address, 1);
      await addAndCheckAdding(adminMinter3.address, 2);
    });
  });

  describe('#removeAdminMinter', () => {
    let promoFactoryAddress: Address;

    let caller: Wallet;
    let callerMinter: Address;

    beforeEach(async () => {
      caller = ownerWallet;
      callerMinter = adminMinter.address;

      const cards = await new CardsFactory(ownerWallet).deploy(BATCH_SIZE, 'Test', 'TEST');
      const promoFactory = await new PromoFactoryFactory(ownerWallet).deploy(cards.address);
      promoFactoryAddress = promoFactory.address;

      await cards.functions.startSeason('Promo', 400, 500);
      await cards.functions.addFactory(promoFactory.address, 1);
      await promoFactory.functions.addPromoMinter(minterWallet.address, 400);
      await promoFactory.functions.addAdminMinter(adminMinter.address);
    });

    async function subject() {
      const promoFactory = await new PromoFactoryFactory(caller).attach(promoFactoryAddress);
      const tx = await promoFactory.functions.removeAdminMinter(callerMinter);
      return await tx.wait();
    }

    it('should not be able to remove as an unauthorised user', async () => {
      caller = userWallet;
      await expectRevert(subject());
    });

    it('should not be able to remove as a minter', async () => {
      caller = minterWallet;
      await expectRevert(subject());
    });

    it('should not be able to remove as an admin', async () => {
      caller = adminMinter;
      await expectRevert(subject());

      const promoFactory = await new PromoFactoryFactory(caller).attach(promoFactoryAddress);

      const adminMinterMapping = await promoFactory.functions.adminMintersMapping(callerMinter);
      expect(adminMinterMapping).toBeTruthy();

      const adminMinterArray = await promoFactory.functions.getAdminMinters();
      expect(adminMinterArray.length).toBe(1);
    });

    it('should be able to remove as the owner', async () => {
      await subject();

      const promoFactory = await new PromoFactoryFactory(caller).attach(promoFactoryAddress);

      const adminMinterMapping = await promoFactory.functions.adminMintersMapping(callerMinter);
      expect(adminMinterMapping.toNumber()).toBe(0);

      const adminMinterArray = await promoFactory.functions.getAdminMinters();
      expect(adminMinterArray.length).toBe(0);
    });
  });

  describe('#adminMintCards', () => {
    let promoFactoryAddress: Address;
    let cardsAddress: Address;

    let caller: Wallet;
    let callerTo: Address;
    let callerProtos: number[];
    let callerQualities: number[];

    beforeEach(async () => {
      caller = adminMinter;
      callerTo = adminMinter.address;
      callerProtos = [400, 401];
      callerQualities = [4, 4];

      const cards = await new CardsFactory(ownerWallet).deploy(BATCH_SIZE, 'Test', 'TEST');
      const promoFactory = await new PromoFactoryFactory(ownerWallet).deploy(cards.address);

      promoFactoryAddress = promoFactory.address;
      cardsAddress = cards.address;

      await cards.functions.startSeason('Promo', 400, 500);
      await cards.functions.addFactory(promoFactory.address, 1);

      await promoFactory.functions.addPromoMinter(minterWallet.address, 400);
      await promoFactory.functions.addAdminMinter(adminMinter.address);
    });

    async function subject() {
      const promoFactory = await new PromoFactoryFactory(caller).attach(promoFactoryAddress);
      const tx = await promoFactory.functions.adminMintCards(
        callerTo,
        callerProtos,
        callerQualities,
      );
      return await tx.wait();
    }

    it('should not be able to mint as a user', async () => {
      caller = userWallet;
      await expectRevert(subject());
    });

    it('should not be able to mint as a minter', async () => {
      caller = minterWallet;
      await expectRevert(subject());
    });

    it('should not be able to mint as an owner', async () => {
      caller = ownerWallet;
      await expectRevert(subject());
    });

    it('should be able to mint as an admin minter', async () => {
      await subject();

      const cards = await new CardsFactory(adminMinter).attach(cardsAddress);

      const newTokenOwner = await cards.functions.ownerOf(0);
      expect(newTokenOwner).toBe(adminMinter.address);

      const balance = await cards.functions.balanceOf(adminMinter.address);
      expect(balance.toNumber()).toBe(2);
    });
  });

  describe('#mint', () => {
    let cards: Cards;
    let promoFactory: PromoFactory;

    let caller: Wallet;

    let callerProtos: number[];
    let callerQualities: number[];

    beforeEach(async () => {
      callerProtos = [400];
      callerQualities = [1];
      caller = minterWallet;

      cards = await new CardsFactory(ownerWallet).deploy(BATCH_SIZE, 'Test', 'TEST');
      promoFactory = await new PromoFactoryFactory(ownerWallet).deploy(cards.address);

      await cards.functions.startSeason('Promo', 400, 500);
      await cards.functions.addFactory(promoFactory.address, 1);

      // TODO: Make into async loop rather than using first element
      await promoFactory.functions.addPromoMinter(minterWallet.address, callerProtos[0]);
    });

    async function subject(): Promise<any> {
      const newPromoFactory = await new PromoFactoryFactory(caller).attach(promoFactory.address);
      return await newPromoFactory.functions.mint(
        userWallet.address,
        callerProtos,
        callerQualities,
      );
    }

    it('should not be able to mint as an unauthorised user', async () => {
      caller = userWallet;
      await expectRevert(subject());
    });

    it('should not be able to mint a locked promo', async () => {
      caller = ownerWallet;
      await promoFactory.functions.lock(callerProtos[0]);
      caller = minterWallet;
      await expectRevert(subject());
    });

    it('should not be able to mint an unassigned promo', async () => {
      callerProtos = [400, 401];
      await expectRevert(subject());
    });

    it('should be able to mint a promo', async () => {
      await subject();

      const isValidMinter = await promoFactory.functions.isValidMinter(
        minterWallet.address,
        callerProtos[0],
      );
      expect(isValidMinter).toBeTruthy();

      const isLocked = await promoFactory.functions.isPromoLocked(callerProtos[0]);
      expect(isLocked).toBeFalsy();

      const result = await cards.functions.balanceOf(userWallet.address);
      expect(result.toNumber()).toBe(1);
    });
  });

  describe('#mintSingle', () => {
    let cards: Cards;
    let promoFactory: PromoFactory;

    let caller: Wallet;

    let callerProto: number;
    let callerQuality: number;

    beforeEach(async () => {
      callerProto = 400;
      callerQuality = 1;
      caller = minterWallet;

      cards = await new CardsFactory(ownerWallet).deploy(BATCH_SIZE, 'Test', 'TEST');
      promoFactory = await new PromoFactoryFactory(ownerWallet).deploy(cards.address);

      await cards.functions.startSeason('Promo', 400, 500);
      await cards.functions.addFactory(promoFactory.address, 1);

      // TODO: Make into async loop rather than using first element
      await promoFactory.functions.addPromoMinter(minterWallet.address, callerProto);
    });

    async function subject(): Promise<any> {
      const newPromoFactory = await new PromoFactoryFactory(caller).attach(promoFactory.address);
      return await newPromoFactory.functions.mintSingle(
        userWallet.address,
        callerProto,
        callerQuality,
      );
    }

    it('should not be able to mint as an unauthorised user', async () => {
      caller = userWallet;
      await expectRevert(subject());
    });

    it('should not be able to mint a locked promo', async () => {
      caller = ownerWallet;
      await promoFactory.functions.lock(callerProto);
      caller = minterWallet;
      await expectRevert(subject());
    });

    it('should not be able to mint an unassigned promo', async () => {
      callerProto = 399;
      await expectRevert(subject());
    });

    it('should be able to mint a promo', async () => {
      await subject();
      const minterArray = await promoFactory.functions.validMinters(callerProto);
      expect(minterArray).toContain(minterWallet.address);
      const result = await cards.functions.balanceOf(userWallet.address);
      expect(result.toNumber()).toBe(1);
    });
  });

  describe('#lock', () => {
    let cards: Cards;
    let promoFactory: PromoFactory;

    let caller: Wallet;
    let callerProtos: number;

    beforeEach(async () => {
      caller = ownerWallet;
      callerProtos = 400;
      cards = await new CardsFactory(ownerWallet).deploy(BATCH_SIZE, 'Test', 'TEST');
      promoFactory = await new PromoFactoryFactory(ownerWallet).deploy(cards.address);

      await cards.functions.startSeason('Promo', 400, 500);
      await cards.functions.addFactory(promoFactory.address, 1);
      await promoFactory.functions.addPromoMinter(minterWallet.address, callerProtos);
    });

    async function subject(): Promise<any> {
      const newPromoFactory = await new PromoFactoryFactory(caller).attach(promoFactory.address);
      return newPromoFactory.functions.lock(callerProtos);
    }

    it('should not be able to lock as an unauthorised user', async () => {
      caller = userWallet;
      await expectRevert(subject());
    });

    it('should not be able to lock an unassigned promo', async () => {
      callerProtos = 401;
      await expectRevert(subject());
    });

    it('should be able to lock a promo', async () => {
      await subject();
      const isLocked = await promoFactory.functions.isPromoLocked(callerProtos);
      expect(isLocked).toBeTruthy();
    });

    it('should not be able to lock an already locked promo', async () => {
      await subject();
      await expectRevert(subject());
    });
  });
});
