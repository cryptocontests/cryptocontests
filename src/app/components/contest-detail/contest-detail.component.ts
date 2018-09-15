import {
  Contest,
  getContestPhase,
  Candidature,
  ContestPhase,
  PhasesList,
  Judge
} from './../../state/contest.model';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../state/contest.reducer';
import { Observable, from, of, combineLatest } from 'rxjs';
import {
  LoadCandidatures,
  CreateCandidature,
  LoadContest,
  RemoveJudge,
  AddJudge,
  RetrieveFunds,
  UploadCandidature,
  SolveContest
} from '../../state/contest.actions';
import { MatDialog } from '@angular/material';
import { CreateCandidatureComponent } from '../create-candidature/create-candidature.component';
import { cardAnimations } from '../card.animations';
import {
  tap,
  withLatestFrom,
  map,
  switchMap,
  skip,
  filter
} from 'rxjs/operators';
import { AddJudgeComponent } from '../add-judge/add-judge.component';
import { CryptoValue } from 'ng-web3/ng-web3';
import { ContestContractService } from '../../services/contest-contract.service';
import { Web3Service } from 'projects/ng-web3/src/public_api';

@Component({
  selector: 'cc-contest-detail',
  templateUrl: './contest-detail.component.html',
  styleUrls: ['./contest-detail.component.css'],
  animations: cardAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ContestDetailComponent implements OnInit {
  userAddress: string;
  contestHash: string;
  contest$: Observable<Contest>;
  loading$: Observable<boolean>;
  loadingCandidatures$: Observable<boolean>;
  contestPhase: number;
  candidatureStake: CryptoValue;
  getContestPhase = getContestPhase;
  candidatures$: Observable<Candidature[]>;
  selectedTabIndex = 0;
  hasOwnCandidatures = false;
  isUserJudge = false;
  winnersCandidatures: Candidature[] = null;

  constructor(
    private store: Store<fromReducer.State>,
    private route: ActivatedRoute,
    private location: Location,
    public dialog: MatDialog,
    private contestService: ContestContractService,
    private web3: Web3Service
  ) {}

  ngOnInit() {
    this.contestHash = this.route.snapshot.paramMap.get('id');

    this.store.dispatch(new LoadContest(this.contestHash));

    this.contest$ = this.store.select(fromReducer.selectContest);
    this.contest$.subscribe((contest: Contest) => {
      if (contest) {
        this.contestPhase = this.getPhaseIndex(contest);
        this.candidatureStake = contest.candidaturesStake;
        if (this.contestPhase > 1) {
          this.getOwnCandidatures();
          this.store.dispatch(
            new LoadCandidatures(this.contestHash, this.contestPhase > 1)
          );
        }

        this.web3
          .getDefaultAccount()
          .then(
            address =>
              (this.isUserJudge =
                contest.judges.findIndex(judge => judge.address === address) !==
                -1)
          );
      }
    });
    this.loading$ = this.store.select(fromReducer.contestDetailLoading);
    this.loadingCandidatures$ = this.store.select(
      fromReducer.candidaturesLoading
    );

    this.candidatures$ = this.store.select(
      fromReducer.uploadedCandidatures(this.contestHash)
    );

    this.contestService.getDefaultAccount.subscribe(
      address => (this.userAddress = address)
    );

    combineLatest(this.contest$, this.candidatures$).subscribe(
      ([contest, candidatures]) =>
        contest &&
        candidatures &&
        this.getWinnersCandidatures(contest, candidatures)
    );
  }

  getPhaseIndex(contest: Contest) {
    const phase = getContestPhase(contest);
    return PhasesList.indexOf(phase);
  }

  shouldShowCandidatures(contest: Contest): boolean {
    const phase = getContestPhase(contest);
    return phase === ContestPhase.REVISION || phase === ContestPhase.ENDED;
  }

  goBack($event) {
    this.location.back();
  }

  isUserOwner(contest: Contest): boolean {
    return contest.owner === this.userAddress;
  }

  isUserWinner() {
    return this.winnersCandidatures && this.winnersCandidatures.some(candidature => candidature.creator === this.userAddress);
  }

  openCreateCandidatureDialog(): void {
    const dialogRef = this.dialog.open(CreateCandidatureComponent, {
      data: this.contestPhase === 2
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.contestPhase === 1) {
          this.submitCandidature(result);
        } else if (this.contestPhase === 2) {
          this.uploadCandidature(result);
        }
      }
    });
  }

  submitCandidature(candidature: Candidature) {
    this.store.dispatch(
      new CreateCandidature({
        contestHash: this.contestHash,
        stake: this.candidatureStake,
        candidature
      })
    );
  }

  uploadCandidature(candidature: Candidature) {
    this.store.dispatch(
      new UploadCandidature({
        contestHash: this.contestHash,
        candidature
      })
    );
  }

  selectedTabChange(index: number) {
    this.selectedTabIndex = index;
  }

  addJudge() {
    const dialogRef = this.dialog.open(AddJudgeComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(
          new AddJudge({
            contestHash: this.contestHash,
            judge: result
          })
        );
      }
    });
  }

  removeJudge(judgeToRemove: Judge) {
    this.store.dispatch(
      new RemoveJudge({
        contestHash: this.contestHash,
        judge: judgeToRemove
      })
    );
  }

  getOwnCandidatures() {
    this.contestService.getDefaultAccount.subscribe(address => {
      this.contestService
        .getOwnCandidatures(address, this.contestHash)
        .then(candidatures => {
          this.hasOwnCandidatures = candidatures.length > 0;
        });
    });
  }

  retrieveFunds() {
    this.store.dispatch(new RetrieveFunds(this.contestHash));
  }

  getWinnersCandidatures(contest: Contest, candidatures: Candidature[]) {
    this.winnersCandidatures = candidatures.filter(
      candidature => contest.winnersCandidatures.includes(candidature.content.hash)
    );
  }

  solveContest() {
    this.store.dispatch(new SolveContest(this.contestHash));
  }
}
