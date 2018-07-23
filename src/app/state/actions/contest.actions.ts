import { TransactionReceipt } from 'web3/types';
import { Action } from '@ngrx/store';
import { Contest, Candidature } from '../contest.model';
import { TransactionState, CryptoValue } from '../../web3/transaction.model';
import { LoadingAction } from '../../loading/ngrx-loading.action';

export enum ContestActionTypes {
  LoadTags = '[LoadTags] LoadTags',
  LoadedTags = '[LoadedTags] LoadedTags',
  LoadContests = '[LoadContests] LoadContests',
  LoadedContests = '[LoadedContests] LoadedContests',
  LoadContest = '[LoadContest] LoadContest',
  LoadedContest = '[LoadedContest] LoadedContest',
  CreateContest = '[CreateContest] CreateContest',
  ContestPending = '[ContestPending] ContestPending',
  LoadCandidatures = '[LoadCandidatures] LoadCandidatures',
  LoadedCandidatures = '[LoadedCandidatures] LoadedCandidatures',
  CreateCandidature = '[CreateCandidature] CreateCandidature',
  CandidaturePending = '[CandidaturePending] CandidaturePending'
}

export class LoadTags implements Action {
  readonly type = ContestActionTypes.LoadTags;
}

export class LoadedTags implements Action {
  readonly type = ContestActionTypes.LoadedTags;
  constructor(public payload: string[]) {}
}

export class LoadContests implements Action {
  readonly type = ContestActionTypes.LoadContests;
  constructor(public payload: Partial<Contest> = {}) {}
}

export class LoadedContests implements Action, LoadingAction {
  readonly type = ContestActionTypes.LoadedContests;
  constructor(public payload: Contest[], public originAction: LoadContests) {}
}

export class LoadContest implements Action {
  readonly type = ContestActionTypes.LoadContest;
  constructor(public payload: string) {}
}

export class LoadedContest implements Action, LoadingAction {
  readonly type = ContestActionTypes.LoadedContest;
  constructor(public payload: Contest, public originAction: LoadContest) {}
}

export class CreateContest implements Action {
  readonly type = ContestActionTypes.CreateContest;

  constructor(public payload: Contest) {}
}

export class ContestPending implements Action {
  readonly type = ContestActionTypes.ContestPending;

  constructor(public transactionReceipt: TransactionReceipt) {}
}

export class LoadCandidatures implements Action {
  readonly type = ContestActionTypes.LoadCandidatures;

  // The payload will contain the contest id
  constructor(public payload: string) {}
}

export class LoadedCandidatures implements Action, LoadingAction {
  readonly type = ContestActionTypes.LoadedCandidatures;

  constructor(
    public payload: { contestHash: string; candidatures: Candidature[] },
    public originAction: LoadCandidatures
  ) {}
}

export class CreateCandidature implements Action {
  readonly type = ContestActionTypes.CreateCandidature;

  constructor(
    public payload: {
      contestHash: string;
      stake: CryptoValue;
      candidature: Candidature;
    }
  ) {}
}

export class CandidaturePending implements Action {
  readonly type = ContestActionTypes.CandidaturePending;

  constructor(public transactionReceipt: TransactionReceipt) {}
}

export type ContestActions =
  | LoadTags
  | LoadedTags
  | LoadContests
  | LoadedContests
  | LoadContest
  | LoadedContest
  | CreateContest
  | ContestPending
  | LoadCandidatures
  | LoadedCandidatures
  | CreateCandidature
  | CandidaturePending;
