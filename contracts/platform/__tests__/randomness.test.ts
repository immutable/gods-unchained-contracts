import 'jest';

import { Beacon, BeaconFactory, Consumer, ConsumerFactory } from '../src/contracts';

import { Blockchain, expectRevert, generatedWallets } from '@imtbl/test-utils';
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

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
      const beacon = await new BeaconFactory(provider.getSigner()).deploy();
    });
  });

  describe('#commit', () => {

    let beacon: Beacon;
    let consumer: Consumer;

    beforeEach(async() => {
        beacon = await new BeaconFactory(provider.getSigner()).deploy();
        consumer = await new ConsumerFactory(provider.getSigner()).deploy();
    })

    it('should be able to able to make a simple commit', async () => {
      let receipt = await beacon.commit(0);
      let committed = await beacon.commitRequested(receipt.blockNumber);
      expect(committed).toBeTruthy();
    });

    it('should be able to able to make multiple commits on the same block', async () => {
        let receipt = await consumer.multiCommit(beacon.address, 5);
        let committed = await beacon.commitRequested(receipt.blockNumber);
        expect(committed).toBeTruthy();
    });

  });

  describe('#callback', () => {

    let beacon: Beacon;
    let consumer: Consumer;

    beforeEach(async() => {
        beacon = await new BeaconFactory(provider.getSigner()).deploy();
        consumer = await new ConsumerFactory(provider.getSigner()).deploy();
    });

    it('should be able to make a successful callback', async () => {
      let receipt = await beacon.commit(0);
      await blockchain.waitBlocksAsync(1);
      await beacon.callback(receipt.blockNumber);
    });

    it('should be able to get randomness after a callback', async () => {
        let receipt = await beacon.commit(0);
        await blockchain.waitBlocksAsync(1);
        await beacon.callback(receipt.blockNumber);
        let randomness = await beacon.randomness(receipt.blockNumber);
    });

  });

  describe('#recommit', () => {

    let beacon: Beacon;
    let consumer: Consumer;

    beforeEach(async() => {
        beacon = await new BeaconFactory(provider.getSigner()).deploy();
        consumer = await new ConsumerFactory(provider.getSigner()).deploy();
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

  });

});
