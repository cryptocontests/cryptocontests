import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ContentChildren,
  QueryList
} from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';
import { FilterAutocompleteComponent } from '../filter-autocomplete/filter-autocomplete.component';
import { FilterNumberComponent } from '../filter-number/filter-number.component';
import { FilterStringComponent } from '../filter-string/filter-string.component';
import { FilterDateComponent } from '../filter-date/filter-date.component';
import { FilterComponent } from '../filter.component';
import * as _ from 'lodash';

@Component({
  selector: 'filter-advanced',
  templateUrl: './filter-advanced.component.html',
  styleUrls: ['./filter-advanced.component.css']
})
export class FilterAdvancedComponent implements OnInit {
  @ViewChild(CdkPortal) portal: CdkPortal;

  @ContentChildren(FilterAutocompleteComponent)
  autocompleteFilters: QueryList<FilterAutocompleteComponent>;

  @ContentChildren(FilterNumberComponent)
  numberFilters: QueryList<FilterNumberComponent>;

  @ContentChildren(FilterStringComponent)
  stringFilters: QueryList<FilterStringComponent>;

  @ContentChildren(FilterDateComponent)
  dateFilters: QueryList<FilterDateComponent>;
  constructor() {}

  ngOnInit() {}

  private listToArray<T>(list: QueryList<T>): Array<T> {
    return list ? list.toArray() : [];
  }

  public getAllFilters(): FilterComponent[] {
    return _.concat(
      this.listToArray(this.autocompleteFilters),
      this.listToArray(this.dateFilters),
      this.listToArray(this.numberFilters),
      this.listToArray(this.stringFilters)
    );
  }
}
