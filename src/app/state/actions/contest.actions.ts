import { TransactionReceipt } from 'web3/types';
import { Action } from '@ngrx/store';
import { Contest, Participation } from '../contest.model';
import { TransactionState } from '../../web3/transaction.model';

export enum ContestActionTypes {
  LoadContests = '[LoadContests] LoadContests',
  LoadedContest = '[LoadedContests] LoadedContest',
  CreateContest = '[CreateContest] CreateContest',
  ContestPending = '[ContestPending] ContestPending',
  LoadParticipations = '[LoadParticipations] LoadParticipations',
  LoadedParticipation = '[LoadedParticipation] LoadedParticipation'
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

export class LoadParticipations implements Action {
  readonly type = ContestActionTypes.LoadParticipations;

  // The payload will contain the contest id
  constructor(public payload: string) {}
}

export class LoadedParticipation implements Action {
  readonly type = ContestActionTypes.LoadedParticipation;

  constructor(public payload: Participation) {}
}

export type ContestActions =
  | LoadContests
  | LoadedContest
  | CreateContest
  | ContestPending
  | LoadParticipations
  | LoadedParticipation;
