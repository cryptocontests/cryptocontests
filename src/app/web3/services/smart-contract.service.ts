import { Web3Service } from './web3.service';

export abstract class SmartContractService {
  protected contract: any;

  constructor(
    private web3: Web3Service,
    private contractAbi: any,
    private contractAddress: string
  ) {
    this.contract = this.web3.newContract(contractAbi, contractAddress);
  }
}
