import { Address } from '@imtbl/common-types';
import { GenesisBoardFactory } from './../../src/generated/GenesisBoardFactory';
import { GenesisBoard } from './../../src/generated/GenesisBoard';

import 'jest';
jest.setTimeout(30000);

import { Blockchain, expectRevert, generatedWallets } from '@imtbl/test-utils';
import { Wallet, ethers } from 'ethers';

import { parseLogs } from '@imtbl/utils';

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

describe('Genesis Board', () => {
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

  describe('#mint', () => {
    let genesisBoard: GenesisBoard;
    let callerDestination: Address;
    let callerLevel: number;
    let callerWallet;

    beforeEach(async () => {
      genesisBoard = await new GenesisBoardFactory(ownerWallet).deploy(
        'GU: Board',
        'GU:GENESISBOARD',
      );
      await genesisBoard.setMinterStatus(minterWallet.address, true);
      callerDestination = userWallet.address;
      callerLevel = 1;
      callerWallet = minterWallet;
    });

    async function subject() {
      const contract = await new GenesisBoardFactory(callerWallet).attach(genesisBoard.address);
      const tx = await contract.mint(callerDestination, callerLevel);
      return tx.wait();
    }

    it('should not be able to mint as an unauthorised user', async () => {
      callerWallet = userWallet;
      await expectRevert(subject());
    });

    it('should be able to mint as a valid minter', async () => {
      await subject();
      const supply = await genesisBoard.functions.totalSupply();
      expect(supply.toNumber()).toBe(1);
    });
  });

  describe('#transferFrom', () => {
    let genesisBoard: GenesisBoard;
    let callerWallet;

    beforeEach(async () => {
      callerWallet = userWallet;

      genesisBoard = await new GenesisBoardFactory(ownerWallet).deploy(
        'GU: Board',
        'GU:GENESISBOARD',
      );
      const tx1 = await genesisBoard.setMinterStatus(minterWallet.address, true);
      await tx1.wait();

      const tx2 = await genesisBoard.mint(userWallet.address, 1);
      const receipt = await tx2.wait();

      const parsed = parseLogs(receipt.logs, new GenesisBoardFactory().interface.abi);
      console.log(parsed[1].values.tokenId.toNumber());
    });

    async function subject() {
      const contract = await new GenesisBoardFactory(callerWallet).attach(genesisBoard.address);
      const tx = await contract.functions.transferFrom(userWallet.address, ownerWallet.address, 1);
      return tx.wait();
    }

    it('should not be able to transfer if trading has not been unlocked', async () => {
      await expectRevert(subject());
    });

    it('should be able to trade if trading unlocked', async () => {
      const tx = await genesisBoard.functions.setTradabilityStatus(true);
      await tx.wait();

      await subject();
      const balance = await genesisBoard.functions.balanceOf(ownerWallet.address);
      expect(balance.toNumber()).toBe(1);
    });
  });
});
