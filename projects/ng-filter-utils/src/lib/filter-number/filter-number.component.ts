import { Component, OnInit, Input } from '@angular/core';
import { FilterGroupComponent } from '../filter-group.component';
import { FormBuilder, ControlContainer } from '@angular/forms';

export enum Operators {
  GREATER_THAN = '>',
  LESSER_THAN = '<',
  EQUALS = '=',
  BETWEEN = 'BETWEEN'
}

@Component({
  selector: 'filter-number',
  templateUrl: './filter-number.component.html',
  styleUrls: [
    './filter-number.component.css',
    '../filter-toolbar/filter-toolbar.component.css'
  ]
})
export class FilterNumberComponent extends FilterGroupComponent
  implements OnInit {
  @Input()
  operators: Operators[] = [
    Operators.GREATER_THAN,
    Operators.LESSER_THAN,
    Operators.EQUALS
    // Operators.BETWEEN
  ];

  selectedOperator = Operators.GREATER_THAN;

  constructor(protected formBuilder: FormBuilder) {
    super(formBuilder);
  }

  getFormProperties() {
    return {
      operator: Operators.GREATER_THAN,
      value: ''
    };
  }
}
