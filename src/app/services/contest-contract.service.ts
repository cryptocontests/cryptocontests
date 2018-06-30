import { environment } from './../../environments/environment';
import { TransactionReceipt, PromiEvent } from 'web3/types';
import { SmartContractService } from './../web3/services/smart-contract.service';
import { Injectable } from '@angular/core';
import { Observable, range, from, of as observableOf, forkJoin } from 'rxjs';
import {
  switchMap,
  mergeAll,
  map,
  concatMap,
  flatMap,
  tap,
  mergeMap
} from 'rxjs/operators';
import { Contest } from '../state/contest.model';
import * as _ from 'lodash';
import { Web3Service } from '../web3/services/web3.service';
import { TransactionStateService } from '../web3/services/transaction-state.service';
declare function require(url: string);

const ContestController = require('./../../../build/contracts/ContestController.json');

@Injectable({
  providedIn: 'root'
})
export class ContestContractService extends SmartContractService {
  constructor(
    private web3Service: Web3Service,
    private transactionStates: TransactionStateService
  ) {
    super(web3Service, ContestController.abi, environment.contractAddress);
  }

  /**
   * Gets all the contests
   */
  public getContests(): Observable<Contest> {
    let address: string;
    return from(this.web3Service.getDefaultAccount()).pipe(
      tap(add => (address = add)),
      switchMap(() =>
        this.contract.methods.getContestsCount().call({
          from: address
        })
      ),
      switchMap((contestCount: number) => range(0, contestCount)),
      mergeMap(index =>
        from(
          this.contract.methods.contestAccounts(index).call({
            from: address
          })
        ).pipe(
          switchMap((contestAddress: string) =>
            this.contract.methods.getContest(contestAddress).call({
              from: address
            })
          ),
          map(
            (response: any) =>
              <Contest>{
                id: response.title,
                title: response.title,
                initialDate: response.startDate,
                participationLimitDate: response.timeToCandidatures,
                endDate: response.endDate,
                prize: response.award
              }
          )
        )
      )
    );
  }

  /**
   * Creates a contest
   */
  public createContest(contest: Contest): Observable<TransactionReceipt> {
    return from(this.web3Service.getDefaultAccount()).pipe(
      switchMap(address =>
        this.contract.methods
          .createContest(
            contest.title,
            contest.initialDate,
            contest.endDate,
            contest.participationLimitDate
          )
          .send({
            from: address,
            value: contest.prize * 1000000000000000000,
            gas: 4712388,
            gasPrice: 20
          })
      ),
      tap(txPromise =>
        this.transactionStates.registerTransaction(txPromise, contest.title)
      )
    );
  }
}
