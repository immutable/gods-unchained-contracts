import 'jest';

import { Blockchain, expectRevert, generatedWallets } from '@imtbl/test-utils';
import { Chest, Referral, TestPack, Escrow } from '../../../src/contracts';

import { ethers } from 'ethers';
import { keccak256 } from 'ethers/utils';
import { PurchaseProcessor, CreditCardEscrow, getETHPayment, getSignedPayment, Currency } from '@imtbl/platform';

const ZERO_EX = '0x0000000000000000000000000000000000000000';

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

ethers.errors.setLogLevel('error');

describe('Chest', () => {
  const [owner, other] = generatedWallets(provider);

  beforeEach(async () => {
    await blockchain.resetAsync();
    await blockchain.saveSnapshotAsync();
  });

  afterEach(async () => {
    await blockchain.revertAsync();
  });

  describe('#purchase ETH', () => {
    let chest: Chest;
    let processor: PurchaseProcessor;
    let escrowProtocol: Escrow;
    let escrow: CreditCardEscrow;
    let referral: Referral;
    let pack: TestPack;
    const rareChestSKU = keccak256('0x00');
    const rareChestPrice = 100;

    beforeEach(async () => {
      referral = await Referral.deploy(owner, 90, 10);
      processor = await PurchaseProcessor.deploy(owner, owner.address);
      pack = await TestPack.deploy(owner);
      escrowProtocol = await Escrow.deploy(owner);
      escrow = await CreditCardEscrow.deploy(
        owner,
        escrowProtocol.address,
        ZERO_EX,
        100,
        ZERO_EX,
        100,
      );
      chest = await Chest.deploy(
        owner,
        'GU: S1 Rare Chest',
        'GU:1:RC',
        pack.address,
        0,
        referral.address,
        rareChestSKU,
        rareChestPrice,
        escrow.address,
        processor.address,
      );
    });

    async function purchaseChests(quantity: number) {
      await processor.setSellerApproval(chest.address, [rareChestSKU], true);
      let balance = await chest.balanceOf(owner.address);
      expect(balance.toNumber()).toBe(0);
      await chest.purchase(quantity, getETHPayment(), ZERO_EX);
      balance = await chest.balanceOf(owner.address);
      expect(balance.toNumber()).toBe(quantity);
    }

    // it('should purchase 1 chest using ETH', async() => {
    //   await purchaseChests(1);
    // });

    // it('should purchase 5 chests using ETH', async() => {
    //   await purchaseChests(5);
    // });
  });

  describe('#purchase USD', () => {
    let chest: Chest;
    let processor: PurchaseProcessor;
    let escrowProtocol: Escrow;
    let escrow: CreditCardEscrow;
    let referral: Referral;
    let pack: TestPack;
    const rareChestSKU = keccak256('0x00');
    const rareChestPrice = 100;

    beforeEach(async () => {
      processor = await PurchaseProcessor.deploy(owner, owner.address);
      referral = await Referral.deploy(owner, 90, 10);
      pack = await TestPack.deploy(owner);
      escrowProtocol = await Escrow.deploy(owner);
      escrow = await CreditCardEscrow.deploy(
        owner,
        escrowProtocol.address,
        ZERO_EX,
        100,
        ZERO_EX,
        100,
      );
      chest = await Chest.deploy(
        owner,
        'GU: S1 Rare Chest',
        'GU:1:RC',
        pack.address,
        0,
        referral.address,
        rareChestSKU,
        rareChestPrice,
        escrow.address,
        processor.address,
      );
    });

    async function purchaseChests(quantity: number, escrowFor: number) {
      await processor.setSignerLimit(owner.address, 10000000000);
      await processor.setSellerApproval(chest.address, [rareChestSKU], true);
      const value = rareChestPrice * quantity;
      const order = {
        quantity,
        sku: rareChestSKU,
        recipient: owner.address,
        currency: Currency.USDCents,
        totalPrice: value,
      };
      const params = { value, escrowFor, nonce: 0 };
      const payment = await getSignedPayment(
        owner,
        processor.address,
        chest.address,
        order,
        params,
      );
      await chest.purchase(quantity, payment, ZERO_EX);
      let expectedUserBalance: number;
      let expectedEscrowBalance: number;
      if (escrowFor > 0) {
        expectedUserBalance = 0;
        expectedEscrowBalance = quantity;
      } else {
        expectedUserBalance = quantity;
        expectedEscrowBalance = 0;
      }
      const escrowBalance = await chest.balanceOf(escrowProtocol.address);
      const userBalance = await chest.balanceOf(owner.address);
      expect(userBalance.toNumber()).toBe(expectedUserBalance);
      expect(escrowBalance.toNumber()).toBe(expectedEscrowBalance);
    }

    it('should purchase 1 chest using USD with no escrow', async () => {
      await purchaseChests(1, 0);
    });

    it('should purchase 5 chests using USD with no escrow', async () => {
      await purchaseChests(5, 0);
    });

    it('should purchase 1 chest using USD with escrow', async () => {
      await purchaseChests(1, 10000);
    });

    it('should purchase 5 chests using USD with escrow', async () => {
      await purchaseChests(5, 10000);
    });
  });

  describe('#open', () => {
    let chest: Chest;
    let processor: PurchaseProcessor;
    let escrowProtocol: Escrow;
    let escrow: CreditCardEscrow;
    let referral: Referral;
    let pack: TestPack;
    const rareChestSKU = keccak256('0x00');

    beforeEach(async () => {
      processor = await PurchaseProcessor.deploy(owner, owner.address);
      referral = await Referral.deploy(owner, 90, 10);
      pack = await TestPack.deploy(owner);
      escrowProtocol = await Escrow.deploy(owner);
      escrow = await CreditCardEscrow.deploy(
        owner,
        escrowProtocol.address,
        ZERO_EX,
        100,
        ZERO_EX,
        100,
      );
      chest = await Chest.deploy(
        owner,
        'GU: S1 Rare Chest',
        'GU:1:RC',
        pack.address,
        0,
        referral.address,
        rareChestSKU,
        0,
        escrow.address,
        processor.address,
      );
    });

    async function openChests(quantity: number) {
      const preBalance = await chest.balanceOf(owner.address);
      await chest.open(quantity);
      const postBalance = await chest.balanceOf(owner.address);
      const diff = preBalance.toNumber() - postBalance.toNumber();
      expect(diff).toBe(quantity);
    }

    it('should not be able to open chests with insufficient balance', async () => {
      await expectRevert(chest.open(1));
    });

    it('should be able to open 1 chest', async () => {
      await processor.setSellerApproval(chest.address, [rareChestSKU], true);
      const payment = getETHPayment();
      await chest.purchase(1, payment, ZERO_EX);
      await openChests(1);
    });

    it('should be able to open 5 chests', async () => {
      await processor.setSellerApproval(chest.address, [rareChestSKU], true);
      const payment = getETHPayment();
      await chest.purchase(5, payment, ZERO_EX);
      await openChests(5);
    });
  });
});
