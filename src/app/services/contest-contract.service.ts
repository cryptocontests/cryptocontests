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
  mergeMap,
  withLatestFrom
} from 'rxjs/operators';
import { Contest } from '../state/contest.model';
import * as _ from 'lodash';
import { Web3Service } from '../web3/services/web3.service';
import { TransactionStateService } from '../web3/services/transaction-state.service';
import { CryptoCurrency } from '../web3/transaction.model';
import { CurrencyService } from '../web3/services/currency.service';
import { IpfsService, FileReceipt, IpfsFile } from '../web3/services/ipfs.service';
declare function require(url: string);

const ContestController = require('./../../../build/contracts/ContestController.json');

@Injectable({
  providedIn: 'root'
})
export class ContestContractService extends SmartContractService {
  constructor(
    private web3Service: Web3Service,
    private transactionStates: TransactionStateService,
    private currencyService: CurrencyService,
    private ipfs: IpfsService
  ) {
    super(web3Service, ContestController.abi, environment.contractAddress);
  }

  getDefaultAccount = from(this.web3Service.getDefaultAccount());
  getTotalContestCount = (address: string) => switchMap(() =>
    this.contract.methods.getTotalContestsCount().call({
      from: address
    })
  )
  getContestHashByIndex = (address: string, index: number) =>
    this.contract.methods.contestHashes(index).call({
      from: address
    })
  getContestByHash = (address: string) => switchMap((contestHash: string) =>
    this.contract.methods.getContest(contestHash).call({
      from: address
    })
  )
  // tslint:disable-next-line:member-ordering
  responseToContest = map((response: any) =>
        <Contest>{
          id: response.contestHash,
          title: response.title,
          initialDate: response.startContest,
          participationLimitDate: response.timeToCandidatures,
          endDate: response.endContest,
          prize: {
            value: response.award,
            currency: CryptoCurrency.WEIS
          },
          tags: null // response[1].tags
        }
    );

  /**
   * Gets all the contests
   */
  public getContests(): Observable<Contest> {
    let address: string;
    return this.getDefaultAccount.pipe(
      tap(add => (address = add)),
      this.getTotalContestCount(address),
      switchMap((contestCount: number) => range(0, contestCount)),
      mergeMap(index =>
        from(
          this.getContestHashByIndex(address, index),
        ).pipe(
          this.getContestByHash(address),
          this.responseToContest
        )
      )
    );
  }

  /**
   * Creates a contest
   */
  public createContest(contest: Contest): Observable<TransactionReceipt> {
    // TODO: uncomment when the contest includes an image
    // const pinFile: Observable<FileReceipt> = from(this.ipfs.addFile(<Buffer>contest.imageHash));
    const ipfsFiles: IpfsFile[] = [{
      path: 'image.png',
      content: contest.additionalContent.content.image
    }, {
      path: 'description.txt',
      content: new Buffer(contest.additionalContent.content.description)
    }];
    const additionalContestContent = from(this.ipfs.add(ipfsFiles, {pin: false, wrapWithDirectory: true}));

    return this.getDefaultAccount.pipe(
//      withLatestFrom(additionalContestContent),
//      map(([address, receipt]) =>
      map((address) =>
        this.contract.methods
          .setNewContest(
            contest.title,
            contest.initialDate,
            contest.endDate,
            contest.participationLimitDate,
            contest.options.limitParticipations,
            '0x341f85f5eca6304166fcfb6f591d49f6019f23fa39be0615e6417da06bf747ce'
          )
          .send({
            from: address,
            value: this.currencyService.ethToWeis(contest.prize.value),
            gas: 4712388,
            gasPrice: 20
          })
      ),
      tap(txPromise =>
        this.transactionStates.registerTransaction(txPromise, contest.title)
      ),
      switchMap(promise => promise)
    );
  }
}
