import { TransactionState } from './../../transaction.model';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TransactionStateService } from '../../services/transaction-state.service';

@Component({
  selector: 'web3-transaction-button',
  templateUrl: './web3-transaction-button.component.html',
  styleUrls: ['./web3-transaction-button.component.css']
})
export class Web3TransactionButtonComponent {
  confirmedUnseenTransactions: number;
  constructor(private transactionStates: TransactionStateService) {
    transactionStates.subscribeToChanges((txStates: TransactionState[]) => {
      this.confirmedUnseenTransactions = txStates.filter(
        (txState: TransactionState) =>
          txState.confirmations > 0 && !txState.seen
      ).length;
    });
  }
}
