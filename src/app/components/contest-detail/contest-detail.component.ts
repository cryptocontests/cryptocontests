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
import { Observable, from } from 'rxjs';
import {
  LoadCandidatures,
  CreateCandidature,
  LoadContest,
  RemoveJudge,
  AddJudge
} from '../../state/contest.actions';
import { MatDialog } from '@angular/material';
import { CreateCandidatureComponent } from '../create-candidature/create-candidature.component';
import { cardAnimations } from '../card.animations';
import { tap, withLatestFrom, map } from 'rxjs/operators';
import { AddJudgeComponent } from '../add-judge/add-judge.component';

@Component({
  selector: 'cc-contest-detail',
  templateUrl: './contest-detail.component.html',
  styleUrls: ['./contest-detail.component.css'],
  animations: cardAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ContestDetailComponent implements OnInit {
  contestHash: string;
  contest$: Observable<Contest>;
  getContestPhase = getContestPhase;
  candidatures$: Observable<Candidature[]>;
  contestAction: LoadContest;
  participationsAction: LoadCandidatures;
  selectedTabIndex = 0;

  constructor(
    private store: Store<fromReducer.State>,
    private route: ActivatedRoute,
    private location: Location,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.contestHash = this.route.snapshot.paramMap.get('id');

    this.contestAction = new LoadContest(this.contestHash);
    this.store.dispatch(this.contestAction);
    this.contest$ = this.store.select(fromReducer.selectedContest);

    this.participationsAction = new LoadCandidatures(this.contestHash);
    this.store.dispatch(this.participationsAction);
    this.candidatures$ = this.store.select(
      state => fromReducer.getContestState(state).candidatures[this.contestHash]
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

  openCreateCandidatureDialog(): void {
    const dialogRef = this.dialog.open(CreateCandidatureComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.submitCandidature(result);
    });
  }

  submitCandidature(candidature: Candidature) {
    from('anything').pipe(
      withLatestFrom(this.contest$),
      tap(([first, contest]) =>
        this.store.dispatch(
          new CreateCandidature({
            contestHash: contest.id,
            stake: contest.taxForCandidature,
            candidature
          })
        )
      )
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
          new AddJudge({ contestHash: this.contestHash, judge: result })
        );
      }
    });
  }

  removeJudge(judgeToRemove: Judge) {
    this.store.dispatch(
      new RemoveJudge({ contestHash: this.contestHash, judge: judgeToRemove })
    );
  }
}
