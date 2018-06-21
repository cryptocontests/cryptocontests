import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { ContestEffects } from './state/effects/contest.effects';
import { contestReducer } from './state/reducers/contest.reducer';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateContestComponent } from './components/create-contest/create-contest.component';
import { ContestGridComponent } from './components/contest-grid/contest-grid.component';
import { EthereumService } from './services/ethereum.service';
import { EthereumModule } from './ethereum/ethereum.module';
import { ContestDetailComponent } from './components/contest-detail/contest-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CreateContestComponent,
    ContestGridComponent,
    ContestDetailComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    StoreModule.forRoot({
      contest: contestReducer,
      router: routerReducer
    }),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' }),
    EffectsModule.forRoot([ContestEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EthereumModule
  ],
  providers: [EthereumService],
  bootstrap: [AppComponent]
})
export class AppModule {}
