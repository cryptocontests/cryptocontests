import { tap } from 'rxjs/operators';
import { Web3Service } from './web3.service';
import { Observable } from 'rxjs';
import { TransactionState } from '../state/transaction.model';
import { Contract, TransactionReceipt, PromiEvent } from 'web3/types';
import { Store } from '@ngrx/store';
import { UpdateTransactionState } from '../state/actions/transaction.actions';

export abstract class SmartContractService {
  protected contract: Contract;

  constructor(
    private web3: Web3Service,
    private contractAbi: any,
    private contractAddress: string,
    private store?: Store<any>
  ) {
    this.contract = this.web3.newContract(contractAbi, contractAddress);
  }

  public eventsToObservable(
    promiEvent: PromiEvent<any>
  ): Observable<TransactionState> {
    return new Observable<TransactionState>(observer => {
      let transactionState: TransactionState = {
        id: null,
        name: null,
        confirmations: false
      };
      promiEvent
        .on('transactionHash', (hash: string) => {
          transactionState = {
            ...transactionState,
            id: hash
          };
          observer.next(transactionState);
        })
        .on('receipt', (receipt: TransactionReceipt) => {
          transactionState = {
            ...transactionState,
            receipt: receipt
          };
          observer.next(transactionState);
        })
        .on(
          'confirmation',
          (confirmationNumber: number, receipt: TransactionReceipt) => {
            transactionState = {
              ...transactionState,
              confirmations: confirmationNumber,
              receipt: receipt
            };
            observer.next(transactionState);
          }
        )
        .on('error', (error: Error) => {
          observer.error(error);
        });

      return () => {};
    });
  }

  /**
   * Register the transaction into the transaction state
   * @param promiEvent
   * @param transactionName
   */
  public registerTransaction(
    promiEvent: PromiEvent<any>,
    transactionName: string
  ): void {
    this.registerTransaction$(
      this.eventsToObservable(promiEvent),
      transactionName
    );
  }

  public registerTransaction$(
    transactionState$: Observable<TransactionState>,
    transactionName: string
  ): void {
    transactionState$.pipe(
      tap((txState: TransactionState) => {
        if (this.store) {
          this.store.dispatch(
            new UpdateTransactionState({ ...txState, name: transactionName })
          );
        }
      })
    );
  }
}
