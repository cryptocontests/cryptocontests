import { TransactionReceipt } from 'web3/types';
import { Action } from '@ngrx/store';
import { Contest, Participation } from '../contest.model';
import { TransactionState } from '../../web3/transaction.model';

export enum ContestActionTypes {
  LoadContests = '[LoadContests] LoadContests',
  LoadedContests = '[LoadedContests] LoadedContests',
  LoadContest = '[LoadContest] LoadContest',
  LoadedContest = '[LoadedContest] LoadedContest',
  CreateContest = '[CreateContest] CreateContest',
  ContestPending = '[ContestPending] ContestPending',
  LoadParticipations = '[LoadParticipations] LoadParticipations',
  LoadedParticipations = '[LoadedParticipations] LoadedParticipations',
  CreateParticipation = '[CreateParticipation] CreateParticipation',
  ParticipationPending = '[ParticipationPending] ParticipationPending'
}

export class LoadContests implements Action {
  readonly type = ContestActionTypes.LoadContests;
  constructor(public payload: Partial<Contest> = {}) {}
}

export class LoadedContests implements Action {
  readonly type = ContestActionTypes.LoadedContests;
  constructor(public payload: Contest[]) {}
}

export class LoadContest implements Action {
  readonly type = ContestActionTypes.LoadContest;
  constructor(public payload: string) {}
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

export class LoadedParticipations implements Action {
  readonly type = ContestActionTypes.LoadedParticipations;

  constructor(public payload: { contestHash: string, participations: Participation[] }) {}
}

export class CreateParticipation implements Action {
  readonly type = ContestActionTypes.CreateParticipation;

  constructor(public payload: { contestHash: string, participation: Participation }) {}
}

export class ParticipationPending implements Action {
  readonly type = ContestActionTypes.ParticipationPending;

  constructor(public transactionReceipt: TransactionReceipt) {}
}

export type ContestActions =
  | LoadContests
  | LoadedContests
  | LoadContest
  | LoadedContest
  | CreateContest
  | ContestPending
  | LoadParticipations
  | LoadedParticipations
  | CreateParticipation
  | ParticipationPending
;
