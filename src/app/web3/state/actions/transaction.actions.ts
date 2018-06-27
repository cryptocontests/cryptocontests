import { Action } from '@ngrx/store';
import { TransactionState } from '../transaction.model';

export enum TransactionActionTypes {
  MakeCallTransaction = '[Transaction] Call Transaction',
  UpdateTransactionState = '[Transaction] Update Transaction State'
}

export class UpdateTransactionState implements Action {
  readonly type = TransactionActionTypes.UpdateTransactionState;
  constructor(public payload: TransactionState) {}
}

export type TransactionActions = UpdateTransactionState;
