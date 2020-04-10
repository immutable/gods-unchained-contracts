import 'jest';

import { Beacon, Consumer } from '../../src/contracts';

import { Blockchain, expectRevert } from '@imtbl/test-utils';
import { ethers } from 'ethers';
import { BigNumber, BigNumberish } from 'ethers/utils';

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

jest.setTimeout(10000);

function parseLogs(abi: string, logs: ethers.providers.Log[]): any[] {
  const iface = new ethers.utils.Interface(abi);
  return logs
    .map((log) => iface.parseLog(log))
    .map((item) => {
      return {
        name: item.name,
        signature: item.signature,
        values: item.values,
      };
    });
}

describe('Beacon', () => {

  beforeEach(async () => {
    await blockchain.resetAsync();
    await blockchain.saveSnapshotAsync();
  });

  afterEach(async () => {
    await blockchain.revertAsync();
  });

  describe('#constructor', () => {
    it('should be able to deploy the beacon contract', async () => {
      const beacon = await Beacon.deploy(provider.getSigner());
    });
  });

  describe('#commit', () => {

    let beacon: Beacon;
    let consumer: Consumer;

    beforeEach(async() => {
      beacon = await Beacon.deploy(provider.getSigner());
      consumer = await Consumer.deploy(provider.getSigner());
    })

    async function commit(offset: BigNumberish) {
      let tx = await beacon.commit(offset);
      let receipt = await tx.wait();
      const parsed = parseLogs(Beacon.ABI, receipt.logs);
      expect(parsed.length).toBe(1);
      expect(parsed[0].name).toBe('Commit');
      expect(parsed[0].values.commitBlock.toNumber()).toBe(receipt.blockNumber + Number(offset));
      let committed = await beacon.commitRequested(receipt.blockNumber);
      expect(committed).toBeTruthy();
    }

    it ('should not be able to force an overflow', async () => {
      const MAX_UINT = new BigNumber("0x" + 'F'.repeat(64));
      await expectRevert(commit(MAX_UINT));
    });

    it('should be able to make a simple commit', async () => {
      await commit(0);
    });

  });

  describe('#callback', () => {

    let beacon: Beacon;
    let consumer: Consumer;

    beforeEach(async() => {
      beacon = await Beacon.deploy(provider.getSigner());
      consumer = await Consumer.deploy(provider.getSigner());
    });

    async function callback(offset: number, wait: number) {
      let tx = await beacon.commit(offset);
      let receipt = await tx.wait();
      await blockchain.waitBlocksAsync(wait);
      let commitBlock = offset + receipt.blockNumber;
      tx = await beacon.callback(commitBlock);
      receipt = await tx.wait();
      const parsed = parseLogs(Beacon.ABI, receipt.logs);
      expect(parsed.length).toBe(1);
      expect(parsed[0].name).toBe('Callback');
      expect(parsed[0].values.commitBlock.toNumber()).toBe(commitBlock);
      expect(parsed[0].values.seed).toBeDefined();
    }

    it('should not be able to callback before block reached', async () => {
      await expectRevert(callback(10, 0));
    });

    it('should not be able to callback without a commit', async () => {
      await expectRevert(beacon.callback(0));
    });

    it('should not be able to callback on the same block', async () => {
      await expectRevert(consumer.sameBlockCallback(beacon.address));
    });

    it('should not be able to callback multiple times', async () => {
      await expectRevert(consumer.multiCallback(beacon.address, 0, 2));
    });

    it('should not be able to callback after 256 blocks', async () => {
      await expectRevert(callback(0, 256));
    });

    it('should not be able to callback after 250 blocks', async () => {
      await callback(0, 250);
    });

    it('should be able to make a successful callback', async () => {
      await callback(0, 1);
    });

  });

  describe('#recommit', () => {

    let beacon: Beacon;
    let consumer: Consumer;

    beforeEach(async() => {
      beacon = await Beacon.deploy(provider.getSigner());
      consumer = await Consumer.deploy(provider.getSigner());
    });

    it('should be able to make a successful recommit', async () => {
      let receipt = await beacon.commit(0);
      await blockchain.waitBlocksAsync(256);
      await beacon.recommit(receipt.blockNumber, 0);
    });

    it('should not be able to recommit inside first 256 blocks', async () => {
        let receipt = await beacon.commit(0);
        await expectRevert(beacon.recommit(receipt.blockNumber, 0));
    });

    it('should not be able to recommit uncommited block', async () => {
      let committed = await beacon.commitRequested(0);
      expect(committed).toBeFalsy();
      await expectRevert(beacon.recommit(0, 0));
    });

    it('should be able to recommit twice', async () => {
        let receipt = await beacon.commit(0);
        await blockchain.waitBlocksAsync(256);
        await beacon.recommit(receipt.blockNumber, 0);
        await blockchain.waitBlocksAsync(256);
        await beacon.recommit(receipt.blockNumber, 0);
    });

    it('should not be able to recommit twice too quickly', async () => {
        let receipt = await beacon.commit(0);
        await blockchain.waitBlocksAsync(256);
        await beacon.recommit(receipt.blockNumber, 0);
        await expectRevert(beacon.recommit(receipt.blockNumber, 0));
    });

    it('should be able to make a successful callback after a recommit', async () => {
      let tx = await beacon.commit(0);
      let receipt = await tx.wait();
      await blockchain.waitBlocksAsync(256);
      tx = await beacon.recommit(receipt.blockNumber, 0);
      receipt = await tx.wait();
      let committed = await beacon.commitRequested(receipt.blockNumber);
      expect(committed).toBeTruthy();
      await beacon.callback(receipt.blockNumber)
    });

  });

  describe('#randomness', () => {

    let beacon: Beacon;
    let consumer: Consumer;

    beforeEach(async() => {
      beacon = await Beacon.deploy(provider.getSigner());
      consumer = await Consumer.deploy(provider.getSigner());
    });

    it('should not be able to get randomness without a commit', async () => {
      await expectRevert(beacon.randomness(0));
    });

    it('should not be able to get randomness on the same block', async () => {
      await expectRevert(consumer.sameBlockRandomness(beacon.address));
    });

    it('should be able to get randomness after recommit', async () => {
      let tx = await beacon.commit(0);
      let receipt = await tx.wait();
      await blockchain.waitBlocksAsync(256);
      tx = await beacon.recommit(receipt.blockNumber, 0);
      receipt = await tx.wait();
      await blockchain.waitBlocksAsync(1);
      await beacon.randomness(receipt.blockNumber);
    });

    it('should be able to get randomness after callback', async () => {
      let tx = await beacon.commit(0);
      let receipt = await tx.wait();
      await blockchain.waitBlocksAsync(1);
      await beacon.callback(receipt.blockNumber);
      await beacon.randomness(receipt.blockNumber);
    });

    it('should be able to get randomness without callback', async () => {
      let tx = await beacon.commit(0);
      let receipt = await tx.wait();
      await blockchain.waitBlocksAsync(1);
      await beacon.randomness(receipt.blockNumber);
    });

  });

});