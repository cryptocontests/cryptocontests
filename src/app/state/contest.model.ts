import { CryptoValue } from '../web3/transaction.model';

export enum ContestPhase {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  ENDED = 'ENDED'
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  prize: CryptoValue;
  createdDate: number;
  initialDate: number;
  participationLimitDate: number;
  endDate: number;
  tags: string[];
}

export interface Participation {
  creator: string;
  date: number;
  contentHash: string;
  content?: any;
  votes: number;
}

export function getContestPhase(contest: Contest): ContestPhase {
  if (Date.now() < contest.initialDate) return ContestPhase.UPCOMING;
  else if (Date.now() >= contest.initialDate && Date.now() < contest.endDate) {
    return ContestPhase.ONGOING;
  } else return ContestPhase.ENDED;
}
