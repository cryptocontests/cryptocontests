import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule, MatIconModule } from '@angular/material';

import { LoadingComponent } from './components/loading/loading.component';
import { AsyncLoadingDirective } from './directives/async-loading.directive';
import { GlobalLoadingService } from './services/global-loading.service';
import { LoadingEmptyComponent } from './components/loading-empty/loading-empty.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoadingErrorComponent } from './components/loading-error/loading-error.component';
import { NgrxLoadingDirective } from './directives/ngrx-loading.directive';
import { SyncLoadingDirective } from './directives/sync-loading.directive';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    FlexLayoutModule
  ],
  declarations: [
    LoadingComponent,
    AsyncLoadingDirective,
    LoadingEmptyComponent,
    LoadingErrorComponent,
    NgrxLoadingDirective,
    SyncLoadingDirective
  ],
  entryComponents: [
    LoadingComponent,
    LoadingEmptyComponent,
    LoadingErrorComponent
  ],
  exports: [
    LoadingComponent,
    SyncLoadingDirective,
    AsyncLoadingDirective,
    NgrxLoadingDirective,
    LoadingEmptyComponent
  ],
  providers: [GlobalLoadingService]
})
export class LoadingUtilsModule {}
