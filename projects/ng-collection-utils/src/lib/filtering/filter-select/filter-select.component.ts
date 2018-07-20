import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FilterComponent } from '../filter.component';

@Component({
  selector: 'filter-select',
  templateUrl: './filter-select.component.html',
  styleUrls: ['./filter-select.component.css', '../filter-toolbar/filter-toolbar.component.css' ]
})
export class FilterSelectComponent extends FilterComponent {

  @Input() options: string[];

  constructor(protected formBuilder: FormBuilder) {
    super(formBuilder);
  }
}