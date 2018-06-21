import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { EthereumService } from '../../services/ethereum.service';
import { Observable } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import {
  LoadContests,
  LoadedContests,
  CreateContest,
  ContestActionTypes,
  ContestCreated
} from '../actions/contest.actions';
import { Contest } from '../contest.model';

@Injectable()
export class ContestEffects {
  constructor(
    private actions$: Actions,
    private ethereumService: EthereumService
  ) {}

  @Effect()
  loadContests$: Observable<Action> = this.actions$
    .ofType<LoadContests>(ContestActionTypes.LoadContests)
    .pipe(
      switchMap((loadAction: LoadContests) =>
        this.ethereumService
          .getContests()
          .pipe(map((contests: Contest[]) => new LoadedContests(contests)))
      )
    );

  @Effect()
  createContest$: Observable<Action> = this.actions$
    .ofType<CreateContest>(ContestActionTypes.CreateContest)
    .pipe(
      switchMap((createAction: CreateContest) =>
        this.ethereumService.createContest(createAction.payload).pipe(
          map(() => new ContestCreated())
          // catchError(err => Observable.empty())
        )
      )
    );
}
