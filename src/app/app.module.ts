import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';

import { FileUploadModule } from 'ng2-file-upload';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { ContestEffects } from './state/effects/contest.effects';
import { contestReducer } from './state/reducers/contest.reducer';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateContestComponent } from './components/create-contest/create-contest.component';
import { ContestGridComponent } from './components/contest-grid/contest-grid.component';
import { Web3Module } from './web3/web3.module';
import { ContestContractService } from './services/contest-contract.service';
import { ContestDetailComponent } from './components/contest-detail/contest-detail.component';
import { TagsComponent } from './components/tags/tags.component';
import { ParticipationsGridComponent } from './components/participations-grid/participations-grid.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { transactionReducer } from './web3/state/reducers/transaction.reducer';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CreateContestComponent,
    ContestGridComponent,
    ContestDetailComponent,
    TagsComponent,
    ParticipationsGridComponent,
    ConfirmDialogComponent
  ],
  entryComponents: [ConfirmDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    FileUploadModule,
    AppRoutingModule,
    StoreModule.forRoot({
      contest: contestReducer,
      router: routerReducer
    }),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    EffectsModule.forRoot([ContestEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    Web3Module
  ],
  providers: [ContestContractService],
  bootstrap: [AppComponent]
})
export class AppModule {}
