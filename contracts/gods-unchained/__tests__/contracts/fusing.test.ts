import 'jest';

import { Blockchain, expectRevert, generatedWallets } from '@imtbl/test-utils';
import { Cards, Fusing } from '../../src/contracts';
import { CardsWrapper } from '../../src/wrappers';
import { Wallet, ethers } from 'ethers';

import { ContractReceipt } from 'ethers/contract';
import { parseLogs } from '@imtbl/utils';

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

jest.setTimeout(10000);

describe('Fusing', () => {
  const [ownerWallet, minterWallet, userWallet, unauthorisedWallet] = generatedWallets(provider);

  beforeEach(async () => {
    await blockchain.resetAsync();
    await blockchain.saveSnapshotAsync();
  });

  afterEach(async () => {
    await blockchain.revertAsync();
  });

  describe('#constructor', () => {
    const cardsWrapper = new CardsWrapper(ownerWallet);

    it('should be able to deploy correctly', async () => {
      const cards = await cardsWrapper.deployTest(ownerWallet.address);
      const fusing = await Fusing.deploy(ownerWallet, cards.address);

      const returnedCardsAddress = await fusing.cards();
      expect(returnedCardsAddress).toBe(cards.address);

      const returnedOwnerAddress = await fusing.owner();
      expect(returnedOwnerAddress).toBe(ownerWallet.address);
    });
  });

  describe('#addMinter', () => {
    let cards: Cards;
    let fusingAddress: string;

    let callerWallet: Wallet;
    let callerMinterAddress: string;

    beforeEach(async () => {
      const cardsWrapper = new CardsWrapper(ownerWallet);
      cards = await cardsWrapper.deployTest(ownerWallet.address);

      const fusingContract = await Fusing.deploy(ownerWallet, cards.address);
      fusingAddress = fusingContract.address;

      await cards.addFactory(fusingAddress, 1);

      callerWallet = ownerWallet;
      callerMinterAddress = minterWallet.address;
    });

    async function subject(): Promise<ContractReceipt> {
      const fusing = Fusing.at(callerWallet, fusingAddress);
      const tx = await fusing.addMinter(callerMinterAddress);

      return await tx.wait();
    }

    it('should not be called by an unauthorised user', async () => {
      callerWallet = unauthorisedWallet;
      await expectRevert(subject());
    });

    it('should be able to add a minter with the event emitted', async () => {
      const receipt = await subject();
      const parsed = parseLogs(receipt.logs, Fusing.ABI);

      const returnedMinter = parsed[0].values.minter;
      expect(returnedMinter).toBe(minterWallet.address);
    });
  });

  describe('#removeMinter', () => {
    let cards: Cards;
    let fusingAddress: string;

    let callerWallet: Wallet;
    let callerMinterAddress: string;

    beforeEach(async () => {
      const cardsWrapper = new CardsWrapper(ownerWallet);
      cards = await cardsWrapper.deployTest(ownerWallet.address);

      const fusingContract = await Fusing.deploy(ownerWallet, cards.address);
      fusingAddress = fusingContract.address;

      await cards.addFactory(fusingAddress, 1);
      await fusingContract.addMinter(minterWallet.address);

      callerWallet = ownerWallet;
      callerMinterAddress = minterWallet.address;
    });

    async function subject(): Promise<ContractReceipt> {
      const fusing = Fusing.at(callerWallet, fusingAddress);
      const tx = await fusing.removeMinter(callerMinterAddress);

      return await tx.wait();
    }

    it('should not be called by an unauthorised user', async () => {
      callerWallet = unauthorisedWallet;
      await expectRevert(subject());
    });

    it('should not be able to remove itself as a minter', async () => {
      callerWallet = minterWallet;
      await expectRevert(subject());
    });

    it('should be able to remove a minter with the event emitted', async () => {
      const receipt = await subject();
      const parsed = parseLogs(receipt.logs, Fusing.ABI);

      const returnedMinter = parsed[0].values.minter;
      expect(returnedMinter).toBe(minterWallet.address);
    });
  });

  describe('#fuse', () => {
    let cards: Cards;
    let fusingAddress: string;

    let callerWallet: Wallet;
    let callerProto: number;
    let callerQuality: number;
    let callerDestination: string;
    let callerReferences: number[];

    beforeEach(async () => {
      const cardsWrapper = new CardsWrapper(ownerWallet);
      cards = await cardsWrapper.deployTest(ownerWallet.address);

      const fusingContract = await Fusing.deploy(ownerWallet, cards.address);
      fusingAddress = fusingContract.address;

      await cards.addFactory(fusingAddress, 1);
      await fusingContract.addMinter(minterWallet.address);

      callerWallet = minterWallet;
      callerProto = 1;
      callerQuality = 1;
      callerDestination = userWallet.address;
      callerReferences = [1, 2];
    });

    async function subject(): Promise<ContractReceipt> {
      const fusing = Fusing.at(callerWallet, fusingAddress);

      const tx = await fusing.fuse(
        callerProto,
        callerQuality,
        callerDestination,
        callerReferences,
      );

      return await tx.wait();
    }

    it('should not be able to be called by an unauthorised user', async () => {
      callerWallet = unauthorisedWallet;
      await expectRevert(subject());
    });

    it('should not be able to be called by the owner', async () => {
      callerWallet = ownerWallet;
      await expectRevert(subject());
    });

    it('should not be able to mint outside of the core season range', async () => {
      callerProto = 101;
      await expectRevert(subject());
    });

    it('should not be able to set the destination address to 0', async () => {
      callerDestination = ethers.constants.AddressZero;
      await expectRevert(subject());
    });

    it('should not be able to pass in no references', async () => {
      callerReferences = [];
      await expectRevert(subject());
    });

    it('should emit the event correctly', async () => {
      callerReferences = [3, 2, 1];
      const receipt = await subject();

      const parsed = parseLogs(receipt.logs, Fusing.ABI);
      console.log(parsed);
      const returnedOwner = parsed[0].values.owner;
      expect(returnedOwner).toBe(callerDestination);

      const returnedTokenAddress = parsed[0].values.tokenAddress;
      expect(returnedTokenAddress).toBe(cards.address);

      const returnedTokenId = parsed[0].values.tokenId;
      expect(returnedTokenId.toNumber()).toBe(0);

      const returnedLowestReference = parsed[0].values.lowestReference;
      expect(returnedLowestReference.toNumber()).toBe(1);

      const returnedReferences = parsed[0].values.references;
      expect(returnedReferences.length).toBe(3);
    });
  });
});
