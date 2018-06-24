export enum ContestPhase {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  ENDED = 'ENDED'
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  prize: number;
  createdDate: number;
  initialDate: number;
  endDate: number;
  tags: string[];
  participations?: Participation[];
}

export function getContestPhase(contest: Contest): ContestPhase {
  if (Date.now() < contest.initialDate) return ContestPhase.UPCOMING;
  else if (Date.now() >= contest.initialDate && Date.now() < contest.endDate)
    return ContestPhase.ONGOING;
  else return ContestPhase.ENDED;
}

export interface Participation {
  creator: string;
  date: number;
  content: string;
}
