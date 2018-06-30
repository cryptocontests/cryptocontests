import { ContestPhase, getContestPhase } from './../contest.model';
import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { Contest } from '../contest.model';
import { ContestActions, ContestActionTypes } from '../actions/contest.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity/src/models';

export interface State extends EntityState<Contest> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Contest> = createEntityAdapter<Contest>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function contestReducer(
  state = initialState,
  action: ContestActions
): State {
  switch (action.type) {
    case ContestActionTypes.LoadedContest: {
      return adapter.addOne(action.payload, state);
    }

    default: {
      return state;
    }
  }
}

export const getContestState = createFeatureSelector<State>('contest');
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors(getContestState);

export const selectContestsByPhase = (contestPhase: ContestPhase) =>
  createSelector(selectAll, (contests: Contest[]) =>
    contests.filter(
      (contest: Contest) => getContestPhase(contest) === contestPhase
    )
  );

export const selectContestById = (id: string) =>
  createSelector(
    selectEntities,
    (entities: Dictionary<Contest>) => entities[id]
  );
