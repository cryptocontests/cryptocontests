import { Web3Service } from './web3.service';
import { TransactionState } from '../transaction.model';
import { Contract, TransactionReceipt, PromiEvent } from 'web3/types';

export abstract class SmartContractService {
  protected contract: Contract;

  constructor(
    private web3: Web3Service,
    private contractAbi: any,
    private contractAddress: string
  ) {
    if (this.web3.initWeb3()) {
      this.contract = this.web3.newContract(contractAbi, contractAddress);
    }
  }
}
