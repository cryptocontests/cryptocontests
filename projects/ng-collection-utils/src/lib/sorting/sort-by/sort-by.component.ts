import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  Inject,
  InjectionToken
} from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';
import { MatRadioChange } from '@angular/material';
import { overlayAnimation } from '../../animations';

export const SORTING_OPTIONS = new InjectionToken<any>('SORTING_OPTIONS');

export enum SortOrder { DESCENDING = 'desc', ASCENDING = 'asc'}
export interface SortOptions {
  sortby: string;
  sortorder: SortOrder;
}

@Component({
  selector: 'sorting-menu',
  templateUrl: './sort-by.component.html',
  styleUrls: ['./sort-by.component.css'],
  animations: [overlayAnimation]
})
export class SortByComponent implements OnInit {
  @Input() options: string[];
  @Input() title = 'Sort by';
  @Input() sortOrder: SortOrder = SortOrder.DESCENDING;
  @Output() sortChange = new EventEmitter<SortOptions>();

  selectedProperty: string;

  constructor(@Inject(SORTING_OPTIONS) public sortingData: any) {
    if (sortingData) {
      this.options = sortingData.options;
      this.title = sortingData.title;
      this.sortChange = sortingData.eventEmitter;
    }
  }

  ngOnInit() {
    this.selectedProperty = this.options[0];
  }

  sortChanged() {
    this.sortChange.emit({
      sortby: this.selectedProperty,
      sortorder: this.sortOrder === SortOrder.ASCENDING ? SortOrder.ASCENDING : SortOrder.DESCENDING
    });
  }
}
