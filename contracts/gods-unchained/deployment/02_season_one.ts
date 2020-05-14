import { S1Vendor } from './../src/contracts/S1Vendor';
import { Wallet, ethers } from 'ethers';

import { DeploymentStage } from '@imtbl/deployment-utils';
import { asyncForEach } from '@imtbl/utils';
import {
  GU_S1_EPIC_PACK_SKU,
  GU_S1_RARE_PACK_SKU,
  GU_S1_SHINY_PACK_SKU,
  GU_S1_LEGENDARY_PACK_SKU,
} from '@imtbl/addresses';

import {
  Raffle,
  S1Sale,
  Referral,
  Pack,
  EpicPack,
  RarePack,
  ShinyPack,
  LegendaryPack,
  PurchaseProcessor,
  Cards,
} from '../src/contracts';

export class SeasonOneStage implements DeploymentStage {
  private wallet: Wallet;
  private networkId: number;

  constructor(privateKey: string, rpcUrl: string, networkId: number) {
    this.wallet = new ethers.Wallet(privateKey, new ethers.providers.JsonRpcProvider(rpcUrl));
    this.networkId = networkId;
  }

  async deploy(
    findInstance: (name: string) => Promise<string>,
    onDeployment: (name: string, address: string, dependency: boolean) => void,
    transferOwnership: (addresses: string[]) => void,
  ) {
    const processorAddress = await findInstance('IM_Processor');
    if (!processorAddress || processorAddress.length == 0) {
      throw '*** IM_Processor not deloyed! Run `yarn deploy --core` inside contracts/platform';
    }
    const s1Vendor =
      (await findInstance('GU_S1_Vendor')) || (await this.deployVendor(processorAddress));

    await onDeployment('GU_S1_Vendor', s1Vendor, false);

    const raffle = (await findInstance('GU_S1_Raffle')) || (await this.deployRaffle());
    await onDeployment('GU_S1_Raffle', raffle, false);

    const s1sale = (await findInstance('GU_S1_Sale')) || (await this.deploySale());
    await onDeployment('GU_S1_Sale', s1sale, false);

    const referral = (await findInstance('GU_S1_Referral')) || (await this.deployReferral());
    await onDeployment('GU_S1_Referral', referral, false);

    const beacon = await findInstance('IM_Beacon');
    const cards = await findInstance('GU_Cards');
    const escrow = await findInstance('IM_Escrow_CreditCard');
    const processor = await findInstance('IM_Processor');

    if (GU_S1_EPIC_PACK_SKU.length === 0) {
      throw '*** No Epic Pack SKU set! Cannot deploy EpicPack. ***';
    }
    const epicPack =
      (await findInstance('GU_S1_Epic_Pack')) ||
      (await this.deployEpicPack(
        raffle,
        beacon,
        cards,
        referral,
        GU_S1_EPIC_PACK_SKU,
        escrow,
        processor,
      ));
    await onDeployment('GU_S1_Epic_Pack', epicPack, false);

    if (GU_S1_RARE_PACK_SKU.length === 0) {
      throw '*** No Rare Pack SKU set! Cannot deploy RarePack. ***';
    }
    const rarePack =
      (await findInstance('GU_S1_Rare_Pack')) ||
      (await this.deployRarePack(
        raffle,
        beacon,
        cards,
        referral,
        GU_S1_RARE_PACK_SKU,
        escrow,
        processor,
      ));
    await onDeployment('GU_S1_Rare_Pack', rarePack, false);

    if (GU_S1_SHINY_PACK_SKU.length === 0) {
      throw '*** No Shiny Pack SKU set! Cannot deploy ShinyPack. ***';
    }
    const shinyPack =
      (await findInstance('GU_S1_Shiny_Pack')) ||
      (await this.deployEpicPack(
        raffle,
        beacon,
        cards,
        referral,
        GU_S1_SHINY_PACK_SKU,
        escrow,
        processor,
      ));
    await onDeployment('GU_S1_Shiny_Pack', shinyPack, false);

    if (GU_S1_LEGENDARY_PACK_SKU.length === 0) {
      throw '*** No Shiny Pack SKU set! Cannot deploy ShinyPack. ***';
    }
    const legendaryPack =
      (await findInstance('GU_S1_Legendary_Pack')) ||
      (await this.deployLegendaryPack(
        raffle,
        beacon,
        cards,
        referral,
        GU_S1_LEGENDARY_PACK_SKU,
        escrow,
        processor,
      ));
    await onDeployment('GU_S1_Legendary_Pack', legendaryPack, false);

    const packAddresses = [rarePack, shinyPack, legendaryPack, epicPack];

    await this.setupCardsContract(cards, 'Season One', 1000, 1500, packAddresses);

    await this.setApprovedRaffleMinters(raffle, packAddresses);

    await this.setApprovedProcessorSellers(processor, [
      { address: epicPack, sku: GU_S1_EPIC_PACK_SKU },
      { address: rarePack, sku: GU_S1_RARE_PACK_SKU },
      { address: shinyPack, sku: GU_S1_SHINY_PACK_SKU },
      { address: legendaryPack, sku: GU_S1_LEGENDARY_PACK_SKU },
    ]);
  }

