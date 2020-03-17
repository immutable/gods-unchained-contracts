import { BigNumber } from 'bignumber.js';
import { JsonRpcProvider } from 'ethers/providers';
import { ethers } from 'ethers';

export class Blockchain {
  private _snapshotId: number;

  public async saveSnapshotAsync(): Promise<void> {
    const response = await this.sendJSONRpcRequestAsync('evm_snapshot', []);
    this._snapshotId = Number(response);
  }

  public async revertAsync(): Promise<void> {
    await this.sendJSONRpcRequestAsync('evm_revert', [this._snapshotId]);
  }

  public async resetAsync(): Promise<void> {
    await this.sendJSONRpcRequestAsync('evm_revert', ['0x1']);
  }

  public async increaseTimeAsync(duration: BigNumber): Promise<any> {
    await this.sendJSONRpcRequestAsync('evm_increaseTime', [duration.toNumber()]);
  }

  public async waitBlocksAsync(count: number): Promise<any> {
    for (let i = 0; i < count; i++) {
      await this.sendJSONRpcRequestAsync('evm_mine', []);
    }
  }

  private async sendJSONRpcRequestAsync(method: string, params: any[]): Promise<any> {
    const jsonProvider: JsonRpcProvider = new ethers.providers.JsonRpcProvider();
    return jsonProvider.send(method, params);
  }


}
