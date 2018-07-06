import { CryptoValue } from '../web3/transaction.model';

export enum ContestPhase {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  VOTING = 'VOTING',
  ENDED = 'ENDED'
}

export interface Hashable<T> {
  hash: string;
  content?: T;
}

export interface Contest {
  id: string;
  title: string;
  additionalContent: Hashable<{ description: string; image: Buffer }>;
  prize: CryptoValue;
  createdDate: number;
  initialDate: number;
  participationLimitDate: number;
  endDate: number;
  tags: string[];
  options: {
    limitParticipations: number; // 0 means no limit
  };
}

export interface Participation {
  title: string;
  creator: string;
  date: number;
  content: Hashable<any>;
  votes: number;
}

export function getContestPhase(contest: Contest): ContestPhase {
  if (Date.now() < contest.initialDate) return ContestPhase.UPCOMING;
  else if (Date.now() >= contest.initialDate && Date.now() < contest.participationLimitDate) {
    return ContestPhase.ONGOING;
  } else if (Date.now() >= contest.participationLimitDate && Date.now() < contest.endDate) {
    return ContestPhase.VOTING;
  } else return ContestPhase.ENDED;
}

/**
 * Tags strings merge and separator
 * This is needed because the tags will be stored in the smart contract as a single string
 */

const TAG_SEPARATOR = '&';

export function splitTags(tags: string): string[] {
  return tags.split(TAG_SEPARATOR);
}

export function mergeTags(tags: string[]): string {
  return tags.reduce((previous: string, current: string) => previous + TAG_SEPARATOR + current, '');
}
