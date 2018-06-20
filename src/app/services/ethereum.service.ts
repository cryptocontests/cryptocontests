import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Contest } from '../state/contest.model';

@Injectable({
  providedIn: 'root'
})
export class EthereumService {
  constructor() {}

  public getContests(): Observable<Contest[]> {
    return null;
  }

  public createContest(contest: Contest): Observable<void> {
    return null;
  }
}
