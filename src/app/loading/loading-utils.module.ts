import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule, MatIconModule } from '@angular/material';

import { LoadingComponent } from './components/loading/loading.component';
import { LoadingDirective } from './loading.directive';
import { GlobalLoadingService } from './global-loading.service';
import { LoadingEmptyComponent } from './components/loading-empty/loading-empty.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoadingErrorComponent } from './components/loading-error/loading-error.component';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    FlexLayoutModule
  ],
  declarations: [LoadingComponent, LoadingDirective, LoadingEmptyComponent, LoadingErrorComponent],
  entryComponents: [LoadingComponent, LoadingEmptyComponent, LoadingErrorComponent],
  exports: [LoadingComponent, LoadingDirective, LoadingEmptyComponent],
  providers: [GlobalLoadingService]
})
export class LoadingUtilsModule { }
