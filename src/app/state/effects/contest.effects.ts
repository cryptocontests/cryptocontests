import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { EthereumService } from '../../services/ethereum.service';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import {
  LoadContests,
  LoadedContests,
  ContestActionTypes
} from '../actions/contest.actions';
import { Contest } from '../contest.model';

@Injectable()
export class ContestEffects {
  constructor(
    private actions$: Actions,
    private ethereumService: EthereumService
  ) {}
  /*
  @Effect()
  loadContests$: Observable<Action> = this.actions$
    .ofType<LoadContests>(ContestActionTypes.LoadContests)
    .switchMap((loadAction: LoadContests) =>
      this.ethereumService
        .getContests()
        .map((contests: Contest[]) => new LoadedContests(contests))
    ); */
}
