import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { ContestContractService } from '../../services/contest-contract.service';
import { Observable } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import {
  LoadContests,
  LoadedContests,
  CreateContest,
  ContestActionTypes,
  ContestPending
} from '../actions/contest.actions';
import { Contest } from '../contest.model';
import { Router } from '@angular/router';
import { TransactionState } from '../../web3/state/transaction.model';

@Injectable()
export class ContestEffects {
  constructor(
    private actions$: Actions,
    private contestContract: ContestContractService,
    private router: Router
  ) {}

  @Effect()
  loadContests$: Observable<Action> = this.actions$
    .ofType<LoadContests>(ContestActionTypes.LoadContests)
    .pipe(
      switchMap((loadAction: LoadContests) =>
        this.contestContract
          .getContests()
          .pipe(map((contests: Contest[]) => new LoadedContests(contests)))
      )
    );

  @Effect()
  createContest$: Observable<Action> = this.actions$
    .ofType<CreateContest>(ContestActionTypes.CreateContest)
    .pipe(
      switchMap((createAction: CreateContest) =>
        this.contestContract.createContest(createAction.payload).pipe(
          map((txState: TransactionState) => new ContestPending(txState))
          // catchError(err => Observable.empty())
        )
      )
    );
}
