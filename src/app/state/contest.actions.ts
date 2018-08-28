import { TransactionReceipt } from 'web3/types';
import { Action } from '@ngrx/store';
import { Contest, Candidature, Judge } from './contest.model';
import { CryptoValue } from 'ng-web3';

export enum ContestActionTypes {
  LoadTags = '[LoadTags] LoadTags',
  LoadedTags = '[LoadedTags] LoadedTags',
  LoadContests = '[LoadContests] LoadContests',
  LoadedContests = '[LoadedContests] LoadedContests',
  LoadContest = '[LoadContest] LoadContest',
  LoadedContest = '[LoadedContest] LoadedContest',
  CreateContest = '[CreateContest] CreateContest',
  ContestPending = '[ContestPending] ContestPending',
  AddJudge = '[AddJudge] AddJudge',
  AddJudgePending = '[AddJudgePending] AddJudgePending',
  RemoveJudge = '[RemoveJudge] RemoveJudge',
  RemoveJudgePending = '[RemoveJudgePending] RemoveJudgePending',
  LoadCandidatures = '[LoadCandidatures] LoadCandidatures',
  LoadedCandidatures = '[LoadedCandidatures] LoadedCandidatures',
  CreateCandidature = '[CreateCandidature] CreateCandidature',
  CandidaturePending = '[CandidaturePending] CandidaturePending',
  UploadCandidature = '[UploadCandidature] UploadCandidature',
  UploadCandidatureSuccess = '[UploadCandidatureSuccess] UploadCandidatureSuccess',
  VoteCandidature = '[VoteCandidature] VoteCandidature',
  VoteCandidaturePending = '[VoteCandidaturePending] VoteCandidaturePending',
  RetrieveFunds = '[RetrieveFunds] RetrieveFunds',
  RetrieveFundsPending = '[RetrieveFundsPending] RetrieveFundsPending'
}

/**
 * Tags
 */

export class LoadTags implements Action {
  readonly type = ContestActionTypes.LoadTags;
}

export class LoadedTags implements Action {
  readonly type = ContestActionTypes.LoadedTags;
  constructor(public payload: string[]) {}
}

/**
 * Contests
 */

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

  constructor(public payload: Partial<Contest>) {}
}

export class ContestPending implements Action {
  readonly type = ContestActionTypes.ContestPending;

  constructor(public transactionReceipt: TransactionReceipt) {}
}

/**
 * Candidatures
 */

export class LoadCandidatures implements Action {
  readonly type = ContestActionTypes.LoadCandidatures;

  // The payload will contain the contest id
  constructor(public payload: string, public discardOnlyHash: boolean) {}
}

export class LoadedCandidatures implements Action {
  readonly type = ContestActionTypes.LoadedCandidatures;

  constructor(
    public payload: { contestHash: string; candidatures: Candidature[] }
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

export class UploadCandidature implements Action {
  readonly type = ContestActionTypes.UploadCandidature;

  constructor(
    public payload: {
      contestHash: string;
      candidature: Candidature;
    }
  ) {}
}

export class UploadCandidatureSuccess implements Action {
  readonly type = ContestActionTypes.UploadCandidatureSuccess;

  constructor() {}
}

/**
 * Judges
 */

export class AddJudge implements Action {
  readonly type = ContestActionTypes.AddJudge;

  constructor(
    public payload: {
      contestHash: string;
      judge: Judge;
    }
  ) {}
}

export class AddJudgePending implements Action {
  readonly type = ContestActionTypes.AddJudgePending;

  constructor(public transactionReceipt: TransactionReceipt) {}
}

export class RemoveJudge implements Action {
  readonly type = ContestActionTypes.RemoveJudge;

  constructor(
    public payload: {
      contestHash: string;
      judge: Judge;
    }
  ) {}
}

export class RemoveJudgePending implements Action {
  readonly type = ContestActionTypes.RemoveJudgePending;

  constructor(public transactionReceipt: TransactionReceipt) {}
}

export class VoteCandidature implements Action {
  readonly type = ContestActionTypes.VoteCandidature;

  constructor(
    public payload: {
      contestHash: string;
      candidatureHash: string;
    }
  ) {}
}

export class VoteCandidaturePending implements Action {
  readonly type = ContestActionTypes.VoteCandidaturePending;

  constructor(public transactionReceipt: TransactionReceipt) {}
}

/**
 * Funds
 */

export class RetrieveFunds implements Action {
  readonly type = ContestActionTypes.RetrieveFunds;

  constructor(public payload: string) {}
}

export class RetrieveFundsPending implements Action {
  readonly type = ContestActionTypes.RetrieveFundsPending;

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
  | CandidaturePending
  | AddJudge
  | AddJudgePending
  | RemoveJudge
  | RemoveJudgePending
  | VoteCandidature
  | VoteCandidaturePending
  | RetrieveFunds
  | RetrieveFundsPending;
