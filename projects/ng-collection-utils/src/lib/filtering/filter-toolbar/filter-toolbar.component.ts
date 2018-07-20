import {
  Component,
  QueryList,
  ContentChildren,
  OnDestroy,
  AfterViewInit,
  Output,
  EventEmitter,
  ContentChild,
  ViewEncapsulation
} from '@angular/core';
import { FilterAutocompleteComponent } from '../filter-autocomplete/filter-autocomplete.component';
import { FilterDateComponent } from '../filter-date/filter-date.component';
import * as _ from 'lodash';
import { FilterNumberComponent } from '../filter-number/filter-number.component';
import { FilterStringComponent } from '../filter-string/filter-string.component';
import { FilterComponent } from '../filter.component';
import { FilterSelectComponent } from '../filter-select/filter-select.component';
import { FilterMultioptionComponent } from '../filter-multioption/filter-multioption.component';
import { FilterAdvancedComponent } from '../filter-advanced/filter-advanced.component';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CdkPortal } from '@angular/cdk/portal';
import { FormGroup, FormBuilder } from '@angular/forms';
import { filterAnimation } from '../../animations';

@Component({
  selector: 'filter-toolbar',
  templateUrl: './filter-toolbar.component.html',
  styleUrls: ['./filter-toolbar.component.css'],
  animations: [filterAnimation],
  encapsulation: ViewEncapsulation.None
})
export class FilterToolbarComponent implements AfterViewInit, OnDestroy {
  @Output() valueChanges = new EventEmitter<any>();
  formGroup: FormGroup;

  @ContentChildren(FilterAutocompleteComponent)
  autocompleteFilters: QueryList<FilterAutocompleteComponent>;

  @ContentChildren(FilterSelectComponent)
  selectFilters: QueryList<FilterSelectComponent>;

  @ContentChildren(FilterMultioptionComponent)
  multioptionFilters: QueryList<FilterMultioptionComponent>;

  @ContentChildren(FilterNumberComponent)
  numberFilters: QueryList<FilterNumberComponent>;

  @ContentChildren(FilterStringComponent)
  stringFilters: QueryList<FilterStringComponent>;

  @ContentChildren(FilterDateComponent)
  dateFilters: QueryList<FilterDateComponent>;

  @ContentChild(FilterAdvancedComponent)
  advancedFilter: FilterAdvancedComponent;

  show = true;
  expandable = false;
  expanded = false;
  advancedPortal: CdkPortal;
  subscription: Subscription;

  constructor(private formBuilder: FormBuilder) {}

  private listToArray<T>(list: QueryList<T>): Array<T> {
    return list ? list.toArray() : [];
  }

  /**
   * Concats all active filters, including the advanced filters if active
   */
  getAllFilters(): FilterComponent[] {
    let filters = _.concat(
      this.listToArray(this.autocompleteFilters),
      this.listToArray(this.multioptionFilters),
      this.listToArray(this.selectFilters),
      this.listToArray(this.dateFilters),
      this.listToArray(this.numberFilters),
      this.listToArray(this.stringFilters)
    );
    if (this.expanded) {
      filters = _.concat(filters, this.advancedFilter.getAllFilters());
    }
    return filters;
  }

  /**
   * Here the views have been populated, build the form
   */
  ngAfterViewInit() {
    if (this.advancedFilter) {
      this.expandable = true;
      this.advancedPortal = this.advancedFilter.portal;
    }
    this.buildForm();
  }

  /**
   * Cleanup
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Set filter toolbar visibility state
   * Needed for the interaction with filter-toggler.directive
   */
  setShow(_show: boolean) {
    this.show = _show;
  }

  /**
   * Toggle filter toolbar visibility state
   */
  toggle() {
    this.show = !this.show;
  }

  /**
   * Toggles the visibility of the advanced filter component and
   * rebuilds the form
   */
  toggleExpanded() {
    this.expanded = !this.expanded;

    this.subscription.unsubscribe();
    this.buildForm();
  }

  /**
   * Retrieve all active filters and build the global group form
   */
  private buildForm() {
    this.formGroup = this.formBuilder.group(
      this.getAllFilters().reduce(
        (formObject, value) => ({
          ...formObject,
          [value.name]: value.formGroup
        }),
        {}
      )
    );
    this.subscription = this.formGroup.valueChanges
      .pipe(
        tap(values => this.removeNulls(values)),
        tap(values => this.flatFilter(values))
      )
      .subscribe(values => this.valueChanges.emit(values));
  }

  private removeNulls(obj: any) {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object' && obj[key] !== null)
        this.removeNulls(obj[key]);
      if (
        !obj[key] ||
        (typeof obj[key] === 'object' && Object.keys(obj[key]).length === 0)
      )
        delete obj[key];
    });
  }

  private flatFilter(filterValue: any) {
    Object.keys(filterValue).forEach(filterProperty => {
      const keys = Object.keys(filterValue);
      if (keys.length === 1 && filterProperty === keys[0]) {
        filterValue[filterProperty] = filterValue[filterProperty][keys[0]];
      }
    });
  }
}
