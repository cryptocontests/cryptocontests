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
// import { overlayAnimation } from '../animations';

export const SORTING_OPTIONS = new InjectionToken<any>('SORTING_OPTIONS');

@Component({
  selector: 'lib-sorting-menu',
  templateUrl: './sort-by.component.html',
  styleUrls: ['./sort-by.component.css']
  //  animations: overlayAnimation
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
