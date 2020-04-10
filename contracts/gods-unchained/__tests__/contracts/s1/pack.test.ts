import 'jest';

import { Blockchain, generatedWallets } from '@imtbl/test-utils';
import { 
  Escrow, 
  Beacon,
  CreditCardEscrow,
  Referral, 
  RarePack,
  EpicPack,
  LegendaryPack,
  ShinyPack, 
  Cards, 
  Pay
} from '../../../src/contracts';
import { Wallet, ethers } from 'ethers';
import { keccak256 } from 'ethers/utils';

import { getSignedPayment, Currency } from '@imtbl/platform/src/pay';
import { on } from 'cluster';

jest.setTimeout(600000);

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

const ZERO_EX = '0x0000000000000000000000000000000000000000';

describe('Referral', () => {

  const [owner] = generatedWallets(provider);
  
  beforeEach(async () => {
    await blockchain.resetAsync();
    await blockchain.saveSnapshotAsync();
  });

  afterEach(async () => {
    await blockchain.revertAsync();
  });

  describe('deployment', () => {

    let beacon: Beacon;
    let referral: Referral;
    let processor: Pay;

    let escrow: Escrow;
    let cc: CreditCardEscrow;
    let sku = keccak256('0x00');

    let rare: RarePack;
    let epic: EpicPack;
    let legendary: LegendaryPack;
    let shiny: ShinyPack;

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
    });

    it('should deploy rare pack', async () => {
        await RarePack.deploy(
          owner,
          beacon.address,
          ZERO_EX,
          sku, 
          referral.address,
          cc.address,
          processor.address
        );
    });

    it('should deploy epic pack', async () => {
        await EpicPack.deploy(
          owner,
          beacon.address,
          ZERO_EX,
          sku, 
          referral.address,
          cc.address,
          processor.address
        );
    });

    it('should deploy legendary pack', async () => {
        await LegendaryPack.deploy(
          owner,
          beacon.address,
          ZERO_EX,
          sku, 
          referral.address,
          cc.address,
          processor.address
        );
    });

    it('should deploy shiny pack', async () => {
        await ShinyPack.deploy(
          owner,
          beacon.address,
          ZERO_EX,
          sku, 
          referral.address,
          cc.address,
          processor.address
        );
    });

  });

  describe('purchase', () => {

    let beacon: Beacon;
    let referral: Referral;
    let pay: Pay;

    let escrow: Escrow;
    let cc: CreditCardEscrow;
    let rarePackSKU = keccak256('0x00');
    let cards: Cards;

    let rare: RarePack;
    let cost = 249;

    beforeEach(async() => {
      escrow = await Escrow.deploy(owner);
      cc = await CreditCardEscrow.deploy(
        owner,
          escrow.address,
          owner.address, 
          100,
          owner.address,
          100
      );
      beacon = await Beacon.deploy(owner);
      referral = await Referral.deploy(owner);
      pay = await Pay.deploy(owner);
      cards = await Cards.deploy(owner, 1250, "Cards", "CARD");
      rare = await RarePack.deploy(
        owner,
        beacon.address,
        cards.address,
        rarePackSKU, 
        referral.address,
        cc.address,
        pay.address
      );
      await pay.setSellerApproval(rare.address, [rarePackSKU], true);
      await pay.setSignerLimit(owner.address, 1000000000000000);
    });

    async function purchasePacks(quantity: number) {
      let order = { quantity: quantity, sku: rarePackSKU, user: owner.address, totalPrice: cost * quantity, currency: Currency.USDCents };
      let params = { escrowFor: 0, nonce: 0, value: cost * quantity };
      let payment = await getSignedPayment(owner, pay.address, rare.address, order, params);
      await rare.purchase(quantity, payment, ZERO_EX)
    }

    it('should purchase one pack with USD', async () => {
      await purchasePacks(1);
    });

    it('should purchase five packs with USD', async () => {
      await purchasePacks(5);
    });

    it('should purchase 100 packs with USD', async () => {
      await purchasePacks(100);
    });
  
  });

  describe('createCards', () => {

    let beacon: Beacon;
    let referral: Referral;
    let pay: Pay;

    let escrow: Escrow;
    let cc: CreditCardEscrow;
    let rarePackSKU = keccak256('0x00');
    let cards: Cards;

    let rare: RarePack;
    let cost = 249;

    beforeEach(async() => {
      escrow = await Escrow.deploy(owner);
      cc = await CreditCardEscrow.deploy(
        owner, 
        escrow.address, owner.address, 100, owner.address, 100
      );
      beacon = await Beacon.deploy(owner);
      referral = await Referral.deploy(owner);
      pay = await Pay.deploy(owner);
      cards = await Cards.deploy(owner, 1250, "Cards", "CARD");
      rare = await RarePack.deploy(
        owner,
        beacon.address, cards.address, rarePackSKU, 
        referral.address, cc.address, pay.address
      );
      await pay.setSellerApproval(rare.address, [rarePackSKU], true);
      await pay.setSignerLimit(owner.address, 1000000000000000);
      await cards.startSeason("S1", 1, 10000);
      await cards.addFactory(rare.address, 1);
    });

    async function purchaseAndCallback(quantity: number, escrowFor: number) {
      let order = { quantity: quantity, sku: rarePackSKU, user: owner.address, totalPrice: cost * quantity, currency: Currency.USDCents };
      let params = { escrowFor: escrowFor, nonce: 0, value: cost * quantity };
      let payment = await getSignedPayment(owner, pay.address, rare.address, order, params);
      let tx = await rare.purchase(quantity, payment, ZERO_EX);
      let receipt = await tx.wait();
      await beacon.callback(receipt.blockNumber);
    }

    async function createCardsTrackGas(id: number, description: string) {
      let tx = await rare.createCards(id);
      let receipt = await tx.wait();
      console.log(description, receipt.gasUsed.toNumber());
    }

    it('should create cards from 1 pack', async () => {
      await purchaseAndCallback(1, 100);
      await rare.createCards(0);
    });

    it('should create cards from 5 packs', async () => {
      await purchaseAndCallback(5, 100);
      await rare.createCards(0);
    });

    it('should create cards from 1 packs with no escrow', async () => {
      await purchaseAndCallback(1, 0);
      await createCardsTrackGas(0, "1 pack no escrow");
    });

    it('should create cards from 6 packs with no escrow', async () => {
      await purchaseAndCallback(6, 0);
      await createCardsTrackGas(0, "6 packs no escrow");
    });
  
  });

});