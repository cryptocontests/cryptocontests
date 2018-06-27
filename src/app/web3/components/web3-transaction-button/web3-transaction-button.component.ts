import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getNumConfirmedTransactions } from '../../state/reducers/transaction.reducer';

@Component({
  selector: 'web3-transaction-button',
  templateUrl: './web3-transaction-button.component.html',
  styleUrls: ['./web3-transaction-button.component.css']
})
export class Web3TransactionButtonComponent {
  confirmedTransactions$: Observable<number>;
  constructor(private store: Store<any>) {
    this.confirmedTransactions$ = store.select(getNumConfirmedTransactions);
  }
}
