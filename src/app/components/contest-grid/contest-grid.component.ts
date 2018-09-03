import {
  Component,
  OnDestroy
} from '@angular/core';
import { Contest, ContestPhase } from '../../state/contest.model';
import { Observable, Subscription } from 'rxjs';
import {
  LoadContests
} from '../../state/contest.actions';
import { cardAnimations } from '../card.animations';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../state/contest.reducer';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

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
  }

  initContest() {
    this.phase = this.route.snapshot.paramMap.get('phase');

    this.store.dispatch(new LoadContests());
    this.contests$ = this.store.select(
      fromReducer.selectContestsByPhase(ContestPhase[this.phase.toUpperCase()])
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
