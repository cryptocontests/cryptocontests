import { TransactionReceipt } from 'web3/types';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { ContestContractService } from '../../services/contest-contract.service';
import { Observable } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import {
  LoadContests,
  LoadedContest,
  CreateContest,
  ContestActionTypes,
  ContestPending
} from '../actions/contest.actions';
import { Contest } from '../contest.model';
import { Router } from '@angular/router';
import { GlobalLoadingService } from '../../services/global-loading.service';

@Injectable()
export class ContestEffects {
  constructor(
    private actions$: Actions,
    private contestContract: ContestContractService,
    private router: Router,
    private globalLoading: GlobalLoadingService
  ) {}

  @Effect()
  loadContests$: Observable<Action> = this.actions$
    .ofType<LoadContests>(ContestActionTypes.LoadContests)
    .pipe(
      switchMap((loadAction: LoadContests) =>
        this.contestContract
          .getContests()
          .pipe(map((contests: Contest) => new LoadedContest(contests)))
      )
    );

  @Effect()
  createContest$: Observable<Action> = this.actions$
    .ofType<CreateContest>(ContestActionTypes.CreateContest)
    .pipe(
      tap(() => this.globalLoading.show()),
      switchMap((createAction: CreateContest) =>
        this.contestContract.createContest(createAction.payload).pipe(
          map((receipt: TransactionReceipt) => new ContestPending(receipt)),
          tap(() => this.globalLoading.hide()),
          tap(() => this.router.navigate(['/contests']))
          // catchError(err => Observable.empty())
        )
      )
    );
}
