import 'jest';

import { TestVendor, Pay } from '../../src/contracts';

import { Blockchain, expectRevert, generatedWallets } from '@imtbl/test-utils';
import { ethers } from 'ethers';
import { keccak256 } from 'ethers/utils';
import { getETHPayment, getSignedPayment, Order, PaymentParams } from '../../src/pay';

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

const ZERO_EX = '0x0000000000000000000000000000000000000000';

describe('Vendor', () => {

  const [user, other] = generatedWallets(provider);

  beforeEach(async () => {
    await blockchain.resetAsync();
    await blockchain.saveSnapshotAsync();
  });

  afterEach(async () => {
    await blockchain.revertAsync();
  });


  describe('#constructor', () => {
    it('should be able to deploy the vendor', async () => {
      const pay = await Pay.deploy(user);
      const vendor = await TestVendor.deploy(user, pay.address);
    });
  });

  describe('#processPayment in ETH', () => {

    let pay: Pay;
    let vendor: TestVendor;
    let sku = keccak256('0x00');

    beforeEach(async () => {
        pay = await Pay.deploy(user);
        vendor = await TestVendor.deploy(user, pay.address);
    });

    async function processETHPayment(approved: boolean, qty: number, totalPrice: number, value: number) {
        await pay.setSellerApproval(vendor.address, [sku], approved);
        await vendor.processPayment(
            { user: user.address, sku: sku, quantity: qty, totalPrice: totalPrice, currency: 0 },
            getETHPayment(),
            { value: value }
        );
    }

    it('should not be able to process an insufficient ETH payment', async () => {
        await expectRevert(processETHPayment(true, 1, 100, 99));
    });

    it('should not be able to process an ETH payment for an unapproved item', async () => {
        await expectRevert(processETHPayment(false, 1, 100, 100));
    });

    it('should be able to process an ETH payment', async () => {
        await processETHPayment(true, 1, 100, 100);
    });

  });

  describe('#processPayment in USD', () => {

    let pay: Pay;
    let vendor: TestVendor;
    let sku = keccak256('0x00');
    let nonce = 0;

    beforeEach(async () => {
        nonce = 0;
        pay = await Pay.deploy(user);
        vendor = await TestVendor.deploy(user, pay.address);
    });

    function getSimpleOrder(price: number): Order {
        return { quantity: 1, totalPrice: price, currency: 1, sku: sku, user: user.address };
    }

    async function processUSDPayment(order: Order, payment: PaymentParams) {
        await pay.setSellerApproval(vendor.address, [sku], true);
        await vendor.processPayment(
            order,
            await getSignedPayment(user, pay.address, vendor.address, order, payment)
        );
    }

    it('should be able to process a USD payment', async () => {
        await pay.setSignerLimit(user.address, 100);
        let order = getSimpleOrder(100);
        let payment = await getSignedPayment(user, pay.address, vendor.address, order, { nonce: 0, escrowFor: 10, value: 100 });
        await processUSDPayment(order, payment);
    });

    it('should not be able to process an insufficient USD payment', async () => {
        await pay.setSignerLimit(user.address, 100);
        let order = getSimpleOrder(100);
        let payment = await getSignedPayment(user, pay.address, vendor.address, order, { nonce: 0, escrowFor: 10, value: 99 });
        await expectRevert(processUSDPayment(order, payment));
    });


    it('should not be able to exceed seller limit in one tx', async () => {
        await pay.setSignerLimit(user.address, 100);
        let order = getSimpleOrder(101);
        let payment = await getSignedPayment(user, pay.address, vendor.address, order, { nonce: 0, escrowFor: 10, value: 101 });
        await expectRevert(processUSDPayment(order, payment));
    });

    it('should not be able to exceed seller limit in two txs', async () => {
        await pay.setSignerLimit(user.address, 100);
        let order = getSimpleOrder(99);
        let payment = await getSignedPayment(user, pay.address, vendor.address, order, { nonce: 0, escrowFor: 10, value: 99 });
        await processUSDPayment(order, payment);
        await expectRevert(vendor.processPayment(
            getSimpleOrder(99),
            await getSignedPayment(user, pay.address, vendor.address, order, { nonce: 0, escrowFor: 10, value: 2 })
        ));
    });

    it('should not process payment from unapproved seller', async () => {
        let order = getSimpleOrder(99);
        let payment = await getSignedPayment(user, pay.address, vendor.address, order, { nonce: 0, escrowFor: 10, value: 99 });
        await expectRevert(processUSDPayment(order, payment));
    });

  });

});