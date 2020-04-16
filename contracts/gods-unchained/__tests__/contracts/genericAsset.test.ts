import { Address } from '@imtbl/common-types';
import { GenericAssetFactory } from './../../src/generated/GenericAssetFactory';
import { GenericAsset } from './../../src/generated/GenericAsset';
import 'jest';

jest.setTimeout(30000);

import { Blockchain, expectRevert, generatedWallets } from '@imtbl/test-utils';
import { Wallet, ethers } from 'ethers';

import { parseLogs } from '@imtbl/utils';

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

describe('Generic Asset', () => {
  const [ownerWallet, minterWallet, userWallet, userWallet2, userWallet3] = generatedWallets(
    provider,
  );

  beforeEach(async () => {
    await blockchain.resetAsync();
    await blockchain.saveSnapshotAsync();
  });

  afterEach(async () => {
    await blockchain.revertAsync();
  });

  describe('#setMinterStatus', () => {
    let genericAsset: GenericAsset;
    let callerWallet: Wallet;
    let callerMinter: Address;
    let callerStatus: boolean;

    beforeEach(async () => {
      callerMinter = minterWallet.address;
      callerWallet = ownerWallet;
      callerStatus = true;
      genericAsset = await new GenericAssetFactory(ownerWallet).deploy('GU: Asset', 'GU');
    });

    async function subject() {
      const contract = await new GenericAssetFactory(callerWallet).attach(genericAsset.address);
      await contract.functions.setMinterStatus(callerMinter, callerStatus);
    }

    it('should not be able set minters as an unauthorised user', async () => {
      callerWallet = userWallet;
      await expectRevert(subject());
    });

    it('should be able to set minters as the owner', async () => {
      await subject();
      const minterStatus = await genericAsset.functions.approvedMinters(minterWallet.address);
      expect(minterStatus).toBeTruthy();
    });
    it('should be able to remove minters as the owner', async () => {
      callerStatus = false;
      await subject();
      const minterStatus = await genericAsset.functions.approvedMinters(minterWallet.address);
      expect(minterStatus).toBeFalsy();
    });
  });

  describe('#setTradabilityStatus', () => {
    let genericAsset: GenericAsset;
    let callerWallet: Wallet;
    let callerStatus: boolean;

    beforeEach(async () => {
      callerWallet = ownerWallet;
      callerStatus = true;
      genericAsset = await new GenericAssetFactory(ownerWallet).deploy('GU: Asset', 'GU');
    });

    async function subject() {
      const contract = await new GenericAssetFactory(callerWallet).attach(genericAsset.address);
      const tx = await contract.functions.setTradabilityStatus(callerStatus);
      return tx.wait();
    }

    it('should not be able to set trading status an unauthorised user', async () => {
      callerWallet = userWallet;
      await expectRevert(subject());
    });

    it('should not be able to set trading status as the minter', async () => {
      callerWallet = minterWallet;
      await expectRevert(subject());
    });

    it('should be able to set trading status as the owner', async () => {
      callerWallet = ownerWallet;
      await subject();
      const tradingStatus = await genericAsset.functions.isTradable();
      expect(tradingStatus).toBeTruthy();
    });
  });
});
