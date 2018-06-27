import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TransactionState } from '../../state/transaction.model';
import * as fromReducer from '../../state/reducers/transaction.reducer';

@Component({
  selector: 'web3-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent {
  @Output('transactionSelected')
  transactionSelected = new EventEmitter<TransactionState>();
  transactions$: Observable<TransactionState[]>;

  constructor(private store: Store<any>, private location: Location) {
    this.transactions$ = this.store.select(fromReducer.selectAll);
  }

  selectTransaction(transactionState: TransactionState) {
    this.transactionSelected.emit(transactionState);
  }

  openInExplorer(hash: string) {
    this.location.go('https://etherscan.io/tx/' + hash);
  }
}
