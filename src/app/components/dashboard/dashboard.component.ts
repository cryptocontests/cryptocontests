import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Contest } from '../../state/contest.model';
import { State, selectAll } from '../../state/reducers/contest.reducer';
import { LoadContests } from '../../state/actions/contest.actions';

@Component({
  selector: 'cc-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  contests$: Observable<Contest[]>;

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.contests$ = this.store.select(selectAll);
    this.store.dispatch(new LoadContests());

    this.store.subscribe(state => console.log(state));
    this.contests$.subscribe(state => console.log(state));
  }
}
