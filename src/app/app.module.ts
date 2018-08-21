import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';

import { FileHelpersModule } from 'ngx-file-helpers';

import { CollectionUtilsModule } from 'ng-collection-utils';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { ContestEffects } from './state/contest.effects';
import { contestReducer } from './state/contest.reducer';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateContestComponent } from './components/create-contest/create-contest.component';
import { ContestGridComponent } from './components/contest-grid/contest-grid.component';
import { Web3Module } from 'ng-web3';

import { ContestContractService } from './services/contest-contract.service';
import { ContestDetailComponent } from './components/contest-detail/contest-detail.component';
import { TagsComponent } from './components/tags/tags.component';
import { CandidaturesGridComponent } from './components/candidatures-grid/candidatures-grid.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { FilePickerComponent } from './components/file-picker/file-picker.component';
import { CreateCandidatureComponent } from './components/create-candidature/create-candidature.component';
import { JudgesListComponent } from './components/judges-list/judges-list.component';
import { HashColorDirective } from './hash-color.directive';
import { AddJudgeComponent } from './components/add-judge/add-judge.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CreateContestComponent,
    ContestGridComponent,
    ContestDetailComponent,
    TagsComponent,
    CandidaturesGridComponent,
    ConfirmDialogComponent,
    FilePickerComponent,
    CreateCandidatureComponent,
    JudgesListComponent,
    HashColorDirective,
    AddJudgeComponent
  ],
  entryComponents: [
    ConfirmDialogComponent,
    CreateCandidatureComponent,
    AddJudgeComponent
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
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    Web3Module,
    CollectionUtilsModule
  ],
  providers: [ContestContractService],
  bootstrap: [AppComponent]
})
export class AppModule {}
