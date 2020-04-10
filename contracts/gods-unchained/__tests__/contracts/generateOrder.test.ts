import 'jest';

import { CardsWrapper } from '../../src/wrappers';
import { IExchange } from '../../src/contracts';
import { DeploymentEnvironment, DeploymentNetwork } from '@imtbl/common-types';

import { ZeroExWrapper } from '../../src/wrappers/zeroExWrapper';
import { ethers } from 'ethers';
import { generatedWallets } from '@imtbl/test-utils';
import { getAddressBook } from '@imtbl/addresses';
import { orderHashUtils } from '@0x/order-utils';

const provider = new ethers.providers.JsonRpcProvider();

describe('Order Generator', () => {
  const [makerWallet, takerWallet] = generatedWallets(provider);
  const addressBook = getAddressBook(DeploymentNetwork.TestRPC, DeploymentEnvironment.Development);

  const zeroExWrapper = new ZeroExWrapper(makerWallet);
  const cardsWrapper = new CardsWrapper(makerWallet);

  it('should be able to generate an order', async () => {
    const cards = await cardsWrapper.deployTest(makerWallet.address);
    const ids = await cardsWrapper.mint(makerWallet.address, 1, 1);

    await zeroExWrapper.giveApproval(cards.address, addressBook.zeroExERC721ProxyAddress);

    const newOrder = await zeroExWrapper.makeOrder(
      ids[0],
      0.01,
      cards.address,
      addressBook.zeroExExchangeAddress,
      addressBook.zeroExERC721ProxyAddress,
      addressBook.wethAddress,
    );

    const exchange = IExchange.at(makerWallet, addressBook.zeroExExchangeAddress);

    const isValidSignature = await exchange.isValidSignature(
      orderHashUtils.getOrderHashBuffer(zeroExWrapper.convertEthersOrderTo0xOrder(newOrder.order)),
      makerWallet.address,
      newOrder.signature,
    );

    expect(isValidSignature).toBeTruthy();
  });
});
