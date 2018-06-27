import { SmartContractService } from './../web3/services/smart-contract.service';
import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { take } from 'rxjs/operators';
import { Contest } from '../state/contest.model';
import * as _ from 'lodash';
import { Web3Service } from '../web3/services/web3.service';
import { TransactionState } from '../web3/state/transaction.model';

const contractAddress = '';
const contractAbi = [];

@Injectable({
  providedIn: 'root'
})
export class ContestContractService extends SmartContractService {
  constructor(private web3Service: Web3Service) {
    super(web3Service, contractAbi, contractAddress);
  }

  public getContests(): Observable<Contest[]> {
    const mock = _
      .fill(Array(20), <Contest>{
        id: 'myidwhichwillbeahash',
        title: 'My new contest',
        description: 'This is a contest to do lots of things',
        prize: 100,
        endDate: 90000000,
        participationLimitDate: 2330000,
        initialDate: 10000000,
        createdDate: 243423432,
        tags: ['nature', 'dogs']
      })
      .map(c => ({
        ...c,
        id: '' + Math.random()
      }));
    return observableOf(mock);
  }

  public createContest(contest: Contest): Observable<TransactionState> {
    const observable = this.eventsToObservable(
      this.contract.methods['']().send()
    );
    this.registerTransaction$(observable, contest.title);
    return observable.pipe(take(1));
  }
}
