import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule,
  MatRadioModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SortByMenuDirective } from './sort-by-menu.directive';
import { SortByComponent } from './sort-by/sort-by.component';
import { FilterToolbarComponent } from './filter-toolbar/filter-toolbar.component';
import { FilterStringComponent } from './filter-string/filter-string.component';
import { FilterComponent } from './filter.component';
import { FormsModule } from '@angular/forms';
import { FilterTogglerDirective } from './filter-toggler.directive';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatRadioModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule
  ],
  declarations: [
    SortByMenuDirective,
    SortByComponent,
    FilterToolbarComponent,
    FilterStringComponent,
    FilterComponent,
    FilterTogglerDirective
  ],
  exports: [
    SortByMenuDirective,
    FilterToolbarComponent,
    FilterStringComponent,
    FilterTogglerDirective
  ],
  entryComponents: [SortByComponent]
})
export class FilterUtilsModule {}
