import 'jest';

import { Blockchain, expectRevert, generatedWallets } from '@imtbl/test-utils';
import { Cards, PromoFactory } from '../../src/contracts';
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
      const cards = await Cards.deploy(ownerWallet, BATCH_SIZE, 'Test', 'TEST');
      const promoFactory = await PromoFactory.deploy(ownerWallet, cards.address);
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
      cards = await Cards.deploy(ownerWallet, BATCH_SIZE, 'Test', 'TEST');
      promoFactory = await PromoFactory.deploy(ownerWallet, cards.address);

      await cards.startSeason('Promo', 400, 500);
      await cards.addFactory(promoFactory.address, 1);
    });

    async function subject(): Promise<any> {
      const newPromoFactory = PromoFactory.at(caller, promoFactory.address);
      await newPromoFactory.addPromoMinter(callerMinter.address, callerProtos);
    }

    it('should not be able to assign a minter as an unauthorised user', async () => {
      caller = userWallet;
      await expectRevert(subject());
    });

    it('should be able to to assign a minter', async () => {
      await subject();

      await asyncForEach(callerProtos, async (proto) => {
        const isValidMinter = await promoFactory.isValidMinter(
          proto,
          minterWallet.address,
        );
        expect(isValidMinter).toBeTruthy();

        const isLocked = await promoFactory.isPromoLocked(proto);
        expect(isLocked).toBeFalsy();
      });
    });

    it('should not be able to assign a minter as the minter', async () => {
      await subject();
      caller = minterWallet;
      callerMinter = userWallet;
      await expectRevert(subject());

      await asyncForEach(callerProtos, async (proto) => {
        const isValidMinter = await promoFactory.isValidMinter(proto, userWallet.address);
        expect(isValidMinter).toBeFalsy();

        const isLocked = await promoFactory.isPromoLocked(proto);
        expect(isLocked).toBeFalsy();
      });
    });

    it('should not be able to assign a minter to a locked promo', async () => {
      await subject();
      await promoFactory.lock(callerProtos);
      callerMinter = userWallet;
      await expectRevert(subject());
    });

    it('should be able to reassign a minter as the owner', async () => {
      await subject();
      callerMinter = userWallet;
      await subject();

      await asyncForEach(callerProtos, async (proto) => {
        const isValidMinter = await promoFactory.isValidMinter(
          proto,
          minterWallet.address,
        );
        expect(isValidMinter).toBeTruthy();

        const isLocked = await promoFactory.isPromoLocked(proto);
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

      const cards = await Cards.deploy(ownerWallet, BATCH_SIZE, 'Test', 'TEST');
      const promoFactory = await PromoFactory.deploy(ownerWallet, cards.address);
      promoFactoryAddress = promoFactory.address;

      await cards.startSeason('Promo', 400, 500);
      await cards.addFactory(promoFactory.address, 1);

      await promoFactory.addPromoMinter(minterWallet.address, 400);
    });

    async function subject() {
      const promoFactory = PromoFactory.at(caller, promoFactoryAddress);
      const tx = await promoFactory.removePromoMinter(callerMinter.address, callerProto);
      return await tx.wait();
    }

    it('should not be able to remove as a minter', async () => {
      caller = minterWallet;
      await expectRevert(subject());
    });

    it('should not be able to remove as an unauthorised user', async () => {
      caller = userWallet;
      await expectRevert(subject());

      const promoFactory = PromoFactory.at(caller, promoFactoryAddress);

      const minters = await promoFactory.validMinters(callerProto);
      expect(minters.length).toBe(1);
      console.log(minters);

      const isValidMinter = await promoFactory.isValidMinter(
        callerMinter.address,
        callerProto,
      );
      expect(isValidMinter).toBeTruthy();
    });

    it('should be able to remove a minter', async () => {
      await subject();
      const promoFactory = PromoFactory.at(caller, promoFactoryAddress);

      const minters = await promoFactory.validMinters(callerProto);
      expect(minters.length).toBe(0);

      const isValidMinter = await promoFactory.isValidMinter(
        callerMinter.address,
        callerProto,
      );
      expect(isValidMinter).toBeFalsy();
    });

    it('should be able to remove one of three minter', async () => {
      const promoFactory = PromoFactory.at(ownerWallet, promoFactoryAddress);
      await promoFactory.addPromoMinter(userWallet.address, callerProto);
      await promoFactory.addPromoMinter(ownerWallet.address, callerProto);

      await subject();

      const minters = await promoFactory.validMinters(callerProto);
      expect(minters.length).toBe(2);

      const isValidMinter = await promoFactory.isValidMinter(
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

      const cards = await Cards.deploy(ownerWallet, BATCH_SIZE, 'Test', 'TEST');
      const promoFactory = await PromoFactory.deploy(ownerWallet, cards.address);
      promoFactoryAddress = promoFactory.address;

      await cards.startSeason('Promo', 400, 500);
      await cards.addFactory(promoFactory.address, 1);
      await promoFactory.addPromoMinter(minterWallet.address, 400);
    });

    async function subject() {
      const promoFactory = PromoFactory.at(caller, promoFactoryAddress);
      const tx = await promoFactory.addAdminMinter(callerMinter);
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

      const promoFactory = PromoFactory.at(caller, promoFactoryAddress);

      const adminMinterMapping = await promoFactory.adminMintersMapping(callerMinter);
      expect(adminMinterMapping).toBeTruthy();

      const adminMinterArray = await promoFactory.getAdminMinters();
      expect(adminMinterArray.length).toBe(1);
    });

    it('should be able to add four admin minters and remove two', async () => {
      const promoFactory = PromoFactory.at(ownerWallet, promoFactoryAddress);

      async function addAndCheckAdding(newAdmin: string, id: number) {
        callerMinter = newAdmin;
        await subject();
        const adminMinterMappingVal = await promoFactory.adminMintersMapping(newAdmin);
        expect(adminMinterMappingVal.toNumber()).toBe(id);
        const adminMinterArrayVal = await promoFactory.getAdminMinters();
        expect(adminMinterArrayVal[id - 1]).toBe(newAdmin);
        expect(adminMinterArrayVal).toContain(newAdmin);
      }

      async function removeAndCheckRemoving(removeAdmin: string, id: number) {
        const beforeAllAdmins = await promoFactory.getAdminMinters();

        let beforeAllIds: number[] = [];
        await asyncForEach(beforeAllAdmins, async (address) => {
          const id = await promoFactory.adminMintersMapping(address);
          beforeAllIds.push(id.toNumber());
        });

        await promoFactory.removeAdminMinter(removeAdmin);

        const afterAllAdmins = await promoFactory.getAdminMinters();

        let afterAllIds: number[] = [];
        await asyncForEach(afterAllAdmins, async (address) => {
          const id = await promoFactory.adminMintersMapping(address);
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

      const cards = await Cards.deploy(ownerWallet, BATCH_SIZE, 'Test', 'TEST');
      const promoFactory = await PromoFactory.deploy(ownerWallet, cards.address);
      promoFactoryAddress = promoFactory.address;

      await cards.startSeason('Promo', 400, 500);
      await cards.addFactory(promoFactory.address, 1);
      await promoFactory.addPromoMinter(minterWallet.address, 400);
      await promoFactory.addAdminMinter(adminMinter.address);
    });

    async function subject() {
      const promoFactory = PromoFactory.at(caller, promoFactoryAddress);
      const tx = await promoFactory.removeAdminMinter(callerMinter);
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

      const promoFactory = PromoFactory.at(caller, promoFactoryAddress);

      const adminMinterMapping = await promoFactory.adminMintersMapping(callerMinter);
      expect(adminMinterMapping).toBeTruthy();

      const adminMinterArray = await promoFactory.getAdminMinters();
      expect(adminMinterArray.length).toBe(1);
    });

    it('should be able to remove as the owner', async () => {
      await subject();

      const promoFactory = PromoFactory.at(caller, promoFactoryAddress);

      const adminMinterMapping = await promoFactory.adminMintersMapping(callerMinter);
      expect(adminMinterMapping.toNumber()).toBe(0);

      const adminMinterArray = await promoFactory.getAdminMinters();
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

      const cards = await Cards.deploy(ownerWallet, BATCH_SIZE, 'Test', 'TEST');
      const promoFactory = await PromoFactory.deploy(ownerWallet, cards.address);

      promoFactoryAddress = promoFactory.address;
      cardsAddress = cards.address;

      await cards.startSeason('Promo', 400, 500);
      await cards.addFactory(promoFactory.address, 1);

      await promoFactory.addPromoMinter(minterWallet.address, 400);
      await promoFactory.addAdminMinter(adminMinter.address);
    });

    async function subject() {
      const promoFactory = PromoFactory.at(caller, promoFactoryAddress);
      const tx = await promoFactory.adminMintCards(
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

      const cards = Cards.at(adminMinter, cardsAddress);

      const newTokenOwner = await cards.ownerOf(0);
      expect(newTokenOwner).toBe(adminMinter.address);

      const balance = await cards.balanceOf(adminMinter.address);
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

      cards = await Cards.deploy(ownerWallet, BATCH_SIZE, 'Test', 'TEST');
      promoFactory = await PromoFactory.deploy(ownerWallet, cards.address);

      await cards.startSeason('Promo', 400, 500);
      await cards.addFactory(promoFactory.address, 1);

      // TODO: Make into async loop rather than using first element
      await promoFactory.addPromoMinter(minterWallet.address, callerProtos[0]);
    });

    async function subject(): Promise<any> {
      const newPromoFactory = PromoFactory.at(caller, promoFactory.address);
      return await newPromoFactory.mint(
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
      await promoFactory.lock(callerProtos[0]);
      caller = minterWallet;
      await expectRevert(subject());
    });

    it('should not be able to mint an unassigned promo', async () => {
      callerProtos = [400, 401];
      await expectRevert(subject());
    });

    it('should be able to mint a promo', async () => {
      await subject();

      const isValidMinter = await promoFactory.isValidMinter(
        minterWallet.address,
        callerProtos[0],
      );
      expect(isValidMinter).toBeTruthy();

      const isLocked = await promoFactory.isPromoLocked(callerProtos[0]);
      expect(isLocked).toBeFalsy();

      const result = await cards.balanceOf(userWallet.address);
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

      cards = await Cards.deploy(ownerWallet, BATCH_SIZE, 'Test', 'TEST');
      promoFactory = await PromoFactory.deploy(ownerWallet, cards.address);

      await cards.startSeason('Promo', 400, 500);
      await cards.addFactory(promoFactory.address, 1);

      // TODO: Make into async loop rather than using first element
      await promoFactory.addPromoMinter(minterWallet.address, callerProto);
    });

    async function subject(): Promise<any> {
      const newPromoFactory = PromoFactory.at(caller, promoFactory.address);
      return await newPromoFactory.mintSingle(
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
      await promoFactory.lock(callerProto);
      caller = minterWallet;
      await expectRevert(subject());
    });

    it('should not be able to mint an unassigned promo', async () => {
      callerProto = 399;
      await expectRevert(subject());
    });

    it('should be able to mint a promo', async () => {
      await subject();
      const minterArray = await promoFactory.validMinters(callerProto);
      expect(minterArray).toContain(minterWallet.address);
      const result = await cards.balanceOf(userWallet.address);
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
      cards = await Cards.deploy(ownerWallet, BATCH_SIZE, 'Test', 'TEST');
      promoFactory = await PromoFactory.deploy(ownerWallet, cards.address);

      await cards.startSeason('Promo', 400, 500);
      await cards.addFactory(promoFactory.address, 1);
      await promoFactory.addPromoMinter(minterWallet.address, callerProtos);
    });

    async function subject(): Promise<any> {
      const newPromoFactory = PromoFactory.at(caller, promoFactory.address);
      return newPromoFactory.lock(callerProtos);
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
      const isLocked = await promoFactory.isPromoLocked(callerProtos);
      expect(isLocked).toBeTruthy();
    });

    it('should not be able to lock an already locked promo', async () => {
      await subject();
      await expectRevert(subject());
    });
  });
});
