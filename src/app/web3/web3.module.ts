import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3Service } from './services/web3.service';
import { CryptoConverterPipe } from './crypto-converter.pipe';
import { TransactionListComponent } from './components/web3-transaction-list/web3-transaction-list.component';
import {
  MatBadgeModule,
  MatIconModule,
  MatListModule,
  MatButtonModule,
  MatCardModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Web3TransactionLauncherDirective } from './components/web3-transaction-launcher.directive';
import { Web3TransactionButtonComponent } from './components/web3-transaction-button/web3-transaction-button.component';
import { TransactionStateService } from './services/transaction-state.service';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatCardModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  declarations: [
    CryptoConverterPipe,
    TransactionListComponent,
    Web3TransactionLauncherDirective,
    Web3TransactionButtonComponent
  ],
  entryComponents: [TransactionListComponent],
  providers: [Web3Service, TransactionStateService],
  exports: [
    TransactionListComponent,
    CryptoConverterPipe,
    Web3TransactionLauncherDirective,
    Web3TransactionButtonComponent
  ]
})
export class Web3Module {}
