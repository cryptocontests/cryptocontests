import { TransactionReceipt } from 'web3/types';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { ContestContractService } from '../services/contest-contract.service';
import { Observable, of as observableOf } from 'rxjs';
import { switchMap, map, catchError, tap, filter, take } from 'rxjs/operators';
import {
  LoadContests,
  LoadedContests,
  CreateContest,
  ContestActionTypes,
  ContestPending,
  CreateCandidature,
  LoadCandidatures,
  LoadedCandidatures,
  LoadContest,
  LoadedContest,
  LoadedTags,
  AddJudge,
  AddJudgePending,
  RemoveJudge,
  RemoveJudgePending
} from './contest.actions';
import { Contest, Candidature } from './contest.model';
import { Router } from '@angular/router';
import { GlobalLoadingService } from '../loading/services/global-loading.service';
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
              (contests: Contest[]) => new LoadedContests(contests, loadAction)
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
          .pipe(map((tags: string[]) => new LoadedTags(tags)))
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
            map((contest: Contest) => new LoadedContest(contest, loadAction))
          )
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
      tap(() => this.showTransactionPending('Contest creation requested')),
      tap(() => this.router.navigate(['/contests']))
    );

  @Effect()
  loadCandidature$: Observable<Action> = this.actions$
    .ofType<LoadCandidatures>(ContestActionTypes.LoadCandidatures)
    .pipe(
      switchMap((loadAction: LoadCandidatures) =>
        this.contestContract.getContestCandidatures(loadAction.payload).pipe(
          map(
            (candidatures: Candidature[]) =>
              new LoadedCandidatures(
                {
                  contestHash: loadAction.payload,
                  candidatures
                },
                loadAction
              )
          )
        )
      )
    );

  @Effect()
  createCandidature$: Observable<any> = this.actions$
    .ofType<CreateContest>(ContestActionTypes.CreateCandidature)
    .pipe(
      tap(() => this.globalLoading.show()),
      switchMap((createAction: CreateCandidature) =>
        this.contestContract
          .createCandidature(
            createAction.payload.contestHash,
            createAction.payload.stake,
            createAction.payload.candidature
          )
          .pipe(
            map((receipt: TransactionReceipt) => new ContestPending(receipt)),
            tap(() => this.globalLoading.hide()),
            catchError(err => {
              this.handleError(err);
              return observableOf();
            })
          )
      ),
      tap(() => this.showTransactionPending('Candidature creation requested'))
    );

  @Effect()
  addJudge$: Observable<any> = this.actions$
    .ofType<AddJudge>(ContestActionTypes.AddJudge)
    .pipe(
      switchMap((addJudgeAction: AddJudge) =>
        this.contestContract
          .addJudge(
            addJudgeAction.payload.contestHash,
            addJudgeAction.payload.judge
          )
          .pipe(
            map((receipt: TransactionReceipt) => new AddJudgePending(receipt)),
            catchError(err => {
              this.handleError(err);
              return observableOf();
            })
          )
      ),
      tap(() => this.showTransactionPending('Add judge requested'))
    );

  @Effect()
  removeJudge$: Observable<any> = this.actions$
    .ofType<RemoveJudge>(ContestActionTypes.RemoveJudge)
    .pipe(
      switchMap((removeJudgeAction: RemoveJudge) =>
        this.contestContract
          .removeJudge(
            removeJudgeAction.payload.contestHash,
            removeJudgeAction.payload.judge
          )
          .pipe(
            map(
              (receipt: TransactionReceipt) => new RemoveJudgePending(receipt)
            ),
            catchError(err => {
              this.handleError(err);
              return observableOf();
            })
          )
      ),
      tap(() => this.showTransactionPending('Remove judge requested'))
    );

  private showTransactionPending(customMessage: string) {
    this.snackBar.open(
      customMessage + ': wait for the transaction to confirm',
      null,
      {
        duration: 3000
      }
    );
  }

  private handleError(error: any) {
    this.globalLoading.hide();
    const snackRef = this.snackBar.open(
      error.message ? error.message : error,
      'CLOSE'
    );
    snackRef.onAction().subscribe(() => snackRef.dismiss());
  }
}
