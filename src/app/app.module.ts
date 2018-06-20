import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { contestReducer } from './state/reducers/contest.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { ContestEffects } from './state/effects/contest.effects';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateContestComponent } from './components/create-contest/create-contest.component';
import { ContestGridComponent } from './components/contest-grid/contest-grid.component';

@NgModule({
  declarations: [AppComponent, DashboardComponent, CreateContestComponent, ContestGridComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    StoreModule.forRoot(contestReducer),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([ContestEffects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
