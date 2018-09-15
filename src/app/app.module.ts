import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

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
import { GenericGalleryModule } from 'projects/ng-generic-gallery/src/public_api';
import { CancelCandidatureComponent } from './components/cancel-candidature/cancel-candidature.component';
import { Web3ErrorComponent } from './components/web3-error/web3-error.component';

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
    AddJudgeComponent,
    CancelCandidatureComponent,
    Web3ErrorComponent
  ],
  entryComponents: [
    ConfirmDialogComponent,
    CreateCandidatureComponent,
    AddJudgeComponent,
    CancelCandidatureComponent,
    Web3ErrorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
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
    CollectionUtilsModule,
    GenericGalleryModule
  ],
  providers: [ContestContractService],
  bootstrap: [AppComponent]
})
export class AppModule {}
