import { Component, OnDestroy } from '@angular/core';
import { Contest, ContestPhase } from '../../state/contest.model';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { LoadContests } from '../../state/contest.actions';
import { cardAnimations } from '../card.animations';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../state/contest.reducer';
import { ActivatedRoute, Router, NavigationEnd, Params } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { query } from '@angular/core/src/render3/query';

@Component({
  selector: 'cc-contest-grid',
  templateUrl: './contest-grid.component.html',
  styleUrls: ['./contest-grid.component.css'],
  animations: cardAnimations
})
export class ContestGridComponent implements OnDestroy {
  phase: string;
  contests$: Observable<Contest[]>;
  loading$: Observable<boolean>;
  navigationSubscription: Subscription;
  titleFilter = '';

  constructor(
    private store: Store<fromReducer.State>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initContest();
      }
    });

    route.params.subscribe(
      (params: Params) => (this.titleFilter = params.title)
    );
  }

  initContest() {
    this.phase = this.route.snapshot.paramMap.get('phase');

    this.store.dispatch(new LoadContests());
    this.contests$ = combineLatest(
      this.store.select(
        fromReducer.selectContestsByPhase(
          ContestPhase[this.phase.toUpperCase()]
        )
      ),
      this.route.queryParams
    ).pipe(
      map(([contests, queryParams]) => {
        if (queryParams.title) {
          contests = contests.filter((contest: Contest) =>
            contest.title.startsWith(queryParams.title)
          );
        }

        if (queryParams.tags && queryParams.tags.length > 0) {
          contests = contests.filter((contest: Contest) =>
            contest.tags.some(tag => queryParams.tags.includes(tag))
          );
        }
        return contests;
      })
    );
    this.loading$ = this.store.select(fromReducer.contestsLoading);
  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we
    // don't then we will continue to run our initialiseInvites()
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  selectContest(contest: Contest) {
    this.router.navigate(['/contest', contest.id]);
    // this.contestSelected.emit(contest.id);
  }
}
