import { selectContestById } from './../../state/reducers/contest.reducer';
import { TransactionState } from '../transaction.model';
import { Injectable } from '@angular/core';
import { PromiEvent, TransactionReceipt } from 'web3/types';
import { Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionStateService {
  private nextId = 0;
  private transactions: TransactionState[] = [
    {
      id: 0,
      seen: false,
      confirmations: false,
      hash: 'jkdfññlajdsflñas',
      name: 'my contest',
      receipt: null,
      error: null
    },
    {
      id: 1,
      seen: true,
      confirmations: 5,
      hash: 'jkdfññlajdsflñas',
      name: 'my contest',
      receipt: null,
      error: null
    },
    {
      id: 2,
      seen: false,
      confirmations: 9,
      hash: 'jkdfññlajdsflñas',
      name: 'my contest',
      receipt: null,
      error: null
    }
  ];
  private subscribers: Array<(txStates: TransactionState[]) => any> = [];

  constructor() {}

  /**
   * Register the transaction into the transaction state
   * @param promiEvent
   * @param transactionName
   */
  public registerTransaction(promiEvent: PromiEvent<any>, name: string) {
    const transactionState = this.registerEvents(promiEvent, name);
    this.transactions.push(transactionState);
    this.updateTransactionState();
  }

  /**
   * Clear the confirmed transactions from the queue
   */
  public clearTransactions() {
    this.transactions = this.transactions.filter(
      (txState: TransactionState) => !txState.confirmations
    );
    this.updateTransactionState();
  }

  public markTransactionsSeen() {
    this.transactions = this.transactions.map((tx: TransactionState) => ({
      ...tx,
      seen: true
    }));
    this.updateTransactionState();
  }

  public subscribeToChanges(
    subscriberFn: (transactionState: TransactionState[]) => any
  ) {
    this.subscribers.push(subscriberFn);
    this.updateTransactionState();
  }

  private registerEvents(
    promiEvent: PromiEvent<any>,
    name: string
  ): TransactionState {
    const txId = this.nextId;
    const transactionState: TransactionState = {
      id: txId,
      hash: null,
      name: name,
      confirmations: false,
      seen: false,
      error: null
    };
    this.nextId++;
    promiEvent
      .on('transactionHash', (hash: string) => {
        this.transactions.find(
          (transaction: TransactionState) => transaction.id === txId
        ).hash = hash;
        this.updateTransactionState();
      })
      .on('receipt', (receipt: TransactionReceipt) => {
        this.transactions.find(
          (transaction: TransactionState) => transaction.id === txId
        ).receipt = receipt;
        this.updateTransactionState();
      })
      .on(
        'confirmation',
        (confirmationNumber: number, receipt: TransactionReceipt) => {
          const tx = this.transactions.find(
            (transaction: TransactionState) => transaction.id === txId
          );
          tx.receipt = receipt;
          tx.confirmations = confirmationNumber;
          this.updateTransactionState();
        }
      )
      .on('error', (error: Error) => {
        this.transactions.find(
          (transaction: TransactionState) => transaction.id === txId
        ).error = error;
        this.updateTransactionState();
      });
    return transactionState;
  }

  private updateTransactionState() {
    this.subscribers.forEach(subs => subs(this.transactions));
  }
}
