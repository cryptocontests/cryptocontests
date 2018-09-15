import { TransactionReceipt } from 'web3/types';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import {
  Actions,
  Effect,
  ROOT_EFFECTS_INIT
} from '@ngrx/effects';
import { ContestContractService } from '../services/contest-contract.service';
import { Observable, of as observableOf } from 'rxjs';
import {
  switchMap,
  map,
  catchError,
  tap,
  filter,
  timeInterval,
  timeout
} from 'rxjs/operators';
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
  RemoveJudgePending,
  RetrieveFunds,
  RetrieveFundsPending,
  UploadCandidature,
  UploadCandidatureSuccess,
  VoteCandidaturePending,
  VoteCandidature,
  SolveContest,
  SolveContestPending,
  CancelCandidature,
  CancelCandidaturePending
} from './contest.actions';
import { Contest, Candidature } from './contest.model';
import { Router } from '@angular/router';
import { GlobalLoadingService } from 'ng-collection-utils';
import { MatSnackBar, MatDialog } from '@angular/material';
import { FileReceipt } from 'ng-web3';
import { Web3ErrorComponent } from '../components/web3-error/web3-error.component';
import { Web3Service } from 'projects/ng-web3/src/public_api';

@Injectable()
export class ContestEffects {
  constructor(
    private actions$: Actions,
    private contestContract: ContestContractService,
    private router: Router,
    private globalLoading: GlobalLoadingService,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private web3Service: Web3Service
  ) {}

  @Effect()
  loadContests$ = this.actions$
    .ofType<LoadContests>(ContestActionTypes.LoadContests)
    .pipe(
      switchMap((loadAction: LoadContests) =>
        this.contestContract
          .getContests(loadAction.payload)
          .pipe(
            map(
              (contests: Contest[]) =>
                new LoadedContests(contests)
            )
          )
      ),
      catchError((error) =>
        observableOf(this.displayWeb3Error())
      )
    );

  @Effect({ dispatch: false })
  checkMetamask$ = this.actions$
    .ofType(ROOT_EFFECTS_INIT)
    .pipe(
      map(() => this.web3Service.isWeb3Present()),
      tap(web3present => {
        if (!web3present) throw Error();
      }),
      switchMap(() => this.web3Service.getNetworkVersion()),
      tap(network => {
        if (network !== 'private' && network !== 'ropsten') throw Error();
      }),
      switchMap(() => this.web3Service.getDefaultAccount()),
      tap(address => {
        if (
          !address ||
          typeof address !== typeof 'string'
        ) {
          throw Error();
        }
      }),
      switchMap(() => this.contestContract.getTags()),
      catchError((error) =>
        observableOf(this.displayWeb3Error())
      )
    );

