import 'jest';

import { Blockchain, generatedWallets } from '@imtbl/test-utils';
import { S1Sale, Referral, RarePack, Raffle } from '../../../src/contracts';
import { ethers } from 'ethers';
import { keccak256 } from 'ethers/utils';
import { PurchaseProcessor, CreditCardEscrow, Escrow, Beacon, getSignedPayment, Currency } from '@imtbl/platform';

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
    let processor: PurchaseProcessor;
    let raffle: Raffle;

    let escrow: Escrow;
    let cc: CreditCardEscrow;
    const rarePackSKU = keccak256('0x00');

    let sale: S1Sale;
    let rare: RarePack;

    beforeEach(async () => {
      escrow = await Escrow.deploy(owner);
      cc = await CreditCardEscrow.deploy(owner, escrow.address, ZERO_EX, 100, ZERO_EX, 100);
      beacon = await Beacon.deploy(owner);
      referral = await Referral.deploy(owner, 90, 10);
      processor = await PurchaseProcessor.deploy(owner, owner.address);
      sale = await S1Sale.deploy(owner);
      raffle = await Raffle.deploy(owner);
      rare = await RarePack.deploy(
        owner,
        raffle.address,
        beacon.address,
        ZERO_EX,
        referral.address,
        rarePackSKU,
        cc.address,
        processor.address,
      );
      await processor.setSellerApproval(rare.address, [rarePackSKU], true);
      await processor.setSignerLimit(owner.address, 1000000000000000);
    });

    async function purchasePacks(products: string[], quantities: number[], prices: number[]) {
      const payments = await Promise.all(
        quantities.map(async (quantity, i) => {
          const cost = prices[i];
          const order = {
            quantity,
            sku: rarePackSKU,
            recipient: owner.address,
            totalPrice: cost * quantity,
            currency: Currency.USDCents,
          };
          const params = { escrowFor: 0, nonce: i, value: cost * quantity };
          return {
            quantity,
            payment: await getSignedPayment(owner, processor.address, rare.address, order, params),
            vendor: products[i],
          };
        }),
      );
      await sale.purchaseFor(owner.address, payments, ZERO_EX);
    }

    it('should purchase one item', async () => {
      await purchasePacks([rare.address], [1], [249]);
    });

    it('should purchase two items', async () => {
      await purchasePacks([rare.address, rare.address], [1, 1], [249, 249]);
    });
  });
});
