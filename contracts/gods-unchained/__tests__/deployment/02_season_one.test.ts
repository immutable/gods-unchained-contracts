import 'jest';

import {
  Cards,
  Beacon,
  PurchaseProcessor,
  Escrow,
  S1Vendor,
  Raffle,
  S1Sale,
  Referral,
  EpicPack,
  RarePack,
  ShinyPack,
  LegendaryPack,
  CreditCardEscrow,
  Pack,
} from '../../src/contracts';

import { Wallet, ethers } from 'ethers';
import { ContractReceipt } from 'ethers/contract';
import {
  getSignedPayment,
  Currency,
  Payment,
  ETHUSDMockOracle,
  getETHPayment,
} from '@imtbl/platform';
import { Blockchain } from '@imtbl/test-utils';

import {
  getAddressBook,
  GU_S1_EPIC_PACK_SKU,
  GU_S1_RARE_PACK_SKU,
  GU_S1_LEGENDARY_PACK_SKU,
  GU_S1_SHINY_PACK_SKU,
} from '@imtbl/addresses';
import { asyncForEach, parseLogs } from '@imtbl/utils';

const config = require('dotenv').config({ path: '../../.env' }).parsed;
const provider = new ethers.providers.JsonRpcProvider(config.RPC_ENDPOINT);
const blockchain = new Blockchain();

const wallet: Wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);

const addressBook = getAddressBook(config.DEPLOYMENT_NETWORK_ID, config.DEPLOYMENT_ENVIRONMENT);

