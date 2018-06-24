import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3Service } from './services/web3.service';
import { CryptoConverterPipe } from './crypto-converter.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [CryptoConverterPipe],
  providers: [Web3Service]
})
export class Web3Module {}
