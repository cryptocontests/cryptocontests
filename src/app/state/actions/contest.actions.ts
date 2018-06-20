import { Action } from '@ngrx/store';
import { Contest } from '../contest.model';

export enum ContestActionTypes {
  LoadContests = '[LoadContests] LoadContests',
  LoadedContests = '[LoadedContests] LoadedContests',
  CreateContest = '[CreateContest] CreateContest',
  ContestCreated = '[ContestCreated] ContestCreated'
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

export class ContestCreated implements Action {
  readonly type = ContestActionTypes.ContestCreated;

  //  constructor(payload: Contest) {}
}

export type ContestActions =
  | LoadContests
  | LoadedContests
  | CreateContest
  | ContestCreated;
