import {
  Component,
  ChangeDetectorRef,
  ApplicationRef,
  OnInit,
  ViewChildren,
  QueryList,
  ContentChildren,
  AfterViewInit,
  Output,
  EventEmitter,
  ContentChild
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FilterAutocompleteComponent } from '../filter-autocomplete/filter-autocomplete.component';
import { FilterDateComponent } from '../filter-date/filter-date.component';
import * as _ from 'lodash';
import { FilterNumberComponent } from '../filter-number/filter-number.component';
import { FilterStringComponent } from '../filter-string/filter-string.component';
import { FilterComponent } from '../filter.component';
import { FilterAdvancedComponent } from '../filter-advanced//filter-advanced.component';
import { combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CdkPortal } from '@angular/cdk/portal';

@Component({
  selector: 'filter-toolbar',
  templateUrl: './filter-toolbar.component.html',
  styleUrls: ['./filter-toolbar.component.css']
})
export class FilterToolbarComponent implements AfterViewInit {
  @Output() valueChanges = new EventEmitter<any>();

  @ContentChildren(FilterAutocompleteComponent)
  autocompleteFilters: QueryList<FilterAutocompleteComponent>;

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

  constructor() {}

  private listToArray<T>(list: QueryList<T>): Array<T> {
    return list ? list.toArray() : [];
  }

  getAllFilters(): FilterComponent[] {
    return _.concat(
      this.listToArray(this.autocompleteFilters),
      this.listToArray(this.dateFilters),
      this.listToArray(this.numberFilters),
      this.listToArray(this.stringFilters)
    );
  }

  ngAfterViewInit() {
    this.subscribeToChanges(this.getAllFilters());
    if (this.advancedFilter) {
      this.expandable = true;
      this.advancedPortal = this.advancedFilter.portal;
    }
  }
  /*
  getInitialValues() {
    return _
      .concat(
        this.listToArray(this.autocompleteFilters),
        this.listToArray(this.dateFilters),
        this.listToArray(this.numberFilters),
        this.listToArray(this.stringFilters)
      )
      .reduce(
        (object, filter: FilterComponent) =>
          Object.assign(object, filter.()),
        {}
      );
  } */

  setShow(_show: boolean) {
    this.show = _show;
  }

  toggle() {
    this.show = !this.show;
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
    this.valueChanges = new EventEmitter<any>();

    let filters = this.getAllFilters();
    if (this.expanded) {
      filters = _.concat(filters, this.advancedFilter.getAllFilters());
    }

    this.subscribeToChanges(filters);
  }

  subscribeToChanges(filters: FilterComponent[]) {
    filters[0].formGroup.valueChanges.subscribe(console.log);
    combineLatest(
      filters.map(filter =>
        filter.formGroup.valueChanges.pipe(tap(console.log))
      )
    ).pipe(
      tap(console.log),
      map((tuple: any[]) =>
        tuple.reduce((object, value) => ({ ...object, value }), {})
      ),
      tap(object => this.valueChanges.emit(object))
    );
  }
}
