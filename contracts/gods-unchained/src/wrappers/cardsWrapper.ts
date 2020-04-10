import { asyncForEach, parseLogs } from '@imtbl/utils';

import { Address } from '@imtbl/common-types';
import { Fusing, OpenMinter, PromoFactory, Cards } from '../contracts';
import { Wallet } from 'ethers';

type Season = {
  name: string;
  low: number;
  high: number;
};

type Factory = {
  minter: Address;
  season: number;
};

export class CardsWrapper {
  private wallet: Wallet;

  public instance: Cards;

  constructor(wallet: Wallet, instance?: Cards) {
    this.wallet = wallet;
    this.instance = instance;
  }

  async deployTest(minter: string): Promise<Cards> {
    return await this.deploy(
      100,
      [
        {
          name: 'Test',
          low: 1,
          high: 100,
        },
      ],
      [
        {
          minter: minter,
          season: 1,
        },
      ],
    );
  }

  async deploy(
    batchSize: number,
    seasons: Season[] = [],
    factories: Factory[] = [],
  ): Promise<Cards> {
    const unsignedTx = Cards.getDeployTransaction(
      this.wallet,
      batchSize,
      'Cards',
      'CARD',
    );

    unsignedTx.nonce = await this.wallet.getTransactionCount();

    const signedTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await signedTx.wait();
    this.instance = Cards.at(this.wallet, receipt.contractAddress);

    await this.addSeasons(seasons);
    await this.addFactories(factories);

    return this.instance;
  }

  async addSeasons(seasons: Season[]) {
    await asyncForEach(seasons, async (season) => {
      if (season <= 0) {
        throw 'Season must be greater than 0';
      }

      const tx = await this.instance.functions.startSeason(season.name, season.low, season.high);
      await tx.wait();
    });
  }

  async addFactories(factories: Factory[]) {
    await asyncForEach(factories, async (factory) => {
      const tx = await this.instance.functions.addFactory(factory.minter, factory.season);
      await tx.wait();
    });
  }

  async mint(to: Address, proto: number, quality: number, quantity: number = 1): Promise<number[]> {
    const protos = [];
    const qualities = [];

    for (let i = 0; i < quantity; i++) {
      protos.push(proto);
      qualities.push(quality);
    }

    const tx = await this.instance.functions.mintCards(to, protos, qualities);
    const receipt = await tx.wait();
    const logs = parseLogs(receipt.logs, Cards.ABI);

    const results = logs
      .filter((item) => item.name === 'CardsMinted')
      .map((item) => {
        let ids = [];
        for (
          let i = item.values.start;
          i < parseInt(item.values.start) + item.values.protos.length;
          i++
        ) {
          ids.push(i);
        }
        return ids;
      });

    return Array.prototype.concat.apply([], results);
  }

  async deployOpenMinter(cards: string): Promise<OpenMinter> {
    const unsignedTx = await OpenMinter.getDeployTransaction(this.wallet, cards);
    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const signedTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await signedTx.wait();
    return OpenMinter.at(this.wallet, receipt.contractAddress);
  }

  async deployFusing(cards: string): Promise<Fusing> {
    const unsignedTx = Fusing.getDeployTransaction(this.wallet, cards);
    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const signedTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await signedTx.wait();
    return Fusing.at(this.wallet, receipt.contractAddress);
  }


  async deployPromoFactory(
    cards: string,
    minProto: number,
    maxProto: number,
  ): Promise<PromoFactory> {
    const unsignedTx = PromoFactory.getDeployTransaction(this.wallet, cards);
    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const signedTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await signedTx.wait();
    return PromoFactory.at(this.wallet, receipt.contractAddress);
  }

  async unlockTrading(seasons: number[]): Promise<boolean> {
    try {
      await asyncForEach(seasons, async (season) => {
        const tx = await this.instance.functions.unlockTrading(season);
        await tx.wait();
      });
      return true;
    } catch {
      return false;
    }
  }
}
