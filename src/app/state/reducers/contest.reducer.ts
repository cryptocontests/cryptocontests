import { ContestPhase, getContestPhase, Participation } from './../contest.model';
import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { Contest } from '../contest.model';
import { ContestActions, ContestActionTypes } from '../actions/contest.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity/src/models';

export interface State extends EntityState<Contest> {
  // additional entities state properties
  participations: {[contestHash: string]: Participation[]};
  selectedContest: string;
  tags: string[];
}

export const adapter: EntityAdapter<Contest> = createEntityAdapter<Contest>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  participations: {},
  selectedContest: null,
  tags: []
});

export function contestReducer(
  state = initialState,
  action: ContestActions
): State {
  switch (action.type) {
    case ContestActionTypes.LoadedTags: {
      return Object.assign(state, { tags: action.payload });
    }
    case ContestActionTypes.LoadedContests: {
      return adapter.addMany(action.payload, state);
    }
    case ContestActionTypes.LoadedContest: {
      return adapter.addOne(action.payload, {
        ...state,
        selectedContest: action.payload.id
      });
    }
    case ContestActionTypes.LoadedParticipations: {
      const addParticipation = { participations: {} };
      addParticipation.participations[action.payload.contestHash] = action.payload.participations;
      return Object.assign(state, addParticipation);
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

export const selectedContest = createSelector(
    getContestState,
    (state: State) => state.entities[state.selectedContest]
  );

export const selectTags = createSelector(
  getContestState,
  (state: State) => state.tags
);
