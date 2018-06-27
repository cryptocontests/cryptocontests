import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3Service } from './services/web3.service';
import { CryptoConverterPipe } from './crypto-converter.pipe';
import { StoreModule } from '@ngrx/store';
import * as fromTransaction from './state/reducers/transaction.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TransactionEffects } from './state/effects/transaction.effects';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import {
  MatBadgeModule,
  MatIconModule,
  MatListModule,
  MatButtonModule
} from '@angular/material';
import { Web3TransactionLauncherDirective } from './components/web3-transaction-launcher.directive';
import { Web3TransactionButtonComponent } from './components/web3-transaction-button/web3-transaction-button.component';

@NgModule({
  imports: [
    CommonModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    StoreModule.forFeature('transaction', fromTransaction.transactionReducer),
    EffectsModule.forFeature([TransactionEffects])
  ],
  declarations: [
    CryptoConverterPipe,
    TransactionListComponent,
    Web3TransactionLauncherDirective,
    Web3TransactionButtonComponent
  ],
  entryComponents: [TransactionListComponent],
  providers: [Web3Service],
  exports: [
    TransactionListComponent,
    CryptoConverterPipe,
    Web3TransactionLauncherDirective,
    Web3TransactionButtonComponent
  ]
})
export class Web3Module {}
