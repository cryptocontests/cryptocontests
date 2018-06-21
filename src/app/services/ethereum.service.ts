import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { Contest } from '../state/contest.model';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class EthereumService {
  constructor() {}

  public getContests(): Observable<Contest[]> {
    const mock = _
      .fill(Array(20), <Contest>{
        id: 'myidwhichwillbeahash',
        title: 'My new contest',
        description: 'This is a contest to do lots of things',
        prize: 100,
        endDate: 90000000,
        initialDate: 10000000,
        createdDate: 243423432
      })
      .map(c => ({
        ...c,
        id: '' + Math.random()
      }));
    console.log(mock);
    return observableOf(mock);
  }

  public createContest(contest: Contest): Observable<void> {
    return null;
  }
}
