import { Action } from '@ngrx/store';
import { Contest } from '../contest.model';
import { TransactionState } from '../../web3/transaction.model';

export enum ContestActionTypes {
  LoadContests = '[LoadContests] LoadContests',
  LoadedContests = '[LoadedContests] LoadedContests',
  CreateContest = '[CreateContest] CreateContest',
  ContestPending = '[ContestPending] ContestPending'
}

export class LoadContests implements Action {
  readonly type = ContestActionTypes.LoadContests;
}

export class LoadedContests implements Action {
  readonly type = ContestActionTypes.LoadedContests;

  constructor(public payload: Contest[]) {}
}

export class CreateContest implements Action {
  readonly type = ContestActionTypes.CreateContest;

  constructor(public payload: Contest) {}
}

export class ContestPending implements Action {
  readonly type = ContestActionTypes.ContestPending;

  constructor(public transactionState: TransactionState) {}
}

export type ContestActions =
  | LoadContests
  | LoadedContests
  | CreateContest
  | ContestPending;
