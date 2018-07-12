import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../state/reducers/contest.reducer';
import { Router, ActivatedRoute } from '@angular/router';
import { PhasesList, ContestPhase } from '../../state/contest.model';

@Component({
  selector: 'cc-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
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
    'Creation Date',
    'Initial Date',
    'Participation Limit Date',
    'End Date'
  ];

  constructor(private store: Store<State>, private route: ActivatedRoute) {}

  ngOnInit() {
    this.activeLinkIndex = PhasesList.indexOf(
      ContestPhase[
        this.route.firstChild.snapshot.paramMap.get('phase').toUpperCase()
      ]
    );
  }
}
