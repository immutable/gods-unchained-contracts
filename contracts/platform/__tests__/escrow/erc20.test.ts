import 'jest';

import { Escrow, TestERC20Token, TestChest, MaliciousChest } from '../../src/contracts';

import { Blockchain, expectRevert, generatedWallets } from '@imtbl/test-utils';
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider();
const blockchain = new Blockchain();

const ZERO_EX = '0x0000000000000000000000000000000000000000';

describe('ERC20Escrow', () => {

  const [user, other] = generatedWallets(provider);

  beforeEach(async () => {
    await blockchain.resetAsync();
    await blockchain.saveSnapshotAsync();
  });

  afterEach(async () => {
    await blockchain.revertAsync();
  });

  async function checkBalance(erc20: TestERC20Token, address: string, expected: number) {
    let balance = await erc20.balanceOf(address);
    expect(balance.toNumber()).toBe(expected);
  }

  describe('#constructor', () => {
    it('should be able to deploy the escrow contract', async () => {
      const escrow = await Escrow.deploy(user);
    });
  });

  describe('#escrow', () => {

    let escrow: Escrow;
    let erc20: TestERC20Token;

    beforeEach(async() => {
        escrow = await Escrow.deploy(user);
        erc20 = await TestERC20Token.deploy(user);
    })

    it('should be able able to escrow', async () => {
        await erc20.mint(user.address, 1000);
        await checkBalance(erc20, user.address, 1000);
        await erc20.approve(escrow.address, 1000);
        await escrow.escrow({
            player: user.address,
            releaser: user.address,
            asset: erc20.address,
            balance: 1000,
            lowTokenID: 0,
            highTokenID: 0,
            tokenIDs: []
        }, user.address);
        escrow.on('Escrowed', () => {

        })
    });

    it('should only remove correct amount', async () => {
        await erc20.mint(user.address, 1000);
        await erc20.approve(escrow.address, 1000);
        await escrow.escrow({
            player: user.address,
            releaser: user.address,
            asset: erc20.address,
            balance: 100,
            lowTokenID: 0,
            highTokenID: 0,
            tokenIDs: []
        }, user.address);
        let balance = await erc20.balanceOf(user.address);
        expect(balance.toNumber()).toBe(900);
    });

    it('should not be able to escrow without a releaser', async () => {
      await erc20.mint(user.address, 1000);
      await erc20.approve(escrow.address, 1000);
      await expectRevert(escrow.escrow({
          player: user.address,
          releaser: ZERO_EX,
          asset: erc20.address,
          balance: 100,
          lowTokenID: 0,
          highTokenID: 0,
          tokenIDs: []
      }, user.address));
    });

    it('should not be able to escrow with an insufficient balance', async () => {
        await erc20.mint(user.address, 100);
        await erc20.approve(escrow.address, 1000);
        await expectRevert(escrow.escrow({
            player: user.address,
            releaser: user.address,
            asset: erc20.address,
            balance: 1000,
            lowTokenID: 0,
            highTokenID: 0,
            tokenIDs: []
        }, user.address));
    });

  });

  describe('#release', () => {

    let escrow: Escrow;
    let erc20: TestERC20Token;

    beforeEach(async() => {
      escrow = await Escrow.deploy(user);
      erc20 = await TestERC20Token.deploy(user);
    })

    it('should be able to release as the releaser', async () => {
      await erc20.mint(user.address, 1000);
      await erc20.approve(escrow.address, 1000);
      await escrow.escrow({
          player: user.address,
          releaser: user.address,
          asset: erc20.address,
          balance: 1000,
          lowTokenID: 0,
          highTokenID: 0,
          tokenIDs: []
      }, user.address);
      await escrow.release(0, user.address);
    });

    it('should not be able to release without being the releaser', async () => {
      await erc20.mint(user.address, 1000);
      await erc20.approve(escrow.address, 1000);
      await escrow.escrow({
          player: user.address,
          releaser: other.address,
          asset: erc20.address,
          balance: 1000,
          lowTokenID: 0,
          highTokenID: 0,
          tokenIDs: []
      }, user.address);
      await expectRevert(escrow.release(0, user.address));
    });

    it('should release correctly', async () => {
      await erc20.mint(user.address, 1000);
      await checkBalance(erc20, user.address, 1000);
      await checkBalance(erc20, escrow.address, 0);
      await erc20.approve(escrow.address, 1000);
      await escrow.escrow({
          player: user.address,
          releaser: user.address,
          asset: erc20.address,
          balance: 1000,
          lowTokenID: 0,
          highTokenID: 0,
          tokenIDs: []
      }, user.address);
      await checkBalance(erc20, user.address, 0);
      await checkBalance(erc20, escrow.address, 1000);
      await escrow.release(0, user.address);
      await checkBalance(erc20, user.address, 1000);
      await checkBalance(erc20, escrow.address, 0);
    });

  });

  describe('#callbackEscrow', () => {

    let escrow: Escrow;
    let erc20: TestERC20Token;
    let malicious: MaliciousChest;
    let chest: TestChest;

    beforeEach(async() => {
      escrow = await Escrow.deploy(user);
      erc20 = await TestERC20Token.deploy(user);
      malicious = await MaliciousChest.deploy(user, escrow.address, erc20.address);
      chest = await TestChest.deploy(user, escrow.address, erc20.address);
    });

    it('should be able to create a vault using a callback', async () => {
      await chest.purchase(5);
    });

    it('should not be able to create a push escrow vault in the callback', async () => {
      await expectRevert(malicious.maliciousPush(5));
    });

    it('should not be able to create a pull escrow vault in the callback', async () => {
      await expectRevert(malicious.maliciousPull(5));
    });

  });


});