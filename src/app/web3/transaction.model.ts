import { Transaction, TransactionReceipt } from 'web3/types';

export interface TransactionState {
  id: number;
  hash: string; // Hash of the transaction
  name: string; // Name which will be displayed on the list of transactions
  // False if the tx has spread, and if it has been confirmed the number of confirmed blocks
  confirmations: false | number;

  receipt?: TransactionReceipt;
  seen: boolean;
  error: any;
}

export enum Fiat {
  EUR = 'EUR', USD = 'USD'
}
export enum CryptoCurrency {
  BTC = 'BTC', ETH = 'ETH', WEIS = 'WEIS'
}
export type Currency = Fiat | CryptoCurrency;

export interface CryptoValue {
  currency: CryptoCurrency;
  value: number;
}
