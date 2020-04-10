import 'jest';

import { Blockchain, generatedWallets } from '@imtbl/test-utils';
import { Referral } from '../../../src/contracts';
import { Wallet, ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

describe('Referral', () => {

  const [ownerWallet] = generatedWallets(provider);

  beforeEach(async () => {
    await blockchain.resetAsync();
    await blockchain.saveSnapshotAsync();
  });

  afterEach(async () => {
    await blockchain.revertAsync();
  });

  describe('#referral', () => {

    let referral: Referral;

    beforeEach(async () => {
      referral = await Referral.deploy(ownerWallet);
    });

    async function expectSplit(total: number, toVendor: number, toReferrer: number) {
        let split = await referral.getSplit(ownerWallet.address, total, ownerWallet.address);
        expect(split.toVendor.toNumber()).toBe(toVendor);
        expect(split.toReferrer.toNumber()).toBe(toReferrer);
    }

    it('should split one dollar', async () => {
      await expectSplit(100, 90, 10);
    });

    it('should split ten dollars', async () => {
        await expectSplit(1000, 900, 100);
    });

    it('should split $9.99', async () => {
        await expectSplit(999, 899, 100);
    });

    it('should split fifty cents', async () => {
        await expectSplit(50, 45, 5);
    });

    it('should split sixteen cents', async () => {
        await expectSplit(16, 14, 2);
    });

    it('should split fifteen cents', async () => {
        await expectSplit(15, 14, 1);
    });

    it('should split six cents', async () => {
        await expectSplit(6, 5, 1);
    });

    it('should split five cents', async () => {
        await expectSplit(5, 5, 0);
    });

    it('should split one cent', async () => {
        await expectSplit(1, 1, 0);
    });

  });
});