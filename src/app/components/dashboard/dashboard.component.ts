import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../state/contest.reducer';
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
    'Award',
    'Creation Date',
    'Initial Date',
    'Candidature Limit Date',
    'End Date'
  ];
  tags$: Observable<string[]>;
  filterTags: string[];
  searchValue: string;

  constructor(
    private store: Store<fromReducer.State>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.tags$ = this.store.select(fromReducer.selectTags);
    this.activeLinkIndex = PhasesList.indexOf(
      ContestPhase[
        this.route.firstChild.snapshot.paramMap.get('phase').toUpperCase()
      ]
    );
    this.searchValue = this.route.firstChild.snapshot.queryParamMap.get(
      'title'
    );
    console.log(this.route.firstChild.snapshot.queryParamMap);
    this.filterTags = this.route.firstChild.snapshot.queryParamMap[
      'params'
    ].tags;
  }

  searchChange($event) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        title: $event
      },
      queryParamsHandling: 'merge'
    });
  }

  filterChanged($event) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        tags: $event.tags
      },
      queryParamsHandling: 'merge'
    });
  }
}
