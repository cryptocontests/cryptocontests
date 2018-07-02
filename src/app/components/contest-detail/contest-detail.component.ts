import { Contest, getContestPhase, Participation } from './../../state/contest.model';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../state/reducers/contest.reducer';
import { Observable } from 'rxjs';
import { LoadParticipations } from '../../state/actions/contest.actions';

@Component({
  selector: 'cc-contest-detail',
  templateUrl: './contest-detail.component.html',
  styleUrls: ['./contest-detail.component.css']
})
export class ContestDetailComponent implements OnInit {
  contest: Contest;
  getContestPhase = getContestPhase;
  participations$: Observable<Participation[]>;

  constructor(
    private store: Store<fromReducer.State>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const contestId = this.route.snapshot.paramMap.get('id');

    this.store
      .select(fromReducer.selectContestById(contestId))
      .subscribe((contest: Contest) => (this.contest = contest));

    this.store.dispatch(new LoadParticipations(contestId));

    //this.participations$ = this.store.select(fromReducer.)
  }

  goBack($event) {
    this.router.navigate(['/contests']);
  }
}