describe('02_season_one', () => {
  let nonce: number = 0;

  let beacon: Beacon;
  let processor: PurchaseProcessor;
  let escrow: Escrow;
  let cards: Cards;
  let s1Vendor: S1Vendor;
  let s1Raffle: Raffle;
  let s1Sale: S1Sale;
  let s1Referral: Referral;
  let epicPack: EpicPack;
  let rarePack: RarePack;
  let shinyPack: ShinyPack;
  let legendaryPack: LegendaryPack;
  let oracle: ETHUSDMockOracle;

  let epicCost: number;
  let rareCost: number;
  let legendaryCost: number;
  let shinyCost: number;

  let epicPayment: Payment;
  let rarePayment: Payment;
  let legendaryPayment: Payment;
  let shinyPayment: Payment;

  const defaultQuantity = 1;

  beforeAll(async () => {
    beacon = await Beacon.at(wallet, addressBook.platform.beaconAddress);
    processor = await PurchaseProcessor.at(wallet, addressBook.platform.processorAddress);
    escrow = await Escrow.at(wallet, addressBook.platform.escrowAddress);
    cards = await Cards.at(wallet, addressBook.godsUnchained.cardsAddress);
    s1Vendor = await S1Vendor.at(wallet, addressBook.godsUnchained.seasonOne.vendorAddress);
    s1Raffle = await Raffle.at(wallet, addressBook.godsUnchained.seasonOne.raffleAddress);
    s1Sale = await S1Sale.at(wallet, addressBook.godsUnchained.seasonOne.saleAddress);
    s1Referral = await Referral.at(wallet, addressBook.godsUnchained.seasonOne.referralAddress);
    epicPack = await EpicPack.at(wallet, addressBook.godsUnchained.seasonOne.epicPackAddress);
    rarePack = await RarePack.at(wallet, addressBook.godsUnchained.seasonOne.rarePackAddress);
    shinyPack = await ShinyPack.at(wallet, addressBook.godsUnchained.seasonOne.shinyPackAddress);
    oracle = await ETHUSDMockOracle.at(wallet, addressBook.platform.ethUSDMockOracleAddress);
    legendaryPack = await LegendaryPack.at(
      wallet,
      addressBook.godsUnchained.seasonOne.legendaryPackAddress,
    );

    epicCost = (await epicPack.price()).toNumber();
    rareCost = (await rarePack.price()).toNumber();
    legendaryCost = (await legendaryPack.price()).toNumber();
    shinyCost = (await shinyPack.price()).toNumber();
  });

  describe('using credit card', () => {
    beforeAll(async () => {
      epicPayment = await returnPaymentObject(
        defaultQuantity,
        epicPack.address,
        GU_S1_EPIC_PACK_SKU,
        epicCost,
      );

      rarePayment = await returnPaymentObject(
        defaultQuantity,
        rarePack.address,
        GU_S1_RARE_PACK_SKU,
        rareCost,
      );

      legendaryPayment = await returnPaymentObject(
        defaultQuantity,
        legendaryPack.address,
        GU_S1_LEGENDARY_PACK_SKU,
        legendaryCost,
      );

      shinyPayment = await returnPaymentObject(
        defaultQuantity,
        shinyPack.address,
        GU_S1_SHINY_PACK_SKU,
        shinyCost,
      );
    });

    beforeEach(async () => {
      await blockchain.resetAsync();
      await blockchain.saveSnapshotAsync();
    });

    afterEach(async () => {
      await blockchain.revertAsync();
    });

    it('should be able to call the purchase function on the epic pack contract', async () => {
      await epicPack.purchase(defaultQuantity, epicPayment, ethers.constants.AddressZero);
    });

    it('should be able to call the purchase function on the rare pack contract', async () => {
      await rarePack.purchase(defaultQuantity, rarePayment, ethers.constants.AddressZero);
    });

    it('should be able to call the purchase function on the legendary pack contract', async () => {
      await legendaryPack.purchase(defaultQuantity, legendaryPayment, ethers.constants.AddressZero);
    });

    it('should be able to call the purchase function on the shiny pack contract', async () => {
      await shinyPack.purchase(defaultQuantity, shinyPayment, ethers.constants.AddressZero);
    });

    it('should be able to call the purchase function on S1 sale for all products', async () => {
      const limit = await processor.signerLimits(wallet.address);
      const tx = await s1Sale.purchaseFor(
        wallet.address,
        [
          { quantity: defaultQuantity, payment: epicPayment, vendor: epicPack.address },
          { quantity: defaultQuantity, payment: rarePayment, vendor: rarePack.address },
          { quantity: defaultQuantity, payment: legendaryPayment, vendor: legendaryPack.address },
          { quantity: defaultQuantity, payment: shinyPayment, vendor: shinyPack.address },
        ],
        ethers.constants.AddressZero,
      );
      const receipt = await tx.wait();
      const escrowLogs = parseLogs(receipt.logs, EpicPack.ABI);

      let receipts: ContractReceipt[];
      receipts = [];

      await asyncForEach(escrowLogs, async (log) => {
        if (log.address === epicPack.address) {
          const receipt = await (await epicPack.mint(log.values.commitmentID)).wait();
          receipts.push(receipt);
        }
        if (log.address === legendaryPack.address) {
          const receipt = await (await legendaryPack.mint(log.values.commitmentID)).wait();
          receipts.push(receipt);
        }
        if (log.address === rarePack.address) {
          const receipt = await (await rarePack.mint(log.values.commitmentID)).wait();
          receipts.push(receipt);
        }
        if (log.address === shinyPack.address) {
          const receipt = await (await shinyPack.mint(log.values.commitmentID)).wait();
          receipts.push(receipt);
        }
      });

      receipts.forEach((receipt) => {
        const rangeMintedLogs = parseLogs(receipt.logs, Pack.ABI);
        const escrowLogs = parseLogs(receipt.logs, Escrow.ABI);
      });

      const supply = await cards.totalSupply();
      expect(supply.toNumber()).toBe(20);
    });
  });

  describe.only('using ETH', () => {
    beforeEach(async () => {
      await blockchain.resetAsync();
      await blockchain.saveSnapshotAsync();
    });

    afterEach(async () => {
      await blockchain.revertAsync();
    });

    it('should be able to purchase an epic pack', async () => {
      const epicEth = await oracle.convert(1, 0, epicCost);
      const shinyEth = await oracle.convert(1, 0, shinyCost);
      const legendaryEth = await oracle.convert(1, 0, legendaryCost);
      const rareEth = await oracle.convert(1, 0, rareCost);

      await s1Sale.purchase(
        [{ quantity: defaultQuantity, vendor: epicPack.address, payment: getETHPayment() }],
        ethers.constants.AddressZero,
        { value: epicEth },
      );

      await s1Sale.purchase(
        [{ quantity: defaultQuantity, vendor: shinyPack.address, payment: getETHPayment() }],
        ethers.constants.AddressZero,
        { value: shinyEth },
      );

      await s1Sale.purchase(
        [{ quantity: defaultQuantity, vendor: rarePack.address, payment: getETHPayment() }],
        ethers.constants.AddressZero,
        { value: rareEth },
      );

      await s1Sale.purchase(
        [{ quantity: defaultQuantity, vendor: legendaryPack.address, payment: getETHPayment() }],
        ethers.constants.AddressZero,
        { value: legendaryEth },
      );
    });
  });

  async function returnPaymentObject(
    quantity: number,
    packAddress: string,
    sku: string,
    cost: number,
  ) {
    const order = {
      quantity,
      sku,
      recipient: wallet.address,
      totalPrice: cost * quantity,
      currency: Currency.USDCents,
    };

    const params = { nonce, escrowFor: 360, value: cost * quantity };
    nonce = nonce + 1;
    const payment = await getSignedPayment(wallet, processor.address, packAddress, order, params);

    return payment;
  }
});
