import { Blockchain, expectRevert, Ganache, generatedWallets } from '@imtbl/test-utils';
import { ethers, Wallet } from 'ethers';
import { keccak256 } from 'ethers/utils';
import 'jest';
import { PurchaseProcessor } from '../../src/contracts';

const provider = new Ganache(Ganache.DefaultOptions);
const blockchain = new Blockchain(provider);
ethers.errors.setLogLevel('error');

describe('PurchaseProcessor', () => {
  const [ownerWallet, userWallet, otherWallet] = generatedWallets(provider);

  beforeEach(async () => {
    await blockchain.resetAsync();
    await blockchain.saveSnapshotAsync();
  });

  afterEach(async () => {
    await blockchain.revertAsync();
  });

  describe('#constructor', () => {
    it('should be able to deploy the processor contract', async () => {
      const processor = await PurchaseProcessor.deploy(userWallet, userWallet.address);
    });
  });

  describe('#setSignerLimit', () => {
    let processor: PurchaseProcessor;

    beforeEach(async () => {
      processor = await PurchaseProcessor.deploy(userWallet, userWallet.address);
    });

    async function setSignerLimit(sender: Wallet, signer: string, value: number) {
      const p = PurchaseProcessor.at(sender, processor.address);
      await p.setSignerLimit(signer, value);
    }

    it('should not be able to set signer limit as owner', async () => {
      await expectRevert(setSignerLimit(otherWallet, userWallet.address, 100));
    });

    it('should be able to set signer limit as owner', async () => {
      await setSignerLimit(userWallet, userWallet.address, 100);

      let signers = await processor.getCurrentSigners();
      expect(signers.length).toBe(1);

      await setSignerLimit(userWallet, userWallet.address, 0);

      signers = await processor.getCurrentSigners();
      expect(signers.length).toBe(0);
    });
  });

  describe('#setSellerApproval', () => {
    let processor: PurchaseProcessor;
    const sku = keccak256('0x00');

    beforeEach(async () => {
      processor = await PurchaseProcessor.deploy(userWallet, userWallet.address);
    });

    async function setSellerApproval(sender: Wallet, seller: string, shouldApprove: boolean) {
      const p = PurchaseProcessor.at(sender, processor.address);
      await p.setSellerApproval(seller, [sku], shouldApprove);
    }

    it('should not be able to set seller approval as non-owner', async () => {
      await expectRevert(setSellerApproval(otherWallet, userWallet.address, true));
      await expectRevert(setSellerApproval(otherWallet, userWallet.address, false));
    });

    it('should be able to set seller approval as owner', async () => {
      await setSellerApproval(userWallet, userWallet.address, true);
      await setSellerApproval(userWallet, userWallet.address, false);
    });
  });

  describe('#setOracle', () => {
    let processorAddress: string;

    beforeEach(async () => {
      const processor = await PurchaseProcessor.deploy(ownerWallet, userWallet.address);
      processorAddress = processor.address;
    });

    async function setOracle(sender: Wallet, address: string) {
      const processor = await PurchaseProcessor.at(sender, processorAddress);
      return await processor.setOracle(address);
    }

    it('should not be able to set as a non-owner', async () => {
      await expectRevert(setOracle(userWallet, ethers.constants.AddressZero));
    });

    it('should be able to set as an owner', async () => {
      await setOracle(ownerWallet, ethers.constants.AddressZero);
    });
  });
});
