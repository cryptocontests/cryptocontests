import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartContractService } from './services/smart-contract.service';
import { CryptoConverterPipe } from './crypto-converter.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [CryptoConverterPipe],
  providers: [SmartContractService]
})
export class EthereumModule {}
