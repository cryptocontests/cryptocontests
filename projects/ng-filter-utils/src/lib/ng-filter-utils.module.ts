import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule,
  MatRadioModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatSelectModule,
  MatDatepickerModule,
  MatChipsModule,
  MatAutocompleteModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SortByMenuDirective } from './sort-by-menu.directive';
import { SortByComponent } from './sort-by/sort-by.component';
import { FilterToolbarComponent } from './filter-toolbar/filter-toolbar.component';
import { FilterStringComponent } from './filter-string/filter-string.component';
import { FilterComponent } from './filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterTogglerDirective } from './filter-toggler.directive';
import { FilterNumberComponent } from './filter-number/filter-number.component';
import { FilterDateComponent } from './filter-date/filter-date.component';
import { FilterMultioptionComponent } from './filter-multioption/filter-multioption.component';
import { FilterAutocompleteComponent } from './filter-autocomplete/filter-autocomplete.component';
import { ChipsAutocompleteComponent } from './chips-autocomplete/chips-autocomplete.component';
import { FilterGroupComponent } from './filter-group.component';
import { FilterAdvancedComponent } from './filter-advanced/filter-advanced.component';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatCardModule,
    MatRadioModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    PortalModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    SortByMenuDirective,
    SortByComponent,
    FilterToolbarComponent,
    FilterStringComponent,
    FilterComponent,
    FilterGroupComponent,
    FilterTogglerDirective,
    FilterNumberComponent,
    FilterDateComponent,
    FilterMultioptionComponent,
    FilterAutocompleteComponent,
    ChipsAutocompleteComponent,
    FilterAdvancedComponent
  ],
  exports: [
    SortByMenuDirective,
    FilterToolbarComponent,
    FilterStringComponent,
    FilterNumberComponent,
    FilterDateComponent,
    FilterAutocompleteComponent,
    FilterAdvancedComponent,
    ChipsAutocompleteComponent,
    FilterTogglerDirective
  ],
  entryComponents: [SortByComponent]
})
export class FilterUtilsModule {}
