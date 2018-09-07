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
  loadingCandidatures: boolean;
}

export const adapter: EntityAdapter<Contest> = createEntityAdapter<Contest>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  candidatures: {},
  selectedContest: null,
  tags: [],
  loadingContests: false,
  loadingContestDetail: false,
  loadingCandidatures: false
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
    case ContestActionTypes.LoadCandidatures: {
      return Object.assign({}, state, {
        loadingCandidatures: true,
        candidatures: {}
      });
    }
    case ContestActionTypes.LoadedCandidatures: {
      const addCandidature = { candidatures: {}, loadingCandidatures: false };
      let list = [];
      if (state.candidatures.hasOwnProperty(action.payload.contestHash)) {
        list = state.candidatures[action.payload.contestHash];
      }
      list.push(action.payload.candidature);

      addCandidature.candidatures[action.payload.contestHash] = list;
      return Object.assign({}, state, addCandidature);
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

export const selectContest = createSelector(
  getContestState,
  (state: State) => state.entities[state.selectedContest]
);

export const selectTags = createSelector(
  getContestState,
  (state: State) => state.tags
);

export const contestsLoading = createSelector(
  getContestState,
  (state: State) => state.loadingContests
);

export const contestDetailLoading = createSelector(
  getContestState,
  (state: State) => state.loadingContestDetail
);

export const candidaturesLoading = createSelector(
  getContestState,
  (state: State) => state.loadingCandidatures
);
