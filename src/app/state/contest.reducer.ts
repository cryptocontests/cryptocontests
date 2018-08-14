import { ContestPhase, getContestPhase, Candidature } from './contest.model';
import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { Contest } from './contest.model';
import { ContestActions, ContestActionTypes } from './contest.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity/src/models';

export interface State extends EntityState<Contest> {
  // additional entities state properties
  candidatures: { [contestHash: string]: Candidature[] };
  selectedContest: string;
  tags: string[];
  loadingContests: boolean;
  loadingContestDetail: boolean;
}

export const adapter: EntityAdapter<Contest> = createEntityAdapter<Contest>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  candidatures: {},
  selectedContest: null,
  tags: [],
  loadingContests: false,
  loadingContestDetail: false
});

export function contestReducer(
  state = initialState,
  action: ContestActions
): State {
  switch (action.type) {
    case ContestActionTypes.LoadedTags: {
      return Object.assign(state, { tags: action.payload });
    }
    case ContestActionTypes.LoadContests: {
      return Object.assign(state, { loadingContests: true });
    }
    case ContestActionTypes.LoadedContests: {
      return adapter.addMany(action.payload, {
        ...state,
        loadingContests: false
      });
    }
    case ContestActionTypes.LoadContest: {
      return Object.assign(state, { loadingContestDetail: true });
    }
    case ContestActionTypes.LoadedContest: {
      return adapter.addOne(action.payload, {
        ...state,
        loadingContestDetail: false,
        selectedContest: action.payload.id
      });
    }
    case ContestActionTypes.LoadedCandidatures: {
      const addCandidature = { candidatures: {} };
      addCandidature.candidatures[action.payload.contestHash] =
        action.payload.candidatures;
      return Object.assign(state, addCandidature);
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
