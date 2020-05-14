import { Wallet, ethers } from 'ethers';
import { DeploymentStage } from '@imtbl/deployment-utils';
import { asyncForEach } from '@imtbl/utils';
import { Escrow, CreditCardEscrow, Beacon, PurchaseProcessor, TestVendor } from '../src/contracts';
import { IM_PROCESSOR_LIMIT } from '@imtbl/addresses';

export class CoreStage implements DeploymentStage {
  private wallet: Wallet;
  private networkId: number;

  constructor(privateKey: string, rpcUrl: string, networkId: number) {
    this.wallet = new ethers.Wallet(privateKey, new ethers.providers.JsonRpcProvider(rpcUrl));
    this.networkId = networkId;
  }

  async deploy(
    findInstance: (name: string) => Promise<string>,
    onDeployment: (name: string, address: string, dependency: boolean) => void,
    transferOwnership: (addresses: string[]) => void,
  ) {
    await this.wallet.getTransactionCount();

    const firstSigner = await findInstance('IM_PROCESSOR_FIRST_SIGNER');

    if (firstSigner.length == 0 || !firstSigner) {
      throw '*** Must set IM_PROCESSOR_FIRST_SIGNER in order to deploy ***';
    }

    const ESCROW_DESTROYER = await findInstance('IM_ESCROW_DESTROYER');
    const DESTRUCTION_DELAY = parseInt(await findInstance('IM_ESCROW_DESTRUCTION_DELAY'));
    const ESCROW_CUSTODIAN = await findInstance('IM_ESCROW_CUSTODIAN');
    const ESCROW_RELEASE_DELAY = parseInt(await findInstance('IM_ESCROW_RELEASE_DELAY'));

    if (ESCROW_DESTROYER.length === 0 || ESCROW_CUSTODIAN.length === 0) {
      throw '*** Must have IM_ESCROW dependency values set ***';
    }

    const beacon = (await findInstance('IM_Beacon')) || (await this.deployBeacon());
    await onDeployment('IM_Beacon', beacon, false);

    const processor = (await findInstance('IM_Processor')) || (await this.deployProcessor());
    await onDeployment('IM_Processor', processor, false);

    const testVendor =
      (await findInstance('IM_TestVendor')) || (await this.deploySimpleVendor(processor));
    await onDeployment('IM_TestVendor', testVendor, false);

    const escrow = (await findInstance('IM_Escrow')) || (await this.deployEscrow());
    await onDeployment('IM_Escrow', escrow, false);

    const creditCardEscrow =
      (await findInstance('IM_Escrow_CreditCard')) ||
      (await this.deployCreditCardEscrow(
        escrow,
        ESCROW_DESTROYER,
        DESTRUCTION_DELAY,
        ESCROW_CUSTODIAN,
        ESCROW_RELEASE_DELAY,
      ));
    await onDeployment('IM_Escrow_CreditCard', creditCardEscrow, false);

    await this.setPaymentProcessorSigner(processor, firstSigner);
  }

  async deployBeacon(): Promise<string> {
    console.log('** Deploying Beacon **');
    await this.wallet.getTransactionCount();
    const unsignedTx = await Beacon.getDeployTransaction(this.wallet);
    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const signedTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await signedTx.wait();
    return receipt.contractAddress;
  }

  async deployProcessor(): Promise<string> {
    console.log('** Deploying PurchaseProcessor **');
    await this.wallet.getTransactionCount();
    const unsignedTx = await PurchaseProcessor.getDeployTransaction(
      this.wallet,
      this.wallet.address,
    );
    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const signedTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await signedTx.wait();
    return receipt.contractAddress;
  }

  async deploySimpleVendor(processor: string): Promise<string> {
    console.log('** Deploying TestVendor **');
    await this.wallet.getTransactionCount();
    const unsignedTx = await TestVendor.getDeployTransaction(this.wallet, processor);
    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const signedTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await signedTx.wait();
    return receipt.contractAddress;
  }

  async deployEscrow(): Promise<string> {
    console.log('** Deploying Escrow **');
    await this.wallet.getTransactionCount();
    const unsignedTx = await Escrow.getDeployTransaction(this.wallet);
    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const signedTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await signedTx.wait();
    return receipt.contractAddress;
  }

  async deployCreditCardEscrow(
    escrow: string,
    destroyer: string,
    destructionDelay: number,
    custodian: string,
    custodianDelay: number,
  ): Promise<string> {
    console.log('** Deploying CreditCardEscrow **');
    await this.wallet.getTransactionCount();
    const unsignedTx = await CreditCardEscrow.getDeployTransaction(
      this.wallet,
      escrow,
      destroyer,
      destructionDelay,
      custodian,
      custodianDelay,
    );

    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const signedTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await signedTx.wait();
    return receipt.contractAddress;
  }

  async setPaymentProcessorSigner(processor: string, signer: string) {
    console.log('*** Setting payment processor signer *** ');
    await this.wallet.getTransactionCount();
    const contract = await PurchaseProcessor.at(this.wallet, processor);
    if ((await contract.signerLimits(signer)).total.toNumber() === 0) {
      console.log(`${signer} | $${IM_PROCESSOR_LIMIT / 100} LIMIT`);
      await contract.setSignerLimit(signer, IM_PROCESSOR_LIMIT);
    }
  }
}
