import { Component, OnInit, Input } from '@angular/core';
import { FilterGroupComponent } from '../filter-group.component';
import { FormBuilder } from '@angular/forms';

export enum Operator {
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
export class FilterNumberComponent extends FilterGroupComponent {
  @Input()
  operators: Operator[] = [
    Operator.GREATER_THAN,
    Operator.LESSER_THAN,
    Operator.EQUALS
    // Operators.BETWEEN
  ];

  selectedOperator: Operator;

  constructor(protected formBuilder: FormBuilder) {
    super(formBuilder);
  }

  getFormProperties() {
    return {
      operator: '',
      value: ''
    };
  }
}
