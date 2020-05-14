import 'jest';

import { TestVendor, PurchaseProcessor } from '../../src/contracts';

import { Blockchain, expectRevert, generatedWallets } from '@imtbl/test-utils';
import { ethers } from 'ethers';
import { keccak256, BigNumber } from 'ethers/utils';
import { getETHPayment, getSignedPayment, Order, PaymentParams } from '../../src/';
import { ETHUSDMockOracle } from '../../src/contracts/ETHUSDMockOracle';

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

const ZERO_EX = '0x0000000000000000000000000000000000000000';

describe('Vendor', () => {
  const [user, treasury, other] = generatedWallets(provider);

  beforeEach(async () => {
    await blockchain.resetAsync();
    await blockchain.saveSnapshotAsync();
  });

  afterEach(async () => {
    await blockchain.revertAsync();
  });

  describe('#constructor', () => {
    it('should be able to deploy the vendor', async () => {
      const pay = await PurchaseProcessor.deploy(user, user.address);
      const vendor = await TestVendor.deploy(user, pay.address);
    });
  });

  describe('#processPayment (priced in USD, pay in ETH)', () => {
    let pay: PurchaseProcessor;
    let vendor: TestVendor;
    let oracle: ETHUSDMockOracle;

    const sku = keccak256('0x00');

    beforeEach(async () => {
      pay = await PurchaseProcessor.deploy(user, treasury.address);
      vendor = await TestVendor.deploy(user, pay.address);
      oracle = await ETHUSDMockOracle.deploy(user);
    });

    async function setOracle(address?: string) {
      return await pay.setOracle(address || oracle.address);
    }

    async function processETHPayment(
      approved: boolean,
      quantity: number,
      totalPrice: number,
      value: number | BigNumber,
    ) {
      const order = { sku, totalPrice, quantity, recipient: user.address, currency: 1 };
      await pay.setSellerApproval(vendor.address, [sku], approved);
      await vendor.processPayment(order, getETHPayment(), { value });
    }

    it('should not be able to process with no oracle set', async () => {
      await expectRevert(processETHPayment(true, 1, 100, 1));
    });

    it('should not be able to process an insufficient ETH payment', async () => {
      await setOracle();
      const valueToSend = await oracle.convert(1, 0, 100);
      await expectRevert(processETHPayment(true, 1, 100, valueToSend.sub(1)));
    });

    it('should not be able to process an ETH payment for an unapproved item', async () => {
      await setOracle();
      await expectRevert(processETHPayment(false, 1, 100, 100));
    });

    it('should be able to process an ETH payment', async () => {
      await setOracle();
      const valueToSend = await oracle.convert(1, 0, 100);
      await processETHPayment(true, 1, 100, valueToSend);
    });

    it('should be able to process an ETH payment and refund the extra', async () => {
      const treasuryBefore = await treasury.getBalance();

      await setOracle();

      const valueToSend = await oracle.convert(1, 0, 100);
      await processETHPayment(true, 1, 100, valueToSend);

      const treasuryAfter = await treasury.getBalance();
      expect(treasuryAfter.toString()).toBe(treasuryBefore.add(valueToSend).toString());
    });
  });

  describe('#processPayment (priced in ETH, paid in ETH)', () => {
    let pay: PurchaseProcessor;
    let vendor: TestVendor;
    let oracle: ETHUSDMockOracle;

    const sku = keccak256('0x00');

    beforeEach(async () => {
      pay = await PurchaseProcessor.deploy(user, treasury.address);
      vendor = await TestVendor.deploy(user, pay.address);
      oracle = await ETHUSDMockOracle.deploy(user);
    });

    async function setOracle(address?: string) {
      return await pay.setOracle(address || oracle.address);
    }

    async function processETHPayment(
      approved: boolean,
      quantity: number,
      totalPrice: number,
      value: number | BigNumber,
    ) {
      const order = { sku, totalPrice, quantity, recipient: user.address, currency: 0 };
      await pay.setSellerApproval(vendor.address, [sku], approved);
      await vendor.processPayment(order, getETHPayment(), { value });
    }

    it('should not be able to process with no oracle set', async () => {
      await expectRevert(processETHPayment(true, 1, 100, 1));
    });

    it('should not be able to process an insufficient ETH payment', async () => {
      await setOracle();
      await expectRevert(processETHPayment(true, 1, 100, 99));
    });

    it('should not be able to process an ETH payment for an unapproved item', async () => {
      await setOracle();
      await expectRevert(processETHPayment(false, 1, 100, 100));
    });

    it('should be able to process an ETH payment', async () => {
      await setOracle();
      await processETHPayment(true, 1, 100, 100);
    });

    it('should be able to process an ETH payment and refund the extra', async () => {
      const treasuryBefore = await treasury.getBalance();

      await setOracle();

      await processETHPayment(true, 1, 100, 102);

      const treasuryAfter = await treasury.getBalance();
      expect(treasuryAfter.toString()).toBe(treasuryBefore.add(100).toString());
    });
  });

  describe('#processPayment (priced in ETH, paid in USD)', () => {
    let pay: PurchaseProcessor;
    let vendor: TestVendor;
    let oracle: ETHUSDMockOracle;
    const sku = keccak256('0x00');
    let nonce = 0;

    beforeEach(async () => {
      nonce = 0;
      pay = await PurchaseProcessor.deploy(user, user.address);
      vendor = await TestVendor.deploy(user, pay.address);
      oracle = await ETHUSDMockOracle.deploy(user);
    });

    async function setOracle(address?: string) {
      return await pay.setOracle(address || oracle.address);
    }

    function getSimpleOrder(price: number): Order {
      return { sku, quantity: 1, totalPrice: price, currency: 0, recipient: user.address };
    }

    async function processUSDPayment(order: Order, payment: PaymentParams) {
      await pay.setSellerApproval(vendor.address, [sku], true);
      await vendor.processPayment(
        order,
        await getSignedPayment(user, pay.address, vendor.address, order, payment),
      );
    }

    it('should be able to process a USD payment', async () => {
      await pay.setSignerLimit(user.address, 100000);
      await setOracle();
      const price = await oracle.convert(0, 1, 1);
      console.log(price.toString());
      const order = getSimpleOrder(1);
      const payment = await getSignedPayment(user, pay.address, vendor.address, order, {
        nonce: 0,
        escrowFor: 100000,
        value: 100000,
      });
      await processUSDPayment(order, payment);
    });

    it('should not be able to process an insufficient USD payment', async () => {
      await pay.setSignerLimit(user.address, 20500);
      await setOracle();
      const order = getSimpleOrder(1);
      const payment = await getSignedPayment(user, pay.address, vendor.address, order, {
        nonce: 0,
        escrowFor: 20500,
        value: 20500,
      });
      await expectRevert(processUSDPayment(order, payment));
    });
  });

  describe('#processPayment (priced in USD, paid in USD)', () => {
    let pay: PurchaseProcessor;
    let vendor: TestVendor;
    const sku = keccak256('0x00');
    let nonce = 0;

    beforeEach(async () => {
      nonce = 0;
      pay = await PurchaseProcessor.deploy(user, user.address);
      vendor = await TestVendor.deploy(user, pay.address);
    });

    function getSimpleOrder(price: number): Order {
      return { sku, quantity: 1, totalPrice: price, currency: 1, recipient: user.address };
    }

    async function processUSDPayment(order: Order, payment: PaymentParams) {
      await pay.setSellerApproval(vendor.address, [sku], true);
      await vendor.processPayment(
        order,
        await getSignedPayment(user, pay.address, vendor.address, order, payment),
      );
    }

    it('should be able to process a USD payment', async () => {
      await pay.setSignerLimit(user.address, 100);
      const order = getSimpleOrder(100);
      const payment = await getSignedPayment(user, pay.address, vendor.address, order, {
        nonce: 0,
        escrowFor: 10,
        value: 100,
      });
      await processUSDPayment(order, payment);
    });

    it('should not be able to process an insufficient USD payment', async () => {
      await pay.setSignerLimit(user.address, 100);
      const order = getSimpleOrder(100);
      const payment = await getSignedPayment(user, pay.address, vendor.address, order, {
        nonce: 0,
        escrowFor: 10,
        value: 99,
      });
      await expectRevert(processUSDPayment(order, payment));
    });

    it('should not be able to exceed seller limit in one tx', async () => {
      await pay.setSignerLimit(user.address, 100);
      const order = getSimpleOrder(101);
      const payment = await getSignedPayment(user, pay.address, vendor.address, order, {
        nonce: 0,
        escrowFor: 10,
        value: 101,
      });
      await expectRevert(processUSDPayment(order, payment));
    });

    it('should not be able to exceed seller limit in two txs', async () => {
      await pay.setSignerLimit(user.address, 100);
      const order = getSimpleOrder(99);
      const payment = await getSignedPayment(user, pay.address, vendor.address, order, {
        nonce: 0,
        escrowFor: 10,
        value: 99,
      });
      await processUSDPayment(order, payment);
      await expectRevert(
        vendor.processPayment(
          getSimpleOrder(99),
          await getSignedPayment(user, pay.address, vendor.address, order, {
            nonce: 0,
            escrowFor: 10,
            value: 2,
          }),
        ),
      );
    });

    it('should not process payment from unapproved seller', async () => {
      const order = getSimpleOrder(99);
      const payment = await getSignedPayment(user, pay.address, vendor.address, order, {
        nonce: 0,
        escrowFor: 10,
        value: 99,
      });
      await expectRevert(processUSDPayment(order, payment));
    });
  });
});
