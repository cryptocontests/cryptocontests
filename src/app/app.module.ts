import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import {
  StoreRouterConnectingModule,
  routerReducer
} from '@ngrx/router-store';

import { FileHelpersModule } from 'ngx-file-helpers';

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
import { LoadingUtilsModule } from './loading/loading-utils.module';

import { ContestContractService } from './services/contest-contract.service';
import { ContestDetailComponent } from './components/contest-detail/contest-detail.component';
import { TagsComponent } from './components/tags/tags.component';
import { ParticipationsGridComponent } from './components/participations-grid/participations-grid.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { FilePickerComponent } from './components/file-picker/file-picker.component';
import { MatTabsToolbarModule } from './mat-tabs-toolbar/mat-tabs-toolbar.module';
import { CreateParticipationComponent } from './components/create-participation/create-participation.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CreateContestComponent,
    ContestGridComponent,
    ContestDetailComponent,
    TagsComponent,
    ParticipationsGridComponent,
    ConfirmDialogComponent,
    FilePickerComponent,
    CreateParticipationComponent
  ],
  entryComponents: [
    ConfirmDialogComponent,
    CreateParticipationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    FileHelpersModule,
    AppRoutingModule,
    StoreModule.forRoot({
      contest: contestReducer,
      router: routerReducer
    }),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router'
    }),
    EffectsModule.forRoot([ContestEffects]),
    !environment.production
      ? StoreDevtoolsModule.instrument()
      : [],
    Web3Module,
    LoadingUtilsModule,
    MatTabsToolbarModule
  ],
  providers: [ContestContractService],
  bootstrap: [AppComponent]
})
export class AppModule {}
