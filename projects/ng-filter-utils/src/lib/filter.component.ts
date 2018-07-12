import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  template: ''
})
export class FilterComponent {
  @Input() title: string;
  @Output() filterChange: EventEmitter<any>;

  value: any;

  constructor() {}
}
