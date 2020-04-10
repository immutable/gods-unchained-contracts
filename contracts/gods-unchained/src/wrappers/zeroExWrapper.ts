import { ethers, Wallet } from 'ethers';

import {
  assetDataUtils,
  generatePseudoRandomSalt,
  signatureUtils,
  orderHashUtils,
  Order,
} from '@0x/order-utils';

import * as ethUtil from 'ethereumjs-util';

import { ERC721 } from '../contracts';
import { BigNumberish, bigNumberify, Arrayish } from 'ethers/utils';
import { BigNumber } from '@0x/utils';

export type EthersOrder = {
  exchangeAddress: string;
  makerAddress: string;
  takerAddress: string;
  senderAddress: string;
  feeRecipientAddress: string;
  expirationTimeSeconds: BigNumberish;
  salt: BigNumberish;
  takerAssetAmount: BigNumberish;
  makerAssetAmount: BigNumberish;
  makerAssetData: string;
  takerAssetData: string;
  makerFee: BigNumberish;
  takerFee: BigNumberish;
};

export type SignedOrder = {
  order: EthersOrder;
  takerAssetAmount: BigNumberish;
  signature: string;
};

export class ZeroExWrapper {
  private wallet: Wallet;

  constructor(wallet: Wallet) {
    this.wallet = wallet;
  }

  async makeOrder(
    tokenId: number,
    price: number,
    cardsAddress: string,
    zeroExExchangeAddress: string,
    zeroExERC721ProxyAddress: string,
    wethAddress: string,
  ): Promise<SignedOrder> {
    const erc721Contract = ERC721.at(this.wallet, cardsAddress);
    const isApproved = await erc721Contract.functions.isApprovedForAll(
      this.wallet.address,
      zeroExERC721ProxyAddress,
    );

    if (!isApproved) {
      throw 'ERC721 approval not set!';
    }

    const makerAssetData = assetDataUtils.encodeERC721AssetData(
      cardsAddress,
      new BigNumber(tokenId),
    );

    const takerAssetData = assetDataUtils.encodeERC20AssetData(wethAddress);

    const order: Order = {
      exchangeAddress: zeroExExchangeAddress,
      makerAddress: this.wallet.address,
      takerAddress: ethers.constants.AddressZero,
      senderAddress: ethers.constants.AddressZero,
      feeRecipientAddress: ethers.constants.AddressZero,
      expirationTimeSeconds: new BigNumber(Date.now()).plus(60 * 60 * 24 * 365),
      salt: generatePseudoRandomSalt(),
      takerAssetAmount: new BigNumber(10).pow(18).multipliedBy(price),
      makerAssetAmount: new BigNumber(1),
      makerAssetData: makerAssetData,
      takerAssetData: takerAssetData,
      makerFee: new BigNumber(0),
      takerFee: new BigNumber(0),
    };

    const signature = await this.signMessageAsync(order);
    const ethersOrder = this.convert0xOrderToEthersOrder(order);

    return {
      order: ethersOrder,
      takerAssetAmount: ethersOrder.takerAssetAmount,
      signature: signature,
    } as SignedOrder;
  }

  async signMessageAsync(order: Order) {
    const sig = await this.wallet.signMessage(orderHashUtils.getOrderHashBuffer(order));
    const rpcSig = ethUtil.fromRpcSig(sig);

    const signedBytes = Buffer.concat([
      ethUtil.toBuffer(rpcSig.v),
      rpcSig.r,
      rpcSig.s,
      ethUtil.toBuffer(0x03),
    ]);

    return `0x${Buffer.from(signedBytes).toString('hex')}`;
  }

  async giveApproval(cardsAddress: string, zeroExERC721ProxyAddress: string) {
    const erc721Contract = ERC721.at(this.wallet, cardsAddress);
    return await erc721Contract.functions.setApprovalForAll(zeroExERC721ProxyAddress, true);
  }

  convert0xOrderToEthersOrder(order: Order): EthersOrder {
    return {
      exchangeAddress: order.exchangeAddress,
      makerAddress: order.makerAddress,
      takerAddress: order.takerAddress,
      senderAddress: order.senderAddress,
      feeRecipientAddress: order.feeRecipientAddress,
      expirationTimeSeconds: bigNumberify(order.expirationTimeSeconds.toString()),
      salt: bigNumberify(order.salt.toString()),
      takerAssetAmount: bigNumberify(order.takerAssetAmount.toString()),
      makerAssetAmount: bigNumberify(order.makerAssetAmount.toString()),
      makerAssetData: order.makerAssetData,
      takerAssetData: order.takerAssetData,
      makerFee: bigNumberify(order.makerFee.toString()),
      takerFee: bigNumberify(order.takerFee.toString()),
    };
  }

  convertEthersOrderTo0xOrder(order: EthersOrder): Order {
    return {
      exchangeAddress: order.exchangeAddress,
      makerAddress: order.makerAddress,
      takerAddress: order.takerAddress,
      senderAddress: order.senderAddress,
      feeRecipientAddress: order.feeRecipientAddress,
      expirationTimeSeconds: new BigNumber(order.expirationTimeSeconds.toString()),
      salt: new BigNumber(order.salt.toString()),
      takerAssetAmount: new BigNumber(order.takerAssetAmount.toString()),
      makerAssetAmount: new BigNumber(order.makerAssetAmount.toString()),
      makerAssetData: order.makerAssetData,
      takerAssetData: order.takerAssetData,
      makerFee: new BigNumber(order.makerFee.toString()),
      takerFee: new BigNumber(order.takerFee.toString()),
    };
  }
}
