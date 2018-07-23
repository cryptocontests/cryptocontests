import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { FilterToolbarComponent } from './filter-toolbar/filter-toolbar.component';

@Directive({
  selector: '[filterToggler]'
})
export class FilterTogglerDirective implements OnInit {
  @Input() filterToggler: FilterToolbarComponent;
  filterActive = false;

  constructor() {}

  ngOnInit() {
    this.filterToggler.setShow(false);
  }

  @HostListener('click')
  toggleFilter() {
    this.filterToggler.toggle();
  }
}
