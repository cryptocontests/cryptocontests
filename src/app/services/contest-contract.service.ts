import { environment } from './../../environments/environment';
import { TransactionReceipt, PromiEvent, Contract } from 'web3/types';
import { Injectable } from '@angular/core';
import {
  Observable,
  from,
  of as observableOf,
  forkJoin,
  combineLatest
} from 'rxjs';
import {
  switchMap,
  map,
  tap,
  defaultIfEmpty,
  withLatestFrom
} from 'rxjs/operators';
import {
  Contest,
  Candidature,
  ContestPhase,
  Judge
} from '../state/contest.model';
import * as _ from 'lodash';
import {
  IpfsService,
  Web3Service,
  TransactionStateService,
  CryptoCurrency,
  CryptoValue,
  CurrencyService,
  IpfsFile,
  FileReceipt
} from 'ng-web3';
import { sha256, sha224 } from 'js-sha256';

declare function require(url: string);
const ContestController = require('./../../../build/contracts/ContestController.json');

@Injectable({
  providedIn: 'root'
})
export class ContestContractService {
  protected contract: Contract;

  constructor(
    private web3Service: Web3Service,
    private transactionStates: TransactionStateService,
    private currencyService: CurrencyService,
    private ipfs: IpfsService
  ) {
    this.contract = this.web3Service.newContract(
      ContestController.abi,
      environment.contractAddress
    );
  }

  /**
   * Helpers methods that interact directly with the contract
   */

  getDefaultAccount = from(this.web3Service.getDefaultAccount());
  getAllTags = (address: string) =>
    this.contract.methods.getAllTags().call({
      from: address
    });
  getTotalContestCount = (address: string) =>
    this.contract.methods.getTotalContestsCount().call({
      from: address
    });
  getContestHashByIndex = (address: string, index: number) =>
    this.contract.methods.contestList(index).call({
      from: address
    });
  getContestByHash = (address: string, contestHash: string) =>
    this.contract.methods.getContest(contestHash).call({
      from: address
    });
  getCandidaturesByContestHash = (address: string, contestHash: string) =>
    this.contract.methods.getCandidaturesByContest(contestHash).call({
      from: address
    });
  getCandidature = (
    address: string,
    contestHash: string,
    candidatureHash: string
  ) =>
    this.contract.methods.getCandidature(contestHash, candidatureHash).call({
      from: address
    });
  getOwnCandidatures = (
    address: string,
    contestHash: string
  ) =>
    this.contract.methods.getOwnCandidatures(contestHash).call({
      from: address
    })
  responseToContest = (contestHash: string, response: any) =>
    <Contest>{
      id: contestHash,
      owner: response.owner,
      additionalContent: response.ipfsHash,
      title: response.title,
      createdDate: parseInt(response.createdDate, 10) * 1000,
      initialDate: response.initialDate * 1000,
      candidatureLimitDate: response.candidatureLimitDate * 1000,
      endDate: response.endDate * 1000,
      prize: {
        value: response.award,
        currency: CryptoCurrency.WEIS
      },
      candidaturesStake: {
        value: response.candidaturesStake,
        currency: CryptoCurrency.WEIS
      },
      tags: response.tags.map(tag => this.web3Service.bytesToString(tag)),
      options: {},
      judges: response.judges
    };
  responseToCandidature = (response: any, ipfsFile: IpfsFile) =>
    <Candidature>{
      title: response.title,
      creator: response.owner,
      date: response.creationDate,
      content: {
        hash: response.content,
        content: ipfsFile.content
      },
      votes: response.votes
    };

  /**
   * Gets all the tags
   */
  public getTags(): Observable<string[]> {
    return this.getDefaultAccount.pipe(
      switchMap((address: string) => this.getAllTags(address)),
      map((tags: any[]) => tags.map(tag => this.web3Service.bytesToString(tag)))
    );
  }

  /**
   * Get a contest from the contest hash
   */
  public getContest(contestHash: string): Observable<Contest> {
    let address: string;
    return this.getDefaultAccount.pipe(
      tap(add => (address = add)),
      switchMap(add =>
        combineLatest(
          this.getContestByHash(address, contestHash),
          this.contract.methods
            .getContestJudges(contestHash)
            .call({ from: address })
        )
      ),
      switchMap(([response, judgesAddresses]) =>
        forkJoin(
          judgesAddresses.map((judgeAddress: string) =>
            this.contract.methods
              .getJudgeDetails(contestHash, judgeAddress)
              .call({ from: address })
          )
        ).pipe(
          map(judges => ({
            ...response,
            judges: judges.map(
              (judgeResponse: any) =>
                <Judge>{
                  address: judgeResponse.judgeAddress,
                  name: judgeResponse.judgeName,
                  weight: judgeResponse.judgeWeight
                }
            )
          }))
        )
      ),
      map((response: any) => this.responseToContest(contestHash, response))
    );
  }

  /**
   * Gets all the contests
   */
  public getContests(filter: Partial<Contest>): Observable<Contest[]> {
    let address: string;
    return this.getDefaultAccount.pipe(
      tap(add => (address = add)),
      switchMap(() => this.getTotalContestCount(address)),
      switchMap((contestCount: number) =>
        forkJoin(
          _.range(0, contestCount).map((index: number) =>
            from(this.getContestHashByIndex(address, index)).pipe(
              switchMap((contestHash: string) => this.getContest(contestHash))
            )
          )
        )
      ),
      defaultIfEmpty([])
    );
  }

