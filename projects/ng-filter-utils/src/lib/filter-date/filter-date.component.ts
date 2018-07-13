import { Component, OnInit } from '@angular/core';
import { FilterComponent } from '../filter.component';
import { FilterGroupComponent } from '../filter-group.component';
import { ControlContainer, FormBuilder } from '@angular/forms';

@Component({
  selector: 'filter-date',
  templateUrl: './filter-date.component.html',
  styleUrls: [
    './filter-date.component.css',
    '../filter-toolbar/filter-toolbar.component.css'
  ]
})
export class FilterDateComponent extends FilterGroupComponent
  implements OnInit {
  constructor(protected formBuilder: FormBuilder) {
    super(formBuilder);
  }

  getFormProperties() {
    return {
      afterDate: '',
      beforeDate: ''
    };
  }
}
