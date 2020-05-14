import 'jest';

import { Blockchain, expectRevert, generatedWallets } from '@imtbl/test-utils';
import { ethers } from 'ethers';
import { BigNumber } from 'ethers/utils';
import { ETHUSDMockOracle } from '../../src/contracts/ETHUSDMockOracle';

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

describe('ETHUSDMockOracle', () => {
  const [ownerWallet, userWallet] = generatedWallets(provider);
  const base = new BigNumber(10).pow(16);

  let oracle: ETHUSDMockOracle;

  beforeAll(async () => {
    oracle = await ETHUSDMockOracle.deploy(ownerWallet);
  });

  describe('should be able to get the correct price at $1000', () => {
    beforeAll(async () => {
      await oracle.setPrice(new BigNumber(1000).mul(100).mul(base));
    });

    it('should return the correct US cents', async () => {
      const price = await oracle.convert(0, 1, 1);
      expect(price.toString()).toEqual('100000');
    });

    it('should return the correct wei amount', async () => {
      const price = await oracle.convert(1, 0, 1);
      expect(price).toEqual(new BigNumber(10).pow(13));
    });
  });

  describe('should be able to get the correct price at $200', () => {
    beforeAll(async () => {
      await oracle.setPrice(new BigNumber(200).mul(100).mul(base));
    });

    it('should return the correct US cents', async () => {
      const price = await oracle.convert(0, 1, 1);
      expect(price.toString()).toEqual('20000');
    });

    it('should return the correct wei amount', async () => {
      const price = await oracle.convert(1, 0, 1);
      expect(price).toEqual(new BigNumber(10).pow(13).mul(5));
    });
  });

  describe('should be able to get the correct price at $100', () => {
    beforeAll(async () => {
      await oracle.setPrice(new BigNumber(100).mul(100).mul(base));
    });

    it('should return the correct US cents', async () => {
      const price = await oracle.convert(0, 1, 1);
      expect(price.toString()).toEqual('10000');
    });

    it('should return the correct wei amount', async () => {
      const price = await oracle.convert(1, 0, 1);
      expect(price).toEqual(new BigNumber(10).pow(14));
    });
  });

  describe('should be able to get the correct price at $50', () => {
    beforeAll(async () => {
      await oracle.setPrice(new BigNumber(50).mul(100).mul(base));
    });

    it('should return the correct US cents', async () => {
      const price = await oracle.convert(0, 1, 1);
      expect(price.toString()).toEqual('5000');
    });

    it('should return the correct wei amount', async () => {
      const price = await oracle.convert(1, 0, 1);
      expect(price).toEqual(new BigNumber(10).pow(14).mul(2));
    });
  });

  describe('should be able to get the correct price at $50 @ 2 quantities', () => {
    beforeAll(async () => {
      await oracle.setPrice(new BigNumber(50).mul(100).mul(base));
    });

    it('should return the correct US cents', async () => {
      const price = await oracle.convert(0, 1, 2);
      expect(price.toString()).toEqual('10000');
    });

    it('should return the correct wei amount', async () => {
      const price = await oracle.convert(1, 0, 2);
      expect(price).toEqual(
        new BigNumber(10)
          .pow(14)
          .mul(2)
          .mul(2),
      );
    });
  });
});
