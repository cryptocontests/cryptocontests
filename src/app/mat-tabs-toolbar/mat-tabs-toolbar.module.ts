import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarDirective } from './toolbar.directive';
import { MatTabsToolbarComponent } from './mat-tabs-toolbar/mat-tabs-toolbar.component';

import { MatTabsModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    FlexLayoutModule
  ],
  declarations: [ToolbarDirective, MatTabsToolbarComponent],
  entryComponents: [MatTabsToolbarComponent],
  exports: [ToolbarDirective, MatTabsToolbarComponent]
})
export class MatTabsToolbarModule { }
