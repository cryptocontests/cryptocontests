import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TransactionState } from '../../transaction.model';
import { TransactionStateService } from '../../services/transaction-state.service';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'web3-transaction-list',
  templateUrl: './web3-transaction-list.component.html',
  styleUrls: ['./web3-transaction-list.component.css'],
  animations: [
    trigger('transactionList', [
      state(
        'void',
        style({
          transform: 'scale(0)',
          opacity: 0
        })
      ),
      transition('void <=> *', [
        style({
          opacity: 1
        }),
        animate('150ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ])
    ])
  ]
})
export class TransactionListComponent {
  @Output('transactionSelected')
  transactionSelected = new EventEmitter<TransactionState>();
  transactions: TransactionState[];

  constructor(
    private transactionsService: TransactionStateService,
    private location: Location
  ) {
    this.transactionsService.subscribeToChanges(
      (txState: TransactionState[]) => (this.transactions = txState)
    );
  }

  selectTransaction(transactionState: TransactionState) {
    this.transactionSelected.emit(transactionState);
  }

  clearTransactions() {
    this.transactionsService.clearTransactions();
  }
}
