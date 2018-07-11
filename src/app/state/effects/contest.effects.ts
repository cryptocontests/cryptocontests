import { TransactionReceipt } from 'web3/types';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import {
  Actions,
  Effect,
  ROOT_EFFECTS_INIT
} from '@ngrx/effects';
import { ContestContractService } from '../../services/contest-contract.service';
import { Observable, of as observableOf } from 'rxjs';
import {
  switchMap,
  map,
  catchError,
  tap,
  filter,
  take
} from 'rxjs/operators';
import {
  LoadContests,
  LoadedContests,
  CreateContest,
  ContestActionTypes,
  ContestPending,
  CreateParticipation,
  LoadParticipations,
  LoadedParticipations,
  LoadContest,
  LoadedContest,
  LoadedTags
} from '../actions/contest.actions';
import { Contest, Participation } from '../contest.model';
import { Router } from '@angular/router';
import { GlobalLoadingService } from '../../loading/services/global-loading.service';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ContestEffects {
  constructor(
    private actions$: Actions,
    private contestContract: ContestContractService,
    private router: Router,
    private globalLoading: GlobalLoadingService,
    public snackBar: MatSnackBar
  ) {}

  @Effect()
  loadContests$: Observable<Action> = this.actions$
    .ofType<LoadContests>(ContestActionTypes.LoadContests)
    .pipe(
      switchMap((loadAction: LoadContests) =>
        this.contestContract
          .getContests(loadAction.payload)
          .pipe(
            map(
              (contests: Contest[]) =>
                new LoadedContests(contests, loadAction)
            )
          )
      )
    );

  @Effect()
  loadTags$: Observable<Action> = this.actions$
    .ofType(ROOT_EFFECTS_INIT)
    .pipe(
      switchMap(() =>
        this.contestContract
          .getTags()
          .pipe(
            map((tags: string[]) => new LoadedTags(tags))
          )
      )
    );

  @Effect()
  loadContest$: Observable<Action> = this.actions$
    .ofType<LoadContest>(ContestActionTypes.LoadContest)
    .pipe(
      switchMap((loadAction: LoadContest) =>
        this.contestContract
          .getContest(loadAction.payload)
          .pipe(
            map(
              (contest: Contest) =>
                new LoadedContest(contest, loadAction)
            )
          )
      )
    );

  @Effect()
  createContest$: Observable<any> = this.actions$
    .ofType<CreateContest>(ContestActionTypes.CreateContest)
    .pipe(
      tap(() => this.globalLoading.show()),
      switchMap((createAction: CreateContest) =>
        this.contestContract
          .createContest(createAction.payload)
          .pipe(
            map(
              (receipt: TransactionReceipt) => new ContestPending(receipt)
            ),
            tap(() => this.globalLoading.hide()),
            catchError(err => {
              this.handleError(err);
              return observableOf();
            })
          )
      ),
      tap(() =>
        this.snackBar.open(
          'Contest creation requested: wait for the transaction to confirm',
          null,
          {
            duration: 3000
          }
        )
      ),
      tap(() => this.router.navigate(['/contests']))
    );

  @Effect()
  loadParticipation$: Observable<
    Action
  > = this.actions$
    .ofType<LoadParticipations>(
      ContestActionTypes.LoadParticipations
    )
    .pipe(
      switchMap((loadAction: LoadParticipations) =>
        this.contestContract
          .getContestParticipations(loadAction.payload)
          .pipe(
            map(
              (participations: Participation[]) =>
                new LoadedParticipations({
                  contestHash: loadAction.payload,
                  participations
                }, loadAction)
            )
          )
      )
    );

  @Effect()
  createParticipation$: Observable<
    any
  > = this.actions$
    .ofType<CreateContest>(
      ContestActionTypes.CreateParticipation
    )
    .pipe(
      tap(() => this.globalLoading.show()),
      switchMap((createAction: CreateParticipation) =>
        this.contestContract
          .createParticipation(
            createAction.payload.contestHash,
            createAction.payload.participation
          )
          .pipe(
            map(
              (receipt: TransactionReceipt) =>
                new ContestPending(receipt)
            ),
            tap(() => this.globalLoading.hide()),
            catchError(err => {
              this.handleError(err);
              return observableOf();
            })
          )
      ),
      tap(() =>
        this.snackBar.open(
          'Participation creation requested: wait for the transaction to confirm',
          null,
          {
            duration: 3000
          }
        )
      )
    );

  private handleError(error: any) {
    this.globalLoading.hide();
    const snackRef = this.snackBar.open(
      error.message ? error.message : error,
      'CLOSE'
    );
    snackRef.onAction().subscribe(() => snackRef.dismiss());
  }
}
