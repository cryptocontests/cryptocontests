import { Contest, getContestPhase } from './../../state/contest.model';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../state/reducers/contest.reducer';

@Component({
  selector: 'cc-contest-detail',
  templateUrl: './contest-detail.component.html',
  styleUrls: ['./contest-detail.component.css']
})
export class ContestDetailComponent implements OnInit {
  contest: Contest;
  getContestPhase = getContestPhase;

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
  }

  goBack($event) {
    this.router.navigate(['/contests']);
  }
}
