import {
  Directive,
  HostListener,
  Input,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { FilterToolbarComponent } from './filter-toolbar/filter-toolbar.component';

@Directive({
  selector: '[filterToggler]'
})
export class FilterTogglerDirective implements OnInit {
  @Input()
  filterToggler: FilterToolbarComponent;
  @Output()
  filterToggled = new EventEmitter<boolean>();
  @Input()
  filterActive = false;

  constructor() {}

  ngOnInit() {
    this.filterToggler.setShow(this.filterActive);
  }

  @HostListener('click')
  toggleFilter() {
    this.filterToggler.toggle();
    this.filterToggled.emit(this.filterToggler.show);
  }
}
