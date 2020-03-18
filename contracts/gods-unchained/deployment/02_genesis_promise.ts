import { Wallet, ethers } from 'ethers';

import { DeploymentStage } from '@imtbl/deployment-utils';
import { ForwarderFactory } from '../src/generated/ForwarderFactory';
import { GenesisBoardFactory, HydraTrinketFactory, RaffleItemFactory } from '../src';

export class GenesisPromiseStage implements DeploymentStage {
  private wallet: Wallet;

  constructor(privateKey: string, rpcUrl: string) {
    this.wallet = new ethers.Wallet(privateKey, new ethers.providers.JsonRpcProvider(rpcUrl));
  }

  async deploy(
    findInstance: (name: string) => Promise<string>,
    onDeployment: (name: string, address: string, dependency: boolean) => void,
    transferOwnership: (addresses: string[]) => void,
  ) {
    await this.wallet.getTransactionCount();

    const genesisBoard =
      (await findInstance('GU_GENESIS_BOARD')) || (await this.deployGenesisBoards());
    await onDeployment('GU_GENESIS_BOARD', genesisBoard, false);

    const hydraTrinket =
      (await findInstance('GU_HYDRA_TRINKET')) || (await this.deployHydraTrinket());
    await onDeployment('GU_HYDRA_TRINKET', hydraTrinket, false);

    const whiteStar =
      (await findInstance('GU_HYPERION_WHITE_STAR')) || (await this.deployHyperionWhiteStar());
    await onDeployment('GU_HYPERION_WHITE_STAR', whiteStar, false);

    const blackStar =
      (await findInstance('GU_HYPERION_BLACK_STAR')) || (await this.deployHyperionBlackStar());
    await onDeployment('GU_HYPERION_BLACK_STAR', blackStar, false);

    const atlasBelt = (await findInstance('GU_ATLAS_BELT')) || (await this.deployAtlasBelt());
    await onDeployment('GU_ATLAS_BELT', atlasBelt, false);

    const prometheanChain =
      (await findInstance('GU_PROMETHEAN_CHAIN')) || (await this.deployPrometheanChain());
    await onDeployment('GU_PROMETHEAN_CHAIN', prometheanChain, false);

    const royalCardBack =
      (await findInstance('GU_ROYAL_CARD_BACK')) || (await this.deployRoyalCardBack());
    await onDeployment('GU_ROYAL_CARD_BACK', royalCardBack, false);
  }

  async deployGenesisBoards() {
    const board = await new GenesisBoardFactory(this.wallet).deploy(
      'GU: Genesis Board',
      'GODS:BOARD',
    );
    return board.address;
  }

  async deployHydraTrinket() {
    const trinket = await new HydraTrinketFactory(this.wallet).deploy(
      'GU: Hydra Trinket',
      'GU:HYDRA',
    );
    return trinket.address;
  }

  async deployHyperionWhiteStar() {
    const whiteStar = await new RaffleItemFactory(this.wallet).deploy(
      'GU: Hyperion White Start',
      'GU:WHITESTAR',
    );
    return whiteStar.address;
  }

  async deployHyperionBlackStar() {
    const blackStar = await new RaffleItemFactory(this.wallet).deploy(
      'GU: Hyperion Black Start',
      'GU:BLACKSTAR',
    );
    return blackStar.address;
  }

  async deployAtlasBelt() {
    const atlasBelt = await new RaffleItemFactory(this.wallet).deploy(
      'GU: Atlas Belt',
      'GU:ATLASBELT',
    );
    return atlasBelt.address;
  }

  async deployPrometheanChain() {
    const chains = await new RaffleItemFactory(this.wallet).deploy(
      'GU: Promethean Chain',
      'GU:PROMETHEANCHAIN',
    );
    return chains.address;
  }

  async deployRoyalCardBack() {
    const royalCard = await new RaffleItemFactory(this.wallet).deploy(
      'GU: Royal Card Back',
      'GU:ROYALCARDBACK',
    );
    return royalCard.address;
  }
}
