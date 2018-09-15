import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

declare let window: any;

export enum EthereumNetwork {
  MAINNET = 1,
  MORDEN = 2,
  ROPSTEN = 3,
  KOVAN = 4,
  RYNKEBY = 42
}

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  protected web3: any;

  constructor() {
    if (!this.web3) this.initWeb3();
  }

  initWeb3() {
    if (this.isWeb3Present()) {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    }
  }

  public getWeb3() {
    return this.web3;
  }

  public isWeb3Present(): boolean {
    return typeof window.web3 !== 'undefined';
  }

  public getNetworkVersion(): Promise<string> {
    return this.web3.eth.net.getNetworkType();
  }

  public getAccounts(): Promise<string[]> {
    if (this.web3) return this.web3.eth.getAccounts();
    else {
      return new Promise((resolve, reject) => {
        reject();
      });
    }
  }

  public getDefaultAccount(): Promise<string> {
    return from(this.getAccounts())
      .pipe(map((accounts: string[]) => accounts[0]))
      .toPromise();
  }

  public newContract(contractAbi: any, contractAddress: string) {
    return new this.web3.eth.Contract(contractAbi, contractAddress);
  }

  public bytesToString(content: any): string {
    return this.web3.utils.toAscii(content).replace(/\W/g, '');
  }

  public stringToBytes(content: string): any {
    return this.web3.utils.fromAscii(content);
  }
}
