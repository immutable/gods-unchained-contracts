import 'jest';

import { Blockchain, generatedWallets } from '@imtbl/test-utils';
import {
  Sale,
  Escrow, 
  Beacon,
  CreditCardEscrow, 
  Referral, 
  RarePack,
  Pay, 
} from '../../../src/contracts';
import { Wallet, ethers } from 'ethers';
import { keccak256 } from 'ethers/utils';

import { getSignedPayment, Currency } from '@imtbl/platform/src/pay';

jest.setTimeout(600000);

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

const ZERO_EX = '0x0000000000000000000000000000000000000000';

describe('Sale', () => {

  const [owner] = generatedWallets(provider);
  
  beforeEach(async () => {
    await blockchain.resetAsync();
    await blockchain.saveSnapshotAsync();
  });

  afterEach(async () => {
    await blockchain.revertAsync();
  });

  describe('purchaseFor', () => {

    let beacon: Beacon;
    let referral: Referral;
    let processor: Pay;

    let escrow: Escrow;
    let cc: CreditCardEscrow;
    let rarePackSKU = keccak256('0x00');

    let sale: Sale;
    let rare: RarePack;

    beforeEach(async() => {
        escrow = await Escrow.deploy(owner);
        cc = await CreditCardEscrow.deploy(
          owner,
          escrow.address,
          ZERO_EX, 
          100,
          ZERO_EX,
          100
        );
        beacon = await Beacon.deploy(owner);
        referral = await Referral.deploy(owner);
        processor = await Pay.deploy(owner);
        sale = await Sale.deploy(owner);
        rare = await RarePack.deploy(
          owner,
          beacon.address,
          ZERO_EX,
          rarePackSKU,
          referral.address,
          cc.address,
          processor.address
        );
        await processor.setSellerApproval(rare.address, [rarePackSKU], true);
        await processor.setSignerLimit(owner.address, 1000000000000000);
    });

    async function purchasePacks(products: Array<string>, quantities: Array<number>, prices: Array<number>) {

        const pr = Promise.all(quantities.map(async (quantity, i) => {
            const cost = prices[i];
            let order = { quantity: quantity, sku: rarePackSKU, user: owner.address, totalPrice: cost * quantity, currency: Currency.USDCents };
            let params = { escrowFor: 0, nonce: i, value: cost * quantity };
            return await getSignedPayment(owner, processor.address, rare.address, order, params);
        }));

        const payments = await pr;

        await sale.purchaseFor(owner.address, products, quantities, payments, ZERO_EX);
      }

    it('should purchase one item', async () => {
        await purchasePacks([rare.address], [1], [249]);
    });

    it('should purchase two items', async () => {
        await purchasePacks([rare.address, rare.address], [1, 1], [249, 249]);
    });

  });

});
