import {
  Contest,
  getContestPhase,
  Candidature,
  ContestPhase,
  PhasesList
} from './../../state/contest.model';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../state/reducers/contest.reducer';
import { Observable, from } from 'rxjs';
import {
  LoadCandidatures,
  CreateCandidature,
  LoadContest
} from '../../state/actions/contest.actions';
import { MatDialog } from '@angular/material';
import { CreateCandidatureComponent } from '../create-candidature/create-candidature.component';
import { cardAnimations } from '../card.animations';
import { tap, withLatestFrom, map } from 'rxjs/operators';

@Component({
  selector: 'cc-contest-detail',
  templateUrl: './contest-detail.component.html',
  styleUrls: ['./contest-detail.component.css'],
  animations: cardAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ContestDetailComponent implements OnInit {
  contest$: Observable<Contest>;
  getContestPhase = getContestPhase;
  candidatures$: Observable<Candidature[]>;
  contestAction: LoadContest;
  participationsAction: LoadCandidatures;

  constructor(
    private store: Store<fromReducer.State>,
    private route: ActivatedRoute,
    private location: Location,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    const contestId = this.route.snapshot.paramMap.get('id');

    this.contestAction = new LoadContest(contestId);
    this.store.dispatch(this.contestAction);
    this.contest$ = this.store.select(fromReducer.selectedContest);

    this.participationsAction = new LoadCandidatures(contestId);
    this.store.dispatch(this.participationsAction);
    this.candidatures$ = this.store.select(
      state => fromReducer.getContestState(state).candidatures[contestId]
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

  addJudge() {}
}