  async deployVendor(processor: string): Promise<string> {
    console.log('** Deploying S1Vendor **');
    const contract = await S1Vendor.confirmDeployment(
      this.wallet,
      ethers.constants.AddressZero,
      ethers.constants.HashZero,
      1,
      ethers.constants.AddressZero,
      processor,
    );
    return contract.address;
  }

  async deployRaffle(): Promise<string> {
    console.log('** Deploying Raffle **');
    const unsignedTx = await Raffle.getDeployTransaction(this.wallet);
    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const signedTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await signedTx.wait();
    return receipt.contractAddress;
  }

  async deploySale(): Promise<string> {
    console.log('** Deploying S1Sale **');
    const unsignedTx = await S1Sale.getDeployTransaction(this.wallet);
    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const signedTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await signedTx.wait();
    return receipt.contractAddress;
  }

  async deployReferral(): Promise<string> {
    console.log('** Deploying Referral **');
    const unsignedTx = await Referral.getDeployTransaction(this.wallet, 90, 10);
    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const signedTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await signedTx.wait();
    return receipt.contractAddress;
  }

  async deployEpicPack(
    raffle: string,
    beacon: string,
    cards: string,
    referral: string,
    sku: string,
    escrow: string,
    processor: string,
  ): Promise<string> {
    console.log('** Deploying EpicPack **');
    const unsignedTx = await EpicPack.getDeployTransaction(
      this.wallet,
      raffle,
      beacon,
      cards,
      referral,
      sku,
      escrow,
      processor,
    );
    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const signedTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await signedTx.wait();
    return receipt.contractAddress;
  }

  async deployRarePack(
    raffle: string,
    beacon: string,
    cards: string,
    referral: string,
    sku: string,
    escrow: string,
    processor: string,
  ): Promise<string> {
    console.log('** Deploying RarePack **');
    const unsignedTx = await RarePack.getDeployTransaction(
      this.wallet,
      raffle,
      beacon,
      cards,
      referral,
      sku,
      escrow,
      processor,
    );
    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const signedTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await signedTx.wait();
    return receipt.contractAddress;
  }

  async deployShinyPack(
    raffle: string,
    beacon: string,
    cards: string,
    referral: string,
    sku: string,
    escrow: string,
    processor: string,
  ): Promise<string> {
    console.log('** Deploying ShinyPack **');
    const unsignedTx = await ShinyPack.getDeployTransaction(
      this.wallet,
      raffle,
      beacon,
      cards,
      referral,
      sku,
      escrow,
      processor,
    );
    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const signedTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await signedTx.wait();
    return receipt.contractAddress;
  }

  async deployLegendaryPack(
    raffle: string,
    beacon: string,
    cards: string,
    referral: string,
    sku: string,
    escrow: string,
    processor: string,
  ): Promise<string> {
    console.log('** Deploying LegendaryPack **');
    const unsignedTx = await LegendaryPack.getDeployTransaction(
      this.wallet,
      raffle,
      beacon,
      cards,
      referral,
      sku,
      escrow,
      processor,
    );
    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const signedTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await signedTx.wait();
    return receipt.contractAddress;
  }

  async setApprovedProcessorSellers(processor: string, items: { address: string; sku: string }[]) {
    console.log('** Adding approved processor sellers ** ');
    const contract = await PurchaseProcessor.at(this.wallet, processor);
    await asyncForEach(items, async (item) => {
      const isApproved = await contract.sellerApproved(item.sku, item.address);
      if (!isApproved) {
        console.log(`${item.address} | ${item.sku}`);
        await contract.setSellerApproval(item.address, [item.sku], true);
      }
    });
  }

  async setApprovedRaffleMinters(raffle: string, minters: string[]) {
    console.log('** Adding approved raffle minters ** ');
    const contract = await Raffle.at(this.wallet, raffle);
    await asyncForEach(minters, async (minter) => {
      const isApproved = await contract.isApprovedMinter(minter);
      if (!isApproved) {
        console.log(minter);
        await contract.setMinterApproval(minter, true);
      }
    });
  }

  async setupCardsContract(
    cards: string,
    name: string,
    low: number,
    high: number,
    approvedMinters: string[],
  ) {
    console.log(`** Adding a new GU Season and adding approved minters **`);
    const contract = Cards.at(this.wallet, cards);
    console.log(contract.address);
    const season = await (await contract.functions.seasons(3)).low;

    try {
      const exists = await contract.functions.seasons(4);
    } catch (e) {
      await contract.functions.startSeason(name, low, high);
    }

    await asyncForEach(approvedMinters, async (minterAddress) => {
      if ((await contract.functions.factoryApproved(minterAddress, 4)) != true) {
        console.log(`** Adding ${minterAddress} as an approved address **`);
        await contract.functions.addFactory(minterAddress, 4);
      }
    });
  }
}
