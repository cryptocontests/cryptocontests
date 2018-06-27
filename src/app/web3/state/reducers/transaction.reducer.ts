import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import {
  TransactionActions,
  TransactionActionTypes
} from '../actions/transaction.actions';
import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { TransactionState } from '../transaction.model';

export interface State extends EntityState<TransactionState> {}

export const adapter: EntityAdapter<TransactionState> = createEntityAdapter<
  TransactionState
>();

export const initialState: State = adapter.getInitialState({});

export function transactionReducer(
  state = initialState,
  action: TransactionActions
): State {
  switch (action.type) {
    case TransactionActionTypes.UpdateTransactionState:
      //  return adapter.upsertOne(action.payload, state);
      return adapter.upsertOne(
        {
          id: 'asflasdkjfñaskdjfñlasf',
          name: 'transaction 2',
          confirmations: false
        },
        state
      );

    default:
      return state;
  }
}

export const getTransactionState = createFeatureSelector<State>('transaction');
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors(getTransactionState);

export const getConfirmedTransactions = createSelector(
  selectAll,
  (transactionStates: TransactionState[]) =>
    transactionStates.filter(
      (transactionState: TransactionState) =>
        transactionState.confirmations && transactionState.confirmations > 0
    )
);

export const getNumConfirmedTransactions = createSelector(
  getConfirmedTransactions,
  (transactionStates: TransactionState[]) => transactionStates.length
);
