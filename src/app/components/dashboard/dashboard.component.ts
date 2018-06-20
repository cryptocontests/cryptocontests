import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Contest } from '../../state/contest.model';
import { State, selectAll } from '../../state/reducers/contest.reducer';

@Component({
  selector: 'cc-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  contests$: Observable<Contest[]>;

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.store.select(selectAll);
  }
}
