import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  Inject
} from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';
import { MatRadioChange } from '@angular/material';
import { SORTING_OPTIONS } from '../sort-by-menu.directive';

@Component({
  selector: 'lib-sorting-menu',
  templateUrl: './sort-by.component.html',
  styleUrls: ['./sort-by.component.css']
})
export class SortByComponent {
  @Input() options: string[] = [];
  @Input() title = 'Sort by';
  @Output() optionSelected = new EventEmitter<string>();

  constructor(@Inject(SORTING_OPTIONS) public sortingData: any) {
    if (sortingData) {
      this.options = sortingData.options;
      this.title = sortingData.title;
      this.optionSelected = sortingData.eventEmitter;
    }
  }

  selectOption(change: MatRadioChange) {
    this.optionSelected.emit(change.value);
  }
}
