import 'jest';

import { Pay } from '../../src/contracts';

import { Blockchain, expectRevert, generatedWallets } from '@imtbl/test-utils';
import { ethers, Wallet } from 'ethers';
import { keccak256 } from 'ethers/utils';

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

const ZERO_EX = '0x0000000000000000000000000000000000000000';

describe('Pay', () => {

  const [user, other] = generatedWallets(provider);

  beforeEach(async () => {
    await blockchain.resetAsync();
    await blockchain.saveSnapshotAsync();
  });

  afterEach(async () => {
    await blockchain.revertAsync();
  });


  describe('#constructor', () => {
    it('should be able to deploy the processor contract', async () => {
      const processor = await Pay.deploy(user);
    });
  });

  describe('#setSignerLimit', () => {

    let processor: Pay;

    beforeEach(async () => {
      processor = await Pay.deploy(user);
    });

    async function setSignerLimit(sender: Wallet, signer: string, value: number) {
      const p = Pay.at(sender, processor.address);
      await p.setSignerLimit(signer, value);
    }

    it('should not be able to set signer limit as owner', async () => {
      await expectRevert(setSignerLimit(other, user.address, 100));
    });

    it('should be able to set signer limit as owner', async () => {
      await setSignerLimit(user, user.address, 100);
    });

  });

  describe('#setSellerApproval', () => {

    let processor: Pay;
    let sku = keccak256('0x00');

    beforeEach(async () => {
        processor = await Pay.deploy(user);
    });

    async function setSellerApproval(sender: Wallet, seller: string, shouldApprove: boolean) {
        const p = Pay.at(sender, processor.address);
        await p.setSellerApproval(seller, [sku], shouldApprove);
    }


    it('should not be able to set seller approval as non-owner', async () => {
      await expectRevert(setSellerApproval(other, user.address, true));
      await expectRevert(setSellerApproval(other, user.address, false));
    });

    it('should be able to set seller approval as owner', async () => {
        await setSellerApproval(user, user.address, true);
        await setSellerApproval(user, user.address, false);
    });

  });

});