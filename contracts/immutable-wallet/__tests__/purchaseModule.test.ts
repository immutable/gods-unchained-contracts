import 'jest';

jest.setTimeout(30000);

import {
  CardsWrapper,
  Forwarder,
  ForwarderFactory,
  SignedOrder,
  ZeroExWrapper,
} from '@imtbl/gods-unchained';
import { DeploymentEnvironment, DeploymentNetwork } from '@imtbl/common-types';
import { DeploymentWrapper, PurchaseModule, PurchaseModuleFactory } from '../src';

import { ethers } from 'ethers';
import { generatedWallets } from '@imtbl/test-utils';
import { getAddressBook } from '@imtbl/addresses';

const provider = new ethers.providers.JsonRpcProvider();

describe('Wallet Factory', () => {
  const [deployerWallet, makerWallet, takerWallet, relayerWallet] = generatedWallets(provider);
  const addressBook = getAddressBook(DeploymentNetwork.TestRPC, DeploymentEnvironment.Development);

  let cardsAddress: string;
  let walletAddress: string;
  let purchaseModuleAddress: string;

  let cardIds: number[];
  let signedOrder: SignedOrder;

  let encodedData: string;
  let signedData: string;

  // async function deployForwarder(): Promise<Forwarder> {
  //   const unsignedTx = await new ForwarderFactory(deployerWallet).getDeployTransaction(
  //     addressBook.zeroExExchangeAddress,
  //     addressBook.zeroExERC20ProxyAddress,
  //     addressBook.wethAddress,
  //   );
  //   const signedTx = await deployerWallet.sendTransaction(unsignedTx);
  //   const receipt = await signedTx.wait();
  //   return await new ForwarderFactory(deployerWallet).attach(receipt.contractAddress);
  // }

  // it('should be able to deploy the cards contract and mint cards', async () => {
  //   const cardsWrapper = new CardsWrapper(deployerWallet);

  //   const cards = await cardsWrapper.deployTest(deployerWallet.address);

  //   cardsAddress = cards.address;
  //   cardIds = await cardsWrapper.mint(deployerWallet.address, 1, 1);
  //   await cardsWrapper.unlockTrading([1]);
  // });

  // it('should be able to generate orders', async () => {
  //   const zeroExWrapper = new ZeroExWrapper(makerWallet);
  //   await zeroExWrapper.giveApproval(cardsAddress, addressBook.zeroExERC721ProxyAddress);
  //   signedOrder = await zeroExWrapper.makeOrder(
  //     cardIds[0],
  //     0.01,
  //     cardsAddress,
  //     addressBook.zeroExExchangeAddress,
  //     addressBook.zeroExERC721ProxyAddress,
  //     addressBook.wethAddress,
  //   );
  // });

  // it('should be able to deploy a smart contract wallet', async () => {
  //   const deploymentWrapper = new DeploymentWrapper(deployerWallet);

  //   const forwarder = await deployForwarder();
  //   const purchaseModule = await deploymentWrapper.deployPurchaseModule(forwarder.address);
  //   const factory = await deploymentWrapper.deployCore(0, [
  //     { name: 'PurchaseModule', address: purchaseModule.address },
  //   ]);

  //   walletAddress = await deploymentWrapper.deployWallet(factory.address, takerWallet.address, [
  //     purchaseModule.address,
  //   ]);

  //   purchaseModuleAddress = purchaseModule.address;
  // });

  // it('should be able to encode the purchasing of an order and sign off', async () => {
  //   const purchaseModule = new PurchaseModuleFactory(takerWallet).attach(purchaseModuleAddress);

  //   const data = purchaseModule.interface.functions.fillOrders.encode([
  //     walletAddress,
  //     [signedOrder.order],
  //     [signedOrder.takerAssetAmount],
  //     [signedOrder.signature],
  //   ]);

  //   const sigHash = await purchaseModule.functions.getSignHash(
  //     purchaseModule.address,
  //     walletAddress,
  //     0,
  //     data,
  //     '0',
  //     '2000000',
  //     '1000000',
  //   );

  //   encodedData = ethers.utils.solidityKeccak256(
  //     ['address', 'address', 'uint', 'bytes', 'uint', 'uint', 'uint'],
  //     [
  //       purchaseModule.address,
  //       walletAddress, // COULD BE WRONG
  //       0,
  //       data,
  //       '0',
  //       '2000000',
  //       '1000000',
  //     ],
  //   );

  //   signedData = await takerWallet.signMessage(encodedData);

  //   const isValidData = await purchaseModule.functions.validateData(walletAddress, data);
  //   console.log(`isValidData: ${isValidData}`);
  //   expect(isValidData).toBeTruthy();

  //   const isValid = await purchaseModule.functions.validateSignatures(
  //     walletAddress,
  //     data,
  //     '0',
  //     signedData,
  //     '',
  //     '1000000',
  //     sigHash,
  //   );

  //   console.log(isValid);

  //   // console.log(`Encoded data: ${encodedData}`);
  //   // console.log(`Returned Signature data: ${returnedSignatureHash}`);
  //   // console.log(`Signed data: ${signedData}`);
  //   // console.log(`Hashed Encoded data: ${ethers.utils.keccak256(encodedData)}`);

  //   // expect(returnedSignatureHash).toBe(signedData);

  //   expect(signedData).not.toBeNull();
  // });

  // it('should be able to execute the signed order as a relayer', async () => {
  //   /* tslint:disable-next-line:max-line-length */
  //   // const purchaseModule = new PurchaseModuleFactory(relayerWallet).attach(purchaseModuleAddress);
  //   // const tx = await purchaseModule.functions.relay(
  //   //   walletAddress,
  //   //   encodedData,
  //   //   0,
  //   //   signedData,
  //   //   '2000000',
  //   //   '1000000',
  //   // );
  //   // const receipt = await tx.wait();
  //   // console.log(receipt);
  // });

  it('should run the test', async () => {});
});
