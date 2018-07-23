import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy
} from '@angular/core';
import { Contest, ContestPhase } from '../../state/contest.model';
import { Observable, Subscription } from 'rxjs';
import {
  ContestActionTypes,
  LoadedContests,
  LoadContests
} from '../../state/actions/contest.actions';
import { cardAnimations } from '../card.animations';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../state/reducers/contest.reducer';
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
  action: LoadContests;
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
    this.action = new LoadContests();
    this.store.dispatch(this.action);
    this.contests$ = this.store.select(
      fromReducer.selectContestsByPhase(ContestPhase[this.phase.toUpperCase()])
    );
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
    console.log(contest);
    this.router.navigate(['/contest', contest.id]);
    // this.contestSelected.emit(contest.id);
  }
}
