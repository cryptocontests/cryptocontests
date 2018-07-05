import { Injectable } from '@angular/core';
import Web3 from 'web3';

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

  public getNetworkVersion(): string {
    return EthereumNetwork[this.web3.version.network];
  }

  public async getAccounts(): Promise<string[]> {
    return this.web3.eth.getAccounts();
  }

  public async getDefaultAccount(): Promise<string> {
    const accounts = await this.getAccounts();
    return accounts[0];
  }

  public newContract(contractAbi: any, contractAddress: string) {
    return new this.web3.eth.Contract(contractAbi, contractAddress);
  }

  public bytesToString(content: any): string {
    return this.web3.utils.toUtf8(content);
  }

  public stringToBytes(content: string): any {
    console.log(content);
    const c = this.web3.utils.asciiToHex(content);
    console.log(c);
    return c;
  }
}
