import { Address } from '@imtbl/common-types';
import { GenericAsset } from './../../src/contracts';
import 'jest';

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
      genericAsset = await GenericAsset.deploy(ownerWallet, 'GU: Asset', 'GU');
    });

    async function subject() {
      const contract = GenericAsset.at(callerWallet, genericAsset.address);
      await contract.setMinterStatus(callerMinter, callerStatus);
    }

    it('should not be able set minters as an unauthorised user', async () => {
      callerWallet = userWallet;
      await expectRevert(subject());
    });

    it('should be able to set minters as the owner', async () => {
      await subject();
      const minterStatus = await genericAsset.approvedMinters(minterWallet.address);
      expect(minterStatus).toBeTruthy();
    });
    it('should be able to remove minters as the owner', async () => {
      callerStatus = false;
      await subject();
      const minterStatus = await genericAsset.approvedMinters(minterWallet.address);
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
      genericAsset = await GenericAsset.deploy(ownerWallet, 'GU: Asset', 'GU');
    });

    async function subject() {
      const contract = GenericAsset.at(callerWallet, genericAsset.address);
      await contract.setTradabilityStatus(callerStatus);
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
      callerWallet = userWallet;
      await subject();
      const tradingStatus = await genericAsset.isTradable();
      expect(tradingStatus).toBeTruthy();
    });
  });
});
