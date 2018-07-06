import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Contest, ContestPhase } from '../../state/contest.model';
import {
  State,
  selectAll,
  selectContestsByPhase
} from '../../state/reducers/contest.reducer';
import { LoadContests } from '../../state/actions/contest.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'cc-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  upcomingContests$: Observable<Contest[]>;
  ongoingContests$: Observable<Contest[]>;
  votingContests$: Observable<Contest[]>;
  endedContests$: Observable<Contest[]>;

  constructor(private store: Store<State>, private router: Router) {}

  ngOnInit() {
    this.upcomingContests$ = this.store.select(
      selectContestsByPhase(ContestPhase.UPCOMING)
    );
    this.ongoingContests$ = this.store.select(
      selectContestsByPhase(ContestPhase.ONGOING)
    );
    this.votingContests$ = this.store.select(
      selectContestsByPhase(ContestPhase.VOTING)
    );
    this.endedContests$ = this.store.select(
      selectContestsByPhase(ContestPhase.ENDED)
    );
    this.store.dispatch(new LoadContests());
  }

  selectContest(contestId: string) {
    this.router.navigate(['/contest', contestId]);
  }
}