  @Effect()
  loadTags$ = this.actions$
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
                new LoadedContest(contest)
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
        this.showTransactionPending(
          'Contest creation requested'
        )
      ),
      tap(() => this.router.navigate(['/contests']))
    );

  @Effect()
  loadCandidatures$: Observable<
    Action
  > = this.actions$
    .ofType<LoadCandidatures>(
      ContestActionTypes.LoadCandidatures
    )
    .pipe(
      switchMap((loadAction: LoadCandidatures) =>
        this.contestContract
          .getContestCandidatures(
            loadAction.payload,
            loadAction.discardOnlyHash
          )
          .pipe(
            map(
              (candidature: Candidature) =>
                new LoadedCandidatures({
                  contestHash: loadAction.payload,
                  candidature
                })
            )
          )
      )
    );

  @Effect()
  createCandidature$: Observable<
    any
  > = this.actions$
    .ofType<CreateCandidature>(
      ContestActionTypes.CreateCandidature
    )
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
        this.showTransactionPending(
          'Candidature creation requested'
        )
      )
    );

  @Effect()
  uploadCandidature$: Observable<
    any
  > = this.actions$
    .ofType<UploadCandidature>(
      ContestActionTypes.UploadCandidature
    )
    .pipe(
      tap(_ => this.globalLoading.show()),
      switchMap((uploadAction: UploadCandidature) =>
        this.contestContract
          .uploadCandidature(
            uploadAction.payload.contestHash,
            uploadAction.payload.candidature
          )
          .pipe(
            map(
              (receipt: FileReceipt) =>
                new UploadCandidatureSuccess()
            ),
            catchError(err => {
              this.handleError(err);
              return observableOf();
            })
          )
      ),
      tap(_ => this.globalLoading.hide()),
      tap(_ =>
        this.snackBar.open(
          'Succesfully uploaded the candidature',
          null,
          {
            duration: 3000
          }
        )
      )
    );

  @Effect()
  addJudge$: Observable<any> = this.actions$
    .ofType<AddJudge>(ContestActionTypes.AddJudge)
    .pipe(
      tap(_ => this.globalLoading.show()),
      switchMap((addJudgeAction: AddJudge) =>
        this.contestContract
          .addJudge(
            addJudgeAction.payload.contestHash,
            addJudgeAction.payload.judge
          )
          .pipe(
            map(
              (receipt: TransactionReceipt) =>
                new AddJudgePending(receipt)
            ),
            catchError(err => {
              this.handleError(err);
              return observableOf();
            })
          )
      ),
      tap(_ => this.globalLoading.hide()),
      tap(() =>
        this.showTransactionPending('Add judge requested')
      )
    );

  @Effect()
  removeJudge$: Observable<any> = this.actions$
    .ofType<RemoveJudge>(ContestActionTypes.RemoveJudge)
    .pipe(
      tap(_ => this.globalLoading.show()),
      switchMap((removeJudgeAction: RemoveJudge) =>
        this.contestContract
          .removeJudge(
            removeJudgeAction.payload.contestHash,
            removeJudgeAction.payload.judge
          )
          .pipe(
            map(
              (receipt: TransactionReceipt) =>
                new RemoveJudgePending(receipt)
            ),
            catchError(err => {
              this.handleError(err);
              return observableOf();
            })
          )
      ),
      tap(_ => this.globalLoading.hide()),
      tap(() =>
        this.showTransactionPending(
          'Remove judge requested'
        )
      )
    );

  @Effect()
  voteCandidature$: Observable<any> = this.actions$
    .ofType<VoteCandidature>(
      ContestActionTypes.VoteCandidature
    )
    .pipe(
      tap(_ => this.globalLoading.show()),
      switchMap((voteCandidature: VoteCandidature) =>
        this.contestContract
          .voteCandidature(
            voteCandidature.payload.contestHash,
            voteCandidature.payload.candidatureHash
          )
          .pipe(
            map(
              (receipt: TransactionReceipt) =>
                new VoteCandidaturePending(receipt)
            ),
            catchError(err => {
              this.handleError(err);
              return observableOf();
            })
          )
      ),
      tap(_ => this.globalLoading.hide()),
      tap(() =>
        this.showTransactionPending(
          'Vote candidature requested'
        )
      )
    );

  @Effect()
  cancelCandidature$: Observable<
    any
  > = this.actions$
    .ofType<CancelCandidature>(
      ContestActionTypes.CancelCandidature
    )
    .pipe(
      tap(_ => this.globalLoading.show()),
      switchMap((cancelCandidature: CancelCandidature) =>
        this.contestContract
          .cancelCandidature(
            cancelCandidature.payload.contestHash,
            cancelCandidature.payload.candidatureHash,
            cancelCandidature.payload.reasonForCancellation
          )
          .pipe(
            map(
              (receipt: TransactionReceipt) =>
                new CancelCandidaturePending(receipt)
            ),
            catchError(err => {
              this.handleError(err);
              return observableOf();
            })
          )
      ),
      tap(_ => this.globalLoading.hide()),
      tap(() =>
        this.showTransactionPending(
          'Cancel candidature requested'
        )
      )
    );

  @Effect()
  retrieveFunds$: Observable<any> = this.actions$
    .ofType<RetrieveFunds>(ContestActionTypes.RetrieveFunds)
    .pipe(
      tap(_ => this.globalLoading.show()),
      switchMap((retrieveFunds: RetrieveFunds) =>
        this.contestContract
          .retrieveFunds(retrieveFunds.payload)
          .pipe(
            map(
              (receipt: TransactionReceipt) =>
                new RetrieveFundsPending(receipt)
            ),
            catchError(err => {
              this.handleError(err);
              return observableOf();
            })
          )
      ),
      tap(() =>
        this.showTransactionPending(
          'Retrieve funds requested'
        )
      ),
      tap(_ => this.globalLoading.hide())
    );

  @Effect()
  solveContest$: Observable<any> = this.actions$
    .ofType<SolveContest>(ContestActionTypes.SolveContest)
    .pipe(
      switchMap((solveContest: SolveContest) =>
        this.contestContract
          .solveContest(solveContest.payload)
          .pipe(
            map(
              (receipt: TransactionReceipt) =>
                new SolveContestPending(receipt)
            ),
            catchError(err => {
              this.handleError(err);
              return observableOf();
            })
          )
      ),
      tap(() =>
        this.showTransactionPending(
          'Solve contest requested'
        )
      )
    );

  displayWeb3Error() {
    this.dialog.open(Web3ErrorComponent, {
      disableClose: true
    });
  }

  private showTransactionPending(customMessage: string) {
    this.snackBar.open(
      customMessage +
        ': wait for the transaction to confirm',
      null,
      {
        duration: 3000
      }
    );
  }

  private handleError(error: any) {
    this.globalLoading.hide();
    console.error(error);
    const snackRef = this.snackBar.open(
      error.message ? error.message : error,
      'CLOSE'
    );
    snackRef.onAction().subscribe(() => snackRef.dismiss());
  }
}
