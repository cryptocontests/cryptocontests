import { TransactionReceipt } from 'web3/types';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { ContestContractService } from '../../services/contest-contract.service';
import { Observable, of as observableOf } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import {
  LoadContests,
  LoadedContest,
  CreateContest,
  ContestActionTypes,
  ContestPending,
  CreateParticipation
} from '../actions/contest.actions';
import { Contest } from '../contest.model';
import { Router } from '@angular/router';
import { GlobalLoadingService } from '../../loading/global-loading.service';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ContestEffects {
  constructor(
    private actions$: Actions,
    private contestContract: ContestContractService,
    private router: Router,
    private globalLoading: GlobalLoadingService,
    public snackBar: MatSnackBar
  ) { }

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
    createContest$: Observable<any> = this.actions$
      .ofType<CreateContest>(ContestActionTypes.CreateContest)
      .pipe(
        tap(() => this.globalLoading.show()),
        switchMap((createAction: CreateContest) =>
          this.contestContract.createContest(createAction.payload).pipe(
            map((receipt: TransactionReceipt) => new ContestPending(receipt)),
            tap(() => this.globalLoading.hide()),
            catchError(err => {
              this.handleError(err);
              return observableOf();
            })
          )
        ),
        tap(() => this.snackBar.open('Contest creation requested: wait for the transaction to confirm', null, {
          duration: 3000
        })),
        tap(() => this.router.navigate(['/contests']))
      );

      @Effect()
      createParticipation$: Observable<any> = this.actions$
        .ofType<CreateContest>(ContestActionTypes.CreateParticipation)
        .pipe(
          tap(() => this.globalLoading.show()),
          switchMap((createAction: CreateParticipation) =>
            this.contestContract.createParticipation(createAction.payload.contestHash, createAction.payload.participation).pipe(
              map((receipt: TransactionReceipt) => new ContestPending(receipt)),
              tap(() => this.globalLoading.hide()),
              catchError(err => {
                this.handleError(err);
                return observableOf();
              })
            )
          ),
          tap(() => this.snackBar.open('Participation creation requested: wait for the transaction to confirm', null, {
            duration: 3000
          })),
          tap(() => this.router.navigate(['/contests']))
        );

  private handleError(error: any) {
    this.globalLoading.hide();
    const snackRef = this.snackBar.open(error.message ? error.message : error, 'CLOSE');
    snackRef.onAction().subscribe(() => snackRef.dismiss());
  }
}
