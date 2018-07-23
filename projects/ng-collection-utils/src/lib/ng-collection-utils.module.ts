import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatCardModule,
  MatRadioModule,
  MatInputModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatIconModule,
  MatSelectModule,
  MatDatepickerModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatProgressSpinnerModule,
  MatSlideToggleModule,
  MatFormFieldModule,
  MatDividerModule,
  MatCheckboxModule
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { PortalModule } from '@angular/cdk/portal';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SortByMenuDirective } from './sorting/sort-by-menu.directive';
import { SortByComponent } from './sorting/sort-by/sort-by.component';
import { FilterToolbarComponent } from './filtering/filter-toolbar/filter-toolbar.component';
import { FilterStringComponent } from './filtering/filter-string/filter-string.component';
import { FilterComponent } from './filtering/filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterTogglerDirective } from './filtering/filter-toggler.directive';
import { FilterNumberComponent } from './filtering/filter-number/filter-number.component';
import { FilterDateComponent } from './filtering/filter-date/filter-date.component';
import { FilterMultioptionComponent } from './filtering/filter-multioption/filter-multioption.component';
import { FilterAutocompleteComponent } from './filtering/filter-autocomplete/filter-autocomplete.component';
import { ChipsAutocompleteComponent } from './components/chips-autocomplete/chips-autocomplete.component';
import { FilterGroupComponent } from './filtering/filter-group.component';
import { FilterAdvancedComponent } from './filtering/filter-advanced/filter-advanced.component';
import { LoadingComponent } from './loading/components/loading/loading.component';
import { AsyncLoadingDirective } from './loading/directives/async-loading.directive';
import { GlobalLoadingService } from './loading/services/global-loading.service';
import { LoadingEmptyComponent } from './loading/components/loading-empty/loading-empty.component';
import { LoadingErrorComponent } from './loading/components/loading-error/loading-error.component';
import { SyncLoadingDirective } from './loading/directives/sync-loading.directive';
import { SearchBoxComponent } from './searching/search-box/search-box.component';
import { LazyLoadingDirective } from './loading/directives/lazy-loading.directive';
import { FilterSelectComponent } from './filtering/filter-select/filter-select.component';
import { OverlayTriggerDirective } from './overlay-trigger.directive';
import { OverlayCardComponent } from './components/overlay-card/overlay-card.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatCardModule,
    MatRadioModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatMomentDateModule,
    MatDividerModule,
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
    FilterAdvancedComponent,
    LoadingComponent,
    AsyncLoadingDirective,
    LoadingEmptyComponent,
    LoadingErrorComponent,
    SyncLoadingDirective,
    SearchBoxComponent,
    LazyLoadingDirective,
    FilterSelectComponent,
    OverlayTriggerDirective,
    OverlayCardComponent
  ],
  exports: [
    SortByMenuDirective,
    FilterToolbarComponent,
    FilterStringComponent,
    FilterNumberComponent,
    FilterDateComponent,
    FilterAutocompleteComponent,
    FilterAdvancedComponent,
    FilterMultioptionComponent,
    ChipsAutocompleteComponent,
    FilterTogglerDirective,
    FilterSelectComponent,
    OverlayTriggerDirective,
    LoadingComponent,
    SyncLoadingDirective,
    AsyncLoadingDirective,
    LoadingEmptyComponent,
    SearchBoxComponent
  ],
  entryComponents: [
    SortByComponent,
    LoadingComponent,
    LoadingEmptyComponent,
    LoadingErrorComponent,
    OverlayCardComponent
  ],
  providers: [GlobalLoadingService]
})
export class CollectionUtilsModule {}