  /**
   * Creates a contest
   */
  public createContest(contest: Partial<Contest>): Observable<TransactionReceipt> {
    // TODO: uncomment when the contest includes an image
    // const pinFile: Observable<FileReceipt> = from(this.ipfs.addFile(<Buffer>contest.imageHash));
    const ipfsFiles: IpfsFile[] = [
      {
        path: 'image.png',
        content: contest.additionalContent.content.image
      },
      {
        path: 'description.txt',
        content: new Buffer(contest.additionalContent.content.description)
      }
    ];
    const additionalContestContent = from(
      this.ipfs.add(ipfsFiles, {
        pin: false,
        wrapWithDirectory: true
      })
    );

    return this.getDefaultAccount.pipe(
      //      withLatestFrom(additionalContestContent),
      //      map(([address, receipt]) =>
      map(address =>
        this.contract.methods
          .setNewContest(
            contest.title,
            contest.tags.map(tag => this.web3Service.stringToBytes(tag)),
            contest.initialDate / 1000,
            contest.candidatureLimitDate / 1000,
            contest.endDate / 1000,
            this.currencyService.ethToWeis(contest.candidaturesStake.value),
            '0x341f85f5eca6304166fcfb6f591d49f6019f23fa39be0615e6417da06bf747ce',
            contest.judges[0].address,
            contest.judges[0].name,
            contest.judges[0].weight
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

  /**
   * Add judge to the given contest
   */
  public addJudge(
    contestHash: string,
    judge: Judge
  ): Observable<TransactionReceipt> {
    return this.getDefaultAccount.pipe(
      map(address =>
        this.contract.methods
          .addJudge(contestHash, judge.address, judge.name, judge.weight)
          .send({
            from: address,
            gas: 4712388,
            gasPrice: 20
          })
      ),
      tap(txPromise =>
        this.transactionStates.registerTransaction(
          txPromise,
          'Adding ' + judge.name
        )
      ),
      switchMap(promise => promise)
    );
  }

  /**
   * Add judge to the given contest
   */
  public removeJudge(
    contestHash: string,
    judge: Judge
  ): Observable<TransactionReceipt> {
    return this.getDefaultAccount.pipe(
      map(address =>
        this.contract.methods.removeJudge(contestHash, judge.address).send({
          from: address,
          gas: 4712388,
          gasPrice: 20
        })
      ),
      tap(txPromise =>
        this.transactionStates.registerTransaction(
          txPromise,
          'Removing ' + judge.name
        )
      ),
      switchMap(promise => promise)
    );
  }

  /**
   * Gets all the candidatures for the given contest
   */
  public getContestCandidatures(
    contestHash: string
  ): Observable<Candidature[]> {
    let address: string;

    return this.getDefaultAccount.pipe(
      tap(add => (address = add)),
      switchMap(() => this.getCandidaturesByContestHash(address, contestHash)),
      switchMap(hashes =>
        forkJoin(
          hashes.map((candidatureHash: string) =>
            combineLatest(
              this.getCandidature(address, contestHash, candidatureHash),
              this.ipfs.get(this.ipfs.getIpfsHashFromBytes32(candidatureHash))
            ).pipe(
              map(([response, ipfsFile]) =>
                this.responseToCandidature(response, ipfsFile[0])
              )
            )
          )
        )
      ),
      defaultIfEmpty([])
    );
  }

  /**
   * Creates a candidature
   */
  public createCandidature(
    contestHash: string,
    stake: CryptoValue,
    candidature: Candidature
  ): Observable<TransactionReceipt> {
    return this.getDefaultAccount.pipe(
      map(address =>
        this.contract.methods
          .setNewCandidature(
            candidature.content.hash,
            candidature.title,
            contestHash
          )
          .send({
            value: this.currencyService.ethToWeis(stake.value),
            from: address,
            gas: 4712388,
            gasPrice: 20
          })
      ),
      tap(txPromise =>
        this.transactionStates.registerTransaction(txPromise, candidature.title)
      ),
      switchMap(promise => promise)
    );
  }

  /**
   * Uploads a candidature to ipfs if its hash exists on the given contest
   */
  public uploadCandidature(contestHash: string, candidature: Candidature): Observable<FileReceipt> {
    const hash = sha256(candidature.content.content);

    return this.getDefaultAccount.pipe(
      map(address => this.contract.methods.getOwnCandidatures(contestHash).call({
        from: address
      })),
      tap((candidatureHashes: string[]) => {
        if (candidatureHashes.includes(hash)) {
          throw new Error('The given content does not match any of the candidatures of the sender in the current contest');
        }
      }),
      map((candidatureHashes: string[]) => this.ipfs.add(candidature.content.content, {
        pin: false
      }))
    );
  }

  /**
   * Retrieve the stake of the candidature
   */
  public retrieveFunds(contestHash: string): Observable<TransactionReceipt> {
    return this.getDefaultAccount.pipe(
      map(address => this.contract.methods.refundToCandidates(contestHash).send({
        from: address,
        gas: 4712388,
        gasPrice: 20
      })),
      tap(txPromise =>
        this.transactionStates.registerTransaction(txPromise, contestHash)
      ),
      switchMap(promise => promise)
    );
  }
}
