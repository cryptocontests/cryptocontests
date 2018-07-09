import { Contest, getContestPhase, Participation } from './../../state/contest.model';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../state/reducers/contest.reducer';
import { Observable } from 'rxjs';
import { LoadParticipations, CreateParticipation, LoadContests, LoadContest } from '../../state/actions/contest.actions';
import { MatDialog } from '@angular/material';
import { CreateParticipationComponent } from '../create-participation/create-participation.component';
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
  participations$: Observable<Participation[]>;

  constructor(
    private store: Store<fromReducer.State>,
    private route: ActivatedRoute,
    private location: Location,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.contestId = this.route.snapshot.paramMap.get('id');

    this.store.dispatch(new LoadContest(this.contestId));
    this.contest$ = this.store.select(fromReducer.selectedContest);

    this.store.dispatch(new LoadParticipations(this.contestId));
    this.participations$ = this.store.select((state) =>
      fromReducer.getContestState(state).participations[this.contestId]);
  }

  goBack($event) {
    this.location.back();
  }

  openCreateParticipationDialog(): void {
    const dialogRef = this.dialog.open(CreateParticipationComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.submitParticipation(result);
    });
  }

  submitParticipation(participation: Participation) {
    this.store.dispatch(new CreateParticipation({contestHash: this.contestId, participation}));
  }

}
