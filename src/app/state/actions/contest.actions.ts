import { TransactionReceipt } from 'web3/types';
import { Action } from '@ngrx/store';
import { Contest } from '../contest.model';
import { TransactionState } from '../../web3/transaction.model';

export enum ContestActionTypes {
  LoadContests = '[LoadContests] LoadContests',
  LoadedContest = '[LoadedContests] LoadedContest',
  CreateContest = '[CreateContest] CreateContest',
  ContestPending = '[ContestPending] ContestPending'
}

export class LoadContests implements Action {
  readonly type = ContestActionTypes.LoadContests;
}

export class LoadedContest implements Action {
  readonly type = ContestActionTypes.LoadedContest;

  constructor(public payload: Contest) {}
}

export class CreateContest implements Action {
  readonly type = ContestActionTypes.CreateContest;

  constructor(public payload: Contest) {}
}

export class ContestPending implements Action {
  readonly type = ContestActionTypes.ContestPending;

  constructor(public transactionReceipt: TransactionReceipt) {}
}

export type ContestActions =
  | LoadContests
  | LoadedContest
  | CreateContest
  | ContestPending;
