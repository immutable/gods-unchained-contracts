import { asyncForEach, parseLogs } from '@imtbl/utils';

import { Fusing, OpenMinter, PromoFactory, Cards } from '../contracts';
import { Wallet } from 'ethers';

type Season = {
  name: string;
  low: number;
  high: number;
};

type Factory = {
  minter: string;
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
    this.instance = await Cards.awaitDeployment(
      this.wallet,
      batchSize,
      'Cards',
      'CARD',
    );

    await this.addSeasons(seasons);
    await this.addFactories(factories);

    return this.instance;
  }

  async addSeasons(seasons: Season[]) {
    await asyncForEach(seasons, async (season) => {
      if (season <= 0) {
        throw 'Season must be greater than 0';
      }

      const tx = await this.instance.startSeason(season.name, season.low, season.high);
      await tx.wait();
    });
  }

  async addFactories(factories: Factory[]) {
    await asyncForEach(factories, async (factory) => {
      const tx = await this.instance.addFactory(factory.minter, factory.season);
      await tx.wait();
    });
  }

  async mint(to: string, proto: number, quality: number, quantity: number = 1): Promise<number[]> {
    const protos = [];
    const qualities = [];

    for (let i = 0; i < quantity; i++) {
      protos.push(proto);
      qualities.push(quality);
    }

    const tx = await this.instance.mintCards(to, protos, qualities);
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
    return OpenMinter.awaitDeployment(this.wallet, cards);
  }

  async deployFusing(cards: string): Promise<Fusing> {
    return Fusing.awaitDeployment(this.wallet, cards);
  }


  async deployPromoFactory(
    cards: string,
    minProto: number,
    maxProto: number,
  ): Promise<PromoFactory> {
    return PromoFactory.awaitDeployment(this.wallet, cards);
  }

  async unlockTrading(seasons: number[]): Promise<boolean> {
    try {
      await asyncForEach(seasons, async (season: number) => {
        const tx = await this.instance.unlockTrading(season);
        await tx.wait();
      });
      return true;
    } catch {
      return false;
    }
  }
}
