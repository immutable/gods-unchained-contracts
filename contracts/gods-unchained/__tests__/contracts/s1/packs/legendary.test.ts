import 'jest';

import { Blockchain, generatedWallets } from '@imtbl/test-utils';
import {
  Referral,
  LegendaryPack,
  Cards,
  Chest,
  Raffle
} from '../../../../src/contracts';
import { Wallet, ethers } from 'ethers';
import { keccak256 } from 'ethers/utils';
import { PurchaseProcessor, CreditCardEscrow, Escrow, Beacon, getSignedPayment, Currency } from '@imtbl/platform';
import { parseLogs } from '@imtbl/utils';
import { rares, legendaries, epics } from './protos';

jest.setTimeout(600000);

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

const ZERO_EX = '0x0000000000000000000000000000000000000000';

ethers.errors.setLogLevel('error');

describe('Pack', () => {

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
    let processor: PurchaseProcessor;

    let raffle: Raffle;

    let escrow: Escrow;
    let cc: CreditCardEscrow;
    const sku = keccak256('0x00');

    beforeAll(async() => {
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
      referral = await Referral.deploy(owner, 90, 10);
      processor = await PurchaseProcessor.deploy(owner, owner.address);
      raffle = await Raffle.deploy(owner);
    });

    it('should deploy rare pack', async () => {
      await LegendaryPack.deploy(
        owner,
        raffle.address,
        beacon.address, ZERO_EX, referral.address, sku,
        cc.address, processor.address
      );
    });

  });

  describe('purchase', () => {

    let beacon: Beacon;
    let referral: Referral;
    let processor: PurchaseProcessor;
    let raffle: Raffle;

    let escrow: Escrow;
    let cc: CreditCardEscrow;
    const legendaryPackSKU = keccak256('0x00');
    let cards: Cards;

    let legendary: LegendaryPack;
    const cost = 2499;

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
      referral = await Referral.deploy(owner, 90, 10);
      processor = await PurchaseProcessor.deploy(owner, owner.address);
      cards = await Cards.deploy(owner, 1250, 'Cards', 'CARD');
      raffle = await Raffle.deploy(owner);
      legendary = await LegendaryPack.deploy(
        owner,
        raffle.address,
        beacon.address, cards.address, referral.address, legendaryPackSKU,
        cc.address, processor.address
      );
      await processor.setSellerApproval(legendary.address, [legendaryPackSKU], true);
      await processor.setSignerLimit(owner.address, 1000000000000000);
    });

    async function purchasePacks(quantity: number) {
      const order = {
        quantity, sku: legendaryPackSKU, recipient: owner.address,
        totalPrice: cost * quantity, currency: Currency.USDCents
      };
      const params = { escrowFor: 0, nonce: 0, value: cost * quantity };
      const payment = await getSignedPayment(
         owner, processor.address, legendary.address, order, params
       );
      const tx = await legendary.purchase(quantity, payment, ZERO_EX);
      const receipt = await tx.wait();
      const parsed = parseLogs(receipt.logs, LegendaryPack.ABI);
      expect(parsed.length).toBe(1);
      expect(parsed[0].name).toBe('CommitmentRecorded');
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

  describe('mint', () => {

    let beacon: Beacon;
    let referral: Referral;
    let processor: PurchaseProcessor;
    let raffle: Raffle;

    let escrow: Escrow;
    let cc: CreditCardEscrow;
    const legendaryPackSKU = keccak256('0x00');
    let cards: Cards;

    let legendary: LegendaryPack;
    const cost = 2499;

    beforeEach(async() => {
      escrow = await Escrow.deploy(owner);
      cc = await CreditCardEscrow.deploy(
        owner,
        escrow.address, owner.address, 100, owner.address, 100
      );
      beacon = await Beacon.deploy(owner);
      referral = await Referral.deploy(owner, 90, 10);
      processor = await PurchaseProcessor.deploy(owner, owner.address);
      cards = await Cards.deploy(owner, 1250, 'Cards', 'CARD');
      raffle = await Raffle.deploy(owner);
      legendary = await LegendaryPack.deploy(
        owner,
        raffle.address,
        beacon.address, cards.address, referral.address, legendaryPackSKU,
        cc.address, processor.address
      );
      await processor.setSellerApproval(legendary.address, [legendaryPackSKU], true);
      await processor.setSignerLimit(owner.address, 1000000000000000);
      await cards.startSeason('S1', 1, 10000);
      await cards.addFactory(legendary.address, 1);
      await raffle.setMinterApproval(legendary.address, true);
    });

    async function purchase(quantity: number, escrowFor: number) {
      const order = {
        quantity, sku: legendaryPackSKU, recipient: owner.address,
        totalPrice: cost * quantity, currency: Currency.USDCents
      };
      const params = { escrowFor, nonce: 0, value: cost * quantity };
      const payment = await getSignedPayment(owner, processor.address, legendary.address, order, params);
      await legendary.purchase(quantity, payment, ZERO_EX);
    }

    async function mintTrackGas(id: number, description: string) {
      const commitment = await legendary.commitments(id);
      const tx = await legendary.mint(id);
      const receipt = await tx.wait();
      console.log(description, receipt.gasUsed.toNumber());
      // we only care about events from the core contract
      const logs = receipt.logs.filter(log => log.address === cards.address);
      const parsed = parseLogs(logs, Cards.ABI);
      // the last event will be the minted event
      const log = parsed[parsed.length - 1];
      expect(log.name).toBe('CardsMinted');
      const protos = log.values.protos;
      const packs = commitment.packQuantity.toNumber();
      expect(protos).toBeDefined();
      expect(protos.length).toBe(packs * 5);
      const rareOrBetter = protos.filter(p => {
        return rares.includes(p) || epics.includes(p) || legendaries.includes(p);
      }).length;
      const legendaryCount = protos.filter(p => legendaries.includes(p)).length;
      // must be at least one rare card in every pack
      expect(legendaryCount).toBeGreaterThanOrEqual(packs);
      expect(rareOrBetter).toBeGreaterThanOrEqual(packs * 2);
    }

    it('should create cards from 1 pack', async () => {
      await purchase(1, 100);
      await mintTrackGas(0, '1 pack escrow');
    });

    it('should create cards from 6 packs', async () => {
      await purchase(6, 100);
      await mintTrackGas(0, '6 pack escrow');
    });

    it('should create cards from 18 packs', async () => {
      await purchase(18, 100);
      await mintTrackGas(0, '18 packs escrow');
    });

    it('should create cards from 1 packs with no escrow', async () => {
      await purchase(1, 0);
      await mintTrackGas(0, '1 pack no escrow');
    });

    it('should create cards from 18 packs with no escrow', async () => {
      await purchase(18, 0);
      await mintTrackGas(0, '18 packs no escrow');
    });

  });

  describe('openChest', () => {

    let beacon: Beacon;
    let referral: Referral;
    let processor: PurchaseProcessor;
    let raffle: Raffle;

    let escrow: Escrow;
    let cc: CreditCardEscrow;
    const legendaryPackSKU = keccak256('0x00');
    const rareChestSKU = keccak256('0x01');
    let cards: Cards;
    let chest: Chest;
    const rareChestPrice = 100;

    let legendary: LegendaryPack;

    beforeEach(async() => {
      escrow = await Escrow.deploy(owner);
      cc = await CreditCardEscrow.deploy(
        owner,
        escrow.address, owner.address, 100, owner.address, 100
      );
      beacon = await Beacon.deploy(owner);
      referral = await Referral.deploy(owner, 90, 10);
      processor = await PurchaseProcessor.deploy(owner, owner.address);
      cards = await Cards.deploy(owner, 1250, 'Cards', 'CARD');
      raffle = await Raffle.deploy(owner);
      legendary = await LegendaryPack.deploy(
        owner,
        raffle.address,
        beacon.address, cards.address, referral.address, legendaryPackSKU,
        cc.address, processor.address
      );
      await raffle.setMinterApproval(legendary.address, true);
      chest = await Chest.deploy(
        owner,
        'GU: S1 Rare Chest',
        'GU:1:RC',
        legendary.address,
        0,
        referral.address,
        rareChestSKU,
        rareChestPrice,
        escrow.address,
        processor.address
      );
      await legendary.setChest(chest.address);
    });

    async function purchaseAndOpenChests(quantity: number) {
      await processor.setSellerApproval(chest.address, [rareChestSKU], true);
      const balance = await chest.balanceOf(owner.address);
      expect(balance.toNumber()).toBe(0);
      await processor.setSignerLimit(owner.address, 10000000000);
      await processor.setSellerApproval(chest.address, [rareChestSKU], true);
      const value = rareChestPrice * quantity;
      const order = {
        quantity, sku: rareChestSKU, recipient: owner.address,
        currency: Currency.USDCents, totalPrice: value
      };
      const params = { value, escrowFor: 0, nonce: 0 };
      const payment = await getSignedPayment(
         owner, processor.address, chest.address, order, params
       );
      await chest.purchase(quantity, payment, ZERO_EX);
      await chest.open(quantity);
      const purchase = await legendary.commitments(0);
      expect(purchase.packQuantity.toNumber()).toBe(quantity * 6);
    }

    it('should create a valid purchase from an opened chest', async () => {
      await purchaseAndOpenChests(1);
    });

    it('should create a valid purchase from 6 chests', async () => {
      await purchaseAndOpenChests(6);
    });

    it('should create cards from an opened chest', async () => {
      await purchaseAndOpenChests(1);
      await cards.startSeason('S1', 1, 10000);
      await cards.addFactory(legendary.address, 1);
      await legendary.mint(0);
    });

  });

});
