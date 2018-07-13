import { Component, OnInit } from '@angular/core';
import { FilterComponent } from '../filter.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'filter-string',
  templateUrl: './filter-string.component.html',
  styleUrls: [
    './filter-string.component.css',
    '../filter-toolbar/filter-toolbar.component.css'
  ]
})
export class FilterStringComponent extends FilterComponent implements OnInit {
  constructor(protected formBuilder: FormBuilder) {
    super(formBuilder);
  }
}
