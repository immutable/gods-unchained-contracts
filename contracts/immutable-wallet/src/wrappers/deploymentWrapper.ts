import { Wallet, ethers } from 'ethers';
import { Registry } from '../generated/Registry';
import { RegistryFactory } from '../generated/RegistryFactory';

import { asyncForEach, parseLogs } from '@imtbl/utils';
import { Factory } from '../generated/Factory';
import { ProxyFactory } from '../generated/ProxyFactory';
import { WalletFactory } from '../generated/WalletFactory';
import { Wallet as WalletImplementation } from '../generated/Wallet';
import { FactoryFactory } from '../generated/FactoryFactory';
import { LimitedModulesFactory } from '../generated/LimitedModulesFactory';
import { SimpleDelegateFactory } from '../generated/SimpleDelegateFactory';
import { MultiLimiterFactory } from '../generated/MultiLimiterFactory';
import { LimitedModules } from '../generated/LimitedModules';
import { SimpleDelegate } from '../generated/SimpleDelegate';
import { MultiLimiter } from '../generated/MultiLimiter';
import { PurchaseModule } from '../generated/PurchaseModule';
import { PurchaseModuleFactory } from '../generated/PurchaseModuleFactory';

type Module = {
  name: string;
  address: string;
};

export class DeploymentWrapper {
  private wallet: Wallet;

  constructor(wallet: Wallet) {
    this.wallet = wallet;
  }

  async deployRegistry(delay: number): Promise<Registry> {
    const factory = new RegistryFactory(this.wallet);
    const unsignedTx = await factory.getDeployTransaction(delay);
    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const deployTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await deployTx.wait();
    return await factory.attach(receipt.contractAddress || ''); // TODO: [AN >> KK] tsc rejected prior version of this file because contractAddress could be undefined.... Think about how to handle that case
  }

  async deployCore(delay: number = 0, modules: Module[]) {
    await this.wallet.getTransactionCount();

    const walletImplementation = await this.deployWalletImplementation();

    const registry = await this.deployRegistry(delay);
    await this.registerModules(registry, modules);

    const limitedModule = await this.deployLimitedModules(registry.address);
    const delegate = await this.deploySimpleDelegate();
    const limiter = await this.deployMultiLimiter();

    return await this.deployFactory(
      walletImplementation.address,
      limitedModule.address,
      delegate.address,
      limiter.address,
    );
  }

  async deployWallet(factory: string, user: string, modules: string[]): Promise<string> {
    await this.wallet.getTransactionCount();

    const salt = ethers.utils.solidityKeccak256(['string', 'address'], ['FACTORY_V1', user]);
    const x = await new FactoryFactory(this.wallet)
      .attach(factory)
      .functions.createProxyWallet(user, salt, modules, [], {
        gasLimit: 2000000,
      });
    const receipt = await x.wait();
    const parsed = parseLogs(receipt.logs, new FactoryFactory().interface.abi);
    return parsed[0].values.wallet;
  }

  async deployWalletImplementation(): Promise<WalletImplementation> {
    const unsignedTx = await new WalletFactory(this.wallet).getDeployTransaction();
    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const signedTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await signedTx.wait();
    return await new WalletFactory(this.wallet).attach(receipt.contractAddress);
  }

  async registerModules(registry: Registry, modules: Module[]) {
    await asyncForEach(modules, async (moduleObject) => {
      const tx = await registry.functions.register(
        moduleObject.address,
        ethers.utils.formatBytes32String(moduleObject.name),
      );

      await tx.wait();
    });
  }

  async deployFactory(
    walletImplementation: string,
    limitedModule: string,
    delegate: string,
    limiter: string,
  ): Promise<Factory> {
    const factoryFactory = new FactoryFactory(this.wallet);
    const unsignedTx = await factoryFactory.getDeployTransaction(limitedModule, delegate, limiter);

    const signedTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await signedTx.wait();

    return factoryFactory.attach(receipt.contractAddress);
  }

  async deployLimitedModules(registry: string): Promise<LimitedModules> {
    const factory = new LimitedModulesFactory(this.wallet);
    const unsignedTx = await factory.getDeployTransaction(registry);
    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const deployTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await deployTx.wait();
    return await factory.attach(receipt.contractAddress);
  }

  async deploySimpleDelegate(): Promise<SimpleDelegate> {
    const factory = new SimpleDelegateFactory(this.wallet);
    const unsignedTx = await factory.getDeployTransaction();
    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const deployTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await deployTx.wait();
    return await factory.attach(receipt.contractAddress);
  }

  async deployMultiLimiter(): Promise<MultiLimiter> {
    const factory = new MultiLimiterFactory(this.wallet);
    const unsignedTx = await factory.getDeployTransaction();
    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const deployTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await deployTx.wait();
    return await factory.attach(receipt.contractAddress);
  }

  async deployPurchaseModule(forwarder: string): Promise<PurchaseModule> {
    const factory = new PurchaseModuleFactory(this.wallet);
    const unsignedTx = await factory.getDeployTransaction(forwarder);
    unsignedTx.nonce = await this.wallet.getTransactionCount();
    const deployTx = await this.wallet.sendTransaction(unsignedTx);
    const receipt = await deployTx.wait();
    return await factory.attach(receipt.contractAddress);
  }
}
