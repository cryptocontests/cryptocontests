import {
  Contest,
  getContestPhase,
  Candidature
} from './../../state/contest.model';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../state/reducers/contest.reducer';
import { Observable } from 'rxjs';
import {
  LoadCandidatures,
  CreateCandidature,
  LoadContest,
  ContestActionTypes
} from '../../state/actions/contest.actions';
import { MatDialog } from '@angular/material';
import { CreateCandidatureComponent } from '../create-candidature/create-candidature.component';
import { cardAnimations } from '../card.animations';

@Component({
  selector: 'cc-contest-detail',
  templateUrl: './contest-detail.component.html',
  styleUrls: ['./contest-detail.component.css'],
  animations: cardAnimations
})
export class ContestDetailComponent implements OnInit {
  contest$: Observable<Contest>;
  contestTitle: string;
  contestId: string;
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
    this.contestId = this.route.snapshot.paramMap.get('id');

    this.contestAction = new LoadContest(this.contestId);
    this.store.dispatch(this.contestAction);
    this.contest$ = this.store.select(fromReducer.selectedContest);

    this.participationsAction = new LoadCandidatures(this.contestId);
    this.store.dispatch(this.participationsAction);
    this.candidatures$ = this.store.select(
      state => fromReducer.getContestState(state).candidatures[this.contestId]
    );
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
    this.store.dispatch(
      new CreateCandidature({ contestHash: this.contestId, candidature })
    );
  }
}
