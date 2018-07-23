import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../state/reducers/contest.reducer';
import { Router, ActivatedRoute } from '@angular/router';
import { PhasesList, ContestPhase } from '../../state/contest.model';
import { Observable } from 'rxjs';
// import { filterAnimation } from 'projects/ng-filter-utils/src/public_api';

@Component({
  selector: 'cc-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
  //  animations: filterAnimation
})
export class DashboardComponent implements OnInit {
  activeLinkIndex = 1;
  routeLinks = [
    { link: '/contests/upcoming', label: 'Upcoming Contests' },
    { link: '/contests/ongoing', label: 'Ongoing Contests' },
    { link: '/contests/revision', label: 'Contests On Revision' },
    { link: '/contests/ended', label: 'Ended Contests' }
  ];
  sortOptions = [
    'Title',
    'Prize',
    'Creation Date',
    'Initial Date',
    'Candidature Limit Date',
    'End Date'
  ];
  tags$: Observable<string[]>;

  constructor(
    private store: Store<fromReducer.State>,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.tags$ = this.store.select(fromReducer.selectTags);
    this.activeLinkIndex = PhasesList.indexOf(
      ContestPhase[
        this.route.firstChild.snapshot.paramMap.get('phase').toUpperCase()
      ]
    );
  }

  filterChanged($event) {
    console.log($event);
  }
}
