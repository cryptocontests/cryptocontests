import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { Contest } from '../contest.model';
import { ContestActions, ContestActionTypes } from '../actions/contest.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';

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
    case ContestActionTypes.LoadedContests: {
      return adapter.addAll(action.payload, state);
    }

    default: {
      return state;
    }
  }
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();

export const selectOnGoingContests = createSelector(
  selectAll,
  (contests: Contest[]) =>
    contests.filter(
      (contest: Contest) =>
        contest.initialDate < Date.now() && contest.endDate > Date.now()
    )
);
