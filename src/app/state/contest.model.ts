import { CryptoValue } from 'ng-web3';

export enum ContestPhase {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  REVISION = 'REVISION',
  ENDED = 'ENDED'
}

export const PhasesList = [
  ContestPhase.UPCOMING,
  ContestPhase.ONGOING,
  ContestPhase.REVISION,
  ContestPhase.ENDED
];

export interface Hashable<T> {
  hash: string;
  content?: T;
}

export interface Contest {
  id: string;
  title: string;
  owner: string;
  additionalContent: Hashable<{ description: string; image: Buffer }>;
  prize: CryptoValue;
  candidaturesStake: CryptoValue;
  createdDate: number;
  initialDate: number;
  candidatureLimitDate: number;
  endDate: number;
  tags: string[];
  judges?: Judge[];
  options: {};
}

export interface Judge {
  address: string;
  name: string;
  weight: number;
}

export interface Candidature {
  title: string;
  creator: string;
  date: number;
  content: Hashable<any>;
  votes: number;
  cancelled: boolean;
  cancelledByMember?: string;
  reasonForCancellation?: string;
}

export function getContestPhase(contest: Contest): ContestPhase {
  if (Date.now() < contest.initialDate) return ContestPhase.UPCOMING;
  else if (
    Date.now() >= contest.initialDate &&
    Date.now() < contest.candidatureLimitDate
  ) {
    return ContestPhase.ONGOING;
  } else if (
    Date.now() >= contest.candidatureLimitDate &&
    Date.now() < contest.endDate
  ) {
    return ContestPhase.REVISION;
  } else return ContestPhase.ENDED;
}
