import { Transaction, TransactionReceipt } from 'web3/types';

export interface TransactionState {
  id: string; // Hash of the transaction
  name: string; // Name which will be displayed on the list of transactions
  // False if the tx has spread, and if it has been confirmed the number of confirmed blocks
  confirmations: false | number;

  receipt?: TransactionReceipt;
}
